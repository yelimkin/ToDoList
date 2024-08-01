import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { FirebaseAdapter } from '@next-auth/firebase-adapter';
import { db } from '../../../firebaseConfig';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: FirebaseAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin', // 로그인 페이지 경로
    verifyRequest: '/auth/verify-request', // 이메일 인증 요청 후 표시할 페이지
    error: '/auth/error', // 에러 발생 시 표시할 페이지
  },
});
