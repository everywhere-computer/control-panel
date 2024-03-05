import Ajv from 'ajv'

/**
 * Fetch workflow JSON based on an array of tasks
 */
export const fetchWorkflow = async tasks => {
  try {
    return JSON.stringify(
      await (
        await fetch(`${import.meta.env.VITE_GATEWAY_ENDPOINT}/workflow`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ tasks })
        })
      ).json(),
      null,
      2
    )
  } catch (error) {
    console.error(error)
  }
}

/**
 * Submit a workflow to the gateway
 */
export const submitWorkflow = async tasks => {
  const res = await fetch(`${import.meta.env.VITE_GATEWAY_ENDPOINT}/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ tasks })
  })

  const responseType = res.headers.get('Content-Type')
  if (responseType.includes('image/')) {
    const blob = await res.blob()

    return {
      outputType: 'image',
      output: URL.createObjectURL(blob)
    }
  }
  return {
    outputType: 'text',
    output: (await res.text()) ?? (await res.json())
  }
}

/**
 *  Validated form values against their associated JSON schema
 */
export const isValid = (data, schema): boolean => {
  const ajv = new Ajv()
  const { id, ...schemaToValidate } = schema
  const validate = ajv.compile(schemaToValidate)
  return validate(data)
}
