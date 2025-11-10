#!/usr/bin/env node

const { loadEnvConfig } = require('@next/env')

loadEnvConfig(process.cwd())

const nodemailer = require('nodemailer')

const {
  MAIL_HOST = 'localhost',
  MAIL_PORT = '587',
  MAIL_USERNAME,
  MAIL_PASSWORD,
  MAIL_FROM_ADDRESS,
  MAIL_FROM_NAME = 'SimplyCode',
  MAIL_ENCRYPTION,
  MAIL_ALLOW_SELF_SIGNED,
  MAIL_TEST_RECIPIENT,
} = process.env

const port = Number.parseInt(MAIL_PORT, 10)
const secure = MAIL_ENCRYPTION === 'ssl' || MAIL_ENCRYPTION === 'tls'
const allowSelfSigned = MAIL_ALLOW_SELF_SIGNED === 'true' || MAIL_ALLOW_SELF_SIGNED === '1'

const mailFrom = {
  address: MAIL_FROM_ADDRESS || MAIL_USERNAME || 'no-reply@simplycode.dev',
  name: MAIL_FROM_NAME,
}

function createTransport() {
  const tlsOptions = {}

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

async function main() {
  const recipient = process.argv[2] || MAIL_TEST_RECIPIENT || mailFrom.address

  if (!recipient) {
    console.error(
      'Provide a recipient email as an argument, or set MAIL_TEST_RECIPIENT / MAIL_FROM_ADDRESS in your environment.',
    )
    process.exit(1)
    return
  }

  console.log(`Attempting to send test email to ${recipient}`)

  try {
    const info = await transporter.sendMail({
      from: mailFrom,
      to: recipient,
      subject: 'SimplyCode SMTP configuration test',
      text: ['This is a test email from SimplyCode.', 'If you received this, SMTP is configured correctly.'].join('\n'),
      html: `
        <p>This is a <strong>test email</strong> from <em>SimplyCode</em>.</p>
        <p>If you received this, SMTP is configured correctly.</p>
      `,
    })

    console.log('Email dispatched successfully.')
    console.log('Accepted:', info.accepted)
    if (info.rejected?.length) {
      console.warn('Rejected:', info.rejected)
    }
    if (info.response) {
      console.log('Response:', info.response)
    }
  } catch (error) {
    console.error('Mail test failed:')
    console.error(error)
    process.exit(1)
  }
}

main()

