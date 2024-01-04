<script lang="ts">
  import type * as odd from '@oddjs/odd'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'

  import { addNotification } from '$lib/notifications'
  import { createAccountLinkingConsumer } from '$lib/auth/linking'
  import { loadAccount } from '$lib/auth/account'
  import { sessionStore } from '$lib/stores'
  import { waitForDataRoot } from '$lib/auth/account'
  import type { LinkDeviceView } from '$lib/views'
  import FilesystemActivity from '$components/common/FilesystemActivity.svelte'
  import LinkDevice from '$components/auth/link-device/LinkDevice.svelte'
  import { extractSearchParam } from '$lib/utils'

  let view: LinkDeviceView = 'link-device'

  let accountLinkingConsumer: odd.AccountLinkingConsumer
  let displayPin: string = ''

  const hashedUsername = extractSearchParam($page.url, 'hashedUsername')
  const fullUsername = decodeURIComponent(
    extractSearchParam($page.url, 'username')
  )

  const initAccountLinkingConsumer = async () => {
    accountLinkingConsumer = await createAccountLinkingConsumer(hashedUsername)

    accountLinkingConsumer.on('challenge', ({ pin }) => {
      displayPin = pin.join('')
    })

    accountLinkingConsumer.on('link', async ({ approved }) => {
      if (approved) {
        view = 'load-filesystem'

        // See https://github.com/oddsdk/ts-odd/issues/529
        await waitForDataRoot(hashedUsername)
        await loadAccount(hashedUsername, fullUsername)

        addNotification({ msg: "You're now connected!", type: 'success' })
        goto('/')
      } else {
        addNotification({
          msg: 'The connection attempt was cancelled',
          type: 'info'
        })
        goto('/')
      }
    })
  }

  const cancelConnection = async () => {
    addNotification({
      msg: 'The connection attempt was cancelled',
      type: 'info'
    })

    await accountLinkingConsumer?.cancel()
    goto('/')
  }

  if (!$sessionStore.session) {
    initAccountLinkingConsumer()
  }
</script>

<input type="checkbox" id="my-modal-5" checked class="modal-toggle" />

{#if view === 'link-device'}
  <LinkDevice pin={displayPin} on:cancel={cancelConnection} />
{:else if view === 'load-filesystem'}
  <FilesystemActivity activity="Loading" />
{/if}
