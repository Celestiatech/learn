import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import { getPrisma } from '../../../lib/prisma'
import { mailFrom, sendMail } from '../../../lib/mail'
import { renderVerificationEmail, renderVerificationText } from '../../../lib/emailTemplates/verifyAccount'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { email } = req.body as { email?: string }

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required.' })
  }

  const prisma = getPrisma()
  if (!prisma) {
    return res.status(503).json({ error: 'Database not available' })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(404).json({ error: 'Account not found.' })
    }

    if (user.emailVerified) {
      return res.status(200).json({ message: 'Account already verified.' })
    }

    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    })

    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    })

    const proto = req.headers['x-forwarded-proto'] ?? 'http'
    const host = req.headers.host
    const baseUrl = process.env.NEXTAUTH_URL || process.env.APP_URL || `${proto}://${host}`
    const verifyUrl = `${baseUrl.replace(/\/$/, '')}/api/auth/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`

    try {
      await sendMail({
        to: email,
        subject: 'Verify your SimplyCode account',
        html: renderVerificationEmail(user.name ?? email, verifyUrl),
        text: renderVerificationText(verifyUrl, mailFrom.name),
      })
    } catch (mailError) {
      console.error('Resend verification email failed', mailError)
    }

    return res.status(200).json({ message: 'Verification link sent.' })
  } catch (error) {
    console.error('Resend verification failed', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

