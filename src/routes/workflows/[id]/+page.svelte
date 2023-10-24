<script lang="ts">
  import { page } from '$app/stores'
  import Chart from 'chart.js/auto'
  import { onMount } from 'svelte'

  import { workflowsStore } from '$src/stores'
  // import chartData from '$routes/workflows/lib/chart-mocks'
  import ExternalLink from '$components/icons/ExternalLink.svelte'
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

  const tabs = ['metrics', 'triggers', 'logs', 'runs & receipts', 'settings']
  let activeTab = 'logs'
  const handleTabClick = (tab: string) => {
    activeTab = tab

    // if (activeTab === 'metrics') {
    //   let timeout = setTimeout(() => {
    //     instantiateChart()
    //     clearTimeout(timeout)
    //   }, 0)
    // }
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

  $: stats = [
    { label: 'Custom Domains', value: workflow.customDomains },
    { label: 'Routes', value: workflow.routes },
    { label: 'Cron Triggers', value: workflow.cronTriggers },
    { label: 'Connected Workflows', value: workflow.connectedWorkflows }
  ]

  onMount(() => {
    // instantiateChart()
  })
</script>

<div class="py-2">
  {#if workflow}
    <div class="w-full max-w-[800px] m-auto mb-8">
      <div class="flex flex-row items-center justify-between mb-5">
        <h1 class="text-heading-2xl font-bold">{workflow.name}</h1>

        <a
          href={`https://${workflow.name}.workflow.ipvm.dev`}
          target="_blank"
          class="btn-odd-purple-900 btn-filter flex flex-row items-center justify-center gap-1 px-3.5 h-[30px] bg-odd-blue-500 text-odd-blue-100 text-label-sm"
        >
          <ExternalLink /> Preview
        </a>
      </div>

      <div
        class="flex flex-row divide-x divide-odd-gray-100 items-center w-full text-label-sm text-odd-gray-400"
      >
        {#each stats as stat}
          <div class="flex flex-col items-center justify-center basis-1/4">
            <p
              class="w-full py-2 bg-odd-gray-150 text-center border-b border-odd-gray-200"
            >
              {stat.label}
            </p>
            <p class="w-full py-2 bg-odd-gray-0 text-body-lg text-center">
              {stat.value}
            </p>
          </div>
        {/each}
      </div>
    </div>

    <div
      class="relative z-10 divide-x divide-odd-gray-0 min-w-[0px] h-8 px-8 whitespace-nowrap overflow-x-scroll translate-y-[1px]"
    >
      {#each tabs as tab}
        <button
          on:click={() => handleTabClick(tab)}
          class="tab {activeTab === tab
            ? 'tab-active relative z-20 bg-odd-gray-0 text-odd-gray-500 !border-odd-gray-200 !border-t !border-r !border-l mx-[0.5px]'
            : 'bg-odd-gray-150 text-odd-gray-500'} capitalize text-label-sm"
        >
          {tab}
        </button>
      {/each}
    </div>

    <div
      class="relative z-0 flex flex-col mb-4 pb-4 border-t border-y-odd-gray-200"
    >
      {#if activeTab === tabs[0]}
        <div class="p-4 bg-odd-gray-0">
          <!-- <canvas id="chart" /> -->
          metrics
        </div>
      {/if}

      {#if activeTab === tabs[1]}
        <div class="p-4 bg-odd-gray-0">triggers</div>
      {/if}

      {#if activeTab === tabs[2]}
        <div class="">
          <Logs />
        </div>
      {/if}

      {#if activeTab === tabs[3]}
        <div class="p-4 bg-odd-gray-0">runs & receipts</div>
      {/if}

      {#if activeTab === tabs[4]}
        <div class="p-4 bg-odd-gray-0">settings</div>
      {/if}
    </div>
  {/if}
</div>
