<script lang="ts">
  import { page } from '$app/stores'

  import { themeStore } from '$lib/stores'

  export let inFooter: boolean = false
  export let navItems
</script>

<ul
  class="flex md:flex-row w-full items-center md:divide-x {$themeStore.selectedTheme ===
  'light'
    ? 'divide-odd-gray-100'
    : 'divide-odd-gray-900'} justify-start {inFooter
    ? 'flex-col divide-y md:flex-row md:divide-x md:divide-y-0 w-full'
    : ''}"
>
  {#each navItems as navItem}
    <li
      class="flex-auto bg-odd-gray-700 group {$page.url.pathname.includes(
        navItem.href
      )
        ? '!bg-odd-purple-500'
        : ''} transition-colors ease-in-out duration-200 h-10 {inFooter
        ? 'w-full'
        : ''}"
    >
      <a
        href={navItem.href}
        class="flex flex-row items-center justify-start gap-4 h-full px-6 font-sans text-label-m text-odd-purple-100 group-hover:text-odd-purple-200 transition-colors ease-in-out duration-200"
      >
        <svelte:component this={navItem.icon} />{navItem.label}
      </a>
    </li>
  {/each}
</ul>
