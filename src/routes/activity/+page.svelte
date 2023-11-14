<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { fly } from 'svelte/transition'

  import { STATUS_COLOURS } from '$routes/workflows/lib/graph'
  import { requestMetrics } from '$lib/metrics'
  import { themeStore, workflowsStore } from '$lib/stores'
  import LoadingSpinner from '$components/common/LoadingSpinner.svelte'
  import ProgressBar from '$routes/activity/components/ProgressBar.svelte'

  let metrics = null
  $: lightTheme = $themeStore.selectedTheme === 'light'

  // Poll for metrics
  const interval = setInterval(async () => {
    metrics = await requestMetrics()
  }, 5000)

  const workflowRuns = $workflowsStore.workflows
    .filter(w => !!w.lastRunTime)
    .sort((a, b) => a.lastRunTime - b.lastRunTime)
    .reduce(
      (acc, w) => [
        ...acc,
        {
          id: w.id,
          name: w.name,
          label: w.runs[0].label,
          status: w.runs[0].status
        }
      ],
      []
    )

  onMount(async () => {
    metrics = await requestMetrics()
  })

  onDestroy(() => {
    clearInterval(interval)
  })
</script>

{#if metrics}
  <div class="mb-10 p-2 bg-base-300 text-right">
    <p
      class="text-code-sm font-mono {lightTheme
        ? 'text-odd-gray-500'
        : 'text-base-content'}"
    >
      System up <span class={lightTheme ? 'text-black' : 'text-odd-gray-300'}>
        {metrics.find(m => m?.metric_name === 'homestar_system_uptime_seconds')
          ?.data[0]?.value}s
      </span>
      Process up
      <span class={lightTheme ? 'text-black' : 'text-odd-gray-300'}>
        {metrics.find(m => m?.metric_name === 'homestar_process_uptime_seconds')
          ?.data[0]?.value}s
      </span>
    </p>
  </div>

  <div
    in:fly={{
      y: 20,
      duration: 200,
      delay: 0,
      opacity: 0
    }}
    class="flex flex-col gap-4 max-w-[800px] m-auto px-4 text-base-content"
  >
    <div
      class="flex flex-col gap-4 p-4 bg-base-100 border border-odd-gray-200 rounded-sm"
    >
      <div class="flex flex-row items-center justify-between">
        <h3 class="text-heading-lg">Peers</h3>

        <a
          href="/"
          class="btn btn-primary btn-odd-purple-500 flex flex-row items-center justify-center gap-1 px-2 py-0 !h-[28px] !text-label-sm"
        >
          View Logs
        </a>
      </div>

      <div class="flex flex-row items-center justify-between w-full">
        <p class="text-label-sm">Active connections</p>
        <p class="text-input-sm">0</p>
      </div>

      <div class="flex flex-row items-center justify-between w-full">
        <p class="text-label-sm">Receipts received</p>
        <p class="text-input-sm">0</p>
      </div>

      <div class="flex flex-row items-center justify-between w-full">
        <p class="text-label-sm">Receipts sent</p>
        <p class="text-input-sm">0</p>
      </div>
    </div>

    <!-- <div class="flex flex-col md:flex-row items-center gap-4"> -->
    <div
      in:fly={{
        y: 20,
        duration: 200,
        delay: 20,
        opacity: 0
      }}
      class="flex flex-col gap-4 md:min-h-[189px] p-4 bg-base-100 border border-odd-gray-200 rounded-sm"
    >
      <h3 class="text-heading-lg">CPU</h3>

      <ProgressBar
        label="Process CPU Usage"
        used={metrics.find(
          m => m?.metric_name === 'homestar_process_cpu_usage_percentage'
        )?.data[0]?.value}
        total={100}
      />

      <ProgressBar
        label="Total System Load"
        used={metrics.find(
          m => m?.metric_name === 'homestar_process_memory_bytes'
        )?.data[0]?.value +
          metrics.find(m => m?.metric_name === 'homestar_process_memory_bytes')
            ?.data[0]?.value}
        total={700}
      />
    </div>
    <!-- <div
        class="w-full md:min-h-[189px] p-4 bg-base-100 border border-odd-gray-200 rounded-sm"
      >
        <h3 class="text-heading-lg mb-4">Memory</h3>
        <ProgressBar
          buffer={metrics.find(
            m => m?.metric_name === 'homestar_system_used_memory_bytes'
          )?.data[0]?.value}
          used={metrics.find(
            m => m?.metric_name === 'homestar_process_memory_bytes'
          )?.data[0]?.value}
          total={metrics.find(
            m => m?.metric_name === 'homestar_system_available_memory_bytes'
          )?.data[0]?.value}
        />
      </div>
    </div> -->

    <div class="flex flex-col md:flex-row items-center gap-4">
      <div
        in:fly={{
          y: 20,
          duration: 200,
          delay: 40,
          opacity: 0
        }}
        class="w-full md:min-h-[138px] p-4 bg-base-100 border border-odd-gray-200 rounded-sm"
      >
        <h3 class="text-heading-lg mb-4">Storage</h3>

        <!-- <div class="flex flex-row items-center justify-between w-full mb-2">
          <p class="text-label-sm">Available disk space</p>
          <p class="text-input-sm">
            {metrics.find(
              m =>
                m?.metric_name === 'homestar_system_disk_available_space_bytes'
            )?.data[0]?.value} Gb
          </p>
        </div> -->
        <div class="flex flex-row items-center justify-between w-full mb-4">
          <p class="text-label-sm">Total read</p>
          <p class="text-input-sm">
            {metrics.find(
              m => m?.metric_name === 'homestar_process_disk_total_read_bytes'
            )?.data[0]?.value || 0} bytes
          </p>
        </div>
        <div class="flex flex-row items-center justify-between w-full">
          <p class="text-label-sm">Total written</p>
          <p class="text-input-sm">
            {metrics.find(
              m =>
                m?.metric_name === 'homestar_process_disk_total_written_bytes'
            )?.data[0]?.value || 0} bytes
          </p>
        </div>
      </div>

      <div
        in:fly={{
          y: 20,
          duration: 200,
          delay: 60,
          opacity: 0
        }}
        class="w-full md:min-h-[138px] p-4 bg-base-100 border border-odd-gray-200 rounded-sm"
      >
        <h3 class="text-heading-lg mb-4">Database</h3>

        <div class="flex flex-row items-center justify-between w-full">
          <p class="text-label-sm">Current size</p>
          <p class="text-input-sm">
            {metrics.find(
              m => m?.metric_name === 'homestar_database_size_bytes'
            )?.data[0]?.value || 0} bytes
          </p>
        </div>
      </div>
    </div>

    <div
      in:fly={{
        y: 20,
        duration: 200,
        delay: 80,
        opacity: 0
      }}
      class="p-4 bg-base-100 border border-odd-gray-200 rounded-sm"
    >
      <h3 class="text-heading-lg mb-4">
        <a href="/workflows">Workflow Activity</a>
      </h3>

      {#if workflowRuns.length}
        <ul class="divide-y divide-base-300">
          {#each workflowRuns as run}
            <li>
              <a
                class="flex flex-row items-center justify-between p-4"
                href="/workflows/{run.id}"
              >
                <div class="flex flex-col gap-2">
                  <h4 class="text-input-m">{run.name}</h4>
                  <h5 class="text-code-m font-mono capitalize">{run.label}</h5>
                </div>

                <span
                  class="px-1 text-code-sm font-mono border {STATUS_COLOURS[
                    run.status
                  ]} rounded-sm capitalize"
                >
                  {run.status}{run.status === 'running' ? '...' : ''}
                </span>
              </a>
            </li>
          {/each}
        </ul>
      {:else}
        <p class="text-code-m font-mono">No runs yet</p>
      {/if}
    </div>
  </div>
{:else}
  <div class="flex items-center justify-center">
    <LoadingSpinner />
  </div>
{/if}
