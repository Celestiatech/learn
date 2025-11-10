import Head from 'next/head'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { buildCanonicalUrl, defaultMeta } from '../lib/seo'

type OgImage = {
  url: string
  width?: number
  height?: number
  alt?: string
  type?: string
}

type TwitterMeta = {
  card?: 'summary' | 'summary_large_image' | 'app' | 'player'
  site?: string
  handle?: string
}

export type SeoProps = {
  title?: string
  description?: string
  canonical?: string
  robots?: string
  noindex?: boolean
  keywords?: string[]
  openGraph?: {
    type?: string
    locale?: string
    siteName?: string
    images?: OgImage[]
  }
  twitter?: TwitterMeta
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>
  image?: OgImage
}

export function ensureArray<T>(input?: T | T[]): T[] {
  if (!input) return []
  return Array.isArray(input) ? input : [input]
}

const buildRobots = (noindex?: boolean, robots?: string) => {
  if (robots) return robots
  if (noindex) return 'noindex, nofollow'
  return 'index, follow'
}

export default function Seo({
  title,
  description,
  canonical,
  robots,
  noindex,
  keywords,
  openGraph,
  twitter,
  jsonLd,
  image,
}: SeoProps) {
  const router = useRouter()

  const resolvedCanonical = useMemo(() => {
    if (canonical) return buildCanonicalUrl(canonical)
    if (!router.asPath) return defaultMeta.canonical
    return buildCanonicalUrl(router.asPath)
  }, [canonical, router.asPath])

  const resolvedTitle = title ? `${title} — ${defaultMeta.siteName}` : defaultMeta.title
  const resolvedDescription = description ?? defaultMeta.description
  const robotsContent = buildRobots(noindex, robots)

  const og = {
    type: openGraph?.type ?? defaultMeta.openGraph.type,
    locale: openGraph?.locale ?? defaultMeta.openGraph.locale,
    siteName: openGraph?.siteName ?? defaultMeta.siteName,
    images: ensureArray(image ? image : openGraph?.images).length
      ? ensureArray(image ?? openGraph?.images)
      : defaultMeta.openGraph.images,
  }

  const twitterMeta: TwitterMeta = {
    card: twitter?.card ?? defaultMeta.twitter.card,
    site: twitter?.site ?? defaultMeta.twitter.site,
    handle: twitter?.handle ?? defaultMeta.twitter.handle,
  }

  const serializedJsonLd = useMemo(() => {
    if (!jsonLd) return null
    const payload = Array.isArray(jsonLd) ? jsonLd : [jsonLd]
    return JSON.stringify(payload.length === 1 ? payload[0] : payload)
  }, [jsonLd])

  return (
    <Head>
      <title key="title">{resolvedTitle}</title>
      <meta key="description" name="description" content={resolvedDescription} />
      <meta key="og:title" property="og:title" content={resolvedTitle} />
      <meta key="og:description" property="og:description" content={resolvedDescription} />
      <meta key="og:type" property="og:type" content={og.type} />
      <meta key="og:locale" property="og:locale" content={og.locale} />
      <meta key="og:site_name" property="og:site_name" content={og.siteName} />
      <meta key="og:url" property="og:url" content={resolvedCanonical} />
      {og.images.map((img, index) => (
        <meta key={`og:image:${index}`} property="og:image" content={buildCanonicalUrl(img.url)} />
      ))}
      {og.images.map(
        (img, index) =>
          img.width && (
            <meta key={`og:image:width:${index}`} property="og:image:width" content={String(img.width)} />
          ),
      )}
      {og.images.map(
        (img, index) =>
          img.height && (
            <meta key={`og:image:height:${index}`} property="og:image:height" content={String(img.height)} />
          ),
      )}
      {og.images.map(
        (img, index) =>
          img.alt && (
            <meta key={`og:image:alt:${index}`} property="og:image:alt" content={img.alt} />
          ),
      )}
      {og.images.map(
        (img, index) =>
          img.type && (
            <meta key={`og:image:type:${index}`} property="og:image:type" content={img.type} />
          ),
      )}
      <meta key="twitter:card" name="twitter:card" content={twitterMeta.card} />
      {twitterMeta.site ? <meta key="twitter:site" name="twitter:site" content={twitterMeta.site} /> : null}
      {twitterMeta.handle ? <meta key="twitter:creator" name="twitter:creator" content={twitterMeta.handle} /> : null}
      <meta key="twitter:title" name="twitter:title" content={resolvedTitle} />
      <meta key="twitter:description" name="twitter:description" content={resolvedDescription} />
      {og.images.length ? (
        <meta key="twitter:image" name="twitter:image" content={buildCanonicalUrl(og.images[0]?.url)} />
      ) : null}
      <link key="canonical" rel="canonical" href={resolvedCanonical} />
      <meta key="robots" name="robots" content={robotsContent} />
      <meta key="theme-color" name="theme-color" content={defaultMeta.themeColor} />
      {keywords?.length ? <meta key="keywords" name="keywords" content={keywords.join(', ')} /> : null}
      {serializedJsonLd ? (
        <script
          key="jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializedJsonLd }}
        />
      ) : null}
    </Head>
  )
}

