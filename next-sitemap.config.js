const path = require('path')
const fs = require('fs')

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '')

const lessonsDir = path.join(__dirname, 'content', 'lessons')
const interactiveDir = path.join(__dirname, 'content', 'interactive')

const priorityMap = new Map([
  ['/', 1.0],
  ['/courses', 0.9],
  ['/about', 0.8],
  ['/blog', 0.7],
  ['/careers', 0.7],
  ['/contact', 0.7],
  ['/faq', 0.7],
  ['/pricing', 0.8],
  ['/privacy', 0.5],
  ['/terms', 0.5],
])

const disallowPaths = ['/admin', '/admin/*', '/profile', '/sandbox', '/api', '/api/*', '/auth', '/auth/*']

function toIsoDate(filePath) {
  try {
    return fs.statSync(filePath).mtime.toISOString()
  } catch {
    return new Date().toISOString()
  }
}

function getInteractiveSlugs() {
  if (!fs.existsSync(interactiveDir)) return []
  const slugs = new Set()

  fs.readdirSync(interactiveDir)
    .filter((file) => file.endsWith('.ts'))
    .filter((file) => !['index.ts', 'types.ts', 'utils.ts'].includes(file))
    .forEach((file) => {
      const content = fs.readFileSync(path.join(interactiveDir, file), 'utf-8')
      const match = content.match(/slug:\s*'([^']+)'/)
      if (match?.[1]) {
        slugs.add(match[1])
      }
    })

  return Array.from(slugs)
}

function getLessonSlugs() {
  if (!fs.existsSync(lessonsDir)) return []
  return fs
    .readdirSync(lessonsDir)
    .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
    .map((file) => file.replace(/\.mdx?$/, ''))
}

module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: false,
  outDir: './public/seo',
  generateIndexSitemap: false,
  exclude: [
    '/admin',
    '/admin/*',
    '/auth',
    '/auth/*',
    '/profile',
    '/sandbox',
    '/api',
    '/api/*',
    '/_next',
    '/404',
  ],
  transform: async (config, path) => {
    const normalized = path === '/' ? '/' : path.replace(/\/+$/, '')
    return {
      loc: `${config.siteUrl}${normalized === '/' ? '' : normalized}`,
      changefreq: 'weekly',
      priority: priorityMap.get(normalized) ?? 0.7,
      lastmod: new Date().toISOString(),
    }
  },
  additionalPaths: async (config) => {
    const extras = []
    const lessonSlugs = new Set([...getLessonSlugs(), ...getInteractiveSlugs()])

    lessonSlugs.forEach((slug) => {
      const lessonPath = `/lessons/${slug}`
      const mdFile = path.join(lessonsDir, `${slug}.mdx`)
      const mdAltFile = path.join(lessonsDir, `${slug}.md`)
      const interactiveFile = path.join(interactiveDir, `${slug}.ts`)
      const statsSource = fs.existsSync(mdFile)
        ? mdFile
        : fs.existsSync(mdAltFile)
        ? mdAltFile
        : fs.existsSync(interactiveFile)
        ? interactiveFile
        : null

      extras.push({
        loc: `${config.siteUrl}${lessonPath}`,
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: statsSource ? toIsoDate(statsSource) : new Date().toISOString(),
      })
    })

    return extras
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: disallowPaths,
      },
    ],
  },
}

