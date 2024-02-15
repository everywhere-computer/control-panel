<script context="module">
  import Prism from 'prismjs'

  const highlight = (code, syntax) => Prism.highlight(code, Prism.languages[syntax], syntax);
</script>

<script lang="ts">
  import {CodeJar} from '@novacbn/svelte-codejar'
  
  import { addNotification } from '$lib/notifications'
  import Tabs from '$components/common/Tabs.svelte'
  import LoadingSpinner from '$components/common/LoadingSpinner.svelte'
  // import { functionsStore } from '$lib/stores'

  const tabs = ['JSON', 'Params']
  let loading = false
  let activeTab = tabs[0]
  let workflow = `{
  "name": "everyCliWorkflow_1",
  "workflow": {
    "tasks": [
      {
        "cause": null,
        "meta": {
          "memory": 4294967296,
          "time": 100000
         },
       "prf": [],
       "run": {
         "input": {
           "args": ["borld"],
           "func": "hello"
          },
          "nnc": "",
          "op": "wasm/run",
          "rsc": "${import.meta.env.VITE_WORKFLOW_RESOURCE}"
        }
      }
    ]
  }
}`
  $: functions = JSON.parse(workflow)?.workflow?.tasks
  

  let output
  const handleSubmitWorkflow = async () => {
    loading = true
    try {
      try {
        JSON.parse(workflow)
      } catch (error) {
        throw new Error('Invalid JSON')
      }

      const { receipt: { out: [, res] } } = await(await fetch(`${import.meta.env.VITE_GATEWAY_ENDPOINT}/start-workflow`, {
        method: 'POST',
        // mode: 'no-cors',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: workflow
      })).json()
      // console.log('res', res)
      output = res
    } catch (error) {
      console.error(error)
      addNotification({ msg: error, type: 'error' })
    }
    loading = false
  }


</script>

<div class="relative flex flex-col sm:flex-row w-full h-full sm:h-[calc(100vh-80px)] m-auto">
  <div class="w-full h-full sm:w-1/2 pt-6">

    <Tabs {tabs} bind:activeTab />

    <div class="h-[calc(100%-32px)] bg-base-100 border-base-300 sm:border-t rounded-box p-6">
      {#if activeTab === tabs[0]}
        <div class="flex flex-col items-start justify-start gap-4 w-full h-full">
          <div class="flex flex-row items-center justify-between w-full">
            <h2>Paste workflow JSON below</h2>
            <button class="btn btn-primary btn-odd-purple-500 min-w-[80px] max-h-8 ml-auto" on:click={handleSubmitWorkflow}>Run</button>
          </div>

          <div class="w-full h-full rounded-sm bg-base-200">
            <CodeJar syntax="javascript" {highlight} bind:value={workflow} withLineNumbers />
          </div>
        </div>
      {/if}      
        
      {#if activeTab === tabs[1]}
        <div class="flex flex-col items-start justify-start gap-4 w-full h-full">
          <div class="flex flex-row items-center justify-between w-full">
            <h2>Add function params below</h2>
            <button class="btn btn-primary btn-odd-purple-500 min-w-[80px] max-h-8 ml-auto" on:click={handleSubmitWorkflow}>Run</button>
          </div>

          <div class="flex flex-col w-full">
            {#if functions}
              {#each functions as func}
                <div class="w-full p-4 rounded-sm bg-base-200 text-base-content">
                  <h3 class="mb-2">{func?.run?.input?.func} <span>(string)</span></h3>
                  {#each func?.run?.input?.args as arg}
                    <input class="input pl-3 py-0.5 h-8 border border-odd-gray-400 bg-transparent w-full text-input-m text-base-content placeholder:text-base-content rounded-sm transition duration-200 ease-in-out" type="text" bind:value={arg} />
                  {/each}
                </div>
              {/each}
            {/if}
          </div>
        </div>        
      {/if}
    </div>
  </div>

  <div class="w-full h-full sm:w-1/2">
    <div class="h-full p-6 border-base-300 border-t sm:border-t-0 sm:border-l bg-base-100">    
      <h2 class="mb-4">Result</h2>

      {#if loading}
        <div class="flex flex-col items-center justify-center h-[calc(100%-32px)] min-h-40 py-2.5 px-4 font-mono bg-base-200 rounded-sm">
          <LoadingSpinner />
        </div>
      {:else}
        <div class="h-[calc(100%-32px)] min-h-40 py-2.5 px-4 font-mono bg-base-200 rounded-sm">
          {#if output}
            {output}
          {/if}
        </div>
      {/if}
    </div>
  </div>
</div>
