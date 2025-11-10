import type { NextApiRequest, NextApiResponse } from 'next'
import { getPrisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { token, email } = req.query

  if (typeof token !== 'string' || typeof email !== 'string') {
    return res.redirect('/auth/signin?verified=invalid')
  }

  const prisma = getPrisma()
  if (!prisma) {
    return res.redirect('/auth/signin?verified=error')
  }

  try {
    const storedToken = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier: email,
          token,
        },
      },
    })

    if (!storedToken || storedToken.expires < new Date()) {
      if (storedToken) {
        await prisma.verificationToken.delete({
          where: { identifier_token: { identifier: email, token } },
        })
      }
      return res.redirect('/auth/signin?verified=expired')
    }

    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    })

    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier: email, token } },
    })

    return res.redirect('/auth/signin?verified=success')
  } catch (error) {
    console.error('Email verification failed', error)
    return res.redirect('/auth/signin?verified=error')
  }
}

