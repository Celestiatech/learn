import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../lib/authOptions'
import { getPrisma } from '../../lib/prisma'

type PreferencesResponse = {
  preferences: Record<string, unknown>
}

type PreferencePayload = {
  key?: string
  value?: unknown
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const prisma = getPrisma()
  if (!prisma) {
    return res.status(503).json({ error: 'Database not available' })
  }

  const userId = session.user.id

  if (req.method === 'GET') {
    const { key } = req.query
    const keys = Array.isArray(key) ? key : key ? [key] : undefined

    const records = await prisma.userPreference.findMany({
      where: {
        userId,
        ...(keys ? { key: { in: keys } } : {}),
      },
    })

    const preferences: Record<string, unknown> = {}
    for (const record of records) {
      preferences[record.key] = record.value
    }

    return res.status(200).json({ preferences } satisfies PreferencesResponse)
  }

  if (req.method === 'POST' || req.method === 'PUT') {
    const payload = req.body as PreferencePayload
    if (!payload?.key) {
      return res.status(400).json({ error: 'Missing preference key' })
    }

    const record = await prisma.userPreference.upsert({
      where: {
        userId_key: {
          userId,
          key: payload.key,
        },
      },
      create: {
        userId,
        key: payload.key,
        value: payload.value ?? null,
      },
      update: {
        value: payload.value ?? null,
      },
    })

    return res.status(200).json({
      preference: {
        key: record.key,
        value: record.value,
      },
    })
  }

  res.setHeader('Allow', 'GET, POST, PUT')
  return res.status(405).end()
}

