<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'

  import { addNotification } from '$lib/notifications'
  import Input from '$components/form/Input.svelte'
  import StarMedium from '$components/icons/StarMedium.svelte'
  import StarSmall from '$components/icons/StarSmall.svelte'
  import TextArea from '$components/form/TextArea.svelte'

  const dispatch = createEventDispatcher()

  let loading = false
  let otherOptionResponse = null
  let whatsInterestingAboutIPVM: string[] = []
  let whereWouldYouDeployIt: string = ''

  // Submit username to Fission server to register the account
  const handleSubmitDetails = async (event: Event) => {
    loading = true
    try {
      const formEl = event.target as HTMLFormElement
      const data = new FormData(formEl)

      // @ts-ignore-next-line
      const formEntries: {
        name: string
        orgOrProject: string
        doYouRunAnyNodes: string | null
        whatProblemsAreYouTackling: string | null
        whereWouldYouDeployIt: string
        whatsInterestingAboutIPVM: string[]
      } = {
        // @ts-ignore-next-line
        ...Object.fromEntries(data),
        whatsInterestingAboutIPVM,
        whereWouldYouDeployIt
      }

      const entriesToQuery = {
        'entry.1008061897': formEntries.name,
        'entry.797898644': 'andy@fission.codes',
        'entry.1857510537': formEntries.orgOrProject,
        'entry.1995046092': formEntries.doYouRunAnyNodes,
        'entry.357312378': formEntries.whatProblemsAreYouTackling,
        'entry.662111001': formEntries.whereWouldYouDeployIt
      }
      let encodedQueryString = Object.entries(entriesToQuery)
        .map(([key, val]) =>
          !!val ? `${key}=${encodeURIComponent(val)}` : null
        )
        .join('&')

      // Handle whatsInterestingAboutIPVM checkbox group(each query param for this requires the same key)
      formEntries.whatsInterestingAboutIPVM?.forEach(val => {
        if (!!val) {
          encodedQueryString = `${encodedQueryString}&entry.2071542748=${val}`
        }
      })

      // Handle `other` option response
      if (
        formEntries.whatsInterestingAboutIPVM?.includes('__other_option__') &&
        otherOptionResponse
      ) {
        encodedQueryString = `${encodedQueryString}&entry.2071542748.other_option_response=${otherOptionResponse}`
      }

      await fetch(
        `https://docs.google.com/forms/d/e/${
          import.meta.env.VITE_GOOGLE_FORM_ID
        }/formResponse?${encodedQueryString}&submit=Submit`,
        {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )

      dispatch('nextStep')

      addNotification({ msg: 'Thanks for the info!', type: 'success' })
    } catch (error) {
      console.error(error)
      addNotification({ msg: 'Failed to register account', type: 'error' })
    }
    loading = false
  }
</script>

<div class="py-12 px-8">
  <div class="flex flex-row items-center mb-8">
    <div
      class="flex flex-row items-center justify-center gap-1 py-3 px-4 rounded-[88px] bg-base-200"
    >
      <StarSmall colour="#32334A" />
      <StarMedium />
      <StarSmall colour="#CCCCE3" />
      <StarSmall colour="#CCCCE3" />
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

    <Input
      maxWidth="372px"
      name="name"
      label="Your name"
      type="text"
      required
    />

    <Input
      maxWidth="372px"
      name="orgOrProject"
      label="Your organization / project"
      type="text"
      required
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
            class="radio"
            type="radio"
            value="AWS"
            bind:group={whereWouldYouDeployIt}
          />
          AWS
        </label>
        <label class="flex flex-row items-center gap-2">
          <input
            name="whereWouldYouDeployIt"
            class="radio"
            type="radio"
            value="Railway"
            bind:group={whereWouldYouDeployIt}
          />
          Railway
        </label>
        <label class="flex flex-row items-center gap-2">
          <input
            name="whereWouldYouDeployIt"
            class="radio"
            type="radio"
            value="Fly.io"
            bind:group={whereWouldYouDeployIt}
          />
          Fly.io
        </label>
        <label class="flex flex-row items-center gap-2">
          <input
            name="whereWouldYouDeployIt"
            class="radio"
            type="radio"
            value="Google Cloud Platform"
            bind:group={whereWouldYouDeployIt}
          />
          Google Cloud Platform
        </label>
        <label class="flex flex-row items-center gap-2">
          <input
            name="whereWouldYouDeployIt"
            class="radio"
            type="radio"
            value="Microsoft Azure"
            bind:group={whereWouldYouDeployIt}
          />
          Microsoft Azure
        </label>
        <label class="flex flex-row items-center gap-2">
          <input
            name="whereWouldYouDeployIt"
            class="radio"
            type="radio"
            value="Digital Ocean"
            bind:group={whereWouldYouDeployIt}
          />
          Digital Ocean
        </label>
        <label class="flex flex-row items-center gap-2">
          <input
            name="whereWouldYouDeployIt"
            class="radio"
            type="radio"
            value="Not interested in cloud hosting, I'll run it myself at home / on my own server"
            bind:group={whereWouldYouDeployIt}
          />
          No cloud! I prefer to run things myself at home / on my own server
        </label>
      </div>
    </div>

    <div class="form-control">
      <div class="label">
        <span class="label-text !text-label-sm">
          What interests you the most?
        </span>
      </div>

      <div class="flex flex-col gap-4">
        <span class="!text-input-sm">Check all that apply.</span>

        <label class="flex flex-row items-center gap-2">
          <input
            name="whatsInterestingAboutIPVM"
            class="checkbox"
            type="checkbox"
            value="Portable computation: serverless not tied to one provider"
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
            value="Offchain compute: IPVM used with blockchain networks"
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
            value="Local first functions: running a Wasm function in local browsers or mobile, AND the same function on a server"
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
            value="I like being involved in dweb p2p experiments like this"
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
            value="Rust is cool"
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
            value="__other_option__"
            bind:group={whatsInterestingAboutIPVM}
          />
          Other
        </label>
        {#if whatsInterestingAboutIPVM?.includes('__other_option__')}
          <input
            class="input input-bordered relative z-0 w-full h-10 !border !border-odd-gray-400 !dark:border-neutral rounded-sm"
            name="other"
            type="text"
            bind:value={otherOptionResponse}
          />
        {/if}
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
