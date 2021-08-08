import { ADD_TODO } from './actions';

const initialState = [];

function todoApp(prevState = initialState, action) {
  if (action.type === ADD_TODO) {
    return [action.todo, ...prevState];
  }
  return prevState;
}
