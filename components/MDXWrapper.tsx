import * as React from 'react'
import { MDXProvider } from '@mdx-js/react'

export const components = {
  // Add any custom components you want available in MDX files
  h1: (props: any) => <h1 className="text-3xl font-bold mb-4" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-bold mb-3" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-bold mb-2" {...props} />,
  p: (props: any) => <p className="mb-4" {...props} />,
  code: (props: any) => (
    <code className="rounded bg-slate-800 px-1 py-0.5 text-sm" {...props} />
  ),
  pre: (props: any) => (
    <pre className="rounded-lg bg-slate-800 p-4 mb-4 overflow-x-auto" {...props} />
  ),
  ul: (props: any) => <ul className="list-disc pl-6 mb-4" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-6 mb-4" {...props} />,
  li: (props: any) => <li className="mb-1" {...props} />,
  a: (props: any) => (
    <a className="text-brand hover:text-brand-dark underline" {...props} />
  ),
}

export default function MDXWrapper({ children }: { children: React.ReactNode }) {
  return <MDXProvider components={components}>{children}</MDXProvider>
}