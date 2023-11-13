import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'
import type FileSystem from '@oddjs/odd/fs/index'

import type { Maybe } from '$lib'
import { loadTheme } from '$lib/theme'
import type { AccountSettings } from '$lib/account-settings'
import type { Notification } from '$lib/notifications'
import type { Session } from '$lib/session'
import type { Theme } from '$lib/theme'
import type { ProjectsStore } from '$lib/projects'
import projects from '$routes/projects/lib/project-mocks'
import type { FunctionsStore } from '$lib/functions'
import functions from '$routes/functions/lib/function-mocks'
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
  loading: true,
})

export const projectsStore: Writable<ProjectsStore> = writable({
  loading: false,
  projects
})

export const functionsStore: Writable<FunctionsStore> = writable({
  loading: false,
  functions
})

export const workflowsStore: Writable<WorkflowsStore> = writable({
  loading: false,
  builder: generateBuilderTemplate(),
  showBuilder: false,
  workflows
})

export const unsavedRunStore: Writable<Maybe<Run | Record<string, unknown>>> = writable({})
