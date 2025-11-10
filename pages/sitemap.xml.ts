import type { GetServerSideProps } from 'next'
import fs from 'fs'
import path from 'path'
import { defaultMeta } from '../lib/seo'

const staticRoutes: Record<string, string> = {
  '/': 'index.tsx',
  '/about': 'about.tsx',
  '/blog': 'blog.tsx',
  '/careers': 'careers.tsx',
  '/contact': 'contact.tsx',
  '/courses': 'courses.tsx',
  '/faq': 'faq.tsx',
  '/playground': 'playground.tsx',
  '/pricing': 'pricing.tsx',
  '/privacy': 'privacy.tsx',
  '/terms': 'terms.tsx',
}

const lessonsDir = path.join(process.cwd(), 'content', 'lessons')
const interactiveDir = path.join(process.cwd(), 'content', 'interactive')

function readIsoDate(filePath: string | null) {
  if (!filePath) return new Date().toISOString()
  try {
    return fs.statSync(filePath).mtime.toISOString()
  } catch {
    return new Date().toISOString()
  }
}

function getLessonPaths() {
  const lessonSlugs = new Set<string>()

  if (fs.existsSync(lessonsDir)) {
    fs.readdirSync(lessonsDir)
      .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
      .forEach((file) => lessonSlugs.add(file.replace(/\.mdx?$/, '')))
  }

  if (fs.existsSync(interactiveDir)) {
    fs.readdirSync(interactiveDir)
      .filter((file) => file.endsWith('.ts'))
      .filter((file) => !['index.ts', 'types.ts', 'utils.ts'].includes(file))
      .forEach((file) => {
        const content = fs.readFileSync(path.join(interactiveDir, file), 'utf-8')
        const match = content.match(/slug:\s*'([^']+)'/)
        if (match?.[1]) {
          lessonSlugs.add(match[1])
        }
      })
  }

  return Array.from(lessonSlugs)
}

function buildUrlTag(loc: string, lastmod: string, priority = 0.7, changefreq: string = 'weekly') {
  return `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const origin = defaultMeta.canonical.replace(/\/+$/, '')

  const urls: string[] = []

  Object.entries(staticRoutes).forEach(([route, file]) => {
    const filePath = path.join(process.cwd(), 'pages', file)
    const isIndex = route === '/'
    const loc = isIndex ? origin : `${origin}${route}`
    const priority = isIndex ? 1.0 : route === '/courses' ? 0.9 : 0.7
    urls.push(buildUrlTag(loc, readIsoDate(filePath), priority))
  })

  const lessonSlugs = getLessonPaths()
  lessonSlugs.forEach((slug) => {
    const route = `${origin}/lessons/${slug}`
    const mdx = path.join(lessonsDir, `${slug}.mdx`)
    const md = path.join(lessonsDir, `${slug}.md`)
    const interactive = path.join(interactiveDir, `${slug}.ts`)
    const source = fs.existsSync(mdx) ? mdx : fs.existsSync(md) ? md : fs.existsSync(interactive) ? interactive : null
    urls.push(buildUrlTag(route, readIsoDate(source), 0.8, 'monthly'))
  })

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`

  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default function Sitemap() {
  return null
}

