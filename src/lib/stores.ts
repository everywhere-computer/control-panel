import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'
import type FileSystem from '@oddjs/odd/fs/index'

import type { Maybe } from '$lib'
import { loadTheme } from '$lib/theme'
import type { AccountSettings } from '$lib/account-settings'
import type { Notification } from '$lib/notifications'
import type { Session } from '$lib/session'
import type { Theme } from '$lib/theme'
import type { FunctionsStore } from '$lib/functions'
import functions from '$routes/functions/lib/function-mocks'
import type { NetworkStore } from '$lib/network'
import type { Run, WorkflowsStore } from '$lib/workflows'
import generateBuilderTemplate from '$lib/workflows/builder/builder-template'
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
  loading: true
})

export const functionsStore: Writable<FunctionsStore> = writable({
  loading: false,
  functions
})

export const workflowsStore: Writable<WorkflowsStore> = writable({
  loading: false,
  activeWorkflow: { tasks: [] },
  builder: generateBuilderTemplate(),
  highlightedFunction: null,
  showBuilder: false,
  workflows
})

export const networkStore: Writable<NetworkStore> = writable({
  loading: false,
  allEvents: [],
  activeConnections: [],
  receiptsSent: 0,
  receiptsReceived: 0
})

export const unsavedRunStore: Writable<
  Maybe<Run | Record<string, unknown>>
> = writable({})
