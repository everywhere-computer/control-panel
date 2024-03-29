<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { onDestroy, onMount } from 'svelte'

  import '../global.css'
  import { instantiatePostHog } from '$lib/analytics'
  import {
    checkHomestarConnection,
    checkIPFSConnection
  } from '$lib/connections'
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
  $: isFullHeight = $page.route.id === '/workflows'
  $: isHome = $page.route.id === '/'
  $: isActivity = $page.route.id === '/activity'
  let screenSize: number

  const unsubscribeSessionStore = sessionStore.subscribe(session => {
    if (session.error) {
      const message = errorToMessage(session.error)
      addNotification({ msg: message, type: 'error' })
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

  // init()

  onMount(async () => {
    // Default to workflows route
    goto('/workflows')
    $sessionStore.loading = false

    // Check for a Homestar WebSocket connection
    checkHomestarConnection()

    // // Check if the IPFS daemon is running
    // await checkIPFSConnection()

    // Subscribe to Homestar network events
    subscribNetworkEvents()

    // Instantiate PostHog Analytics
    instantiatePostHog()
  })

  onDestroy(() => {
    unsubscribeRPC()
    unsubscribeSessionStore()
  })
</script>

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
          : isFullHeight
          ? 'p-0'
          : 'p-6'}
      >
        <slot />
      </div>

      <Footer {screenSize} />

      <!-- {#if $sessionStore.session} -->
        <!-- <DataWidget /> -->
        <!-- <GlobalShortcutHandler /> -->
      <!-- {/if} -->
    </div>
  {/if}
</div>
