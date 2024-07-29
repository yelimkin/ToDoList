import { createContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
    const { data: session } = useSession();
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        if (session) {
            const q = query(collection(db, 'todos'), where('userId', '==', session.user.id));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const todosData = [];
                querySnapshot.forEach((doc) => {
                    todosData.push({ id: doc.id, ...doc.data() });
                });
                setTodos(todosData);
            });
            return () => unsubscribe();
        }
    }, [session]);

    const addTodo = async (text) => {
        await addDoc(collection(db, 'todos'), {
            text,
            completed: false,
            userId: session.user.id,
        });
    };

    const deleteTodo = async (id) => {
        await deleteDoc(doc(db, 'todos', id));
    };

    const toggleTodo = async (id, completed) => {
        await updateDoc(doc(db, 'todos', id), { completed });
    };

    return (
        <TodoContext.Provider value={{ todos, addTodo, deleteTodo, toggleTodo }}>
            {children}
        </TodoContext.Provider>
    );
};

export default TodoContext;
