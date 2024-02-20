<script context="module">
  import Prism from 'prismjs'

  const highlight = (code, syntax) => Prism.highlight(code, Prism.languages[syntax], syntax);
</script>

<script lang="ts">
  // import { CodeJar } from '@novacbn/svelte-codejar'
  import '@jsfe/system'
  import Ajv from 'ajv'
  import { onMount } from 'svelte'
  
  import { setFormStyles } from '$routes/workflows/components/custom-functions/styles'
  import { addNotification } from '$lib/notifications'
  import LoadingSpinner from '$components/common/LoadingSpinner.svelte'
  import Result from '$routes/workflows/components/custom-functions/Result.svelte'
  import Tabs from '$components/common/Tabs.svelte'
  import { themeStore } from '$lib/stores'

  const tabs = ['Result', 'Workflow JSON']
  $: activeTab = tabs[0]

  let loading = false
  let contentType
	let formData = {}
  let functionName
  let functionParams
  let output
  let schema
  let workflow

	const formBinding = async (form) => {
		form.data = formData;
		form.schema = /* Type-casted as JSONSchema7 */ schema;
		form.uiSchema = {
			/* Type-casted as UiSchema */
			bar: {
				'ui:widget': 'switch',
			},
		};
    const isValid = (data): boolean => {
      const ajv = new Ajv()
      const validate = ajv.compile(schema)
      return validate(data)      
    }

    // We need to wait a moment for the form to be rendered to the shadowRoot
    const timeout = setTimeout(() => {
      const submitButton = document.querySelector('jsf-system').shadowRoot.querySelector('.widget-submit button')
      if (isValid(formData)) {
        submitButton.removeAttribute('disabled')
        console.error('Invalid function params')
      } else {
        submitButton.setAttribute('disabled', 'true')
      } 
      clearTimeout(timeout)   
    }, 0)

		form.dataChangeCallback = async (newData) => {
      const submitButton = document.querySelector('jsf-system').shadowRoot.querySelector('.widget-submit button')
      if (isValid(newData)) {
        submitButton.removeAttribute('disabled')
      } else {
        submitButton.setAttribute('disabled', 'true')
        // console.error('Invalid function params')
      }
      
      // Live update workflow JSON
      const defaultParams = Object.keys(functionParams).reduce((acc, v) => ({
        ...acc,
        [v]: newData[v] ?? ''
      }), {})
      const queryParams = new URLSearchParams(defaultParams).toString()
      workflow = JSON.stringify(await(await fetch(`${import.meta.env.VITE_GATEWAY_ENDPOINT}/${functionName}/workflow?${queryParams}`)).json(), null, 2)  
		};
		form.submitCallback = async (newData, valid) => {
      loading = true
      try {
        const res = await fetch(`${import.meta.env.VITE_GATEWAY_ENDPOINT}/${functionName}`, 
          { 
            method: 'POST', 
            headers: { 
              'Content-Type': 'application/json' 
            },
            body: JSON.stringify(newData) 
        })
        const text = await res.text()
        output = text ?? await res.json()
      } catch (error) {
        console.error(error)
      }
      loading = false
		};
	}

  $: activeTab, setFormStyles()

  onMount(async () => {
    loading = true
    try {
      const res = await (await fetch(import.meta.env.VITE_GATEWAY_ENDPOINT)).json()
      ;({ properties: { 'content-type': contentType } } = res[0][1])
      schema = res[0][1]
      delete schema.properties['content-type']
      functionName = res[0][0]
      functionParams = res[0][1].properties
      setFormStyles()
      
      // Set default params to fetch workflow JSON
      const defaultParams = Object.keys(functionParams).reduce((acc, v) => ({
        ...acc,
        [v]: ''
      }), {})
      const queryParams = new URLSearchParams(defaultParams).toString()
      workflow = JSON.stringify(await(await fetch(`${import.meta.env.VITE_GATEWAY_ENDPOINT}/${functionName}/workflow?${queryParams}`)).json(), null, 2)
    } catch (error) {
      console.error(error)
    }
    loading = false
  })
</script>


<div class="relative flex flex-col sm:flex-row w-full h-full sm:h-[calc(100vh-80px)] m-auto">
  <div class="w-full h-full sm:w-1/2 border-base-300 border-b sm:border-b-0 sm:border-r">
    {#if !schema}
      <div class="flex flex-col items-center justify-center h-full bg-base-100 border-base-300 sm:border-t rounded-sm p-6 pt-7">
        <LoadingSpinner />
      </div>
    {:else}    
      <div class="h-full bg-base-100 rounded-sm p-6 pt-7">
        <div class="relative flex flex-col items-start justify-start gap-4 w-full h-full">
          <div class="flex flex-row items-center justify-between w-full min-h-8 pr-[86px]">
            <h2>Add params below</h2>
            <!-- <button class="btn btn-primary btn-odd-purple-500 min-w-[80px] max-h-8 ml-auto" on:click={handleSubmitWorkflow}>Run</button> -->
          </div>

          {#if schema}
            <div class="json-schema-form w-full h-full rounded-sm">
              <div class="p-2 bg-base-100 rounded-sm border {$themeStore.selectedTheme === 'light' ? 'border-odd-gray-400' : 'border-odd-gray-500'}">
                <h3 class="mb-4 pb-2 border-b border-odd-gray-400 text-label-m capitalize">{functionName}</h3>
                <jsf-system use:formBinding submitButtonLabel="Run"></jsf-system>
              </div>
            </div>
          {/if}
        </div>        
      </div>
    {/if}
  </div>

  <div class="w-full h-full sm:w-1/2 pt-6">
    <Tabs {tabs} bind:activeTab />
    <div class="h-[calc(100%-32px)] p-6 border-base-300 sm:border-t bg-base-100 rounded-sm">
      {#if activeTab === tabs[0]}      
        <Result {loading} {output} />
      {/if}

      {#if activeTab === tabs[1]}
        <div class="flex flex-col items-start justify-start gap-4 w-full h-full">
          <!-- <div class="flex flex-row items-center justify-between w-full min-h-8">
            <h2>Paste workflow JSON below</h2>
          </div> -->

          <div class="w-full h-full p-4 overflow-auto rounded-sm bg-base-200">
            <pre>{workflow}</pre>
            <!-- <CodeJar syntax="javascript" {highlight} bind:value={workflow} withLineNumbers /> -->
          </div>
        </div>
      {/if}                   
    </div>
  </div>
</div>
