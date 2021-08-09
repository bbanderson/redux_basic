import TodoFormContainer from '../containers/TodoFormContainer';
import TodoListContainer from '../containers/TodoListContainer';

export default function Todos() {
  return (
    <div>
      <TodoListContainer />
      <TodoFormContainer />
    </div>
  );
}
