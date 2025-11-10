import { useEffect, useRef, useState } from 'react'
import Editor from '@monaco-editor/react'

const defaultCode = `// Try editing this code and press Run
const message = 'Hello from the sandbox!'
console.log(message)

// DOM manipulation is safe - contained in the preview
document.body.innerHTML = '<h1>' + message + '</h1>'
`

export default function MonacoPlayground(){
  const [code, setCode] = useState(defaultCode)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(()=>{
    // wait for sandbox to initialize
    const handler = (e: MessageEvent) => {
      if(e.data === 'sandbox:ready') setReady(true)
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  },[])

  function handleRun(){
    if(!frameRef.current) return
    frameRef.current.contentWindow?.postMessage({ type: 'run', code }, '*')
  }

  function handleReset(){
    setCode(defaultCode)
    if(!frameRef.current) return
    frameRef.current.contentWindow?.postMessage({ type: 'reset' }, '*')
  }

  return (
    <div className="min-h-screen bg-[var(--color-page-bg)] text-[var(--color-text-primary)]">
      <div className="max-w-5xl mx-auto p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-heading">Playground</h1>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleReset}
              className="px-4 py-2 text-sm font-semibold tracking-[0.14em] rounded-full border border-soft bg-surface-card text-heading transition hover:border-strong hover:bg-surface-muted"
            >
              Reset
            </button>
            <button
              onClick={handleRun}
              disabled={!ready}
              className="px-4 py-2 text-sm font-semibold tracking-[0.14em] rounded-full bg-[var(--gradient-brand-alt)] text-white shadow-soft transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Run code
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="h-[600px] rounded-2xl overflow-hidden border border-soft bg-surface-card shadow-soft">
            <Editor
              defaultLanguage="javascript"
              theme="vs-dark"
              value={code}
              onChange={v => setCode(v || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                tabSize: 2,
                lineNumbers: 'on',
              }}
            />
          </div>
          <div className="h-[600px] rounded-2xl overflow-hidden border border-soft bg-surface-card shadow-soft">
            <iframe
              ref={frameRef}
              src="/sandbox"
              className="w-full h-full bg-surface-contrast"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      </div>
    </div>
  )
}