// 액션 타입 정의
export const ADD_TODO = '/redux_basic/todos/ADD_TODO';
export const COMPLETE_TODO = '/redux_basic/todos/COMPLETE_TODO';

// 액션 생성 함수
export function addTodo(text) {
  return { type: ADD_TODO, text };
}

export function completeTodo(index) {
  return { type: COMPLETE_TODO, index };
}

// 초기값
const initialState = [];

// 리듀서
export default function reducer(prevState = initialState, action) {
  if (action.type === ADD_TODO) {
    return [{ plan: action.text, done: false }, ...prevState];
  }
  if (action.type === COMPLETE_TODO) {
    return prevState.map((todo, index) => {
      if (index === action.index) {
        return { plan: todo.plan, done: true };
      } else {
        return todo;
      }
    });
    // target.done = true;
    // return [{ plan: action.text, done: false }, ...prevState];
  }
  return prevState;
}
