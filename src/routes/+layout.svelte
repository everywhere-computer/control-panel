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
  import { sessionStore, themeStore } from '$lib/stores'
  import { unsubscribeRPC } from '$lib/rpc'
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

  const init = async () => {
    await initialize()

    // Redirect to home if not logged in
    // if (
    //   window.location.href !== window.location.origin &&
    //   !$sessionStore.username
    // ) {
    //   goto('/')
    // }
  }

  init()

  onMount(async () => {
    // Check for a Homestar WebSocket connection
    checkHomestarConnection()

    // Check if the IPFS daemon is running
    await checkIPFSConnection()

    // Subscribe to Homestar network events
    subscribNetworkEvents()

    // Instantiate PostHog Analytics
    instantiatePostHog()
  })

  onDestroy(() => {
    unsubscribeRPC()
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
      {#if !$page.route.id.includes('onboarding')}
        {#if isHome && screenSize >= 768}
          <Nav {screenSize} />
        {:else if !isHome}
          <Nav {screenSize} />
        {/if}
      {/if}

      <div
        class={isHome ? '' : isActivity ? 'pb-6' : isFullWidth ? 'pt-6' : 'p-6'}
      >
        <slot />
      </div>

      {#if isHome && $sessionStore.username}
        <Footer {screenSize} />
      {/if}

      {#if $sessionStore.username}
        <DataWidget />
        <GlobalShortcutHandler />
      {/if}
    </div>
  {/if}
</div>
