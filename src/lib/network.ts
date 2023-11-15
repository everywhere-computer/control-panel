// import { Homestar } from '@fission-codes/homestar'
// import { WebsocketTransport } from '@fission-codes/homestar/transports/ws.js'
// import { get as getStore } from 'svelte/store'
// import { WebSocket } from 'unws'

import { networkStore } from '$lib/stores'
import { homestar } from '$lib/rpc'

export type NetworkStore = {
  loading: boolean
  activeConnections: Connection[]
  receiptsSent: number
  receiptsReceived: number
}

type Connection = {
  address: string
  peerId: string
  type: string
  timestamp: number
}

const CONN_ESTABLISHED = 'network:connectionEstablished'
const CONN_CLOSED = 'network:connectionClosed'
const RECEIPT_RECEIVED = 'network:receivedReceiptPubsub'
const RECEIPT_SENT = 'network:publishedReceiptPubsub'

// const homestar2 = new Homestar({
//   transport: new WebsocketTransport('ws://localhost:8070', {
//     ws: WebSocket
//   })
// })

export const subscribNetworkEvents = async (): Promise<void> => {
  await homestar.networkEvents(res => {
    // console.log('node1 res', res)
    if (res.error) {
      console.error(res.error)
    }

    // Handle connection established
    if (res?.result?.type === CONN_ESTABLISHED) {
      networkStore.update(state => ({
        ...state,
        activeConnections: state.activeConnections.find(
          con => con?.peerId === res?.result?.data?.peerId
        )
          ? state.activeConnections
          : [
              {
                address: res?.result?.data?.address,
                peerId: res?.result?.data?.peerId,
                type: res?.result?.type,
                timestamp: res?.result?.timestamp
              },
              ...state.activeConnections
            ]
      }))
    }

    // Handle connection closed
    if (res?.result?.type === CONN_CLOSED) {
      networkStore.update(state => ({
        ...state,
        activeConnections: state.activeConnections.find(
          con => con?.peerId === res?.result?.data?.peerId
        )
          ? state.activeConnections.filter(
              con => con?.peerId !== res?.result?.data?.peerId
            )
          : state.activeConnections
      }))
    }

    // Handle receipt sent
    if (res?.result?.type === RECEIPT_SENT) {
      networkStore.update(state => ({
        ...state,
        receiptsSent: state.receiptsSent + 1
      }))
    }

    // Handle receipt received
    if (res?.result?.type === RECEIPT_RECEIVED) {
      networkStore.update(state => ({
        ...state,
        receiptsReceived: state.receiptsReceived + 1
      }))
    }
  })

  // await homestar2.networkEvents(result => {
  //   console.log('node2 result', result)
  //   if (result.error) {
  //     console.error(result.error)
  //   }
  // })
}

export default subscribNetworkEvents
