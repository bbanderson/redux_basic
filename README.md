# Redux

API 호출은 Component의 componentDidMount 시점에 합니다.  
```js
// Component
export default function Component(props) {
  useEffect(() => {
    props.oneAsyncFunc();
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

* * *

## **Ducks Pattern**
### **리덕스를 효율적으로 사용할 수 있는 파일/디렉토리 관리 패턴**

Ducks Pattern은 리덕스 사용자들이 수많은 파일을 관리하며 찾아낸  
가장 효율적인 파일/디렉토리 관리 패턴입니다.  
일반적인 상황에서는 `actionTypes`,`action`,`reducer` 기준으로 각각 모아서 관리하다보니,  
하나의 기능을 추가할 때마다 서로 다른 파일을 관리해야 했습니다.  
하지만 `Ducks Pattern`을 사용하면 `각 기능을 기준으로 모듈화`함으로써 유기적인 프로그래밍이 가능해집니다.  
즉, 하나의 기능을 기준으로 `action`과 `reducer`를 함께 관리하며,  
결과적으로 각 모듈에서의 `export default function reducer`을  
`index.js`에서 여러번 import하여 `combineReducer`의 인수로 전달하는 방식입니다.  
이때 `combineReducer`에 전달되는 각 모듈은 `redux-devtools`의 `state`로 확인 가능합니다.

#### Before 🐣
```
.
└── redux
    ├── actions.js
    ├── store.js
    └── reducers
        ├── index.js
        ├── subReducer.js
        └── subReducer2.js
```

#### After 🐤
```
.
└── redux
    ├── store.js
    └── modules
        ├── index.js
        ├── subReducer.js
        └── subReducer2.js
```

각 모듈의 코드 관리 방식은 다음과 같습니다.  
```js
// 액션 타입 정의
export const ACTION_TYPE = '/project_name/module_name/ACTION_TYPE';

// 액션 생성 함수
export function actionCreator() {
  return { type: ACTION_TYPE };
}

// 초기값
const initialState = {
  foo: 'bar',
};

// 리듀서
export default function reducer(state = initialState, action) {
  if (action.type === ACTION_TYPE) {
    return { ...state, baz: 'qux' };
  }
  return state;
}

// 기타 미들웨어

// redux-thunk
/* ... */

// redux-promise-middleware
/* ... */

```

* * *

## **`react-router-dom` X `Redux`**
### **리덕스 로직 결과에 따라 경로 처리를 함께 하는 방법**
리덕스의 액션이 발행될 때 URL을 함께 관리하는 방식입니다.

#### **1. `redux-thunk`와 `withExtraArgument` 사용하기**
thunk를 export default 상태 그대로 사용하지 않고  
`.withExtraArgument` 속성을 이용하면 커스텀 인수를 전달할 수 있습니다.  
커스텀 인수로는 추가하고 싶은 기능을 객체로 전달합니다.  
이때 `thunk.withExtraArgument({ foo })`는  
thunk의 본래 기능과 개발자가 방금 전달한 인수를 모두 포함한 함수 객체를 반환하기 때문에,  
이후 함수를 반환하는 `액션 생성자`를 호출하기만 하면 언제든지 또다른 미들웨어로서 사용 가능합니다.  
다음 예제는 `history` 라이브러리를 미들웨어로 추가하는 모습입니다.  
`history` 라이브러리는 createStore에 전달할 뿐만 아니라,  
라우팅을 위해 애플리케이션의 최상위 컴포넌트 `<App />`에도 공유되어야 하므로,  
따로 모듈화하여 export 시키는 것이 편리합니다.
```js
// history.js - 따로 모듈화
import { createBrowserHistory} from 'history'; // react-router-dom 설치 시 함께 설치됨
const history = createBrowserHistory();
export default history;
```
```js
// App.js - 리덕스의 상태를 react-router-dom과 연결시키는 핵심 장소
import { Router, Route } from 'react-router-dom';
import history from './history';
import Home from './pages/Home';

// BrowserRouter는 history를 내장하고 있어서 일반 Router를 사용했습니다.
<Router history={history}>
  <Route path="/" exact component={Home} />
</Router>
```
```js
// redux/store.js
import thunk from 'thunk';
import reducer from './modules';
import history from '../history';
/* ... */
// createStore(reducer, applyMiddleware(thunk)); /* 기존 방식 */
createStore(reducer, applyMiddleware(thunk.withExtraArgument({ history })));
/* ... */
```
```js
// modules/foo.js - 실제 활용처
function fooActionThunk() { // 함수를 반환하는 액션 생성자
  return async (dispatch, getState, { history }) => {
    /* ... */
    history.push('/');
    /* ... */
  };
}
```

#### **2. `connected-react-router` 사용하기**
`connected-react-router`는 이름에서부터 알 수 있듯이  
Redux의 `dispatch`로 액션을 발행할 때마다  
React의 `Route`를 **강하게 결합**시키는 라이브러리입니다.  
즉, dispatch만 해도 URL 처리가 자동 동기화되는 장점이 있습니다.  
`connectRouter` 메서드를 `combineReducers`의 `router` 프로퍼티에 추가하면 일반 리듀서와 함께 합성되며  
라우팅 관련 정보가 `state`에 추가됩니다.
```js
// redux/modules/index.js
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import users from './users';
import posts from './posts';
import history from '../../history';

const reducer = combineReducers({
  users,
  posts,
  router: connectRouter(history),
});

export default reducer;
```

```js
// redux/store.js
import thunk from 'thunk';
import reducer from './modules';
import history from '../history';
import { routerMiddleware } from 'connected-react-router';

/* ... */
// createStore(reducer, applyMiddleware(thunk)); /* 기존 방식 */
createStore(reducer, applyMiddleware(routerMiddleware(history)));
/* ... */
```
```js
// App.js - 리덕스의 상태를 react-router-dom과 연결시키는 핵심 장소
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import history from './history';
import Home from './pages/Home';

// BrowserRouter는 history를 내장하고 있어서 일반 Router를 사용했습니다.
<ConnectedRouter history={history}>
  <Route path="/" exact component={Home} />
</ConnectedRouter>
```
```js
// pages/Home.jsx - 실제 활용처
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { useDispatch } from 'react-redux';

export default function Home() {
  const dispatch = useDispatch();
  return (
    <div>
      <h1>Home</h1>
      <ul>
        <li>
          <Link to="/todos">Todos</Link>
        </li>
        <li>
          <Link to="/users">Users</Link>
        </li>
      </ul>
      <button onClick={click}>전체 게시글 보기</button>
    </div>
  );

  function click() {
    dispatch(push('/todos')); // 버튼을 클릭하면 액션이 발행됨과 동시에 라우팅 처리
  }
}
```

#### **3. `redux-saga` 사용하기**
커스텀 정의한 함수를 `saga`라고 합니다.  
`redux-saga`는 비동기 처리 뿐만 아니라 웹개발에 필요한 여러 기능들(throttle, debounce 등)을  
함수로 미리 구현해 놓았기 때문에 생산성이 매우 높습니다.  
이 함수들을 `saga effect`라고 하며 우리는 `saga effect`를 잘 활용하기만 하면 됩니다.  
초기 설정 순서는 다음과 같습니다.
> 1. `store`에서 `redux-saga` 미들웨어 설정하기
> 2. `saga` 함수 만들기
> 3. 리듀서 별 모듈화된 `saga`함수를 `rootSaga`로 모으기
> 4. `store`에서 `rootSaga` 등록하고 실행하기
> 5. 원하는 `saga` 함수를 실행시키기 위해 `saga` 전용 액션 생성자 만들기
> 6. dispatch 하기 (`redux-saga`에서는 dispatch를 `put` saga effect로 대체합니다.) 

```js
// redux/store.js
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducer from './modules';
import rootSaga from './modules/rootSaga';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(reducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

export default store;
```

```js
// redux/modules/users.js
import axios from 'axios';
import { push } from 'connected-react-router';
import { call, delay, put } from 'redux-saga/effects';

function* getUsersSaga(action) {
  try {
    yield put(getUsersRequest());
    const { data } = yield call(axios.get, 'https://api.github.com/users');
    yield put(getUsersSuccess(data));
    yield delay(2000);
    yield put(push('/'));
  } catch (error) {
    yield put(getUsersFailure(error));
  }
}

const GET_USERS_SAGA = 'GET_USERS_SAGA';

export function getUsersSagaStart() {
  return {
    type: GET_USERS_SAGA,
  };
}

export function* usersSaga() {
  yield takeEvery(GET_USERS_SAGA, getUsersSaga);
}
```

```js
// redux/modules/rootSaga.js
import { all } from 'redux-saga/effects';
import { usersSaga } from './users';

export default function* rootSaga() {
  yield all([usersSaga()]);
}
```