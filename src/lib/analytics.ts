import { dev } from '$app/environment'
import posthog from 'posthog-js'

export const instantiatePostHog = (): void => {
  // Don't instantiate in dev mode
  if (!dev) {
    posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
      api_host: 'https://us.posthog.com'
    })
  }
}
