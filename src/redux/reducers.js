import { ADD_TODO, COMPLETE_TODO, SHOW_ALL, SHOW_COMPLETED } from './actions';

const initialState = {
  todos: [],
  filter: 'ALL',
};

export function todoApp(prevState = initialState, action) {
  if (action.type === ADD_TODO) {
    return {
      ...prevState,
      todos: [{ plan: action.text, done: false }, ...prevState.todos],
    };
  }
  if (action.type === COMPLETE_TODO) {
    return {
      ...prevState,
      todos: prevState.todos.map((todo, index) => {
        if (index === action.index) {
          return { plan: todo.plan, done: true };
        } else {
          return todo;
        }
      }),
    };
    // target.done = true;
    // return [{ plan: action.text, done: false }, ...prevState];
  }

  if (action.type === SHOW_ALL) {
    return {
      ...prevState,
      filter: 'ALL',
    };
  }

  if (action.type === SHOW_COMPLETED) {
    return {
      ...prevState,
      filter: 'COMPLETED',
    };
  }
  return prevState;
}
