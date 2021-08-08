import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './redux/store';
import ReduxContext from './contexts/ReduxContext';
// import { addTodo, completeTodo, showAll, showCompleted } from './redux/actions';

// console.log(store);
// console.log(store.getState());
// store.dispatch(addTodo('have breakfast'));
// console.log(store.getState());

// store.subscribe(() => {
//   console.log(store.getState());
// });

// store.dispatch(addTodo('one'));
// store.dispatch(addTodo('two'));
// store.dispatch(addTodo('three'));
// store.dispatch(completeTodo(1));
// store.dispatch(completeTodo(2));
// store.dispatch(showAll());
// store.dispatch(showCompleted());

ReactDOM.render(
  <React.StrictMode>
    <ReduxContext.Provider value={store}>
      <App />
    </ReduxContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
