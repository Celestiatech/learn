import type { NextApiRequest, NextApiResponse } from 'next'
import { hash } from 'bcryptjs'
import crypto from 'crypto'
import { getPrisma } from '../../../lib/prisma'
import { mailFrom, sendMail } from '../../../lib/mail'
import { renderVerificationEmail, renderVerificationText } from '../../../lib/emailTemplates/verifyAccount'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end('Method Not Allowed')
  }

  const { name, email, password } = req.body as { name?: string; email?: string; password?: string }

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' })
  }

  const prisma = getPrisma()
  if (!prisma) {
    return res.status(503).json({ error: 'Database not available' })
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(409).json({ error: 'User already exists' })
    }

    const hashed = await hash(password, 12)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
      },
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

    const baseUrl = process.env.NEXTAUTH_URL || process.env.APP_URL || `${req.headers['x-forwarded-proto'] ?? 'http'}://${req.headers.host}`
    const verifyUrl = `${baseUrl.replace(/\/$/, '')}/api/auth/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(
      email,
    )}`

    try {
      await sendMail({
        to: email,
        subject: 'Verify your SimplyCode account',
        html: renderVerificationEmail(name ?? email, verifyUrl),
        text: renderVerificationText(verifyUrl, mailFrom.name),
      })
    } catch (mailError) {
      console.error('Verification email failed', mailError)
    }

    return res.status(201).json({ id: user.id, email: user.email })
  } catch (error) {
    console.error('Registration failed', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

