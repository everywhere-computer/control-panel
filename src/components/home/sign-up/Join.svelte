<script lang="ts">
  import Plausible from 'plausible-tracker'
  import { createEventDispatcher } from 'svelte'

  const { trackEvent } = Plausible({
    trackLocalhost: false
  })

  const dispatch = createEventDispatcher()

  const handleJoin = () => {
    trackEvent('Click "beta intake" button', {
      // callback: () => console.log('done'),
      props: {
        email: '' // enter user account email
      }
    })
    dispatch('nextStep')
  }
</script>

<div class="flex flex-col gap-6 mt-[125px] px-8 pb-10">
  <div class="flex flex-col gap-4">
    <h1 class="text-heading-2xl font-bold">
      Fission is building the Everywhere Computer
    </h1>

    <p>
      Everywhere Computer is a network of functions and computation, with
      payment included.
    </p>
    <p>
      It will help you write durable, local-first, software that can run
      *everywhere*.
    </p>
    <ul>
      <li>✵ Run your own instance or rent as you go</li>
      <li>✵ Write functions in Rust, JS, ++</li>
      <li>✵ Extend with any UCAN-enabled service</li>
    </ul>
  </div>

  <div class="flex flex-col gap-4">
    <h2 class="text-heading-m font-bold">How do I know if it’s for me?</h2>

    <p>
      If you run a network, or write code that is accessed over one, Everywhere
      Computer may be for you.
    </p>
    <p>There are many ways to get involved:</p>
    <ul class="flex flex-col gap-4">
      <li>
        ✵ Node Runners: Run a Homestar node on your home machine or personal
        cloud account as we boot up the network.
      </li>
      <li>
        ✵ Rustaceans & JS devs*: try your hand at writing IPVM functions. They
        compile to Wasm and can be run by anyone in the network. *We'll add
        support for Python, and other languages that compile well to Wasm over
        time
      </li>
      <li>
        ✵ Front-end Devs: Get backend capabilities that run local-first, on your
        users' devices — but run at scale on the Everywhere Computer when
        needed.
      </li>
    </ul>
  </div>

  <div class="flex flex-col gap-4">
    <h2 class="text-heading-m font-bold">Built on open protocols</h2>
    <p>
      Everywhere Computer bundles together a number of powerful open protocols,
      making them effortless for you and your team to leverage without needing
      to spend time acquiring deep expertise.
    </p>
    <p>
      At the centre is IPVM, the InterPlanetary Virtual Machine. It aims to be
      the easiest, fastest, most secure, and open way to run WebAssembly
      functions anywhere.
    </p>
    <p>
      Using content-addressed data, public key infrastructure (PKI), and
      capabilities, IPVM liberates computation from its dependence on
      pre-negotiated services and paves the way for interoperability.
    </p>
    <p>
      IPVM is designed to run an open, community standards base of portable
      compute functions, instead of being locked into any one cloud provider.
    </p>
    <p>
      Homestar is Fission’s reference implementation of the IPVM standards,
      written in Rust. The managed network we run is the Everywhere Computer.
    </p>
  </div>

  <h2 class="text-heading-m font-bold">Join the early access beta</h2>

  <p>
    To participate in the Homestar-powered beta of the Everywhere Computer
    network, and get access to our private Beta Participants Discord channel,
    create an account now. It takes less than 5 minutes:
  </p>

  <button
    class="btn btn-primary btn-odd-purple-500 self-center w-full max-w-[400px] h-10 mt-20 !text-label-l"
    on:click={handleJoin}
  >
    Enter the Beta
  </button>
</div>
