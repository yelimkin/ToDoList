import NextAuth from 'next-auth'; // NextAuth.js의 다양한 설정 초기화와 필요한 엔드포인트(/api/auth/*) 생성
import CredentialsProvider from 'next-auth/providers/credentials'; // NextAuth.js에서 제공하는 다양한 인증 제공자 정의 객체
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'; // 인증 정보와 세션 데이터 MongoDB에 저장 및 관리
import clientPromise from '../../../lib/mongodb'; // MongoDB와의 연결 관리
import bcrypt from 'bcryptjs'; // 비밀번호 검증 : 사용자가 로그인할 때 입력한 비밀번호를 동일한 해시 함수로 변환하고, 데이터베이스에 저장된 해시된 비밀번호와 비교

export default NextAuth({
  debug: true,  // 디버그 모드 활성화
  providers: [ // 애플리케이션에서 사용할 인증 제공자 정의
    CredentialsProvider({ // Credentials 제공자를 사용해 사용자 이름과 비밀번호 기반 인증을 설정
      name: 'Credentials',
      async authorize(credentials) { // 사용자가 입력한 인증 정보를 검증하는 역할
        // const user = { id: 1, name: 'test', email: 'test@example.com', password: '1111' };
        // if (user) {
        //   return user;
        // } else {
        //   return null;
        // }

        const client = await clientPromise;
        const db = client.db('todo-app'); // db 이름 일치하는지 확인하기

        const user = await db.collection('users').findOne({ email: credentials.email }) // db의 컬렉션(테이블) 이름 확인하기
        
        if (!user) {
          console.log('No user found with that email');
          return null;
        }
        
        if (await bcrypt.compare(credentials.password, user.password)) { // 비밀번호 비교는 해시 함수로 검증해야 함
          console.log('Valid password');
          console.log({user});
          return user;
        } else {
          console.log('Invalid password');
          return null;
        }
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise), // MongoDB 어댑터를 사용하여 NextAuth.js가 인증 정보와 세션 데이터를 MongoDB에 저장
  secret: process.env.NEXTAUTH_SECRET, // JWT(Json Web Token)와 세션 암호화에 사용되는 비밀 키를 정의
  session: { // 세션 관리 방식 정의
    strategy: 'jwt', // true로 설정하면 서버 측 세션 저장소를 사용하지 않고, 클라이언트 측에 JWT를 저장
    maxAge: 3600
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,  // JWT 서명에 사용될 비밀키
    encryption: true,  // JWT 암호화 설정
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production', // 프로덕션 환경에서만 secure를 true로 설정
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      // 로그인 시 사용자 정보가 있다면 토큰에 추가합니다.
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // 세션에 토큰의 정보를 추가합니다.
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login', // 사용자가 인증되지 않았을 때 리디렉션될 /login 페이지로 지정
  },
});
