import type { GetServerSideProps } from 'next'
import { defaultMeta } from '../lib/seo'

const disallow = Array.from(
  new Set(['/admin', '/admin/*', '/profile', '/sandbox', '/api', '/api/*', '/auth', '/auth/*']),
)

function buildRobots(baseUrl: string) {
  const lines = [
    'User-agent: *',
    'Allow: /',
    ...disallow.map((path) => `Disallow: ${path}`),
    '',
    `Sitemap: ${baseUrl}/sitemap.xml`,
  ]
  return lines.join('\n')
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const origin = defaultMeta.canonical.replace(/\/+$/, '')
  const robots = buildRobots(origin)

  res.setHeader('Content-Type', 'text/plain')
  res.write(robots)
  res.end()

  return {
    props: {},
  }
}

export default function Robots() {
  return null
}

