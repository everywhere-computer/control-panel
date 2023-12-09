<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import StarSmall from '$components/icons/StarSmall.svelte'

  const dispatch = createEventDispatcher()

  const handleContinue = () => {
    dispatch('nextStep')
  }

  const handleJoinDiscord = async () => {
    handleContinue()
  }
</script>

<div class="pt-12 px-9">
  <div class="flex flex-row items-center mb-8">
    <div
      class="flex flex-row items-center justify-center gap-1 py-3 px-4 rounded-[88px] bg-base-content"
    >
      <StarSmall colour="#E8E8F4" />
      <StarSmall colour="#E8E8F4" />
      <StarSmall colour="#8D74F7" />
      <StarSmall />
    </div>
  </div>

  <div class="flex flex-col gap-6 text-body-lg">
    <h1 class="font-bold text-heading-2xl">You’re in good company, here.</h1>

    <p>
      And we’re all hanging out right now in the <span class="font-bold">
        Beta Members Discord Forum.
      </span>
    </p>
    <p>
      Whether you’re stuck, want to lend a hand, or want to riff on distributed
      compute problems with other like-minded folks, it’s the place to be.
    </p>
    <p class="italic">Come join us!</p>
  </div>
</div>

<div class="flex flex-col gap-6 w-full mt-auto mb-8 px-9">
  <div
    class="flex flex-row items-center justify-center font-mono !font-bold text-code-sm bg-odd-green-50 border border-odd-green-400 py-3 rounded-sm"
  >
    <span class="w-4 h-4 mr-2 bg-odd-green-400 rounded-full" />
    9 MEMBERS ONLINE
  </div>

  <button
    class="btn btn-primary btn-odd-purple-500 self-center w-full h-10 !text-label-l"
    on:click={handleJoinDiscord}
  >
    Join the Discord
  </button>

  <button
    class="btn btn-ghost self-center w-full !text-label-l -translate-y-4"
    on:click={handleContinue}
  >
    Skip for now
  </button>
</div>
