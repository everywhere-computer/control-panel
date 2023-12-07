<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import { addNotification } from '$lib/notifications'
  import Input from '$components/form/Input.svelte'
  import TextArea from '$components/form/TextArea.svelte'

  const dispatch = createEventDispatcher()

  let loading = false
  let whatsInterestingAboutIPVM = []
  let whereWouldYouRunIt = []

  // $: console.log('whatsInterestingAboutIPVM', whatsInterestingAboutIPVM)
  // $: console.log('whereWouldYouRunIt', whereWouldYouRunIt)

  // Submit username to Fission server to register the account
  const handleSubmitDetails = async (event: Event) => {
    loading = true
    try {
      const formEl = event.target as HTMLFormElement
      const data = new FormData(formEl)

      // @ts-ignore-next-line
      console.log('data', Object.fromEntries(data))

      // await register(encodedUsername)
      // dispatch('nextStep')

      // addNotification('Account created!', 'success')
    } catch (error) {
      console.error(error)
      addNotification('Failed to register account', 'error')
    }
    loading = false
  }
</script>

<form
  on:submit|preventDefault={handleSubmitDetails}
  class="flex flex-col items-center gap-6 pt-4"
>
  <h1 class="text-heading-2xl font-bold">Tell us a few more things:</h1>

  <Input maxWidth="372px" name="name" label="What's your name?" type="text" />

  <Input
    maxWidth="372px"
    name="companyOrProject"
    label="What's the name of your company or project?"
    type="text"
  />

  <TextArea
    maxWidth="372px"
    name="doYouRunAnyNodes"
    note={`<span class="italic">Note: Homestar can be used just in development mode: run it for testing locally and then publishing your function, so you don't have to be running it all the time.</span>`}
    label="Do you run any other nodes at home?"
    validationMessage="For example, you might run an IPFS node, a Bittorrent server, Ethereum or other blockchain node. If you've participated in beta networks like this before, let us know!"
  />

  <!-- bind:group={selection} -->
  <div class="form-control">
    <div class="label">
      <span class="label-text !text-label-sm">
        Where would you like to run a Homestar node?
      </span>
    </div>

    <div class="flex flex-col gap-4">
      <span class="!text-input-sm">
        Assume well written how-tos or "one click" deploy experiences, depending
        on the platform.
      </span>

      <label class="flex flex-row items-center gap-2">
        <input
          name="whereWouldYouRunIt"
          class="checkbox"
          type="checkbox"
          value="aws"
          bind:group={whereWouldYouRunIt}
        />
        AWS
      </label>
      <label class="flex flex-row items-center gap-2">
        <input
          name="whereWouldYouRunIt"
          class="checkbox"
          type="checkbox"
          value="railway"
          bind:group={whereWouldYouRunIt}
        />
        Railway
      </label>
      <label class="flex flex-row items-center gap-2">
        <input
          name="whereWouldYouRunIt"
          class="checkbox"
          type="checkbox"
          value="fly.io"
          bind:group={whereWouldYouRunIt}
        />
        Fly.io
      </label>
      <label class="flex flex-row items-center gap-2">
        <input
          name="whereWouldYouRunIt"
          class="checkbox"
          type="checkbox"
          value="google_cloud_platform"
          bind:group={whereWouldYouRunIt}
        />
        Google Cloud Platform
      </label>
      <label class="flex flex-row items-center gap-2">
        <input
          name="whereWouldYouRunIt"
          class="checkbox"
          type="checkbox"
          value="microsoft_azure"
          bind:group={whereWouldYouRunIt}
        />
        Microsoft Azure
      </label>
      <label class="flex flex-row items-center gap-2">
        <input
          name="whereWouldYouRunIt"
          class="checkbox"
          type="checkbox"
          value="digital_ocean"
          bind:group={whereWouldYouRunIt}
        />
        Digital Ocean
      </label>
      <label class="flex flex-row items-center gap-2">
        <input
          name="whereWouldYouRunIt"
          class="checkbox"
          type="checkbox"
          value="not_interested"
          bind:group={whereWouldYouRunIt}
        />
        Not interested in cloud hosting, I'll run it myself at home / on my own server
      </label>
    </div>
  </div>

  <div class="form-control">
    <div class="label">
      <span class="label-text !text-label-sm">
        What's interesting to you about IPVM?
      </span>
    </div>

    <div class="flex flex-col gap-4">
      <span class="!text-input-sm">Check all that apply.</span>

      <label class="flex flex-row items-center gap-2">
        <input
          name="whatsInterestingAboutIPVM"
          class="checkbox"
          type="checkbox"
          value="portable_computation"
          bind:group={whatsInterestingAboutIPVM}
        />
        Portable computation: serverless not tied to one provider
      </label>
      <label class="flex flex-row items-center gap-2">
        <input
          name="whatsInterestingAboutIPVM"
          class="checkbox"
          type="checkbox"
          value="offchain_compute"
          bind:group={whatsInterestingAboutIPVM}
        />
        Offchain compute: IPVM used with blockchain networks
      </label>
      <label class="flex flex-row items-center gap-2">
        <input
          name="whatsInterestingAboutIPVM"
          class="checkbox"
          type="checkbox"
          value="local_first_functions"
          bind:group={whatsInterestingAboutIPVM}
        />
        Local-first functions: running a Wasm function in local browsers or mobile,
        AND the same function on a server
      </label>
      <label class="flex flex-row items-center gap-2">
        <input
          name="whatsInterestingAboutIPVM"
          class="checkbox"
          type="checkbox"
          value="dweb_p2p_experiments"
          bind:group={whatsInterestingAboutIPVM}
        />
        I like being involved in dweb p2p experiments like this
      </label>
      <label class="flex flex-row items-center gap-2">
        <input
          name="whatsInterestingAboutIPVM"
          class="checkbox"
          type="checkbox"
          value="rust_is_cool"
          bind:group={whatsInterestingAboutIPVM}
        />
        Rust is cool
      </label>
      <label class="flex flex-row items-center gap-2">
        <input
          name="whatsInterestingAboutIPVM"
          class="checkbox"
          type="checkbox"
          value="other"
          bind:group={whatsInterestingAboutIPVM}
        />
        Other
      </label>
    </div>
  </div>

  <TextArea
    maxWidth="372px"
    name="whatProblemsAreYouTackling"
    label="What problem(s) are you interested in tackling with IPVM decentralized compute? What do you hope to learn from running a Homestar node?"
    validationMessage="Feel free to add any other questions or comments for the Fission team. If you're interested in joining a W3C Community Group on these topics, please leave a note."
  />

  <button
    class="btn btn-primary btn-odd-purple-500 w-[189px] h-10 !text-label-l {loading
      ? 'opacity-80'
      : ''} gap-2"
    disabled={loading}
    type="submit"
  >
    Create account
  </button>
</form>
