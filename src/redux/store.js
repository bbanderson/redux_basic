import { createStore, applyMiddleware } from 'redux';
import todoApp from './modules';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import history from '../history';
import { routerMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './modules/rootSaga';

const sagaMiddleware = createSagaMiddleware();
// function middleware1(store) {
//   console.log('middleware1', 0);
//   return (next) => {
//     console.log('middleware1', 1);
//     return (action) => {
//       console.log('middleware1', 2);
//       const returnValue = next(action);
//       console.log('middleware1', 3);
//       return returnValue;
//     };
//   };
// }

// function middleware2(store) {
//   console.log('middleware2', 0);
//   return (next) => {
//     console.log('middleware2', 1);
//     return (action) => {
//       console.log('middleware2', 2);
//       const returnValue = next(action);
//       console.log('middleware2', 3);
//       return returnValue;
//     };
//   };
// }

const store = createStore(
  todoApp,
  composeWithDevTools(
    applyMiddleware(
      thunk.withExtraArgument({ history }),
      promise,
      routerMiddleware(history),
      sagaMiddleware
    )
  )
);

sagaMiddleware.run(rootSaga);

export default store;
