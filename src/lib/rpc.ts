import { Homestar } from '@fission-codes/homestar'
// @ts-ignore-next-line
import { WebsocketTransport } from '@fission-codes/homestar/channel/transports/ws'
import { WebSocket } from 'unws'

// import { RequestManager, Client, WebSocketTransport } from '@open-rpc/client-js'

// import { handleMessage as handleWorkflowMessage, type Message } from '$lib/workflows'

// /metrics is JSON
// /health is JSON
// subscriptions will send back bytes(for workflows -> receipts, libp2p events(no params), network events(peers))

// const transport = new HTTPTransport('http://127.0.0.1:3030') // HTTP
// const transport = new WebSocketTransport(
//   import.meta.env.VITE_WEBSOCKET_ENDPOINT
// ) // WS
// const requestManager = new RequestManager([transport])
// export const rpcClient = new Client(requestManager)

export const homestar = new Homestar({
  transport: new WebsocketTransport(import.meta.env.VITE_WEBSOCKET_ENDPOINT, {
    ws: WebSocket,
  }),
})

/**
 * Subscribe to WS messages and pass the data to the appropriate handler
 */
export const subscribeRPC = (): void => {
  // requestManager.transports[0].subscribe('notification', async event => {
  //   const decoded = new TextDecoder().decode(
  //     new Uint8Array(event?.params?.result)
  //   )
  //   const parsed = JSON.parse(decoded)
  //   if (parsed?.metadata?.workflow) {
  //     await handleWorkflowMessage(parsed as Message)
  //   }
  // })
}

/**
 * Unsubscribe from WS messages
 */
export const unsubscribeRPC = (): void => {
  // requestManager.transports[0].unsubscribe('notification', event => {
  //   // Some actions on unsubscribe
  //   console.log('unsubcribed from JSON RPC', event)
  // })

  homestar.close()
}
