import { connect } from 'react-redux';
import { addTodo } from '../redux/actions';
import TodoForm from '../components/TodoForm';

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

export default connect(mapStateToProps, mapDispatchToProps)(TodoForm);
