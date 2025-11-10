import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import { getPrisma } from '../../../lib/prisma'
import { mailFrom, sendMail } from '../../../lib/mail'
import { renderPasswordResetEmail, renderPasswordResetText } from '../../../lib/emailTemplates/passwordReset'

const TOKEN_SCOPE = 'password-reset'
const TOKEN_EXPIRY_MS = 60 * 60 * 1000 // 60 minutes

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { email } = req.body as { email?: string }

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required.' })
  }

  const normalizedEmail = email.trim().toLowerCase()
  const prisma = getPrisma()

  if (!prisma) {
    return res.status(503).json({ error: 'Database not available' })
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } })

    if (!user || !user.password) {
      // Prevent account enumeration
      await wait(500)
      return res.status(200).json({
        message: 'If an account exists for that email, we’ve sent password reset instructions.',
      })
    }

    await prisma.verificationToken.deleteMany({
      where: { identifier: buildIdentifier(normalizedEmail) },
    })

    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + TOKEN_EXPIRY_MS)

    await prisma.verificationToken.create({
      data: {
        identifier: buildIdentifier(normalizedEmail),
        token,
        expires,
      },
    })

    const baseUrl = process.env.NEXTAUTH_URL || process.env.APP_URL || getBaseUrl(req)
    const resetUrl = `${baseUrl.replace(/\/$/, '')}/auth/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(
      normalizedEmail,
    )}`

    try {
      await sendMail({
        to: normalizedEmail,
        subject: 'Reset your SimplyCode password',
        html: renderPasswordResetEmail(user.name ?? normalizedEmail, resetUrl),
        text: renderPasswordResetText(resetUrl, mailFrom.name),
      })
    } catch (mailError) {
      console.error('Password reset email failed', mailError)
    }

    return res.status(200).json({
      message: 'If an account exists for that email, we’ve sent password reset instructions.',
    })
  } catch (error) {
    console.error('Forgot password failed', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

function buildIdentifier(email: string) {
  return `${TOKEN_SCOPE}:${email}`
}

function getBaseUrl(req: NextApiRequest) {
  const proto = req.headers['x-forwarded-proto'] ?? 'http'
  const host = req.headers.host ?? 'localhost:3000'
  return `${proto}://${host}`
}

function wait(duration: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, duration))
}

