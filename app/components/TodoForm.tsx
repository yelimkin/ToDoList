import React from 'react';

const TodoForm: React.FC = () => {
  const [text, setText] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    setText('');
    // 페이지 새로 고침 또는 상태 업데이트
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2 mb-4">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new todo"
        className="border p-2 flex-grow"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white p-2"
      >
        Add
      </button>
    </form>
  );
};

export default TodoForm;
