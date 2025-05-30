import { useMutation } from '@tanstack/react-query';
import { AuthResponse, Credentials, login } from 'app/api/services/authService';

export function useLoginMutation(
  onSuccess?: (res: AuthResponse) => void,
  onError?: (err: Error) => void,
) {
  return useMutation<AuthResponse, Error, Credentials>({
    mutationFn: async (credentials: Credentials) => {
      if (!credentials.username || !credentials.password)
        throw new Error('Username or password is not valid');
      const response: AuthResponse = await login(credentials);
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
