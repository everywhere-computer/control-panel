<script lang="ts">
  import { onDestroy, onMount } from 'svelte'

  import { sessionStore } from '$lib/stores'
  import StarMedium from '$components/icons/StarMedium.svelte'
  import StarSmall from '$components/icons/StarSmall.svelte'

  const INTERVAL = 7500
  let discordMemberPoll: NodeJS.Timer
  let discordMembersOnline: number

  // Start polling for online discord members
  onMount(async () => {
    const fetchMemberCount = async () => {
      const res = await fetch(
        'https://control-panel-online-discord-members.fission-cdd.workers.dev/',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      discordMembersOnline = await res.json()
      return discordMembersOnline
    }
    try {
      await fetchMemberCount()

      discordMemberPoll = setInterval(async () => {
        await fetchMemberCount()
      }, INTERVAL)
    } catch (error) {
      console.error(error)
    }
  })

  // Stop polling for online discord members
  onDestroy(() => {
    clearInterval(discordMemberPoll)
  })
</script>

<div class="flex flex-col gap-4 md:gap-12 min-h-[calc(100vh-88px)]">
  <div class="">
    <div class="flex flex-row items-center justify-between mb-8 md:mb-[60px]">
      <div
        class="flex flex-row items-center justify-center gap-1 py-3 px-4 rounded-[88px] bg-base-200"
      >
        <StarSmall colour="#32334A" />
        <StarSmall colour="#32334A" />
        <StarMedium />
        <StarSmall colour="#CCCCE3" />
      </div>

      <p class="w-[120px] font-mono text-code-m text-right uppercase">
        Onboarding member #{$sessionStore.id}
      </p>
    </div>

    <div
      class="flex flex-col gap-6 text-body-lg w-full md:max-w-[572px] md:mx-auto"
    >
      <h1 class="font-bold text-heading-2xl">You’re in good company, here.</h1>

      <p>
        And we’re all hanging out right now in the <span class="font-bold">
          Beta Members Discord Forum.
        </span>
      </p>
      <p>
        Whether you’re stuck, want to lend a hand, or want to riff on
        distributed compute problems with other like-minded folks, it’s the
        place to be.
      </p>
      <p class="italic">Come join us!</p>
    </div>
  </div>

  <div
    class="flex flex-col gap-6 w-full md:max-w-[572px] mt-auto md:mt-8 md:mx-auto mb-8 px-9 md:px-0"
  >
    <div
      class="flex flex-row items-center justify-center font-mono !font-bold text-code-sm bg-odd-green-50 border border-odd-green-400 py-3 rounded-sm"
    >
      <span
        class="w-4 h-4 mr-2 {discordMembersOnline
          ? 'bg-odd-green-400 animate-pulse'
          : 'bg-odd-red-400'} rounded-full"
      />
      {discordMembersOnline ?? 'loading'} MEMBERS ONLINE
    </div>

    <div class="flex flex-col md:flex-row md:items-center gap-6">
      <a
        href="https://discord.com/channels/478735028319158273/1182384404887244860"
        target="_blank"
        class="btn btn-primary btn-odd-purple-500 self-center w-full md:max-w-[311px] h-10 !text-label-l"
      >
        Join the Discord
      </a>

      <a
        href="/onboarding/nav"
        class="btn btn-ghost self-center w-full md:max-w-[230px] !text-label-l -translate-y-4 md:translate-y-0"
      >
        Skip for now
      </a>
    </div>
  </div>
</div>
