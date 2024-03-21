import { get as getStore } from 'svelte/store'
import { themeStore } from '$lib/stores'

export const BORDER_COLOURS = {
  completed: 'border-success',
  failed: 'border-error',
  'from cache': 'border-info',
  ready:
    getStore(themeStore)?.selectedTheme === 'light'
      ? 'border-odd-gray-400'
      : 'border-odd-gray-500',
  running: 'border-secondary',
  success: 'border-success'
}

export const STATUS_COLOURS = {
  completed: 'bg-odd-green-100 border-transparent text-odd-green-600',
  editing: 'bg-odd-teal-300 border-transparent text-odd-gray-900',
  failed: 'bg-error border-transparent text-error-content',
  final: 'bg-odd-purple-100 border-transparent text-odd-purple-600',
  'from cache': 'bg-odd-blue-100 border-transparent text-odd-blue-600',
  ready: 'bg-base-100 border-odd-gray-400 text-base-content',
  running: 'bg-secondary border-transparent text-secondary-content',
  success: 'bg-odd-green-100 border-transparent text-odd-green-600'
}

export const BLUR_PARAMS = [
  { name: 'sigma', type: 'number', min: 0.1, max: 100, default: 0.1 }
]
export const CROP_PARAMS = [
  { name: 'x', type: 'number', default: 50 },
  { name: 'y', type: 'number', default: 50 },
  { name: 'width', type: 'number', default: 100 },
  { name: 'height', type: 'number', default: 100 }
]

export const FUNCTION_PARAMS = {
  blur: BLUR_PARAMS,
  'blur-base64': BLUR_PARAMS,
  crop: CROP_PARAMS,
  'crop-base64': CROP_PARAMS,
  'grayscale-base64': [],
  grayscale: [],
  'rotate90-base64': [],
  rotate90: []
}

export const FUNCTION_NODE_SIZES = {
  blur: { width: 311, height: 147 },
  crop: { width: 311, height: 331 },
  grayscale: { width: 311, height: 147 },
  rotate90: { width: 311, height: 147 }
}
