# Redux

API 호출은 Component의 componentDidMount 시점에 합니다.  
Component에는 View만 보이도록 노력해야 합니다.  
**비동기 로직은 모두 Container에 맡기고, Component는 UI만 집중합시다.**

### redux-thunk
**비동기 처리를 위한 라이브러리**  
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
  
#### **관심사의 분리**
```
thunk는 액션에서 dispatch를 처리시킴으로써 Container를 가볍게 합니다.
즉, Container는 액션 생성자를 Component에 전달하는 역할만 담당하게 됩니다.
(Component는 여전히 UI에만 집중!)
```