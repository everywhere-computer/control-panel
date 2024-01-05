<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import StarMedium from '$components/icons/StarMedium.svelte'
  import StarSmall from '$components/icons/StarSmall.svelte'

  const dispatch = createEventDispatcher()

  let username = 'depatchedmode'
  let analyticsPolicy = false

  const handleContinue = async () => {
    dispatch('nextStep')
  }
</script>

<div class="py-12 px-9">
  <div class="flex flex-row items-center md:mr-auto mb-8">
    <div
      class="flex flex-row items-center justify-center gap-1 py-3 px-4 rounded-[88px] bg-base-200"
    >
      <StarMedium />
      <StarSmall colour="#CCCCE3" />
      <StarSmall colour="#CCCCE3" />
      <StarSmall colour="#CCCCE3" />
    </div>
  </div>

  <div class="flex flex-col gap-6 text-body-lg w-full max-w-[576px] m-auto">
    <h1 class="font-bold text-heading-2xl mb-8">
      Welcome to the Everywhere Computer, <span
        class="whitespace-nowrap text-primary-focus"
      >
        {username}
        <span class="text-base-content">!</span>
      </span>
    </h1>

    <p>
      You’re network <strong class="font-bold">member #89</strong>
      .
    </p>
    <p>
      We’re excited to get you up and running on Everywhere Computer, and
      learning about your compute needs.
    </p>
    <p>
      To help us improve the product experience, we collect basic analytics
      using a simple, privacy preserving, cookie-free tool called PostHog.
    </p>
    <p>
      It does <strong class="font-bold">not</strong>
      :
    </p>
    <ul class="pl-6 list-disc">
      <li>associate analytics with any PII</li>
      <li>disclose analytics to 3rd parties</li>
      <li>correlate activity across devices</li>
    </ul>
    <p>You can opt-out at any time by enabling Do Not Track in your browser.</p>

    <div class="form-control">
      <label class="flex flex-row items-center gap-2 text-body-sm">
        <input
          name="analyticsPolicy"
          class="checkbox"
          type="checkbox"
          bind:value={analyticsPolicy}
        />
        I understand the analytics policy
      </label>
    </div>

    <button
      class="btn btn-primary btn-odd-purple-500 self-center w-full md:max-w-[311px] md:mr-auto h-10 !text-label-l"
      on:click={handleContinue}
      disabled={!analyticsPolicy}
    >
      Continue
    </button>
  </div>
</div>
