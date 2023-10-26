<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import Chart from 'chart.js/auto'

  import type { Metric } from '$routes/workflows/lib/chart-mocks'

  export let metric: Metric

  const LEGEND = [
    { colour: 'bg-odd-green-400', label: 'Computed' },
    { colour: 'bg-odd-blue-400', label: 'From network' },
    { colour: 'bg-odd-red-400', label: 'Failed' }
  ]

  let currentChartRef
  let chartInstance
  const instantiateChart = () => {
    chartInstance = new Chart(currentChartRef, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June'],
        datasets: metric.datasets
      },
      options: {
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true
          }
        }
      }
    })
  }

  const debounce = (func: () => void, delay: number) => {
    let timeout

    return function () {
      const context = this
      const args = arguments
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(context, args), delay)
    }
  }

  const reRenderChart = () => {
    chartInstance.resize()
  }

  const debouncedReRenderChart = debounce(reRenderChart, 200)

  onMount(() => {
    instantiateChart()
    window.addEventListener('resize', debouncedReRenderChart)
  })

  onDestroy(() => {
    window.removeEventListener('resize', debouncedReRenderChart)
    chartInstance.destroy()
  })
</script>

<div class="w-full">
  <div class="p-6 bg-odd-gray-100">
    <h3 class="text-heading-xl mb-4">{metric.name}</h3>
    <div class="flex flex-row gap-4 items-center">
      {#each LEGEND as { colour, label }}
        <div class="flex flex-row gap-2 items-center">
          <span class="w-8 h-4 rounded-sm {colour}" />
          <p class="text-input-sm">{label}</p>
        </div>
      {/each}
    </div>
  </div>
  <div class="bg-odd-gray-50 pt-6 px-4 pb-4">
    <canvas class="w-full" bind:this={currentChartRef} />
  </div>
</div>
