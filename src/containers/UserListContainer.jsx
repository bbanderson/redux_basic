import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import UserList from '../components/UserList';
import {
  getUsersFailure,
  getUsersRequest,
  getUsersSuccess,
} from '../redux/actions';

export default function UserListContainer() {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  const getUsers = useCallback(async () => {
    try {
      dispatch(getUsersRequest());
      const { data } = await axios.get('https://api.github.com/users');
      dispatch(getUsersSuccess(data));
    } catch (error) {
      dispatch(getUsersFailure(error));
    }
  }, [dispatch]);
  // const getUsers = await dispatch(getUsersRequest);

  return <UserList users={users} getUsers={getUsers} />;
}
