<script lang="ts">
  import * as Bearer from '@fission-codes/ucan/bearer'
  import { onMount } from 'svelte'

  import { createUcanWithCaps } from '$lib/fission-server-utils'
  import { sessionStore } from '$lib/stores'

  onMount(async () => {
    try {
      const { store, ucan } = await createUcanWithCaps('account/info')
      const headers = Bearer.encode(ucan, store)

      const response = await fetch(
        `${import.meta.env.VITE_FISSION_SERVER_API_URI}/account/member-number`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...headers
          }
        }
      )

      const { memberNumber } = await response.json()

      $sessionStore.memberNumber = memberNumber
    } catch (error) {
      console.error(error)
    }
  })
</script>

{#if $sessionStore.memberNumber}
  <slot />
{/if}
