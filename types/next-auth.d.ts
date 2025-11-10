import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      xp?: number
      level?: string
    }
  }

  interface User {
    id: string
    xp?: number
    level?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    xp?: number
    level?: string
  }
}
