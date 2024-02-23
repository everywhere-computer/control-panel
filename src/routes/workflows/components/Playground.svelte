<script context="module">
  // import Prism from 'prismjs'

  // const highlight = (code, syntax) => Prism.highlight(code, Prism.languages[syntax], syntax);
</script>

<script lang="ts">
  // import { CodeJar } from '@novacbn/svelte-codejar'
  import '@jsfe/system'
  import Ajv from 'ajv'
  import { onMount } from 'svelte'
  import * as uint8arrays from 'uint8arrays'

  import { hostStyles } from '$routes/workflows/components/custom-functions/styles'
  // import { addNotification } from '$lib/notifications'
  import LoadingSpinner from '$components/common/LoadingSpinner.svelte'
  import Result from '$routes/workflows/components/custom-functions/Result.svelte'
  import Tabs from '$components/common/Tabs.svelte'
  import { themeStore } from '$lib/stores'

  const tabs = ['Result', 'Workflow JSON']

  $: activeTab = tabs[1]

  let contentType
  let formValidStates = []
  let loading = false
  let output
  let outputType = 'text'
  let schemas
  let tasks
  let workflow

  // Validated form values against their associated JSON schema
  const isValid = (data, schema): boolean => {
    const ajv = new Ajv()
    const { id, ...schemaToValidate } = schema
    const validate = ajv.compile(schemaToValidate)
    return validate(data)
  }

  // JSF listener
  const formBinding = async form => {
    // form.data = {}
    // form.dataChangeCallback = async newData => {}
    // form.submitCallback = async (newData, valid) => {}
  }

  // Submit workflow to gateway
  const handleSubmitWorkflow = async () => {
    loading = true
    activeTab = tabs[0]

    try {
      const res = await fetch(`${import.meta.env.VITE_GATEWAY_ENDPOINT}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tasks })
      })

      const responseType = res.headers.get('Content-Type')
      if (responseType.includes('image/')) {
        const blob = await res.blob()
        outputType = 'image'
        output = URL.createObjectURL(blob)
      } else {
        outputType = 'text'
        output = (await res.text()) ?? (await res.json())
      }
    } catch (error) {
      console.error(error)
    }

    loading = false
  }

  // Append stylesheet and add event listeners to JSF shadow DOM elements
  const modifyShadowDomForm = (schemas = null) => {
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

        if (schemas) {
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

            workflow = JSON.stringify(
              await (
                await fetch(
                  `${import.meta.env.VITE_GATEWAY_ENDPOINT}/workflow`,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ tasks })
                  }
                )
              ).json(),
              null,
              2
            )
          })

          functionParams.forEach((param, i) => {
            const fieldName = param.getAttribute('for')
            const paramHeading = param.querySelector('div')
            const input = param.querySelector('& > input')

            // Set input names because JSF doesn't...
            input.setAttribute('name', fieldName)

            // If we're not in the first function, add a checkbox to each field to allow it to accept the output of the previous function
            if (index > 0) {
              const wrapper = document.createElement('div')
              wrapper.classList.add('checkbox-wrapper')
              wrapper.innerHTML = `<span>use ${
                schemas[index - 1].title
              } output</span><input type="checkbox" class="checkbox checkbox-primary">`
              paramHeading.appendChild(wrapper)

              // Use output of previous function when checkbox is clicked
              paramHeading
                .querySelector('.checkbox')
                .addEventListener('change', function () {
                  if (this.checked) {
                    // @ts-ignore-next-line
                    // input.value = `{{needs.${schemas[index - 1].id}.output}}`
                    input.value = null
                    input.setAttribute('disabled', 'true')
                    fieldsUsingPreviousOutput = {
                      ...fieldsUsingPreviousOutput,
                      [fieldName]: `{{needs.${schemas[index - 1].id}.output}}`
                    }
                    form.dispatchEvent(new Event('keyup'))
                  } else {
                    // @ts-ignore-next-line
                    input.value = null
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

  $: activeTab, modifyShadowDomForm()

  onMount(async () => {
    loading = true
    try {
      const res = await (
        await fetch(import.meta.env.VITE_GATEWAY_ENDPOINT)
      ).json()
      ;({
        properties: { 'content-type': contentType }
      } = res[0][1])

      // Map schema for each taks because we need to render each schema into its own JSF
      schemas = res.map((schema, i) => {
        delete schema[1].properties['content-type']
        return {
          ...schema[1],
          title: schema[0],
          id: `${schema[0]}_${i}`
        }
      })

      // Map default task args to fetch workflow JSON
      tasks = schemas.map(schema => ({
        run: {
          name: schema.id,
          input: {
            args: Object.keys(schema.properties).map(() => null),
            func: schema.title
          }
        }
      }))

      // Set form valid states to false
      formValidStates = schemas.reduce(
        (acc, schema) => ({ ...acc, [schema.id]: false }),
        {}
      )

      modifyShadowDomForm(schemas)

      workflow = JSON.stringify(
        await (
          await fetch(`${import.meta.env.VITE_GATEWAY_ENDPOINT}/workflow`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tasks })
          })
        ).json(),
        null,
        2
      )
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
    class="w-full h-full sm:w-1/2 border-base-300 border-b sm:border-b-0 sm:border-r"
  >
    {#if !schemas}
      <div
        class="flex flex-col items-center justify-center h-full bg-base-100 border-base-300 sm:border-t rounded-sm p-6 pt-7"
      >
        <LoadingSpinner />
      </div>
    {:else}
      <div class="h-full bg-base-100 rounded-sm p-6 pt-7">
        <div
          class="relative flex flex-col items-start justify-start gap-4 w-full h-full"
        >
          <div
            class="flex flex-row items-center justify-between w-full min-h-8 mb-2"
          >
            <h2>Add params below</h2>
            <button
              disabled={!Object.values(formValidStates).every(Boolean)}
              class="btn btn-primary btn-odd-purple-500 min-w-[80px] max-h-8 ml-auto"
              on:click={handleSubmitWorkflow}
            >
              Run
            </button>
          </div>

          <div
            class="json-schema-form flex flex-col gap-6 w-full h-[calc(100%-56px)] overflow-auto rounded-sm"
          >
            {#each schemas as schema}
              <div
                data-schema={JSON.stringify(schema)}
                class="p-2 bg-base-100 rounded-sm border {$themeStore.selectedTheme ===
                'light'
                  ? 'border-odd-gray-400'
                  : 'border-odd-gray-500'}"
              >
                <jsf-system use:formBinding {schema} submitButtonLabel="Run" />
              </div>
            {/each}
          </div>
        </div>
      </div>
    {/if}
  </div>

  <div class="w-full h-full sm:w-1/2 pt-6">
    <Tabs {tabs} bind:activeTab />
    <div
      class="h-[calc(100%-32px)] p-6 border-base-300 sm:border-t bg-base-100 rounded-sm overflow-x-hidden"
    >
      {#if activeTab === tabs[0]}
        <Result {loading} {output} {outputType} />
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
