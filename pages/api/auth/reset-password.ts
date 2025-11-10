import type { NextApiRequest, NextApiResponse } from 'next'
import { hash } from 'bcryptjs'
import { getPrisma } from '../../../lib/prisma'

const TOKEN_SCOPE = 'password-reset'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { email, token, password } = req.body as { email?: string; token?: string; password?: string }

  if (!email || typeof email !== 'string' || !token || typeof token !== 'string' || !password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Missing required fields.' })
  }

  const trimmedEmail = email.trim().toLowerCase()
  const prisma = getPrisma()

  if (!prisma) {
    return res.status(503).json({ error: 'Database not available' })
  }

  try {
    const storedToken = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier: buildIdentifier(trimmedEmail),
          token,
        },
      },
    })

    if (!storedToken || storedToken.expires < new Date()) {
      if (storedToken) {
        await prisma.verificationToken.delete({
          where: {
            identifier_token: {
              identifier: buildIdentifier(trimmedEmail),
              token,
            },
          },
        })
      }
      return res.status(400).json({ error: 'Reset link is invalid or expired.' })
    }

    const hashed = await hash(password, 12)

    await prisma.user.update({
      where: { email: trimmedEmail },
      data: {
        password: hashed,
      },
    })

    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: buildIdentifier(trimmedEmail),
          token,
        },
      },
    })

    return res.status(200).json({ message: 'Password updated successfully.' })
  } catch (error) {
    console.error('Reset password failed', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

function buildIdentifier(email: string) {
  return `${TOKEN_SCOPE}:${email}`
}

