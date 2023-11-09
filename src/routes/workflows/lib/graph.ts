export const BORDER_COLOURS = {
  completed: 'border-success',
  failed: 'border-error',
  'from cache': 'border-info',
  ready: 'border-odd-gray-400',
  running: 'border-secondary',
  success: 'border-success',
}

export const STATUS_COLOURS = {
  completed: 'bg-odd-green-100 border-transparent text-odd-green-600x',
  editing: 'bg-odd-teal-300 border-transparent text-odd-gray-900',
  failed: 'bg-error border-transparent text-error-content',
  'from cache': 'bg-odd-blue-100 border-transparent text-odd-blue-600',
  ready: 'bg-base-100 border-odd-gray-400 text-base-content',
  running: 'bg-secondary border-transparent text-secondary-content',
  success: 'bg-odd-green-100 border-transparent text-odd-green-600',
}

export const FUNCTION_PARAMS = {
  blur: [{ name: 'sigma', type: 'number', max: 1, note: 'float' }],
  'blur-base64': [{ name: 'sigma', type: 'number', max: 1, note: 'float' }],
  crop: [
    { name: 'x', type: 'number' },
    { name: 'y', type: 'number' },
    { name: 'width', type: 'number' },
    { name: 'height', type: 'number' }
  ],
  'crop-base64': [
    { name: 'x', type: 'number' },
    { name: 'y', type: 'number' },
    { name: 'width', type: 'number' },
    { name: 'height', type: 'number' }
  ],
  'grayscale-base64': [],
  grayscale: [],
  'rotate90-base64': [],
  rotate90: []
}

export const FUNCTION_NODE_SIZES = {
  blur: { width: 311, height: 147 },
  crop: { width: 311, height: 331 },
  grayscale: { width: 311, height: 147 },
  rotate90: { width: 311, height: 147 },
}
