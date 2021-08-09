import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import UserList from '../components/UserList';
import { getUsersPromise, getUsersThunk } from '../redux/modules/users';

export default function UserListContainer() {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  const getUsers = useCallback(() => {
    // dispatch(getUsersThunk());
    dispatch(getUsersPromise());
  }, [dispatch]);
  // const getUsers = useCallback(async () => {}, [dispatch]);
  // const getUsers = await dispatch(getUsersRequest);

  return <UserList users={users} getUsers={getUsers} />;
}
