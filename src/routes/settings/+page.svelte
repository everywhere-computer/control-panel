<script lang="ts">
  import { goto } from '$app/navigation'
  import { fly } from 'svelte/transition'

  import { sessionStore } from '$lib/stores'
  // import AvatarUpload from '$components/settings/AvatarUpload.svelte'
  import ConnectedDevices from '$components/settings/ConnectedDevices.svelte'
  import PeerID from '$components/settings/PeerID.svelte'
  // import RecoveryKit from '$components/settings/RecoveryKit.svelte'
  import ThemePreferences from '$components/settings/ThemePreferences.svelte'
  import Username from '$components/settings/Username.svelte'
</script>

{#if $sessionStore.session}
  <div
    in:fly={{
      y: 20,
      duration: 200,
      opacity: 0
    }}
    class="flex flex-col items-start max-w-[800px] m-auto gap-10 pb-28 text-sm"
  >
    <div class="flex flex-col items-start justify-center gap-6">
      <!-- <AvatarUpload /> -->

      <PeerID />

      <Username />

      <ThemePreferences />

      <ConnectedDevices />

      <!-- <RecoveryKit /> -->
    </div>
  </div>
{:else}
  {goto('/')}
{/if}
