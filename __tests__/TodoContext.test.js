import { renderHook, act } from '@testing-library/react-hooks';
import { TodoProvider, useTodos } from '../components/TodoContext';

test('adds a todo', async () => {
  const { result } = renderHook(() => useTodos(), { wrapper: TodoProvider }); // useTodos 훅을 테스트 환경에서 렌더링(훅을 호출하는 함수, 훅이 필요한 컨텍스트를 제공하는 TodoProvider)

  // 행동 실행 및 상태 업데이트 
  await act(async () => { // React의 상태 업데이트를 안정적으로 처리(비동기 작업을 포함하므로 async 키워드를 사용하고, 내부에서도 await를 사용)
    await result.current.addTodo('New Todo'); // useTodos 훅에서 반환된 addTodo 함수를 호출하여 새로운 투두 항목을 추가
  });

  // 특정 값이 예상한 대로인지 검증
  expect(result.current.todos).toHaveLength(1); // todos 배열의 길이가 1인지 확인(상태 검증)
  expect(result.current.todos[0].text).toBe('New Todo'); // 첫 번째 투두 항목의 text 값이 'New Todo'인지 확인
});
