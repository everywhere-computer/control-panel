<script lang="ts">
  import { themeStore } from '$lib/stores'
  import Email from '$components/home/sign-up/Email.svelte'
  import Join from '$components/home/sign-up/Join.svelte'
  import Pin from '$components/home/sign-up/Pin.svelte'
  import Username from '$components/home/sign-up/Username.svelte'

  const steps = {
    1: Join,
    2: Email,
    3: Pin,
    4: Username
  }

  let currentStep = 1

  $: showGlobe =
    currentStep === 1 ||
    currentStep === 2 ||
    currentStep === 3 ||
    currentStep === 4
  $: authDetails = {}

  const onNextStep = (dispatchEvent: {
    detail: null | {
      email?: String
      error?: String
      nextStep?: number
      pin?: String
      username?: String
    }
  }) => {
    if (dispatchEvent?.detail) {
      const { nextStep, ...details } = dispatchEvent.detail
      authDetails = {
        ...details
      }

      currentStep = nextStep
    }
  }
</script>

<div
  class="flex flex-col items-center gap-4 md:gap-32 w-full min-h-screen md:min-h-[calc(100vh-40px)]"
>
  {#if currentStep === 2 || currentStep === 3 || currentStep === 4}
    <h1 class="mb-[89px] pt-[88px] md:pt-0 text-heading-2xl">
      Beta Access Procedure
    </h1>
  {/if}

  {#if showGlobe}
    <div
      class="logo relative max-w-[60vmin] md:max-w-[282px] max-h-[60vmin] md:max-h-[282px] {currentStep ===
      1
        ? 'mt-[205px]'
        : ''}"
    >
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

  <svelte:component
    this={steps[currentStep]}
    on:nextStep={onNextStep}
    {...authDetails}
  />
</div>
