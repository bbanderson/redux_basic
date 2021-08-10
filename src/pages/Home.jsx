import { push } from 'connected-react-router';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Home() {
  const dispatch = useDispatch();
  return (
    <div>
      <h1>Home</h1>
      <ul>
        <li>
          <Link to="/todos">Todos</Link>
        </li>
        <li>
          <Link to="/users">Users</Link>
        </li>
      </ul>
      <button onClick={click}>todos로 이동</button>
    </div>
  );

  function click() {
    dispatch(push('/todos'));
  }
}
