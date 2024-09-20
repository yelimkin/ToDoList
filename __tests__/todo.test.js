import handler from '../pages/api/todos';
import { getServerSession } from 'next-auth';
import clientPromise from '../../lib/mongodb';

jest.mock('next-auth');
jest.mock('../../lib/mongodb');

test('GET method retrieves todos', async () => {
  const req = { method: 'GET' };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  getServerSession.mockResolvedValueOnce({ user: { email: 'test@example.com' } });
  const client = { db: jest.fn().mockReturnValue({ collection: jest.fn().mockReturnValue({ find: jest.fn().mockReturnValue({ toArray: jest.fn().mockResolvedValue([{ text: 'Test Todo' }]) }) }) }) };
  clientPromise.mockResolvedValueOnce(client);

  await handler(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith([{ text: 'Test Todo' }]);
});
