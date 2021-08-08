import logo from './logo.svg';
import './App.css';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <TodoForm />
        <TodoList />
      </header>
    </div>
  );
}

export default App;
