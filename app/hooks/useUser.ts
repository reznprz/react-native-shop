import { ApiResponse } from 'app/api/handlers';
import {
  createUserApi,
  deleteUserApi,
  getUsersApi,
  updateUserApi,
  User,
  UserRegisterRequest,
} from 'app/api/services/userService';
import { useMutation } from '@tanstack/react-query';
import { setUserAvatarUrl } from 'app/redux/authSlice';
import { useCallback, useMemo, useState } from 'react';
import type { RootState, AppDispatch } from '../redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { useOtpMutations } from './apiQuery/useOtpMutations';

export const useUsers = () => {
  const dispatch: AppDispatch = useDispatch();
  const { requestOtpMutation, validateOtpMutation } = useOtpMutations();

  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

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

  const updateUserMutation = useMutation<
    ApiResponse<User[]>,
    Error,
    { userId: number; updatedUser: User; updateImageOnly?: boolean }
  >({
    mutationFn: async ({ userId, updatedUser, updateImageOnly = false }) => {
      if (userId === 0) {
        throw new Error('User Id Invalid');
      }
      const response: ApiResponse<User[]> = await updateUserApi(
        userId,
        updatedUser,
        updateImageOnly,
      );
      if (response.status !== 'success') {
        throw new Error(response.message);
      }
      if (response) {
        dispatch(setUserAvatarUrl(updatedUser.avatarUrl || ''));
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

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) {
      // If searchTerm is empty (or whitespace), return all
      return users;
    }

    const lower = searchTerm.toLowerCase();
    return users.filter((u) => {
      const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
      const username = u.username?.toLowerCase() || '';
      const email = u.email?.toLowerCase() || '';
      return fullName.includes(lower) || username.includes(lower) || email.includes(lower);
    });
  }, [users, searchTerm]);

  return {
    storeRestaurantId,

    // getUsers
    users: filteredUsers,
    getUsersState: getAllUsersMutation,
    fetchUsers,

    // deleteUser
    handleDeleteUser,
    deleteUserState: deleteUserMutation,

    // createUser
    createUserMutation,

    //updateUser
    updateUserMutation,

    //otp
    sendOtpState: requestOtpMutation,
    verifyOtpState: validateOtpMutation,

    //search
    searchTerm,
    setSearchTerm,
  };
};
