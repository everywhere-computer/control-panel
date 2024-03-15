<script context="module">
  // import Prism from 'prismjs'

  // const highlight = (code, syntax) => Prism.highlight(code, Prism.languages[syntax], syntax);
</script>

<script lang="ts">
  // import { CodeJar } from '@novacbn/svelte-codejar'
  import '@jsfe/system'
  import { onMount } from 'svelte'

  import {
    isValid,
    remapTaskNeeds,
    fetchWorkflow,
    submitWorkflow
  } from '$routes/workflows/lib/custom-functions'
  import { hostStyles } from '$routes/workflows/components/custom-functions/styles'
  import LoadingSpinner from '$components/common/LoadingSpinner.svelte'
  import Functions from '$routes/workflows/components/custom-functions/Functions.svelte'
  import Results from '$routes/workflows/components/custom-functions/Results.svelte'
  import Tabs from '$components/common/Tabs.svelte'

  const tabs = ['Results', 'Workflow JSON']

  $: activeTab = tabs[1]

  let formValidStates = {}
  let loading = false
  let originalSchemas
  let results
  let reorderedSchemas
  let schemas
  let tasks
  let allTimeTasksLength = 0
  let workflow

  const updateShadowDomAndWorkflows = async () => {
    modifyShadowDomForm(true, reorderedSchemas)

    workflow = await fetchWorkflow(tasks)
  }

  // When a drag and drop is complete, update the tasks, shadow DOM and workflow JSON
  const onDrop = async dispatchEvent => {
    if (dispatchEvent?.detail) {
      reorderedSchemas = dispatchEvent.detail
      tasks = reorderedSchemas.map(schema =>
        tasks.find(task => task.run.name === schema.id)
      )

      // Remove {{needs.<prevFunc>.output}} string from first task if it was previously set
      if (tasks[0]?.run?.input?.args?.find(arg => arg?.includes('{{needs.'))) {
        tasks[0].run.input.args = tasks[0].run.input.args.map(() => null)
        formValidStates[tasks[0].run.name] = false
      }

      // Update {{needs.funcName.output}} to point to new previous function if order has changed
      tasks = remapTaskNeeds(tasks)

      schemas = reorderedSchemas

      await updateShadowDomAndWorkflows()
    }
  }

  // When a new function is added, update the tasks, shadow DOM and workflow JSON
  const onAddFunction = async dispatchEvent => {
    if (dispatchEvent?.detail) {
      const newSchema = dispatchEvent.detail
      allTimeTasksLength = allTimeTasksLength + 1

      // Map default args for new task
      tasks = [
        ...tasks,
        {
          run: {
            name: newSchema.id,
            input: {
              args: newSchema.additionalProperties
                ? Object.keys(newSchema?.properties).map(() => null)
                : [],
              func: newSchema.title
            }
          }
        }
      ]

      // Add new schema to existing ones
      schemas = [
        ...reorderedSchemas,
        {
          ...newSchema
        }
      ]

      reorderedSchemas = schemas

      // Set valid state for new form schema
      formValidStates = {
        ...formValidStates,
        [newSchema.id]:
          newSchema.properties && Object.keys(newSchema.properties).length
            ? false
            : true
      }

      await updateShadowDomAndWorkflows()
    }
  }

  // When a function is deleted, update the tasks, shadow DOM and workflow JSON
  const onDeleteFunction = async dispatchEvent => {
    if (dispatchEvent?.detail) {
      const schemaToDelete = dispatchEvent.detail

      // Remove task from tasks array
      tasks = remapTaskNeeds(
        tasks.filter(task => task.run.name !== schemaToDelete.id)
      )

      // Remove schema from schemas array
      schemas = schemas.filter(schema => schema.id !== schemaToDelete.id)

      reorderedSchemas = schemas

      // Remove valid state for schema
      delete formValidStates[schemaToDelete.id]

      await updateShadowDomAndWorkflows()
    }
  }

  // Submit workflow to gateway
  const handleSubmitWorkflow = async () => {
    loading = true
    activeTab = tabs[0]

    try {
      results = (await submitWorkflow(tasks)).map((result, index) => ({
        ...result,
        title: tasks[index].run.input.func,
        key: tasks[index].run.name
      }))
    } catch (error) {
      console.error(error)
    }

    loading = false
  }

  // Append stylesheet and add event listeners to JSF shadow DOM elements
  const modifyShadowDomForm = (attachListeners = false, schemas) => {
    // Set styles for shadow elements in form(this is messy, but it's the only workaround for this library)
    const timeout = setTimeout(() => {
      const hosts = document.querySelectorAll('jsf-system')
      hosts.forEach((host, index) => {
        const { id, ...schema } = JSON.parse(
          host.parentElement.getAttribute('data-schema')
        )
        const hostStylesheet = document.createElement('style')
        hostStylesheet.innerHTML = hostStyles
        host.shadowRoot.appendChild(hostStylesheet)

        if (attachListeners) {
          const form = host.shadowRoot.querySelector('form')
          const functionParams = host.shadowRoot.querySelectorAll('label')
          let fieldsUsingPreviousOutput = {}

          // Listen to JSF input changes
          form.addEventListener('keyup', async function () {
            // @ts-ignore-next-line
            const formData = Object.fromEntries(new FormData(form))
            let data = Object.keys(formData).reduce((acc, key) => {
              const val =
                schema.properties[key].type === 'number' && formData[key]
                  ? Number(formData[key])
                  : formData[key]
              return {
                ...acc,
                [key]: val
              }
            }, {})

            if (Object.values(fieldsUsingPreviousOutput).length) {
              data = {
                ...data,
                ...fieldsUsingPreviousOutput
              }

              if (
                Object.values(data)
                  .map(val => !!val)
                  .every(Boolean)
              ) {
                formValidStates[id] = true
              } else {
                formValidStates[id] = false
              }
            } else {
              if (isValid(data, schema)) {
                formValidStates[id] = true
              } else {
                formValidStates[id] = false
              }
            }

            // Live update workflow JSON
            const updatedParams = Object.keys(schema.properties).reduce(
              (acc, v) => ({
                ...acc,
                [v]: data[v] ?? null
              }),
              {}
            )

            tasks = tasks.map(task => {
              if (task.run.name === id) {
                return {
                  ...task,
                  run: {
                    ...task.run,
                    input: {
                      ...task.run.input,
                      args: Object.values(updatedParams)
                    }
                  }
                }
              }
              return task
            })

            workflow = await fetchWorkflow(tasks)
          })

          functionParams.forEach(param => {
            const fieldName = param.getAttribute('for')
            const paramHeading = param.querySelector('div')
            const input = param.querySelector('& > input')

            // Set input names because JSF doesn't...
            input.setAttribute('name', fieldName)

            // Prevent click events on input fields from triggering drag start
            input.addEventListener('mousedown', e => e.stopPropagation())
            input.addEventListener('touchstart', e => e.stopPropagation())

            // Remove checkbox from first function
            if (
              index === 0 &&
              paramHeading.querySelector('.checkbox-wrapper')
            ) {
              if (
                (paramHeading.querySelector(
                  '.checkbox-wrapper .checkbox'
                ) as HTMLInputElement)?.checked
              ) {
                ;(input as HTMLInputElement).value = null
                ;(paramHeading.querySelector(
                  '.checkbox-wrapper .checkbox'
                ) as HTMLInputElement).checked = false
              }
              input.removeAttribute('disabled')
              // @ts-ignore-next-line
              paramHeading.querySelector('.checkbox-wrapper')?.remove()
            }

            // If we're not in the first function, add a checkbox to each field to allow it to accept the output of the previous function
            if (index > 0) {
              const oldWrapper = paramHeading.querySelector('.checkbox-wrapper')
              const oldCheckedValue = (oldWrapper?.querySelector(
                '.checkbox'
              ) as HTMLInputElement)?.checked
              if (oldWrapper) {
                oldWrapper?.remove()
              }

              const wrapper = document.createElement('div')
              wrapper.classList.add('checkbox-wrapper')
              wrapper.innerHTML = `<span>use ${
                schemas[index - 1].title
              } output</span><input type="checkbox" class="checkbox checkbox-primary" ${
                oldCheckedValue ? 'checked' : ''
              }>`
              paramHeading.appendChild(wrapper)

              // Prevent click events on param fields and child elements from triggering drag start
              paramHeading.addEventListener('mousedown', e =>
                e.stopPropagation()
              )
              paramHeading.addEventListener('touchstart', e =>
                e.stopPropagation()
              )

              // Use output of previous function when checkbox is clicked
              paramHeading
                .querySelector('.checkbox')
                .addEventListener('change', function () {
                  if (this.checked) {
                    ;(input as HTMLInputElement).value = null
                    input.setAttribute('disabled', 'true')
                    fieldsUsingPreviousOutput = {
                      ...fieldsUsingPreviousOutput,
                      [fieldName]: `{{needs.${schemas[index - 1].id}.output}}`
                    }
                    form.dispatchEvent(new Event('keyup'))
                  } else {
                    ;(input as HTMLInputElement).value = null
                    input.removeAttribute('disabled')
                    delete fieldsUsingPreviousOutput[fieldName]
                    form.dispatchEvent(new Event('keyup'))
                  }
                })
            }
          })
        }
      })

      clearTimeout(timeout)
    }, 0)
  }

  $: activeTab, modifyShadowDomForm(false, reorderedSchemas)

  onMount(async () => {
    loading = true
    try {
      const res = await (
        await fetch(import.meta.env.VITE_GATEWAY_ENDPOINT)
      ).json()

      // Map schema for each taks because we need to render each schema into its own JSF
      schemas = res.map((schema, i) => ({
        properties: {},
        ...schema[1],
        title: schema[0],
        id: `${schema[0]}_${i}`
      }))
      reorderedSchemas = schemas
      originalSchemas = schemas
      allTimeTasksLength = schemas.length

      // Map default task args to fetch workflow JSON
      tasks = schemas.map(schema => ({
        run: {
          name: schema.id,
          input: {
            args: schema.additionalProperties
              ? Object.keys(schema?.properties).map(() => null)
              : [],
            func: schema.title
          }
        }
      }))

      // Set form valid states to false
      formValidStates = schemas.reduce(
        (acc, schema) => ({
          ...acc,
          [schema.id]:
            schema?.properties && Object.keys(schema.properties).length
              ? false
              : true
        }),
        {}
      )

      modifyShadowDomForm(true, schemas)

      workflow = await fetchWorkflow(tasks)
    } catch (error) {
      console.error(error)
    }
    loading = false
  })
</script>

<div
  class="relative flex flex-col sm:flex-row w-full h-full sm:h-[calc(100vh-80px)] m-auto"
>
  <div
    class="w-full h-full sm:w-1/2 xl:w-1/3 border-base-300 border-b sm:border-b-0 sm:border-r"
  >
    {#if !schemas}
      <div
        class="flex flex-col items-center justify-center h-full bg-base-100 border-base-300 sm:border-t rounded-sm p-6 pt-7"
      >
        <LoadingSpinner />
      </div>
    {:else}
      <Functions
        {allTimeTasksLength}
        {formValidStates}
        {handleSubmitWorkflow}
        {loading}
        {originalSchemas}
        {schemas}
        on:addFunction={onAddFunction}
        on:deleteFunction={onDeleteFunction}
        on:drop={onDrop}
      />
    {/if}
  </div>

  <div class="w-full h-full sm:w-1/2 xl:w-2/3 pt-6">
    <Tabs {tabs} bind:activeTab />
    <div
      class="h-[calc(100%-32px)] p-6 border-base-300 sm:border-t bg-base-100 rounded-sm overflow-x-hidden"
    >
      {#if activeTab === tabs[0]}
        <Results {loading} {results} />
      {/if}

      {#if activeTab === tabs[1]}
        <div
          class="flex flex-col items-start justify-start gap-4 w-full h-full"
        >
          <div class="w-full h-full p-4 overflow-auto rounded-sm bg-base-200">
            <pre>{workflow}</pre>
            <!-- <CodeJar syntax="javascript" {highlight} bind:value={workflow} withLineNumbers /> -->
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
