import { db } from '../../utils/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const todoCollection = collection(db, 'todos');
      const todoSnapshot = await getDocs(todoCollection);
      const todoList = todoSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      res.status(200).json(todoList);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch todos' });
    }
  } else if (req.method === 'POST') {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    try {
      const todoCollection = collection(db, 'todos');
      await addDoc(todoCollection, { text, completed: false });
      res.status(201).json({ message: 'Todo added' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add todo' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
