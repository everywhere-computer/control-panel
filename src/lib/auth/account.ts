import * as uint8arrays from 'uint8arrays'
import { sha256 } from '@oddjs/odd/components/crypto/implementation/browser'
import { publicKeyToDid } from '@oddjs/odd/did/transformers'
import type { Crypto } from '@oddjs/odd'
import type FileSystem from '@oddjs/odd/fs/index'
import { get as getStore } from 'svelte/store'

import { asyncDebounce } from '$lib/utils'
import { filesystemStore, sessionStore } from '../../stores'
import { getBackupStatus } from '$lib/auth/backup'
import { ACCOUNT_SETTINGS_DIR } from '$lib/account-settings'
import { AREAS } from '$routes/gallery/stores'
import { GALLERY_DIRS } from '$routes/gallery/lib/gallery'

export const USERNAME_STORAGE_KEY = 'fullUsername'

export enum RECOVERY_STATES {
  Ready,
  Processing,
  Error,
  Done
}

export const isUsernameValid = async (username: string): Promise<boolean> => {
  const session = getStore(sessionStore)
  return session.authStrategy.isUsernameValid(username)
}

const _isUsernameAvailable = async (
  username: string
) => {
  const session = getStore(sessionStore)
  return session.authStrategy.isUsernameAvailable(username)
}

const debouncedIsUsernameAvailable = asyncDebounce(
  _isUsernameAvailable,
  300
)

export const isUsernameAvailable = async (
  username: string
): Promise<boolean> => {
  return debouncedIsUsernameAvailable(username)
}

export const createDID = async (crypto: Crypto.Implementation): Promise<string> => {
  const pubKey = await crypto.keystore.publicExchangeKey()
  const ksAlg = await crypto.keystore.getAlgorithm()

  return publicKeyToDid(crypto, pubKey, ksAlg)
}

export const prepareUsername = async (username: string): Promise<string> => {
  const normalizedUsername = username.normalize('NFD')
  const hashedUsername = await sha256(
    new TextEncoder().encode(normalizedUsername)
  )

  return uint8arrays
    .toString(hashedUsername, 'base32')
    .slice(0, 32)
}

export const register = async (hashedUsername: string): Promise<boolean> => {
  const { authStrategy, program: { components: { storage } } } = getStore(sessionStore)

  const { success } = await authStrategy.register({ username: hashedUsername })

  if (!success) return success

  const session = await authStrategy.session()
  filesystemStore.set(session.fs)

  // TODO Remove if only public and private directories are needed
  await initializeFilesystem(session.fs)

  const fullUsername = await storage.getItem(USERNAME_STORAGE_KEY) as string

  sessionStore.update(state => ({
    ...state,
    username: {
      full: fullUsername,
      hashed: hashedUsername,
      trimmed: fullUsername.split('#')[ 0 ]
    },
    session
  }))

  return success
}

/**
 * Create additional directories and files needed by the app
 *
 * @param fs FileSystem
 */
const initializeFilesystem = async (fs: FileSystem): Promise<void> => {
  await fs.mkdir(GALLERY_DIRS[ AREAS.PUBLIC ])
  await fs.mkdir(GALLERY_DIRS[ AREAS.PRIVATE ])
  await fs.mkdir(ACCOUNT_SETTINGS_DIR)
}

export const loadAccount = async (hashedUsername: string, fullUsername: string): Promise<void> => {
  const { authStrategy, program: { components: { storage } } } = getStore(sessionStore)
  const session = await authStrategy.session()

  filesystemStore.set(session.fs)

  const backupStatus = await getBackupStatus(session.fs)

  await storage.setItem(USERNAME_STORAGE_KEY, fullUsername)

  sessionStore.update(state => ({
    ...state,
    username: {
      full: fullUsername,
      hashed: hashedUsername,
      trimmed: fullUsername.split('#')[ 0 ],
    },
    session,
    backupCreated: backupStatus.created
  }))
}

export async function waitForDataRoot(username: string): Promise<void> {
  const session = getStore(sessionStore)
  const reference = session.program?.components.reference
  const EMPTY_CID = 'Qmc5m94Gu7z62RC8waSKkZUrCCBJPyHbkpmGzEePxy2oXJ'

  if (!reference) throw new Error('Program must be initialized to check for data root')

  let dataRoot = await reference.dataRoot.lookup(username)

  if (dataRoot.toString() !== EMPTY_CID) return

  return new Promise((resolve) => {
    const maxRetries = 50
    let attempt = 0

    const dataRootInterval = setInterval(async () => {
      dataRoot = await reference.dataRoot.lookup(username)

      if (dataRoot.toString() === EMPTY_CID && attempt < maxRetries) {
        attempt++
        return
      }

      clearInterval(dataRootInterval)
      resolve()
    }, 500)
  })
}
