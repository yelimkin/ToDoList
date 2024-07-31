import { db } from '../../../firebaseConfig';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

export default async (req, res) => {
  const { uid } = req.query;
  
  switch (req.method) {
    case 'GET':
      const todosQuery = query(collection(db, 'todos'), where('uid', '==', uid));
      const todosSnapshot = await getDocs(todosQuery);
      const todos = todosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(todos);
      break;
    case 'POST':
      const newTodo = req.body;
      await addDoc(collection(db, 'todos'), { ...newTodo, uid });
      res.status(201).end();
      break;
    case 'DELETE':
      const { id } = req.body;
      await deleteDoc(doc(db, 'todos', id));
      res.status(200).end();
      break;
    case 'PUT':
      const { id: updateId, ...updateData } = req.body;
      await updateDoc(doc(db, 'todos', updateId), updateData);
      res.status(200).end();
      break;
    default:
      res.status(405).end();
      break;
  }
};
