import clientPromise from '../lib/mongodb';
import { MongoClient } from 'mongodb';

jest.mock('mongodb');

describe('MongoDB connection', () => {
  let mockClient;

  beforeAll(() => {
    mockClient = {
      connect: jest.fn().mockResolvedValue({
        db: jest.fn().mockReturnValue({
          collection: jest.fn(),
        }),
      }),
    };
    MongoClient.mockReturnValue(mockClient);
  });

  test('returns a MongoClient instance', async () => {
    const client = await clientPromise;
    expect(client).toBeDefined();
    expect(mockClient.connect).toHaveBeenCalled();
  });

  test('throws error if Mongo URI is missing', async () => {
    delete process.env.MONGODB_URI;

    await expect(clientPromise).rejects.toThrow('Please add your Mongo URI to .env.local');
  });
});
