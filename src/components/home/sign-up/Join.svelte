<script lang="ts">
  import Plausible from 'plausible-tracker'
  import { createEventDispatcher } from 'svelte'

  const { trackEvent } = Plausible({
    trackLocalhost: false
  })

  const dispatch = createEventDispatcher()

  const handleJoin = () => {
    trackEvent('Click "beta intake" button', {
      // callback: () => console.log('done'),
      props: {
        email: '' // enter user account email
      }
    })
    dispatch('nextStep')
  }
</script>

<button
  class="btn btn-primary btn-odd-purple-500 w-[189px] h-10 mt-auto !text-label-l gap-2"
  on:click={handleJoin}
>
  Join the Beta
</button>
