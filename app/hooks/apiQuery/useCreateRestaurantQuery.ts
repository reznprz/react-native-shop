import { useMutation } from '@tanstack/react-query';
import {
  createNewRestaurantApi,
  CreateRestaurantRequest,
  SuccessResponse,
} from 'app/api/services/authService';

export function useCreateRestaurantMutation(
  onSuccess?: (res: SuccessResponse) => void,
  onError?: (err: Error) => void,
) {
  return useMutation<SuccessResponse, Error, CreateRestaurantRequest>({
    mutationFn: async (payload: CreateRestaurantRequest) => {
      if (!payload.username || !payload.password)
        throw new Error('Username or password is not valid');
      const response: SuccessResponse = await createNewRestaurantApi(payload);
      return response;
    },
    onSuccess: (response) => {
      if (!response) {
        throw new Error('Login Failed');
      }
      onSuccess?.(response);
    },
    onError,
  });
}
