import { ADD_TODO, COMPLETE_TODO } from '../actions';

const initialState = [];

export default function todos(prevState = initialState, action) {
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
