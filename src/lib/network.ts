// import { Homestar } from '@fission-codes/homestar'
// import { WebsocketTransport } from '@fission-codes/homestar/transports/ws.js'
// import { WebSocket } from 'unws'

import { networkStore } from '$lib/stores'
import { getHomestarClient } from '$lib/rpc'

export type NetworkStore = {
  loading: boolean
  allEvents: Connection[]
  activeConnections: Connection[]
  receiptsSent: number
  receiptsReceived: number
}

type Connection = {
  address?: string
  cid?: string
  peerId?: string
  ran?: string
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
  const homestar = getHomestarClient()

  await homestar.networkEvents(res => {
    // console.log('node1 res', res)
    if (res.error) {
      console.error(res.error)
    }

    switch (res?.result?.type) {
      // Handle connection established
      case CONN_ESTABLISHED:
        networkStore.update(state => {
          const eventAlreadyTracked = state.activeConnections.find(
            con => con?.peerId === res?.result?.data?.peerId
          )
          const event = {
            address: res?.result?.data?.address,
            peerId: res?.result?.data?.peerId,
            type: res?.result?.type,
            timestamp: res?.result?.timestamp
          }

          return {
            ...state,
            activeConnections: eventAlreadyTracked
              ? state.activeConnections
              : [
                  event,
                  ...state.activeConnections
                ],
            allEvents: [
              event,
              ...state.allEvents
            ]
          }
        })
        break

      // Handle connection closed
      case CONN_CLOSED:
        networkStore.update(state => ({
            ...state,
            activeConnections: state.activeConnections.find(
              con => con?.peerId === res?.result?.data?.peerId
            )
              ? state.activeConnections.filter(
                  con => con?.peerId !== res?.result?.data?.peerId
                )
              : state.activeConnections,
            allEvents: [
              {
                address: res?.result?.data?.address,
                peerId: res?.result?.data?.peerId,
                type: res?.result?.type,
                timestamp: res?.result?.timestamp
              },
              ...state.allEvents
            ]
        }))
        break

      // Handle receipt sent
      case RECEIPT_SENT:
        networkStore.update(state => ({
          ...state,
          receiptsSent: state.receiptsSent + 1,
          allEvents: [
            {
              cid: res?.result?.data?.cid,
              ran: res?.result?.data?.ran,
              type: res?.result?.type,
              timestamp: res?.result?.timestamp
            },
            ...state.allEvents
          ]
        }))
        break

      // Handle receipt received
      case RECEIPT_RECEIVED:
        networkStore.update(state => ({
          ...state,
          receiptsReceived: state.receiptsReceived + 1,
          allEvents: [
            {
              cid: res?.result?.data?.cid,
              peerId: res?.result?.data?.peerId,
              ran: res?.result?.data?.ran,
              type: res?.result?.type,
              timestamp: res?.result?.timestamp
            },
            ...state.allEvents
          ]
        }))
        break

      default:
        break
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
