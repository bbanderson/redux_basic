import logo from './logo.svg';
import './App.css';
import TodoFormContainer from './containers/TodoFormContainer';
import TodoListContainer from './containers/TodoListContainer';
import UserListContainer from './containers/UserListContainer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <UserListContainer />
        <TodoFormContainer />
        <TodoListContainer />
      </header>
    </div>
  );
}

export default App;
