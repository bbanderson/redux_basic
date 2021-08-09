import axios from 'axios';

export const ADD_TODO = 'ADD_TODO';
export const COMPLETE_TODO = 'COMPLETE_TODO';
export const SHOW_ALL = 'SHOW_ALL';
export const SHOW_COMPLETED = 'SHOW_COMPLETED';

export function addTodo(text) {
  return { type: ADD_TODO, text };
}

export function completeTodo(index) {
  return { type: COMPLETE_TODO, index };
}

export function showAll() {
  return { type: SHOW_ALL };
}

export function showCompleted() {
  return { type: SHOW_COMPLETED };
}

// users

export const GET_USERS_REQUEST = 'GET_USERS_REQUEST';
export const GET_USERS_SUCCESS = 'GET_USERS_SUCCESS';
export const GET_USERS_FAILURE = 'GET_USERS_FAILURE';

export function getUsersRequest() {
  return { type: GET_USERS_REQUEST };
}

export function getUsersSuccess(data) {
  return { type: GET_USERS_SUCCESS, data };
}

export function getUsersFailure(error) {
  return { type: GET_USERS_FAILURE, error };
}

export function getUsersThunk() {
  return async (dispatch) => {
    try {
      dispatch(getUsersRequest());
      const { data } = await axios.get('https://api.github.com/users');
      dispatch(getUsersSuccess(data));
    } catch (error) {
      dispatch(getUsersFailure(error));
    }
  };
}
