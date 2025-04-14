import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { AuthResponse, Credentials, login } from 'app/api/services/authService';
import { setAuthData } from 'app/redux/authSlice';

export function useLoginMutation() {
  const dispatch = useDispatch();

  /**
   * Wrap the `login` API call in a mutation:
   */
  return useMutation<AuthResponse, unknown, Credentials>({
    mutationKey: ['login'], // optional, but helpful to organize or reset the mutation
    mutationFn: (credentials: Credentials) => login(credentials),

    onSuccess: (data: AuthResponse) => {
      // Optionally store tokens or user info in Redux state
      dispatch(setAuthData(data));
    },

    onError: (error) => {
      console.error('Login failed:', error);
      // You can handle error messages or logging here as well
    },
  });
}
