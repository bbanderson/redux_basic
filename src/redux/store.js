import { createStore, applyMiddleware } from 'redux';
import todoApp from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

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

const store = createStore(todoApp, composeWithDevTools(applyMiddleware(thunk)));

export default store;
