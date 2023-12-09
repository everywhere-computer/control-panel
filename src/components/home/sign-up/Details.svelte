<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import { addNotification } from '$lib/notifications'
  import Input from '$components/form/Input.svelte'
  import StarSmall from '$components/icons/StarSmall.svelte'
  import TextArea from '$components/form/TextArea.svelte'

  const dispatch = createEventDispatcher()

  let loading = false
  let whatsInterestingAboutIPVM = []
  let whereWouldYouDeployIt = []

  // Submit username to Fission server to register the account
  const handleSubmitDetails = async (event: Event) => {
    loading = true
    try {
      const formEl = event.target as HTMLFormElement
      const data = new FormData(formEl)

      const formEntries = {
        // @ts-ignore-next-line
        ...Object.fromEntries(data),
        whatsInterestingAboutIPVM,
        whereWouldYouDeployIt
      }
      console.log('formEntries', formEntries)

      // await register(encodedUsername)
      dispatch('nextStep')

      // addNotification('Account created!', 'success')
    } catch (error) {
      console.error(error)
      addNotification('Failed to register account', 'error')
    }
    loading = false
  }
</script>

<div class="py-12 px-8">
  <div class="flex flex-row items-center mb-8">
    <div
      class="flex flex-row items-center justify-center gap-1 py-3 px-4 rounded-[88px] bg-base-content"
    >
      <StarSmall colour="#E8E8F4" />
      <StarSmall colour="#8D74F7" />
      <StarSmall />
      <StarSmall />
    </div>
  </div>

  <form
    on:submit|preventDefault={handleSubmitDetails}
    class="flex flex-col items-center gap-6"
  >
    <h1 class="text-heading-2xl font-bold">
      What brings you to the Everywhere Computer?
    </h1>

    <p>
      Your answers are only be visible to the Everywhere Computer team, and will
      help us tailor the platform and documentation to our beta members.
    </p>

    <Input maxWidth="372px" name="name" label="Your name" type="text" />

    <Input
      maxWidth="372px"
      name="orgOrProject"
      label="Your organization / project"
      type="text"
    />

    <TextArea
      maxWidth="372px"
      name="doYouRunAnyNodes"
      label="Do you run nodes for other networks?"
      validationMessage="For example, an IPFS node, a Bittorrent server, or Ethereum node. If you've participated in beta networks like this before, let us know!"
    />

    <div class="form-control">
      <div class="label">
        <span class="label-text !text-label-sm">
          Where are you interested in deploying Everywhere Computer?
        </span>
      </div>

      <div class="flex flex-col gap-4">
        <span class="!text-input-sm">
          Assume well written how-tos or "one click" deploy experiences,
          depending on the platform.
        </span>

        <label class="flex flex-row items-center gap-2">
          <input
            name="whereWouldYouDeployIt"
            class="checkbox"
            type="checkbox"
            value="aws"
            bind:group={whereWouldYouDeployIt}
          />
          AWS
        </label>
        <label class="flex flex-row items-center gap-2">
          <input
            name="whereWouldYouDeployIt"
            class="checkbox"
            type="checkbox"
            value="railway"
            bind:group={whereWouldYouDeployIt}
          />
          Railway
        </label>
        <label class="flex flex-row items-center gap-2">
          <input
            name="whereWouldYouDeployIt"
            class="checkbox"
            type="checkbox"
            value="fly.io"
            bind:group={whereWouldYouDeployIt}
          />
          Fly.io
        </label>
        <label class="flex flex-row items-center gap-2">
          <input
            name="whereWouldYouDeployIt"
            class="checkbox"
            type="checkbox"
            value="google_cloud_platform"
            bind:group={whereWouldYouDeployIt}
          />
          Google Cloud Platform
        </label>
        <label class="flex flex-row items-center gap-2">
          <input
            name="whereWouldYouDeployIt"
            class="checkbox"
            type="checkbox"
            value="microsoft_azure"
            bind:group={whereWouldYouDeployIt}
          />
          Microsoft Azure
        </label>
        <label class="flex flex-row items-center gap-2">
          <input
            name="whereWouldYouDeployIt"
            class="checkbox"
            type="checkbox"
            value="digital_ocean"
            bind:group={whereWouldYouDeployIt}
          />
          Digital Ocean
        </label>
        <label class="flex flex-row items-center gap-2">
          <input
            name="whereWouldYouDeployIt"
            class="checkbox"
            type="checkbox"
            value="not_interested"
            bind:group={whereWouldYouDeployIt}
          />
          No cloud! I prefer to run things myself at home / on my own server
        </label>
      </div>
    </div>

    <div class="form-control">
      <div class="label">
        <span class="label-text !text-label-sm">
          What's interests you the most?
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
          <div>
            <span class="font-bold">Portable computation:</span>
            Serverless without lock-in to a single provider.
          </div>
        </label>
        <label class="flex flex-row items-center gap-2">
          <input
            name="whatsInterestingAboutIPVM"
            class="checkbox"
            type="checkbox"
            value="offchain_compute"
            bind:group={whatsInterestingAboutIPVM}
          />
          <div>
            <span class="font-bold">Offchain compute:</span>
            Running offchain compute that can interface with blockchain network data.
          </div>
        </label>
        <label class="flex flex-row items-center gap-2">
          <input
            name="whatsInterestingAboutIPVM"
            class="checkbox"
            type="checkbox"
            value="local_first_functions"
            bind:group={whatsInterestingAboutIPVM}
          />
          <div>
            <span class="font-bold">Local-first functions:</span>
            The same Wasm function running locally on your browser or phone AND remotely
            on a server
          </div>
        </label>
        <label class="flex flex-row items-center gap-2">
          <input
            name="whatsInterestingAboutIPVM"
            class="checkbox"
            type="checkbox"
            value="dweb_p2p_experiments"
            bind:group={whatsInterestingAboutIPVM}
          />
          <div>
            <span class="font-bold">DWeb/p2p:</span>
            Distributed computation running across a p2p network
          </div>
        </label>
        <label class="flex flex-row items-center gap-2">
          <input
            name="whatsInterestingAboutIPVM"
            class="checkbox"
            type="checkbox"
            value="rust_is_cool"
            bind:group={whatsInterestingAboutIPVM}
          />
          <div>
            <span class="font-bold">Rust</span>
            is cool
          </div>
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
      label="What problem would you like to tackle with Everywhere Computer?"
      validationMessage="Feel free to add any other questions or comments for the Fission team. If you're interested in joining a W3C Community Group on these topics, please leave a note."
    />

    <button
      class="btn btn-primary btn-odd-purple-500 w-full max-w-[400px] h-10 !text-label-l {loading
        ? 'opacity-80'
        : ''} gap-2"
      disabled={loading}
      type="submit"
    >
      Submit your answers
    </button>
  </form>
</div>
