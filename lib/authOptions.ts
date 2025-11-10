import { PrismaAdapter } from '@auth/prisma-adapter'
import { compare } from 'bcryptjs'
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import getPrisma from './prisma'
import { mailFrom, sendMail } from './mail'

const prisma = getPrisma()

const providers: NextAuthOptions['providers'] = [
  GitHubProvider({
    clientId: process.env.GITHUB_ID ?? '',
    clientSecret: process.env.GITHUB_SECRET ?? '',
  }),
  CredentialsProvider({
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Credentials authorize called', {
          hasPrisma: !!prisma,
          email: credentials?.email,
        })
      }
      if (!prisma) {
        // Database disabled; credentials login unavailable.
        if (process.env.NODE_ENV !== 'production') {
          console.log('Credentials authorize blocked: prisma unavailable')
        }
        return null
      }
      if (!credentials?.email || !credentials.password) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('Credentials authorize blocked: missing email/password')
        }
        return null
      }
      const user = await prisma.user.findUnique({ where: { email: credentials.email } })
      if (!user || !user.password) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('Credentials authorize blocked: user not found or missing password')
        }
        return null
      }
      if (!user.emailVerified) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('Credentials authorize blocked: email not verified')
        }
        throw new Error('Please verify your email before signing in.')
      }
      const isValid = await compare(credentials.password, user.password)
      if (!isValid) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('Credentials authorize blocked: invalid password')
        }
        return null
      }
      if (process.env.NODE_ENV !== 'production') {
        console.log('Credentials authorize success', {
          id: user.id,
          email: user.email,
        })
      }
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        xp: user.xp,
        level: user.level,
      }
    },
  }),
]

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.splice(
    1,
    0,
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  )
}

if (prisma) {
  providers.unshift(
    EmailProvider({
      from: `${mailFrom.name} <${mailFrom.address}>`,
      maxAge: 10 * 60, // 10 minutes
      async sendVerificationRequest({ identifier, url }) {
        const loginUrl = new URL(url)
        const appUrl = new URL(process.env.NEXTAUTH_URL || process.env.APP_URL || 'http://localhost:3000')
        const displayHost = loginUrl.host === appUrl.host ? appUrl.host : loginUrl.host

        const html = renderMagicLinkEmail(identifier, loginUrl.toString())
        const text = `Hello,\n\nUse the link below to sign in to SimplyCode.\n\n${loginUrl}\n\nThis link expires in 10 minutes. If you did not request this email you can safely ignore it.\n\n— ${mailFrom.name}`

        await sendMail({
          to: identifier,
          subject: `Your SimplyCode sign-in link`,
          html,
          text,
          headers: {
            'X-Entity-Ref-ID': `magic-link-${displayHost}`,
          },
        })
      },
    }),
  )
}

export const authOptions: NextAuthOptions = {
  adapter: prisma ? PrismaAdapter(prisma) : undefined,
  session: {
    strategy: 'jwt',
  },
  providers,
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async session({ session, token, user }) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('auth.session callback input', { session, token, user })
      }
      if (!session.user) {
        return session
      }

      const source = user ?? token
      if (source?.id) {
        session.user.id = source.id as string
      }
      session.user.level = typeof source?.level === 'string' ? source.level : undefined
      session.user.xp = typeof source?.xp === 'number' ? source.xp : undefined

      return session
    },
    async jwt({ token, user }) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('auth.jwt callback input', { token, user })
      }
      if (user) {
        token.id = user.id
        token.level = user.level
        token.xp = user.xp
      }
      return token
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

function renderMagicLinkEmail(recipient: string, url: string) {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#11092a;padding:32px 0;font-family:'Inter','Segoe UI',system-ui,-apple-system,sans-serif;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#19143e;border-radius:24px;padding:48px;border:1px solid rgba(140,133,255,0.22);box-shadow:0 40px 120px rgba(31,19,70,0.55);color:#d6dbf4;">
          <tr>
            <td style="text-align:center;">
              <div style="display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:16px;background:linear-gradient(135deg,#673de6,#8c85ff);color:#ffffff;font-weight:600;font-size:18px;">SC</div>
              <h1 style="margin:24px 0 12px;font-size:26px;font-weight:700;color:#ffffff;">Sign in to SimplyCode</h1>
              <p style="margin:0 0 32px;font-size:16px;line-height:1.5;color:#c8ceef;">
                Hi ${recipient.split('@')[0] || 'there'}, click the button below to finish signing in.<br />
                This link expires in 10 minutes.
              </p>
              <a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#20e052,#bded00);color:#0b0a1d;font-size:15px;font-weight:600;padding:14px 32px;border-radius:999px;text-decoration:none;letter-spacing:0.14em;text-transform:uppercase;">
                Access SimplyCode
              </a>
              <p style="margin:32px 0 0;font-size:13px;line-height:1.5;color:#a3a7c7;">
                If the button doesn’t work, copy and paste this link into your browser:<br />
                <span style="word-break:break-all;color:#8c85ff;">${url}</span>
              </p>
            </td>
          </tr>
        </table>
        <p style="margin-top:24px;font-size:12px;color:#7d81a3;">You’re receiving this email because someone requested to sign in with this address. If this wasn’t you, you can safely ignore it.</p>
      </td>
    </tr>
  </table>
  `
}
