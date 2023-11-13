<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { onDestroy, onMount } from 'svelte'

  import '../global.css'
  import { addNotification } from '$lib/notifications'
  import { appDescription, appImageURL, appName, appURL } from '$lib/app-info'
  import { sessionStore, themeStore } from '$lib/stores'
  import { subscribeRPC, unsubscribeRPC } from '$lib/rpc'
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
  let backgroundColour = sessionStore.subscribe(session => {
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
    subscribeRPC()
  })

  onDestroy(() => {
    unsubscribeRPC()
  })
</script>

<svelte:head>
  <title>{appName}</title>

  <meta name="description" content={appDescription} />
  <meta property="og:title" content={appName} />
  <meta property="og:description" content={appDescription} />
  <meta property="og:url" content={appURL} />
  <meta property="og:image" content={appImageURL} />
  <meta name="twitter:title" content={appName} />
  <meta name="twitter:description" content={appDescription} />
  <meta name="twitter:image" content={appImageURL} />
  <meta name="twitter:image:alt" content={appName} />
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
    <div class="flex flex-col min-h-screen">
      {#if isHome && screenSize >= 768}
        <Nav {screenSize} />
      {:else if !isHome}
        <Nav {screenSize} />
      {/if}

      <div class={isActivity ? 'pb-6' : isFullWidth ? 'pt-6' : 'p-6'}>
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
