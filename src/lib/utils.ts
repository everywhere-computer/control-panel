export function asyncDebounce<A extends unknown[], R>(
  fn: (...args: A) => Promise<R>,
  wait: number
): (...args: A) => Promise<R> {
  let lastTimeoutId: ReturnType<typeof setTimeout> | undefined = undefined

  return (...args: A): Promise<R> => {
    clearTimeout(lastTimeoutId)

    return new Promise((resolve, reject) => {
      const currentTimeoutId = setTimeout(async () => {
        try {
          if (currentTimeoutId === lastTimeoutId) {
            const result = await fn(...args)
            resolve(result)
          }
        } catch (err) {
          reject(err)
        }
      }, wait)

      lastTimeoutId = currentTimeoutId
    })
  }
}

export const extractSearchParam = (url: URL, param: string): string | null => {
  const val = url.searchParams.get(param)

  // clear the param from the URL
  url.searchParams.delete(param)
  history.replaceState(null, document.title, url.toString())

  return val
}

/**
 * File to Uint8Array
 */
export async function fileToUint8Array(file: File): Promise<Uint8Array> {
  return new Uint8Array(
    await new Blob([ file ]).arrayBuffer()
  )
}

/**
 * Dispatch event on click outside of node
 */
export function clickOutside(node, { enabled: initialEnabled, cb }) {
  const handleOutsideClick = ({ target }) => {
    if (!node.contains(target)) {
      cb()
    }
  }

  function update({ enabled }) {
    if (enabled) {
      window.addEventListener('click', handleOutsideClick)
    } else {
      window.removeEventListener('click', handleOutsideClick)
    }
  }

  update({ enabled: initialEnabled })
  return {
    update,
    destroy() {
      window.removeEventListener('click', handleOutsideClick)
    }
  }
}

/**
 * Convert string to camelCase
 */
export const camelCase = (str: string): string =>
  str.replace(/(?:^\w|[A-Z]|\b\w)/g,
    (word, index) => index == 0 ? word.toLowerCase() : word.toUpperCase()
  ).replace(/\s+/g, '')
