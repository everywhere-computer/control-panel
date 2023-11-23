import type { Homestar as Client } from '@fission-codes/homestar'
import { Homestar } from '@fission-codes/homestar'
import { WebsocketTransport } from '@fission-codes/homestar/transports/ws.js'
import { WebSocket } from 'unws'

import { addNotification } from './notifications'

let homestar: Client
export const getHomestarClient = (): Client => {
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
 * Unsubscribe from WS messages
 */
export const unsubscribeRPC = (): void => {
  homestar.close()
}
