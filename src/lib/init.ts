import localforage from 'localforage'

import {
  IDB_ACCOUNT_DID_LABEL,
  IDB_ACCOUNT_ID_LABEL,
  IDB_UCAN_LABEL
} from '$lib/session'
import { sessionStore } from '$lib/stores'

export const initialize = async (): Promise<void> => {
  try {
    const accountDid = await localforage.getItem(IDB_ACCOUNT_DID_LABEL)
    const accountId = (await localforage.getItem(
      IDB_ACCOUNT_ID_LABEL
    )) as number
    const ucan = await localforage.getItem(IDB_UCAN_LABEL)

    // If there is no save accountDid or ucan, there's no active session
    if (!accountDid || !ucan) {
      sessionStore.set({
        id: null,
        username: null,
        loading: false
      })
      return
    }

    const response = await fetch(
      `${import.meta.env.VITE_FISSION_SERVER_URI}/account/${accountDid}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ucan.toString()}`
        }
      }
    )

    const { username } = await response.json()

    sessionStore.set({
      id: accountId,
      username,
      loading: false
    })
  } catch (error) {
    sessionStore.set({
      username: null,
      loading: false,
    })

    console.error(error)
  }
}
