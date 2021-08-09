import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserList from '../components/UserList';
import {
  getUsersFailure,
  getUsersRequest,
  getUsersSuccess,
} from '../redux/actions';

export default function UserListContainer() {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  const request = useCallback(() => {
    dispatch(getUsersRequest());
  }, [dispatch]);
  const success = useCallback(
    (data) => {
      dispatch(getUsersSuccess(data));
    },
    [dispatch]
  );
  const fail = useCallback(
    (error) => {
      dispatch(getUsersFailure(error));
    },
    [dispatch]
  );

  // const getUsers = await dispatch(getUsersRequest);

  return (
    <UserList users={users} request={request} success={success} fail={fail} />
  );
}
