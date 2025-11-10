export function parseHtmlDocument(markup: string) {
  if (typeof window === 'undefined') {
    return null
  }
  const parser = new DOMParser()
  return parser.parseFromString(markup, 'text/html')
}

export function normalizeWhitespace(str: string) {
  return str.replace(/\s+/g, ' ').trim()
}

export function runJavaScript(code: string) {
  const logs: string[] = []
  const sandboxConsole = {
    log: (...args: unknown[]) => {
      logs.push(args.map(String).join(' '))
    },
    error: (...args: unknown[]) => {
      logs.push(args.map(String).join(' '))
    },
    warn: (...args: unknown[]) => {
      logs.push(args.map(String).join(' '))
    },
  }

  let error: string | null = null
  try {
    const fn = new Function('console', `${code}`)
    fn(sandboxConsole)
  } catch (err) {
    error = err instanceof Error ? err.message : String(err)
  }

  return { logs, error }
}

export function runJavaScriptWithDocument(code: string, htmlTemplate: string) {
  if (typeof window === 'undefined') {
    return { error: 'DOM not available' }
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlTemplate, 'text/html')

  let error: string | null = null

  try {
    const fn = new Function('document', code)
    fn(doc)
  } catch (err) {
    error = err instanceof Error ? err.message : String(err)
  }

  return { document: doc, error }
}

