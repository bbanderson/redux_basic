import axios from 'axios';

// 액션 타입 정의
export const GET_USERS_REQUEST = '/redux_basic/users/GET_USERS_REQUEST';
export const GET_USERS_SUCCESS = '/redux_basic/users/GET_USERS_SUCCESS';
export const GET_USERS_FAILURE = '/redux_basic/users/GET_USERS_FAILURE';

// redux-promise-middleware
export const GET_USERS = 'redux_basic/users/GET_USERS';

export const GET_USERS_PENDING = 'redux_basic/users/GET_USERS_PENDING';
export const GET_USERS_FULFILLED = 'redux_basic/users/GET_USERS_FULFILLED';
export const GET_USERS_REJECTED = 'redux_basic/users/GET_USERS_REJECTED';

// 액션 생성 함수
export function getUsersRequest() {
  return { type: GET_USERS_REQUEST };
}

export function getUsersSuccess(data) {
  return { type: GET_USERS_SUCCESS, data };
}

export function getUsersFailure(error) {
  return { type: GET_USERS_FAILURE, error };
}

// 초기값
const initialState = {
  getUsersLoading: false,
  getUsersDone: false,
  getUsersError: null,
  users: [],
};

// 리듀서
export default function reducer(state = initialState, action) {
  if (action.type === GET_USERS_REQUEST || action.type === GET_USERS_PENDING) {
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
  if (action.type === GET_USERS_FULFILLED) {
    return {
      ...state,
      getUsersLoading: false,
      getUsersDone: true,
      users: action.payload,
    };
  }
  if (action.type === GET_USERS_FAILURE) {
    return {
      ...state,
      getUsersLoading: false,
      getUsersError: action.error,
    };
  }
  if (action.type === GET_USERS_REJECTED) {
    return {
      ...state,
      getUsersLoading: false,
      getUsersError: action.payload,
    };
  }
  return state;
}

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

// redux-thunk
export function getUsersThunk() {
  return async (dispatch, getState, { history }) => {
    try {
      console.log(history);
      dispatch(getUsersRequest());
      const { data } = await axios.get('https://api.github.com/users');
      dispatch(getUsersSuccess(data));
      await sleep(2000);
      history.push('/');
    } catch (error) {
      dispatch(getUsersFailure(error));
    }
  };
}

// redux-promise-middleware
export function getUsersPromise() {
  return {
    type: GET_USERS,
    async payload() {
      const { data } = await axios.get('https://api.github.com/users');
      return data;
    },
  };
}
