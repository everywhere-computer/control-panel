import { Homestar } from '@fission-codes/homestar'
import { WebsocketTransport } from '@fission-codes/homestar/transports/ws.js'
import { WebSocket } from 'unws'

import {
  RequestManager,
  Client,
  WebSocketTransport as OpenRPCWebSocketTransport
} from '@open-rpc/client-js'
import { addNotification } from './notifications'

const openRPCTransport = new OpenRPCWebSocketTransport(
  import.meta.env.VITE_WEBSOCKET_ENDPOINT
)
const requestManager = new RequestManager([openRPCTransport])
export const rpcClient = new Client(requestManager)

let homestar
export const getHomestarClient = () => {
  try {
    if (!homestar) {
      const transport = new WebsocketTransport(
        import.meta.env.VITE_WEBSOCKET_ENDPOINT,
        {
          ws: WebSocket
        }
      ) // WS
      homestar = new Homestar({
        transport
      })
    }

    return homestar
  } catch (error) {
    console.error(error)
    addNotification(error, 'error')
  }
}

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
