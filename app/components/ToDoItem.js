"use client";

// app/components/TodoItem.js
export default function TodoItem({ todo }) {
    return (
      <div>
        <input type="checkbox" checked={todo.completed} />
        <span>{todo.text}</span>
      </div>
    );
}
  