import { useRef } from 'react';
import { connect } from 'react-redux';
// import useReduxDispatch from '../hooks/useReduxDispatch';
import { addTodo } from '../redux/actions';

function TodoForm({ add }) {
  const inputRef = useRef();
  // const dispatch = useReduxDispatch();
  return (
    <div>
      <input ref={inputRef} />
      <button onClick={click}>추가</button>
    </div>
  );

  function click() {
    add(inputRef.current.value);
  }
}

const mapStateToProps = (state) => {
  return {
    todos: state.todos,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    add(plan) {
      dispatch(addTodo(plan));
    },
  };
};
const TodoFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoForm);

export default TodoFormContainer;