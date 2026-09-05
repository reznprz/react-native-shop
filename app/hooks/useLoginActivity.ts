import { useCallback, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { ApiResponse } from 'app/api/handlers';
import {
  DateRangeSelectionType,
  getLoginActivityApi,
  getLoginActivityByDateApi,
  getLoginActivityByDateRangeApi,
  getRecentLoginActivityApi,
  getTodayLoginActivityApi,
  LoginActivity,
} from 'app/api/services/loginActivityService';

export const useLoginActivity = () => {
  const [loginActivities, setLoginActivities] = useState<LoginActivity[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const storedAuthData = useSelector((state: RootState) => state.auth.authData);
  const { restaurantId: storeRestaurantId = 0 } = storedAuthData || {};

  const getTodayLoginActivityMutation = useMutation<
    ApiResponse<LoginActivity[]>,
    Error,
    { restaurantId: number }
  >({
    mutationFn: async ({ restaurantId }) => {
      const response = await getTodayLoginActivityApi(restaurantId);
      if (response.status !== 'success') {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      setLoginActivities(response.data || []);
    },
    onError: () => {
      setLoginActivities([]);
    },
  });

  const getRecentLoginActivityMutation = useMutation<
    ApiResponse<LoginActivity[]>,
    Error,
    { restaurantId: number }
  >({
    mutationFn: async ({ restaurantId }) => {
      const response = await getRecentLoginActivityApi(restaurantId);
      if (response.status !== 'success') {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      setLoginActivities(response.data || []);
    },
    onError: () => {
      setLoginActivities([]);
    },
  });

  const getLoginActivityByDateMutation = useMutation<
    ApiResponse<LoginActivity[]>,
    Error,
    { restaurantId: number; singleDate: string }
  >({
    mutationFn: async ({ restaurantId, singleDate }) => {
      const response = await getLoginActivityByDateApi(restaurantId, singleDate);
      if (response.status !== 'success') {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      setLoginActivities(response.data || []);
    },
    onError: () => {
      setLoginActivities([]);
    },
  });

  const getLoginActivityByDateRangeMutation = useMutation<
    ApiResponse<LoginActivity[]>,
    Error,
    { restaurantId: number; startDate: string; endDate: string }
  >({
    mutationFn: async ({ restaurantId, startDate, endDate }) => {
      const response = await getLoginActivityByDateRangeApi(restaurantId, startDate, endDate);
      if (response.status !== 'success') {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      setLoginActivities(response.data || []);
    },
    onError: () => {
      setLoginActivities([]);
    },
  });

  const getLoginActivityMutation = useMutation<
    ApiResponse<LoginActivity[]>,
    Error,
    {
      restaurantId: number;
      selectionType?: DateRangeSelectionType;
      singleDate?: string;
      startDate?: string;
      endDate?: string;
    }
  >({
    mutationFn: async (request) => {
      const response = await getLoginActivityApi(request);
      if (response.status !== 'success') {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      setLoginActivities(response.data || []);
    },
    onError: () => {
      setLoginActivities([]);
    },
  });

  const fetchTodayLoginActivities = useCallback(() => {
    getTodayLoginActivityMutation.mutate({ restaurantId: storeRestaurantId });
  }, [getTodayLoginActivityMutation, storeRestaurantId]);

  const fetchRecentLoginActivities = useCallback(() => {
    getRecentLoginActivityMutation.mutate({ restaurantId: storeRestaurantId });
  }, [getRecentLoginActivityMutation, storeRestaurantId]);

  const fetchLoginActivitiesByDate = useCallback(
    (singleDate: string) => {
      getLoginActivityByDateMutation.mutate({
        restaurantId: storeRestaurantId,
        singleDate,
      });
    },
    [getLoginActivityByDateMutation, storeRestaurantId],
  );

  const fetchLoginActivitiesByDateRange = useCallback(
    (startDate: string, endDate: string) => {
      getLoginActivityByDateRangeMutation.mutate({
        restaurantId: storeRestaurantId,
        startDate,
        endDate,
      });
    },
    [getLoginActivityByDateRangeMutation, storeRestaurantId],
  );

  const fetchLoginActivities = useCallback(
    (params?: {
      selectionType?: DateRangeSelectionType;
      singleDate?: string;
      startDate?: string;
      endDate?: string;
    }) => {
      getLoginActivityMutation.mutate({
        restaurantId: storeRestaurantId,
        selectionType: params?.selectionType,
        singleDate: params?.singleDate,
        startDate: params?.startDate,
        endDate: params?.endDate,
      });
    },
    [getLoginActivityMutation, storeRestaurantId],
  );

  const filteredLoginActivities = useMemo(() => {
    if (!searchTerm.trim()) {
      return loginActivities;
    }

    const lower = searchTerm.toLowerCase();

    return loginActivities.filter((activity) => {
      const fullName = `${activity.firstName || ''} ${activity.lastName || ''}`
        .trim()
        .toLowerCase();
      const username = activity.username?.toLowerCase() || '';
      const usernameAttempted = activity.usernameAttempted?.toLowerCase() || '';
      const status = activity.status?.toLowerCase() || '';
      const platform = activity.platform?.toLowerCase() || '';
      const deviceType = activity.deviceType?.toLowerCase() || '';
      const failureReason = activity.failureReason?.toLowerCase() || '';

      return (
        fullName.includes(lower) ||
        username.includes(lower) ||
        usernameAttempted.includes(lower) ||
        status.includes(lower) ||
        platform.includes(lower) ||
        deviceType.includes(lower) ||
        failureReason.includes(lower)
      );
    });
  }, [loginActivities, searchTerm]);

  return {
    storeRestaurantId,

    loginActivities: filteredLoginActivities,
    rawLoginActivities: loginActivities,

    getTodayLoginActivityState: getTodayLoginActivityMutation,
    getRecentLoginActivityState: getRecentLoginActivityMutation,
    getLoginActivityByDateState: getLoginActivityByDateMutation,
    getLoginActivityByDateRangeState: getLoginActivityByDateRangeMutation,
    getLoginActivityState: getLoginActivityMutation,

    fetchTodayLoginActivities,
    fetchRecentLoginActivities,
    fetchLoginActivitiesByDate,
    fetchLoginActivitiesByDateRange,
    fetchLoginActivities,

    searchTerm,
    setSearchTerm,
  };
};
