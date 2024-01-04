import { addNotification, removeNotification } from '$lib/notifications'

const INTERVAL = 3000

/**
 * Check for a connection to the Homestar WebSocket
 */
export const checkHomestarConnection = (): void => {
  let ws = new WebSocket(import.meta.env.VITE_WEBSOCKET_ENDPOINT)
  let connectionInterval = null
  let homestarError = false
  let notificationId = null

  const handleError = () => {
    // Connection error
    if (ws.readyState === 3) {
      homestarError = true
      console.error(`Error: couldn't connect to WebSocket`)
      if (!notificationId) {
        notificationId = addNotification({
          msg:
            'Failed to connect to Homestar. Please check the WebSocket endpoint in your .env and ensure Homestar is running.',
          permanent: true,
          type: 'error'
        })
      }
      pollForConnection()
    }
  }

  const pollForConnection = () => {
    if (homestarError && !connectionInterval) {
      connectionInterval = setInterval(() => {
        ws.removeEventListener('error', () => null)
        ws.removeEventListener('open', () => null)

        ws = new WebSocket(import.meta.env.VITE_WEBSOCKET_ENDPOINT)

        ws.addEventListener('error', handleError)
        ws.addEventListener('open', () => {
          // Connection opened
          if (homestarError && ws.readyState === 1) {
            clearInterval(connectionInterval)
            homestarError = false
            removeNotification(notificationId)
            addNotification({
              msg: 'Homestar node connected',
              type: 'success'
            })
          }
        })
      }, INTERVAL)
    }
  }

  // Check for connection error
  ws.addEventListener('error', handleError)
}

/**
 * Check if IPFS daemon is running
 */
export const checkIPFSConnection = async (): Promise<void> => {
  let connectionInterval = null
  let notificationId = null

  const attemptConnection = async () => {
    try {
      await fetch('http://localhost:5001/debug/vars', {
        method: 'GET',
        mode: 'no-cors'
      })
      clearInterval(connectionInterval)

      if (notificationId) {
        removeNotification(notificationId)
        addNotification({
          msg: 'IPFS daemon connected',
          type: 'success'
        })
      }
    } catch (error) {
      console.error(`Error: IPFS daemon isn't running`)
      if (!notificationId) {
        notificationId = addNotification({
          msg: 'Your IPFS daemon isn\'t running. Please run \'ipfs daemon\' in your terminal.',
          permanent: true,
          type: 'error'
        })
      }

      if (!connectionInterval) {
        connectionInterval = setInterval(async () => {
          await attemptConnection()
        }, INTERVAL)
      }

    }
  }

  await attemptConnection()
}
