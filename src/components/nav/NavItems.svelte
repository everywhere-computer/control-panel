<script lang="ts">
  import { page } from '$app/stores'

  export let inFooter: boolean = false
  export let navItems
</script>

<ul
  class="flex md:flex-row w-full items-center md:divide-x divide-odd-gray-100 justify-start {inFooter
    ? 'flex-col divide-y md:flex-row md:divide-x md:divide-y-0 w-full'
    : ''}"
>
  {#each navItems as navItem}
    <li
      class="flex-auto bg-odd-blue-500 hover:bg-odd-blue-400 {$page.url.pathname.includes(
        navItem.href
      )
        ? '!bg-odd-gray-500'
        : ''} transition-colors ease-in-out duration-200 h-[64px] {inFooter
        ? 'w-full'
        : ''}"
    >
      <a
        href={navItem.href}
        class="flex flex-row items-center justify-start gap-4 h-full px-6 font-sans text-body-m text-odd-blue-100"
      >
        <svelte:component this={navItem.icon} />{navItem.label}
      </a>
    </li>
  {/each}
</ul>
