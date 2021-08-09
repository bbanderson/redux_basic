export default function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo) => {
        return <li>{todo.plan}</li>;
      })}
    </ul>
  );
}
