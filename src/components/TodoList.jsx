import { connect } from 'react-redux';

function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo) => {
        return <li>{todo.plan}</li>;
      })}
    </ul>
  );
}

const mapStateToProps = (state) => {
  return {
    todos: state.todos,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {};
};

const TodoListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList);

export default TodoListContainer;
