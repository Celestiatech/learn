#!/usr/bin/env node

const { loadEnvConfig } = require('@next/env')

loadEnvConfig(process.cwd())

const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000'

function parseCookies(header) {
  if (!header) return []
  if (Array.isArray(header)) return header
  return [header]
}

function joinCookies(existing, fresh) {
  return [...existing, ...fresh.map((cookie) => cookie.split(';')[0])]
}

async function main() {
  const email = process.env.TEST_EMAIL || process.argv[2]
  const password = process.env.TEST_PASSWORD || process.argv[3]

  if (!email || !password) {
    console.error('Usage: node scripts/test-login.js <email> <password>')
    console.error('Or set TEST_EMAIL and TEST_PASSWORD environment variables.')
    process.exit(1)
  }

  console.log(`Testing credentials login for ${email}`)

  const cookies = []

  const csrfRes = await fetch(`${BASE_URL}/api/auth/csrf`, {
    method: 'GET',
    headers: {
      'User-Agent': 'login-tester/1.0',
      Accept: 'application/json',
    },
  })

  const csrfSetCookie = parseCookies(csrfRes.headers.get('set-cookie') ?? csrfRes.headers.raw?.()['set-cookie'])
  if (csrfSetCookie.length) {
    cookies.push(...csrfSetCookie.map((cookie) => cookie.split(';')[0]))
  }

  if (!csrfRes.ok) {
    console.error('Failed to fetch CSRF token:', csrfRes.status, await csrfRes.text())
    process.exit(1)
  }

  const { csrfToken } = await csrfRes.json()
  console.log('Got CSRF token.')

  const body = new URLSearchParams({
    csrfToken,
    email,
    password,
    callbackUrl: `${BASE_URL}/lessons/intro`,
    json: 'true',
  })

  const loginRes = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      cookie: cookies.join('; '),
    },
    body,
  })

  const loginSetCookie = parseCookies(loginRes.headers.get('set-cookie') ?? loginRes.headers.raw?.()['set-cookie'])
  const loginCookies = joinCookies([], loginSetCookie)
  const allCookies = joinCookies(cookies, loginSetCookie)

  const loginData = await loginRes.json().catch(() => null)

  if (!loginRes.ok || loginData?.error) {
    console.error('Login failed:', loginRes.status, loginData?.error ?? loginData)
    process.exit(1)
  }

  console.log('Login response URL:', loginData?.url ?? 'unknown')
  console.log('Session cookies:', loginCookies.join('; '))

  const sessionRes = await fetch(`${BASE_URL}/api/auth/session`, {
    headers: {
      cookie: allCookies.join('; '),
      'User-Agent': 'login-tester/1.0',
    },
  })

  if (!sessionRes.ok) {
    console.error('Failed to fetch session:', sessionRes.status, await sessionRes.text())
    process.exit(1)
  }

  const session = await sessionRes.json()
  console.log('Session response:', session)
}

main().catch((err) => {
  console.error('Unexpected error:', err)
  process.exit(1)
})

