import { getSession } from 'next-auth/client';
import clientPromise from '../../lib/mongodb';

export default async (req, res) => {
  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const client = await clientPromise;
  const db = client.db('todo-app');

  if (req.method === 'GET') {
    const todos = await db.collection('todos').find({ user: session.user.email }).toArray();
    res.json(todos);
  } else if (req.method === 'POST') {
    const { text } = req.body;
    const todo = {
      text,
      user: session.user.email,
      completed: false,
    };
    await db.collection('todos').insertOne(todo);
    res.status(201).json(todo);
  } else if (req.method === 'PUT') {
    const { id, completed } = req.body;
    await db.collection('todos').updateOne({ _id: id }, { $set: { completed } });
    res.status(200).json({ message: 'Todo updated' });
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    await db.collection('todos').deleteOne({ _id: id });
    res.status(200).json({ message: 'Todo deleted' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
