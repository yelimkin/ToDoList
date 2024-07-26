import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from '../lib/firebaseConfig';

const todosCollection = collection(db, "todos");

export async function getTodos() {
  const snapshot = await getDocs(todosCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function addTodo(text: string) {
  await addDoc(todosCollection, { text, completed: false });
}

export async function toggleTodo(id: string, completed: boolean) {
  const todoDoc = doc(db, "todos", id);
  await updateDoc(todoDoc, { completed });
}

export async function deleteTodo(id: string) {
  const todoDoc = doc(db, "todos", id);
  await deleteDoc(todoDoc);
}
