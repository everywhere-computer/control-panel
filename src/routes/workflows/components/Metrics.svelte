<script lang="ts">
  import { metrics } from '$routes/workflows/lib/chart-mocks'
  import MetricsCard from '$routes/workflows/components/MetricsCard.svelte'
</script>

<div class="flex flex-col gap-6 items-center w-full max-w-[800px] mx-auto">
  {#each metrics as metric}
    <MetricsCard {metric} />
  {/each}
</div>
