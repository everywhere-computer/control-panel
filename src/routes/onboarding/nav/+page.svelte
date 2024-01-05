<script lang="ts">
  import { goto } from '$app/navigation'

  import { sessionStore } from '$lib/stores'
  // import StarNav from '$components/icons/StarNav.svelte'
  import StarSmall from '$components/icons/StarSmall.svelte'
  import StarMedium from '$components/icons/StarMedium.svelte'

  const handleGoHome = async () => {
    // @ts-ignore-next-line
    $sessionStore.session = true

    goto('/')
  }
</script>

<div class="flex flex-row items-center mb-8">
  <div
    class="flex flex-row items-center justify-center gap-1 py-3 px-4 rounded-[88px] bg-base-200"
  >
    <StarSmall colour="#32334A" />
    <StarSmall colour="#32334A" />
    <StarSmall colour="#32334A" />
    <StarMedium />
  </div>
</div>

<div class="flex flex-col gap-24 md:gap-12">
  <div class="flex flex-col gap-6 md:max-w-[572px] mx-auto text-body-lg">
    <h1 class="font-bold text-heading-2xl">One last thing: Meet Nav</h1>

    <p>
      Mistakes are sure to be made.
      <br />
      Confusion is bound to occur.
      <br />
      Fits of inspiration are guaranteed!
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

  <div class="flex items-center justify-center max-w-[572px] m-auto md:my-0">
    <img
      src={`${window.location.origin}/star-nav.png`}
      alt="nav star"
      class="w-16 h-16 block"
    />
  </div>

  <div
    class="flex flex-col gap-4 w-full md:max-w-[572px] m-auto md:mt-0 mb-8 px-9 md:px-0"
  >
    <button
      class="btn btn-primary btn-odd-purple-500 self-center w-full h-10 !text-label-l"
      on:click={handleGoHome}
    >
      Let's go!
    </button>
  </div>
</div>
