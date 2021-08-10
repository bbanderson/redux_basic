import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import todos from './todos';
import filter from './filter';
import users from './users';
import history from '../../history';

const reducer = combineReducers({
  todos,
  filter,
  users,
  router: connectRouter(history),
});

export default reducer;
