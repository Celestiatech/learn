import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../lib/authOptions'
import { getPrisma } from '../../../lib/prisma'

function sanitizeString(value: unknown, max = 120) {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  if (!trimmed) return null
  return trimmed.length > max ? trimmed.slice(0, max) : trimmed
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH' && req.method !== 'POST') {
    res.setHeader('Allow', 'PATCH, POST')
    return res.status(405).end()
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const prisma = getPrisma()
  if (!prisma) {
    return res.status(503).json({ error: 'Database not available' })
  }

  const payload = req.body ?? {}

  const name = sanitizeString(payload.name, 80)
  const level = sanitizeString(payload.level, 40)
  const image = sanitizeString(payload.image, 512)

  if (payload.image && typeof payload.image === 'string' && payload.image.trim()) {
    try {
      const url = new URL(payload.image)
      if (!/^https?:$/.test(url.protocol)) {
        return res.status(400).json({ error: 'Avatar URL must use http or https.' })
      }
    } catch (error) {
      return res.status(400).json({ error: 'Invalid avatar URL.' })
    }
  }

  const data: Record<string, string | null | undefined> = {}
  if (name !== undefined) data.name = name
  if (level !== undefined) data.level = level
  if (image !== undefined) data.image = image

  if (!Object.keys(data).length) {
    return res.status(400).json({ error: 'No valid profile fields provided.' })
  }

  try {
    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data,
      select: {
        id: true,
        name: true,
        level: true,
        image: true,
      },
    })

    return res.status(200).json({ user: updated })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to update profile', error)
    return res.status(500).json({ error: 'Failed to update profile.' })
  }
}
