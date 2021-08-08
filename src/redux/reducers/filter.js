import { SHOW_ALL, SHOW_COMPLETED } from '../actions';

const initialState = 'ALL';

export default function filter(prevState = initialState, action) {
  if (action.type === SHOW_ALL) {
    return 'ALL';
  }

  if (action.type === SHOW_COMPLETED) {
    return 'COMPLETED';
  }
  return prevState;
}
