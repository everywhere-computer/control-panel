import { homestar } from '$lib/rpc'

export const subscribNetworkEvents = async (): Promise<void> => {
  await homestar.networkEvents(result => {
    console.log('result', result)
    if (result.error) {
      console.error(result.error)
    } else {
      console.log('result', result)
    }
  })
}

export default subscribNetworkEvents
