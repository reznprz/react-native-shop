import { ApiResponse } from 'app/api/handlers';
import { getUsers, User } from 'app/api/services/userService';
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
      const response: ApiResponse<User[]> = await getUsers(restaurantId);
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

  return {
    // getUsers
    users,
    getUsersState: getAllUsersMutation,
    fetchUsers,
  };
};
