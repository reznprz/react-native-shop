import { useQuery, UseQueryResult, UseQueryOptions } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { fetchAllTablesWithStatusApi, RestaurantTable } from 'app/api/services/tableService';
import { ApiResponse } from 'app/api/handlers';
import { setTables } from 'app/redux/tableSlice';

// Type for the query key
type TablesQueryKey = ['restaurantTables', number];

export const useRestaurantTablesQuery = (
  restaurantId: number,
  options?: UseQueryOptions<
    ApiResponse<RestaurantTable[]>, // TData
    Error, // TError
    ApiResponse<RestaurantTable[]>, // TQueryFnData -> TData (same here)
    TablesQueryKey // TQueryKey
  >,
): UseQueryResult<ApiResponse<RestaurantTable[]>, Error> => {
  const dispatch = useDispatch();

  return useQuery<
    ApiResponse<RestaurantTable[]>,
    Error,
    ApiResponse<RestaurantTable[]>,
    TablesQueryKey
  >({
    // base config
    queryKey: ['restaurantTables', restaurantId],
    queryFn: async () => {
      if (!restaurantId) {
        throw new Error('Restaurant is not valid');
      }

      const response = await fetchAllTablesWithStatusApi(restaurantId);

      // bubble up server-side error
      if (response.status !== 'success') {
        throw new Error(response.message);
      }

      // ALWAYS push to Redux whenever we have fresh data
      if (response.data) {
        dispatch(setTables(response.data));
      }

      return response;
    },
    enabled: !!restaurantId,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 min; React Query caches for you
    // allow caller to override/extend behavior
    ...(options ?? {}),
  });
};
