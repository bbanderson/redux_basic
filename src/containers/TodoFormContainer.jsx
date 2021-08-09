import { useDispatch } from 'react-redux';
import { addTodo } from '../redux/modules/todos';
import TodoForm from '../components/TodoForm';
import { useCallback } from 'react';

export default function TodoFormContainer() {
  const dispatch = useDispatch();
  const add = useCallback(
    (plan) => {
      dispatch(addTodo(plan));
    },
    [dispatch]
  );
  return <TodoForm add={add} />;
}
