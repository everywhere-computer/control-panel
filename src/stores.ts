import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'
import type FileSystem from '@oddjs/odd/fs/index'

import { loadTheme } from '$lib/theme'
import type { AccountSettings } from '$lib/account-settings'
import type { Notification } from '$lib/notifications'
import type { Session } from '$lib/session'
import type { Theme } from '$lib/theme'
import type { WorkflowsStore } from '$lib/workflows'
import workflows from '$routes/workflows/lib/workflow-mocks'

export const themeStore: Writable<Theme> = writable(loadTheme())

export const sessionStore: Writable<Session> = writable({
  username: null,
  session: null,
  authStrategy: null,
  program: null,
  loading: true,
  backupCreated: null
})

export const filesystemStore: Writable<FileSystem | null> = writable(null)

export const notificationStore: Writable<Notification[]> = writable([])

export const accountSettingsStore: Writable<AccountSettings> = writable({
  avatar: null,
  loading: true,
})

export const workflowsStore: Writable<WorkflowsStore> = writable({
  loading: false,
  workflows,
})
