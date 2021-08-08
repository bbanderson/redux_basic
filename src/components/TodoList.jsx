import useReduxState from '../hooks/useReduxState';

export default function TodoList() {
  const state = useReduxState();
  return (
    <ul>
      {state.todos.map((todo) => {
        return <li>{todo.plan}</li>;
      })}
    </ul>
  );
}
