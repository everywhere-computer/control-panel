<script lang="ts">
  import { MemoryBlockStore, volumePut } from '$lib/fission-server-utils'
  import { CID } from 'multiformats'
  import * as UnixFS from '@ipld/unixfs'
  import type { BlockStore } from 'car-mirror'

  export let uploadCID: Promise<CID | null> | null = null

  const store = new MemoryBlockStore()

  async function consumeReadableStream<T>(
    stream: ReadableStream<T>,
    handleItem: (t: T, signal?: AbortSignal) => Promise<void>,
    signal?: AbortSignal
  ): Promise<void> {
    const reader = stream.getReader()

    while (!signal?.aborted) {
      const { done, value } = await reader.read()

      if (done || signal?.aborted) {
        return
      }

      await handleItem(value, signal)
    }
  }

  async function storeFileAsUnixFs(
    fileContent: ReadableStream<Uint8Array>,
    store: BlockStore,
    signal?: AbortSignal
  ): Promise<CID> {
    const { readable, writable } = new TransformStream<
      UnixFS.Block,
      UnixFS.Block
    >({}, UnixFS.withCapacity(1048576 * 32))

    // Asynchronously write blocks to blockstore
    const finishReading = consumeReadableStream(
      readable,
      async block => {
        console.debug('Adding block', block.cid.toString(), block.bytes.length)
        await store.putBlockKeyed(block.cid.bytes, block.bytes)
      },
      signal
    )

    const writer = UnixFS.createWriter({ writable })
    const file = UnixFS.createFileWriter(writer)

    // Write the uploaded file chunks into the UnixFS file
    await consumeReadableStream(
      fileContent,
      async chunk => {
        console.debug('Reading chunk', chunk.length)
        await file.write(chunk)
      },
      signal
    )

    const { cid } = await file.close()
    writer.close()

    // We wait for the blockstore to have consumed all blocks.
    await finishReading

    return CID.parse(cid.toString())
  }

  // NOTE: I briefly thought about if this needs a spinner, but I'm actually pretty convinced that, no.
  // This is really fast, even with 100MB+ files.
  const handleFileSelectChange = event =>
    (uploadCID = (async () => {
      if (event?.target?.files == null || event.target.files[0] == null) {
        throw new Error("No files in the upload?");
      }

      const upload: ReadableStream<Uint8Array> = await event.target.files[0].stream()
      const cid = await storeFileAsUnixFs(upload, store)

      console.log('CID?', cid.toString())

      return cid
    })())

  // TODO: This needs a spinner or some indicator that it's not finished at some point.
  // It's okay to interrupt this at any time, though - it'll not leave the server or client
  // in a bad state, and it'll resume the upload if restarted, but still.
  const handleUploadFormSubmit = async () => {
    if (uploadCID == null) {
      console.error('no file selected for upload') // FIXME needs to be shown to the user properly
      return
    }
    const cid = await uploadCID
    console.log('Starting upload of', cid.toString())
    await volumePut(cid, store)
    console.log('Finished upload of', cid.toString())
  }
</script>

<div class="flex flex-row relative w-full sm:max-w-[343px]">
  <form name="uploadModuleForm" on:submit={handleUploadFormSubmit}>
    <input type="file" id="input" on:change={handleFileSelectChange} />
    <input type="submit" value="Upload Module" />
  </form>
</div>
