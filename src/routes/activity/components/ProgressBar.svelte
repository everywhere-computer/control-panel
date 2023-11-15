<script lang="ts">
  export let buffer = 0
  export let used = 0
  export let total = 100
  export let label = null

  const bufferPercentage = ((used + buffer) / total) * 100
  const usedPercentage = (used / total) * 100

  let currentColour = 'bg-odd-green-300'
  if (usedPercentage > 75) {
    currentColour = 'bg-odd-red-300'
  } else if (usedPercentage > 50) {
    currentColour = 'bg-odd-yellow-300'
  }
</script>

<div>
  <div class="flex flex-row items-center justify-between w-full mb-2">
    {#if label}
      <p class="text-label-sm">{label}</p>
    {/if}

    <p class="self-end text-input-sm">{Math.round(usedPercentage)}%</p>
  </div>

  <div
    class="relative w-full h-[22px] bg-base-100 border border-odd-gray-400 rounded-sm overflow-x-hidden"
  >
    <div
      class="absolute top-0 left-0 bottom-0 z-10 {currentColour}"
      style="width: {Math.round(usedPercentage)}%"
    />
    {#if buffer}
      <div
        class="absolute top-0 left-0 bottom-0 z-0 w-[{Math.round(
          bufferPercentage
        )}%] bg-base-300 border-r border-odd-gray-400"
      />
    {/if}
  </div>
</div>
