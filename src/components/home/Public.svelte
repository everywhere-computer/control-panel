<script lang="ts">
  import { themeStore } from '$lib/stores'
  import Details from '$components/home/sign-up/Details.svelte'
  import Email from '$components/home/sign-up/Email.svelte'
  import Join from '$components/home/sign-up/Join.svelte'
  import Pin from '$components/home/sign-up/Pin.svelte'
  import Username from '$components/home/sign-up/Username.svelte'

  const steps = {
    1: 'join',
    2: 'email',
    3: 'new',
    4: 'details',
    5: 'pin'
  }

  let currentStep = 1

  const onNextStep = () => {
    if (currentStep < 5) {
      currentStep = currentStep + 1
    }
  }
</script>

<div
  class="flex flex-col items-center justify-center gap-4 min-h-[calc(100vh-248px)] md:min-h-[calc(100vh-160px)] w-full"
>
  {#if currentStep !== 4}
    <div class="logo relative max-w-[60vmin] max-h-[60vmin] mt-auto">
      <img
        class="logo-bg w-full animate-rotateAnimation"
        src={`${window.location.origin}/logo-bg${
          $themeStore.selectedTheme === 'dark' ? '-dark' : ''
        }.svg`}
        alt="logo backgroud"
      />
      <img
        class="logo-mg absolute z-10 top-[12.8%] left-[12.4%] w-[75.4%] object-cover"
        src={`${window.location.origin}/logo-mg.gif`}
        alt="logo spinning lines"
      />
      <img
        class="logo-fg absolute top-0 left-0 z-20 w-full"
        src={`${window.location.origin}/logo-fg.svg`}
        alt="logo foreground"
      />
    </div>
  {/if}

  {#if currentStep === 1}
    <Join on:nextStep={onNextStep} />
  {:else if currentStep === 2}
    <Email on:nextStep={onNextStep} />
  {:else if currentStep === 3}
    <Username on:nextStep={onNextStep} />
  {:else if currentStep === 4}
    <Details on:nextStep={onNextStep} />
  {:else if currentStep === 5}
    <Pin on:nextStep={onNextStep} />
  {/if}
</div>
