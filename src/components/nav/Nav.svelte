<script lang="ts">
  import { page } from '$app/stores'
  import Activity from '$components/icons/Activity.svelte'
  import Functions from '$components/icons/Functions.svelte'
  import HeaderLogo from '$components/icons/HeaderLogo.svelte'
  import Settings from '$components/icons/Settings.svelte'
  import Workflows from '$components/icons/Workflows.svelte'

  const navItems = [
    {
      label: 'Activity',
      href: '/activity/',
      icon: Activity
    },
    {
      label: 'Workflows',
      href: '/workflows/',
      icon: Workflows
    },
    {
      label: 'Functions',
      href: '/functions/',
      icon: Functions
    },
    {
      label: 'Settings',
      href: '/settings/',
      icon: Settings
    }
  ]
</script>

<navbar class="flex flex-row p-0 w-full h-[64px]">
  <a href="/" class=""><HeaderLogo /></a>
  <ul
    class="flex flex-row w-full items-center divide-x divide-odd-gray-100 justify-start"
  >
    {#each navItems as navItem}
      <li
        class="flex-auto bg-odd-blue-500 hover:bg-odd-blue-400 {$page.url.pathname.includes(
          navItem.href
        )
          ? '!bg-odd-gray-500'
          : ''} transition-colors ease-in-out duration-200 h-[64px] px-6"
      >
        <a
          href={navItem.href}
          class="flex flex-row items-center justify-start gap-4 h-full font-sans text-body-m text-odd-blue-100"
        >
          <svelte:component this={navItem.icon} />{navItem.label}
        </a>
      </li>
    {/each}
  </ul>
</navbar>
