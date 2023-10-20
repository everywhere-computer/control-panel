<script lang="ts">
  import { page } from '$app/stores'
  import FooterBrand from '$components/icons/FooterBrand.svelte'
  import Nav from '$components/nav/Nav.svelte'

  export let screenSize: number
  $: isHome = $page.route.id === '/'
</script>

{#if isHome && screenSize < 768}
  <Nav inFooter {screenSize} />
{/if}

<div
  class="flex flex-row items-center justify-center gap-[5px] h-10 {isHome &&
  screenSize < 768
    ? ''
    : 'mt-auto'} {isHome ? 'bg-odd-gray-100' : 'bg-odd-gray-0'}"
>
  <FooterBrand />
</div>
