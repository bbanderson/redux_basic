# Redux

API 호출은 Component의 componentDidMount 시점에 합니다.  
```js
// Component
export default function Component(props) {
  useEffect(() => {
    props.oneAyncFunc();
  }, [props.oneAsyncFunc]);

  return <h1>{props.title}</h1>;
}
```
Component에는 View만 보이도록 노력해야 합니다.  
**비동기 로직은 모두 Container에 맡기고, Component는 UI만 집중합시다.**
* * *
## **redux-thunk**
### **비동기 처리를 위한 라이브러리**  
액션 생성자가 일반 객체가 아닌 `함수`를 반환할 때만 반응합니다.  
따라서 `redux-thunk`를 적용하려면 액션 생성자가 함수를 반환하도록 변경하세요.  

##### 기존 Action Creator
```js
export function foo(data) {
  return { type: DO_SOMETHING, data };
}
```

##### thunk Action Creator
```js
export function bar(data) {
  return (dispatch) => {};
}
```
###### dispatch는 액션을 store에 전달하는 행위입니다.

react-redux는 기본적으로 비동기 로직을 지원하지 않습니다.  
따라서 만약 비동기 로직을 위한 라이브러리를 따로 사용하지 않는다면  
Container와 Component 사이에서 신중한 설계가 필요합니다.  
예를 들면  
Component 자체의 DidMount 또는 특정 이벤트가 발생시점에 맞추어서  
Container가 axios 등으로 비동기 처리를 시작하도록 호출하고,  
그동안 Component는 Container가 props로 결과를 보내줄 때까지 기다립니다.

물론 훌륭한 방법입니다만, 다음과 같이 코드가 조금 길다는 문제가 있습니다.
```js
// Container
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import Component from './Component';
import {
  requestSomethingAction,
  resolveSomethingAction,
  rejectSomethingAction
} from './actions';

export default function Container() {
  const { oneDataOfInitialState } = useSelector(state => state.oneOfReducers);
  const dispatch = useDispatch();

  const doWhateverAsync = useCallback(async () => {
    dispatch(requestSomethingAction());
    try {
      const response = await axios.get(/* API Address */);
      dispatch(resolveSomethingAction(response.data));
    } catch (error) {
      dispatch(rejectSomethingAction(error));
    }
  }, [dispatch]);
  
  return <Component
    data={oneDataOfInitialState}
    asyncFunc={doWhateverAsync}
    />;
}
```
```js
// Component
import { useEffect } from 'react';

export default function Component({data, asyncFunc}) {
  useEffect(() => {
    asyncFunc();
  }, [asyncFunc])
  return <h1>{data}</h1>;
}
```

하지만 `redux-thunk`를 사용한다면,  
더 이상 Container도 `dispatch`와 관련된 것들을 부담할 필요가 없습니다.  
액션 쪽에서 모두 처리하기 때문입니다.  
```js
// actions.js
import axios from 'axios';

// 유저 정보에 대한 비동기 API 호출을 전담하는 액션
export function getUsersThunk() {
  return async (dispatch) => {
    dispatch(requestSomethingAction());
    try {
      const response = await axios.get(/* API Address */);
      dispatch(resolveSomethingAction(response.data));
    } catch (error) {
      dispatch(rejectSomethingAction(error));
    }
  };
}
```
```js
// store.js
import { createStore, applyMiddleware } from 'redux';
import reducer from './reducers';
import thunk from 'redux-thunk';
const store = createStore(reducer, applyMiddleware(thunk));

export default store;
```
```js
// Container.js
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Component from '../components/UserList';
import { getUsersThunk } from '../redux/actions';

export default function UserListContainer() {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  const getUsers = useCallback(() => {
    dispatch(getUsersThunk());
  }, [dispatch]);

  return <Component users={users} getUsers={getUsers} />;
}

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import Component from './Component';
import {
  getUsersThunk
} from './actions';

export default function Container() {
  const { oneDataOfInitialState } = useSelector(state => state.oneOfReducers);
  const dispatch = useDispatch();

  const doWhateverAsync = useCallback(async () => {
    getUsersThunk(); /* 비동기 로직을 기존 이 곳에서 액션으로 분리! */
  }, [dispatch]);
  
  return <Component
    data={oneDataOfInitialState}
    asyncFunc={doWhateverAsync}
    />;
}
```
```js
// Component (차이 없음)
import { useEffect } from 'react';

export default function Component({data, asyncFunc}) {
  useEffect(() => {
    asyncFunc();
  }, [asyncFunc])
  return <h1>{data}</h1>;
}
```
  
#### **관심사의 분리**
```
thunk는 액션에서 dispatch를 처리시킴으로써 Container를 가볍게 합니다.
즉, Container는 액션 생성자를 Component에 전달하는 역할만 담당하게 됩니다.
(Component는 여전히 UI에만 집중!)
```

* * *

## **redux-promise-middleware**
### **비동기 try~catch에 해당하는 액션 자동 호출 액션 생성자**

`redux-promise-middleware`는 비동기 요청에 대한 일련의 과정인  
`request` → `success(try) || fail(catch)`을 대신 수행해줍니다.  
비동기 처리에서는 액션 이름을 일반적으로  
`FOO_REQUEST, FOO_SUCCESS, FOO_FAILURE`처럼 3가지 상태로 나누어 정의합니다.  
하지만 `redux-promise-middleware`에서는 `FOO` 하나만 정의하면  
`FOO_PENDING, FOO_FULFILLED, FOO_REJECTED` 3가지를 암묵적으로 정의함과 동시에
자동 호출해줍니다.  
따라서 개발자는 `reducer`에서 해당 액션 타입에 대한 분기 처리만 해주면 됩니다.  
단, 편의를 위해 3가지 자동 생성 액션에 대한 상수를 미리 정의하는 것이 좋습니다.
`redux-promise-middleware`로 액션 생성자를 정의할 때는,
여느 액션 생성자와 마찬가지로 객체 리터럴을 반환하며,  
비동기 처리는 `payload`라는 이름의 메서드 안에 정의해야 합니다.

```js
// actions.js
export const ASYNC_ACTION = 'ASYNC_ACTION';

export const ASYNC_ACTION_PENDING = 'ASYNC_ACTION_PENDING';
export const ASYNC_ACTION_FULFILLED = 'ASYNC_ACTION_FULFILLED';
export const ASYNC_ACTION_REJECTED = 'ASYNC_ACTION_REJECTED';

export function getUsersPromise() {
  return {
    type: ASYNC_ACTION,
    async payload() {
      const { data } = await axios.get(/* API Address */);
      return data;
    },
  };
}
```

```js
// reducer.js
import {
  GET_USERS_FULFILLED,
  GET_USERS_PENDING,
  GET_USERS_REJECTED,
} from '../actions';

const initialState = {
  getUsersLoading: false,
  getUsersDone: false,
  getUsersError: null,
  users: [],
};
export default function users(state = initialState, action) {
  if (action.type === GET_USERS_PENDING) {
    return {
      ...state,
      getUsersLoading: true,
      getUsersDone: false,
      getUsersError: null,
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
  if (action.type === GET_USERS_REJECTED) {
    return {
      ...state,
      getUsersLoading: false,
      getUsersError: action.payload,
    };
  }
  return state;
}
```
```js
// store.js
import { createStore, applyMiddleware } from 'redux';
import reducer from './reducers';
import promise from 'redux-promise-middleware';

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(promise))
);
export default store;
```