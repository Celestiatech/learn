const FALLBACK_SITE_URL = 'http://localhost:3000'

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL).replace(/\/+$/, '')

export const defaultMeta = {
  title: 'SimplyCode — Learn to Code. Step by Step.',
  description:
    'SimplyCode delivers narrative-driven coding lessons, interactive playgrounds, and guided certifications so you can build real projects with confidence.',
  siteName: 'SimplyCode',
  canonical: baseUrl,
  themeColor: '#090C28',
  openGraph: {
    type: 'website' as const,
    locale: 'en_US',
    images: [
      {
        url: '/logo-simplecode.svg',
        width: 512,
        height: 512,
        alt: 'SimplyCode logo',
        type: 'image/svg+xml',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image' as const,
    site: '@SimplyCodeHQ',
    handle: '@SimplyCodeHQ',
  },
}

export function buildCanonicalUrl(path: string) {
  const raw = path.startsWith('http') ? path : `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`

  try {
    const url = new URL(raw)
    url.hash = ''
    url.search = ''
    const normalizedPath = url.pathname === '/' ? '/' : url.pathname.replace(/\/+$/, '')
    return `${url.origin}${normalizedPath || '/'}`
  } catch {
    return raw.replace(/(?<!:)\/{2,}/g, '/')
  }
}

const capitalizeWords = (value: string) =>
  value
    .split(/[\s-_]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')

export function getLessonSeo({
  title,
  description,
  slug,
}: {
  title: string
  description?: string
  slug: string
}) {
  const lessonTitle = title || capitalizeWords(slug)
  const lessonDescription = description ?? defaultMeta.description
  const lessonUrl = buildCanonicalUrl(`/lessons/${slug}`)

  return {
    title: lessonTitle,
    description: lessonDescription,
    canonical: `/lessons/${slug}`,
    openGraph: {
      type: 'article' as const,
      images: defaultMeta.openGraph.images,
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: lessonTitle,
      description: lessonDescription,
      url: lessonUrl,
      provider: {
        '@type': 'Organization',
        name: defaultMeta.siteName,
        url: defaultMeta.canonical,
      },
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: 'online',
        url: lessonUrl,
      },
    },
  }
}

