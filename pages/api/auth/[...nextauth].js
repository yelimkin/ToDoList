import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { FirestoreAdapter } from '@next-auth/firebase-adapter';
import { db } from '../../../firebaseConfig';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: FirestoreAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn(user, account, profile, email, credentials) {
      try {
        console.log('User:', user);
        console.log('Account:', account);
        console.log('Profile:', profile);
        console.log('Email:', email);
        console.log('Credentials:', credentials);

        // 사용자 인증 논리 
        return true;

      } catch (error) {
        console.error('Sign in error:', error);
        return false; // 인증 실패 시 false 반환
      }
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  },
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
    error: '/auth/error',
  },
  debug: true,
});
