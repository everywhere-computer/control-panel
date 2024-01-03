<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { onDestroy, onMount } from 'svelte'

  import '../global.css'
  import subscribNetworkEvents from '$lib/network'
  import { addNotification } from '$lib/notifications'
  import { sessionStore, themeStore } from '$lib/stores'
  import { unsubscribeRPC } from '$lib/rpc'
  import { errorToMessage } from '$lib/session'
  import { initialize } from '$lib/init'
  import DataWidget from '$components/common/DataWidget.svelte'
  import GlobalShortcutHandler from '$components/common/GlobalShortcutHandler.svelte'
  import FullScreenLoadingSpinner from '$components/common/FullScreenLoadingSpinner.svelte'
  import Footer from '$components/Footer.svelte'
  import Nav from '$components/nav/Nav.svelte'
  import Notifications from '$components/notifications/Notifications.svelte'

  $: isFullWidth =
    $page.route.id === '/activity' ||
    $page.route.id === '/workflows/[id]' ||
    $page.route.id === '/workflows/build'
  $: isHome = $page.route.id === '/'
  $: isActivity = $page.route.id === '/activity'
  let screenSize: number

  const unsubscribeSessionStore = sessionStore.subscribe(session => {
    if (session.error) {
      const message = errorToMessage(session.error)
      addNotification(message, 'error')
    }
  })

  const init = async () => {
    await initialize()

    // Rediret to home if not logged in
    if (
      window.location.href !== window.location.origin &&
      !$sessionStore.session
    ) {
      goto('/')
    }
  }

  init()

  onMount(() => {
    // Check if Homestar node is connected
    let homestarError = false
    const ws = new WebSocket(import.meta.env.VITE_WEBSOCKET_ENDPOINT)
    ws.addEventListener('error', () => {
      // Connection closed
      if (ws.readyState === 3) {
        homestarError = true
        console.error(`Error: couldn't connect to WebSocket`)
        addNotification(
          'Failed to connect to Homestar. Please check the WebSocket endpoint in your .env and ensure Homestar is running.',
          'error',
          15000
        )
      }
    })

    if (!homestarError) {
      subscribNetworkEvents()
    }
  })

  onDestroy(() => {
    unsubscribeRPC()
    unsubscribeSessionStore()
  })
</script>

<svelte:head>
  {#if window?.location?.href?.includes('control')}
    <script
      defer
      data-domain="control.everywhere.computer"
      src="https://plausible.io/js/script.js"
    ></script>
  {/if}
</svelte:head>

<svelte:window bind:innerWidth={screenSize} />

<div
  data-theme={$themeStore.selectedTheme}
  class="min-h-screen {isHome
    ? $themeStore.selectedTheme === 'light'
      ? 'bg-odd-gray-0'
      : 'bg-base-100'
    : $themeStore.selectedTheme === 'light'
    ? 'bg-odd-gray-50'
    : 'bg-odd-gray-900'} duration-200 ease-in-out transition-colors"
>
  <Notifications />

  {#if $sessionStore.loading}
    <FullScreenLoadingSpinner />
  {:else}
    <div class="flex flex-col min-h-screen md:pt-10">
      {#if isHome && screenSize >= 768}
        <Nav {screenSize} />
      {:else if !isHome}
        <Nav {screenSize} />
      {/if}

      <div
        class={isHome
          ? 'p-4'
          : isActivity
          ? 'pb-6'
          : isFullWidth
          ? 'pt-6'
          : 'p-6'}
      >
        <slot />
      </div>

      <Footer {screenSize} />

      {#if $sessionStore.session}
        <DataWidget />
        <GlobalShortcutHandler />
      {/if}
    </div>
  {/if}
</div>
