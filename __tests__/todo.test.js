/**
 * @jest-environment node
 */

import handler from '../pages/api/todos';
import { getServerSession } from 'next-auth';
import clientPromise from '../lib/mongodb';

jest.mock('next-auth');
jest.mock('../lib/mongodb');

test('GET method retrieves todos', async () => { // HTTP 요청과 응답 객체를 모의(mock) : Jest의 jest.fn()을 사용하여 함수 호출을 추적
  const req = { method: 'GET' };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  getServerSession.mockResolvedValueOnce({ user: { email: 'test@example.com' } }); // 세션 정보 모의
  const client = { // 데이터베이스 클라이언트 모의
    db: jest.fn().mockReturnValue({ 
      collection: jest.fn().mockReturnValue({ 
        find: jest.fn().mockReturnValue({ 
          toArray: jest.fn().mockResolvedValue([{ 
            text: 'Test Todo' 
          }]) 
        })
      }) 
    }) 
  };
  clientPromise.mockResolvedValueOnce(client); // clientPromise를 모의하여 MongoDB 클라이언트의 동작을 시뮬레이션

  await handler(req, res); // API 핸들러 함수를 호출

  // 응답 검증
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith([{ text: 'Test Todo' }]);
});
