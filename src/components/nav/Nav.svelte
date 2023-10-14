<script lang="ts">
  import { navigating, page } from '$app/stores'
  import { fade, fly } from 'svelte/transition'

  import { sessionStore } from '$src/stores'
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
</script>

<navbar
  class="relative flex flex-row p-0 w-full {inFooter
    ? 'h-auto md:h-[64px] mt-auto'
    : 'h-[64px]'}"
>
  <a href="/" class={inFooter ? 'hidden md:inline-block' : ''}>
    <HeaderLogo />
  </a>

  {#if $sessionStore.session}
    {#if !inFooter && screenSize < 768}
      {@const activeNavItem = navItems.find(({ isActive }) => isActive)}
      {#if activeNavItem}
        <button
          on:click={handleToggleNav}
          class="flex flex-row items-center justify-start gap-4 w-full h-full pl-3.5 box-border bg-odd-gray-150 font-sans text-body-lg text-odd-gray-500 transition-colors ease-in-out duration-200 hover:bg-odd-blue-400 hover:text-odd-blue-100"
        >
          <svelte:component this={activeNavItem.icon} />{activeNavItem.label}
        </button>
        {#if navOpen}
          <div
            class="absolute z-20 top-full left-0 right-0"
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
