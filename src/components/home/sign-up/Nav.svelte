<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import StarNav from '$components/icons/StarNav.svelte'
  import StarSmall from '$components/icons/StarSmall.svelte'

  const dispatch = createEventDispatcher()

  const handleJoinDiscord = async () => {
    dispatch('nextStep')
  }
</script>

<div class="pt-12 px-9">
  <div class="flex flex-row items-center mb-8">
    <div
      class="flex flex-row items-center justify-center gap-1 py-3 px-4 rounded-[88px] bg-base-content"
    >
      <StarSmall colour="#E8E8F4" />
      <StarSmall colour="#E8E8F4" />
      <StarSmall colour="#E8E8F4" />
      <StarSmall colour="#8D74F7" />
    </div>
  </div>

  <div class="flex flex-col gap-6 text-body-lg">
    <h1 class="font-bold text-heading-2xl">One last thing: Meet Nav</h1>

    <p>
      Mistakes are sure to be made.Confusion is bound to occur.Fits of
      inspiration are guaranteed!
    </p>
    <p>
      Whatever it is that has disrupted your flow, Nav will be be available in
      the bottom right corner of your screen to give you an outlet.
    </p>
    <p>
      At present, it’s a simple widget with handy links, but over time it will
      grow to be much more.
    </p>
  </div>
</div>

<div class="my-auto">
  <img
    src={`${window.location.href}/star-nav.png`}
    alt="nav star"
    class="w-16 h-16 block"
  />
</div>

<div class="flex flex-col gap-4 w-full mt-auto mb-8 px-9">
  <button
    class="btn btn-primary btn-odd-purple-500 self-center w-full h-10 !text-label-l"
    on:click={handleJoinDiscord}
  >
    Let's go!
  </button>
</div>
