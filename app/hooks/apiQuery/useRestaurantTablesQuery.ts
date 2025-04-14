import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchAllTablesApi, RestaurantTable } from 'app/api/services/tableService';
import { ApiResponse } from 'app/api/handlers';

/**
 * Fetch all tables for the given restaurant.
 * Wrapped in React‑Query for caching, refetching and stale‑while‑revalidate.
 */
export const useRestaurantTablesQuery = (
  restaurantId: number,
): UseQueryResult<ApiResponse<RestaurantTable[]>, Error> =>
  useQuery<ApiResponse<RestaurantTable[]>, Error>({
    queryKey: ['restaurantTables', restaurantId],
    // keep the query function pure and parameterised only by the queryKey
    queryFn: () => {
      if (!restaurantId) throw new Error('Restaurant is not valid');
      return fetchAllTablesApi(restaurantId);
    },
    enabled: !!restaurantId, // don’t run until we have a valid id
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 min cache window
    select: (response) => {
      // bubble‑up server errors early
      if (response.status !== 'success') throw new Error(response.message);
      return response;
    },
  });
