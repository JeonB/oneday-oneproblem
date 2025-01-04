import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import User, { UserProps } from '@/app/lib/models/User'
import { connectDB } from '@/app/lib/connecter'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'UserEmail', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials: any) => {
        await connectDB()

        const { email, password } = credentials
        const user = (await User.findOne({ email })) as UserProps | null

        if (!user) {
          throw new Error('아이디 또는 비밀번호가 일치하지 않습니다')
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
          throw new Error('아이디 또는 비밀번호가 일치하지 않습니다')
        }

        // Return user object
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name
        session.user.id = token.id
        session.user.email = token.email
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name
        token.id = user.id
        token.email = user.email
      }
      return token
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
