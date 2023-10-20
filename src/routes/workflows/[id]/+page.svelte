<script lang="ts">
  import { page } from '$app/stores'
  import Chart from 'chart.js/auto'
  import { onMount } from 'svelte'

  import { workflowsStore } from '$src/stores'
  // import chartData from '$routes/workflows/lib/chart-mocks'
  import Logs from '$routes/workflows/components/Logs.svelte'

  $: workflow = $workflowsStore?.workflows?.find(
    workflow => workflow?.id === $page.params.id
  )

  const chartValues = [0, 10, 5, 50, 20, 30, 0]
  const chartLabels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July'
  ]

  const tabs = ['metrics', 'triggers', 'logs', 'settings']
  let activeTab = 'metrics'
  const handleTabClick = (tab: string) => {
    activeTab = tab

    if (activeTab === 'metrics') {
      let timeout = setTimeout(() => {
        instantiateChart()
        clearTimeout(timeout)
      }, 0)
    }
  }

  const instantiateChart = () => {
    const ctx = document.getElementById('chart') as HTMLCanvasElement
    const chart = new Chart(ctx, {
      //Type of the chart
      type: 'line',
      data: {
        //labels on x-axis
        labels: chartLabels,
        datasets: [
          {
            //The label for the dataset which appears in the legend and tooltips.
            label: 'Requests',
            //data for the line
            data: chartValues,
            //styling of the chart
            backgroundColor: ['rgba(255, 99, 132, 0.2)'],
            borderColor: ['rgba(255, 99, 132, 1)'],
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          //make sure Y-axis starts at 0
          // y: {
          //   beginAtZero: true
          // }
        }
      }
    })
  }

  onMount(() => {
    instantiateChart()
  })
</script>

<div class="">
  {#if workflow}
    <h1 class="text-heading-lg mb-4">{workflow.name}</h1>

    <div
      class="flex flex-col mb-8 px-4 py-4 border border-odd-gray-500 rounded-lg"
    >
      <p class="font-bold">Preview</p>
      <a
        href={`https://${workflow.name}.workflow.ipvm.dev`}
        class="flex flex-row items-center gap-1 mb-4 text-xs underline text-blue-600"
      >
        {`https://${workflow.name}.workflow.ipvm.dev`}
        <img
          src={`${window.location.origin}/external-link.svg`}
          class="w-[16px] h-auto text-blue-500"
          alt="external link preview"
        />
      </a>

      <div class="flex flex-row divide-x divide-odd-gray-500 items-center">
        <div class="pr-4 min-w-[99px]">
          <p class="text-xs">Custom Domains</p>
          <div class="flex flex-row items-center justify-between">
            <p class="font-bold">{workflow.customDomains}</p>
            <a
              href={`/workflows/${$page.params.slug}/custom-domains`}
              class="text-xs text-blue-600 underline"
            >
              View
            </a>
          </div>
        </div>

        <div class="px-4 min-w-[99px]">
          <p class="text-xs">Routes</p>
          <div class="flex flex-row items-center justify-between">
            <p class="font-bold">{workflow.routes}</p>
            <a
              href={`/workflows/${$page.params.slug}/routes`}
              class="text-xs text-blue-600 underline"
            >
              View
            </a>
          </div>
        </div>

        <div class="px-4 min-w-[99px]">
          <p class="text-xs">Cron Triggers</p>
          <div class="flex flex-row items-center justify-between">
            <p class="font-bold">{workflow.cronTriggers}</p>
            <a
              href={`/workflows/${$page.params.slug}/cron-triggers`}
              class="text-xs text-blue-600 underline"
            >
              View
            </a>
          </div>
        </div>

        <div class="px-4 min-w-[99px]">
          <p class="text-xs">Email Triggers</p>
          <div class="flex flex-row items-center justify-between">
            <p class="font-bold">{workflow.emailTriggers}</p>
            <a
              href={`/workflows/${$page.params.slug}/email-triggers`}
              class="text-xs text-blue-600 underline"
            >
              View
            </a>
          </div>
        </div>

        <div class="pl-4 min-w-[99px]">
          <p class="text-xs">Connected Workflows</p>
          <div class="flex flex-row items-center justify-between">
            <p class="font-bold">{workflow.connectedWorkflows}</p>
            <a
              href={`/workflows/${$page.params.slug}/connected-workflows`}
              class="text-xs text-blue-600 underline"
            >
              View
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="tabs mb-8 border-b border-odd-gray-500 box-border">
      {#each tabs as tab}
        <button
          on:click={() => handleTabClick(tab)}
          class="tab {activeTab === tab
            ? 'tab-active border-b border-odd-gray-500'
            : ''} capitalize"
        >
          {tab}
        </button>
      {/each}
    </div>

    <div
      class="flex flex-col mb-4 px-4 py-4 border border-odd-gray-500 rounded-lg"
    >
      {#if activeTab === tabs[0]}
        <div class="">
          <canvas id="chart" />
        </div>
      {/if}

      {#if activeTab === tabs[1]}
        <div class="">triggers</div>
      {/if}

      {#if activeTab === tabs[2]}
        <div class="">
          <Logs />
        </div>
      {/if}

      {#if activeTab === tabs[3]}
        <div class="">settings</div>
      {/if}
    </div>
  {/if}
</div>
