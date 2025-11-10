import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import { defaultMeta } from '../lib/seo'

class SimplyCodeDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="application-name" content={defaultMeta.siteName} />
          <meta name="color-scheme" content="dark light" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </Head>
        <body className="bg-[var(--color-page-bg)] text-[var(--color-text-primary)] antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default SimplyCodeDocument

