import { notificationStore } from './stores'

export type Notification = {
  id?: string
  msg?: string
  type?: NotificationType
  timeout?: number
}

type NotificationType = 'success' | 'error' | 'info' | 'warning'

export const removeNotification: (id: string) => void = id => {
  notificationStore.update(all =>
    all.filter(notification => notification.id !== id)
  )
}

export const addNotification = ({
  msg,
  permanent = false,
  timeout = 5000,
  type = 'info',
}: {
  msg: string
  permanent?: boolean
  timeout?: number
  type?: NotificationType
}): string => {
  // uuid for each notification
  const id = crypto.randomUUID()

  // adding new notifications to the bottom of the list so they stack from bottom to top
  notificationStore.update(rest => [
    ...rest,
    {
      id,
      msg,
      type,
      timeout
    }
  ])

  if (!permanent) {
    // removing the notification after a specified timeout
    const timer = setTimeout(() => {
      removeNotification(id)
      clearTimeout(timer)
    }, timeout)
  }

  // return the id
  return id
}
