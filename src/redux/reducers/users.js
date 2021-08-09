import {
  GET_USERS_FAILURE,
  GET_USERS_REQUEST,
  GET_USERS_SUCCESS,
} from '../actions';

const initialState = {
  getUsersLoading: false,
  getUsersDone: false,
  getUsersError: null,
  users: [],
};
export default function users(state = initialState, action) {
  if (action.type === GET_USERS_REQUEST) {
    return {
      ...state,
      getUsersLoading: true,
      getUsersDone: false,
      getUsersError: null,
    };
  }
  if (action.type === GET_USERS_SUCCESS) {
    return {
      ...state,
      getUsersLoading: false,
      getUsersDone: true,
      users: action.data,
    };
  }
  if (action.type === GET_USERS_FAILURE) {
    return {
      ...state,
      getUsersLoading: false,
      getUsersError: action.error,
    };
  }
  return state;
}
