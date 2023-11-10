import { Homestar } from '@fission-codes/homestar'
import { WebsocketTransport } from '@fission-codes/homestar/transports/ws.js'
import { WebSocket } from 'unws'

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
  homestar.close()
}
