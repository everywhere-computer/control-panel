<script lang="ts">
  import { fade, fly } from 'svelte/transition'

  import { themeStore } from '$lib/stores'
  import type { Notification } from '$lib/notifications'
  import CheckThinIcon from '$components/icons/CheckThinIcon.svelte'
  import InfoThinIcon from '$components/icons/InfoThinIcon.svelte'
  import WarningThinIcon from '$components/icons/WarningThinIcon.svelte'
  import XThinIcon from '$components/icons/XThinIcon.svelte'

  export let notification: Notification

  const iconMap = {
    info: {
      component: InfoThinIcon,
      props: {
        color: '#1e3a8a'
      }
    },
    error: {
      component: XThinIcon,
      props: {
        color: $themeStore.selectedTheme === 'light' ? '#ffd6d7' : '#fec3c3'
      }
    },
    success: {
      component: CheckThinIcon,
      props: {
        color: '#14532D'
      }
    },
    warning: {
      component: WarningThinIcon,
      props: {
        color: '#7c2d12'
      }
    }
  }
</script>

<div
  in:fly={{ y: 20, duration: 400 }}
  out:fade
  role="alert"
  aria-live="assertive"
  aria-atomic="true"
>
  <div
    class="alert alert-{notification.type} flex items-center max-w-[272px] w-fit text-label-m mb-3 peer-last:mb-0"
  >
    <p>{notification.msg}</p>
  </div>
</div>
