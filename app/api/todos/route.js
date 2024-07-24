// app/api/todos/route.js
import { db } from '../../../utils/firebase'; // Firebase 초기화 파일을 가져옴
import { collection, getDocs, addDoc } from 'firebase/firestore';

export async function GET(request) {
  try {
    const todoCollection = collection(db, 'todos');
    const todoSnapshot = await getDocs(todoCollection);
    const todoList = todoSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return new Response(JSON.stringify(todoList), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch todos' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request) {
  const { text } = await request.json();
  if (!text) {
    return new Response(JSON.stringify({ error: 'Text is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  try {
    const newTodo = { text, completed: false }; // 변수 선언
    await addDoc(collection(db, 'todos'), newTodo); // newTodo 변수를 선언한 후에 접근

    return new Response(JSON.stringify({ message: 'Todo added' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to add todo' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
