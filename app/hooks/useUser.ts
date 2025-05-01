import { ApiResponse } from 'app/api/handlers';
import {
  createUserApi,
  deleteUserApi,
  getUsersApi,
  User,
  UserRegisterRequest,
} from 'app/api/services/userService';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import type { RootState } from '../redux/store';
import { useSelector } from 'react-redux';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);

  const storedAuthData = useSelector((state: RootState) => state.auth.authData);
  const { restaurantId: storeRestaurantId = 0 } = storedAuthData || {};

  const getAllUsersMutation = useMutation<ApiResponse<User[]>, Error, { restaurantId: number }>({
    mutationFn: async ({ restaurantId }) => {
      const response: ApiResponse<User[]> = await getUsersApi(restaurantId);
      if (response.status !== 'success') {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      setUsers(response.data || []);
    },
    onError: (err) => {
      setUsers([]);
    },
  });

  const createUserMutation = useMutation<
    ApiResponse<User[]>,
    Error,
    { newUser: UserRegisterRequest }
  >({
    mutationFn: async ({ newUser }) => {
      const response: ApiResponse<User[]> = await createUserApi(storeRestaurantId, newUser);
      if (response.status !== 'success') {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      setUsers(response.data || []);
    },
    onError: (err) => {
      setUsers([]);
    },
  });

  const deleteUserMutation = useMutation<
    ApiResponse<User[]>,
    Error,
    { restaurantId: number; userId: number }
  >({
    mutationFn: async ({ restaurantId, userId }) => {
      const response: ApiResponse<User[]> = await deleteUserApi(restaurantId, userId);
      if (response.status !== 'success') {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      setUsers(response.data || []);
    },
    onError: (err) => {
      setUsers([]);
    },
  });

  const fetchUsers = useCallback(() => {
    getAllUsersMutation.mutate({ restaurantId: storeRestaurantId });
  }, [getAllUsersMutation]);

  const handleDeleteUser = useCallback(
    (userId: number) => {
      deleteUserMutation.mutate({ restaurantId: storeRestaurantId, userId: userId });
    },
    [deleteUserMutation],
  );

  return {
    // getUsers
    users,
    getUsersState: getAllUsersMutation,
    fetchUsers,

    // deleteUser
    handleDeleteUser,
    deleteUserState: deleteUserMutation,

    // createUser
    createUserMutation,
  };
};
