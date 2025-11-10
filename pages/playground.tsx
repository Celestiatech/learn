import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'
import SiteHeader from '../components/SiteHeader'
import Seo from '../components/Seo'
import { buildCanonicalUrl, defaultMeta } from '../lib/seo'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

export default function Playground() {
  const [code, setCode] = useState<string>(`console.log('hello world')`)

  function runInIframe(js: string) {
    const src = `<!doctype html><html><body><script>try{\n${js}\n}catch(e){document.body.innerText='Error: '+e.message}</script></body></html>`
    const w = window.open('', '_blank')
    if (w) {
      w.document.open()
      w.document.write(src)
      w.document.close()
    }
  }

  const playgroundJsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'SimplyCode Playground',
      url: buildCanonicalUrl('/playground'),
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      publisher: {
        '@type': 'Organization',
        name: defaultMeta.siteName,
        url: defaultMeta.canonical,
      },
    }),
    [],
  )

  return (
    <>
      <Seo
        title="Interactive Playground"
        description="Write and run JavaScript instantly with the SimplyCode playground—perfect for quick experiments and lesson practice."
        keywords={['JavaScript playground', 'live code editor', 'SimplyCode']}
        openGraph={{
          type: 'website',
        }}
        jsonLd={playgroundJsonLd}
      />
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-10 lg:px-16">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
          <SiteHeader />
          <header className="glass-card p-6">
            <h1 className="text-2xl font-bold text-white">Playground</h1>
            <p className="mt-2 text-sm text-slate-300">
              Experiment with JavaScript snippets inline. When you click run, we’ll open a sandboxed preview window.
            </p>
          </header>
          <div className="glass-card p-6">
            <div className="h-[60vh] overflow-hidden rounded-2xl border border-white/10">
              <MonacoEditor height="100%" defaultLanguage="javascript" value={code} onChange={(v) => setCode(v || '')} />
            </div>
            <div className="mt-6 flex justify-end">
              <button
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 via-sky-500 to-indigo-500 px-5 py-2 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-sky-500/30"
                onClick={() => runInIframe(code)}
              >
                Run code
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
