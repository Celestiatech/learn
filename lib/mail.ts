import nodemailer from 'nodemailer'

const {
  MAIL_HOST = 'localhost',
  MAIL_PORT = '587',
  MAIL_USERNAME,
  MAIL_PASSWORD,
  MAIL_FROM_ADDRESS,
  MAIL_FROM_NAME = 'SimplyCode',
  MAIL_ENCRYPTION,
  MAIL_ALLOW_SELF_SIGNED,
} = process.env

const port = Number.parseInt(MAIL_PORT, 10)
const secure = MAIL_ENCRYPTION === 'ssl' || MAIL_ENCRYPTION === 'tls'
const allowSelfSigned = MAIL_ALLOW_SELF_SIGNED === 'true' || MAIL_ALLOW_SELF_SIGNED === '1'

if (allowSelfSigned) {
  // Ensure downstream TLS connections tolerate self-signed certificates.
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

export const mailFrom = {
  address: MAIL_FROM_ADDRESS || MAIL_USERNAME || 'no-reply@simplycode.dev',
  name: MAIL_FROM_NAME,
}

export function createTransport() {
  const tlsOptions: Record<string, unknown> = {}

  if (MAIL_ENCRYPTION === 'tls') {
    tlsOptions.ciphers = 'SSLv3'
  }

  if (allowSelfSigned) {
    tlsOptions.rejectUnauthorized = false
  }

  return nodemailer.createTransport({
    host: MAIL_HOST,
    port: Number.isFinite(port) ? port : 587,
    secure,
    auth:
      MAIL_USERNAME && MAIL_PASSWORD
        ? {
            user: MAIL_USERNAME,
            pass: MAIL_PASSWORD,
          }
        : undefined,
    tls: Object.keys(tlsOptions).length > 0 ? tlsOptions : undefined,
  })
}

const transporter = createTransport()

export async function sendMail(options: Parameters<typeof transporter.sendMail>[0]) {
  return transporter.sendMail({
    from: mailFrom,
    ...options,
  })
}

