import * as Bearer from '@fission-codes/ucan/bearer'

import { createUcanWithCaps } from '$lib/fission-server-utils'
import { sessionStore } from '$lib/stores'

export const initialize = async (): Promise<void> => {
  try {
    const { store, ucan } = await createUcanWithCaps('account/info')
    const headers = Bearer.encode(ucan, store)

    const response = await fetch(
      `${import.meta.env.VITE_FISSION_SERVER_API_URI}/account`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...headers,
        }
      }
    )

    const { email, username } = await response.json()

    sessionStore.set({
      email,
      username: username.split('.')[0],
      loading: false
    })
  } catch (error) {
    sessionStore.set({
      email: null,
      username: null,
      loading: false
    })

    console.error(error)
  }
}
