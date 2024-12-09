import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        name: { label: 'UserName', type: 'text' },
        email: { label: 'UserEmail', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize(credentials: any, req) {
        // database operations
        return {
          id: '1',
          name: credentials.name,
          email: credentials.email,
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user = token.user as {
        name?: string | null
        email?: string | null
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user
      }
      return token
    },
  },
}
