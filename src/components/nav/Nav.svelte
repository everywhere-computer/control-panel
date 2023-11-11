<script lang="ts">
  import { navigating, page } from '$app/stores'
  import { fade, fly } from 'svelte/transition'

  import { sessionStore } from '$lib/stores'
  import { clickOutside } from '$lib/utils'
  import Activity from '$components/icons/Activity.svelte'
  import Functions from '$components/icons/Functions.svelte'
  import HeaderLogo from '$components/icons/HeaderLogo.svelte'
  import NavItems from '$components/nav/NavItems.svelte'
  import Settings from '$components/icons/Settings.svelte'
  import Workflows from '$components/icons/Workflows.svelte'

  export let inFooter: boolean = false
  export let screenSize: number | null

  let navOpen = false
  const handleToggleNav = () => (navOpen = !navOpen)

  $: {
    if ($navigating) {
      navOpen = false
    }
  }

  $: navItems = [
    {
      label: 'Activity',
      href: '/activity/',
      icon: Activity,
      isActive: $page.url.pathname.includes('/activity/')
    },
    {
      label: 'Workflows',
      href: '/workflows/',
      icon: Workflows,
      isActive: $page.url.pathname.includes('/workflows/')
    },
    {
      label: 'Functions',
      href: '/functions/',
      icon: Functions,
      isActive: $page.url.pathname.includes('/functions/')
    },
    {
      label: 'Settings',
      href: '/settings/',
      icon: Settings,
      isActive: $page.url.pathname.includes('/settings/')
    }
  ]

  // Close the nav when clicking outside
  const handleClickOutside = () => (navOpen = false)
</script>

<navbar
  class="relative flex flex-row p-0 w-full {inFooter
    ? 'h-auto md:h-10 mt-auto'
    : 'h-10'}"
>
  <a
    href="/"
    class="{inFooter ? 'hidden md:inline-block' : ''} {$page.url.pathname ===
    '/'
      ? 'text-odd-purple-500'
      : 'text-odd-gray-700'} border-r border-odd-gray-100 hover:text-odd-purple-500 transition-colors ease-in-out duration-200"
  >
    <HeaderLogo />
  </a>

  {#if $sessionStore.session}
    {#if !inFooter && screenSize < 768}
      {@const activeNavItem = navItems.find(({ isActive }) => isActive)}
      {#if activeNavItem}
        <button
          on:click={handleToggleNav}
          use:clickOutside={{
            enabled: navOpen,
            cb: handleClickOutside
          }}
          class="toggle-trigger flex flex-row items-center justify-start gap-2 w-full h-full pl-3.5 box-border bg-odd-gray-700 font-sans text-body-sm text-odd-gray-0"
        >
          <svelte:component this={activeNavItem.icon} />{activeNavItem.label}
        </button>
        {#if navOpen}
          <div
            class="absolute z-20 top-full left-0 right-0 border-t border-odd-gray-100"
            in:fly={{ x: -10, duration: 120 }}
            out:fade={{ duration: 100 }}
          >
            <NavItems inFooter {navItems} />
          </div>
        {/if}
      {/if}
    {:else}
      <NavItems {inFooter} {navItems} />
    {/if}
  {/if}
</navbar>
