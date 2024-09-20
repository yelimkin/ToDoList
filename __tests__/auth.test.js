import NextAuth from 'next-auth';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '../../lib/mongodb'; // MongoDB 연결
import bcrypt from 'bcryptjs';
import { authOptions } from '../pages/api/auth/[...nextauth]';

jest.mock('../../lib/mongodb');
jest.mock('bcryptjs');

describe('NextAuth authentication', () => {
  test('authorizes valid credentials', async () => {
    const mockUser = { email: 'test@example.com', password: 'hashedPassword' };
    
    // MongoDB에서 사용자 정보를 가져오는 부분 모킹
    clientPromise.mockResolvedValue({
      db: () => ({
        collection: () => ({
          findOne: jest.fn().mockResolvedValue(mockUser),
        }),
      }),
    });

    // 비밀번호 비교
    bcrypt.compare.mockResolvedValue(true);

    const credentials = { email: 'test@example.com', password: 'password123' };
    const user = await authOptions.providers[0].authorize(credentials);

    expect(user).toEqual(mockUser);
  });

  test('throws error with invalid password', async () => {
    const mockUser = { email: 'test@example.com', password: 'hashedPassword' };

    clientPromise.mockResolvedValue({
      db: () => ({
        collection: () => ({
          findOne: jest.fn().mockResolvedValue(mockUser),
        }),
      }),
    });

    bcrypt.compare.mockResolvedValue(false); // 비밀번호 비교 실패

    const credentials = { email: 'test@example.com', password: 'wrongPassword' };

    await expect(authOptions.providers[0].authorize(credentials)).rejects.toThrow('Invalid password');
  });
});
