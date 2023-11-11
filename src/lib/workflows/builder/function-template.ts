import * as HSWorkflow from '@fission-codes/homestar/workflow'

type GeneratorParams = {
  functionName: string
  label: string
  needs?: string
  base64?: boolean
  data?: string
  args?: FunctionParams
}

type FunctionParams = { sigma: number } | { x: number; y: number; width: number; height: number } | Record<string, never>

export const DEFAULT_PARAMS: { [functionName: string]: FunctionParams } = {
  blur: { sigma: 0.1 },
  crop: { x: 50, y: 50, width: 100, height: 100 },
  grayscale: {},
  rotate90: {}
}

/**
 * Generate a Homestar function with default params
 */
const generateFunction = ({
  functionName,
  label,
  base64 = false,
  data = null,
  args = null,
  needs = null
}: GeneratorParams): any => {
  const homestarFunctionName = `${functionName}${base64 ? 'Base64' : ''}`

  return HSWorkflow[homestarFunctionName]({
    name: label,
    resource: import.meta.env.VITE_WORKFLOW_RESOURCE,
    ...(needs ? { needs } : {}),
    args: {
      data,
      ...(args ? args : DEFAULT_PARAMS[functionName])
    }
  })
}

export default generateFunction
