import { useCallback, useState } from 'react';
import { useLoginMutation } from './apiQuery/useLoginQuery';
import { ButtonState } from 'app/components/common/button/LoadingButton';
import { navigate, push } from 'app/navigation/navigationService';
import { useFoodMenuActions } from './apiQuery/useFoodMenuAction';
import { useDispatch } from 'react-redux';
import { setAuthData } from 'app/redux/authSlice';
import { Credentials } from 'app/api/services/authService';
import { ScreenNames } from 'app/types/navigation';
import { setThemeVariant } from 'app/redux/themeSlice';

interface UseLoginResult {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  remember: boolean;
  setRemember: React.Dispatch<React.SetStateAction<boolean>>;
  validationError: string | null;
  handleLogin: () => Promise<void>;
  handleLoginSuccess: () => void;
  loginState: ButtonState;
}

export function useLogin(): UseLoginResult {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const dispatch = useDispatch();

  const {
    mutate: loginMutate,
    error: loginError,
    data: loginRes,
    isPending: isLoading,
    isError,
    isSuccess,
    reset: resetLoginState,
  } = useLoginMutation();

  const { loadFoodMenu } = useFoodMenuActions();

  const handleLogin = async () => {
    if (!username || !password) {
      setValidationError('Please fill out both fields.');
      return;
    }
    setValidationError(null);

    // Trigger the mutation
    const creds: Credentials = { username, password };
    loginMutate(creds);
  };

  const handleLoginSuccess = useCallback(() => {
    if (loginRes) {
      dispatch(setAuthData(loginRes));
      dispatch(setThemeVariant(loginRes.themeVariant));
    }
  }, [loginRes, dispatch]);

  const loginState: ButtonState = isLoading
    ? { status: 'loading' }
    : isError
      ? { status: 'error', message: String(loginError), reset: resetLoginState }
      : isSuccess
        ? { status: 'success', reset: resetLoginState }
        : { status: 'idle' };

  return {
    username,
    remember,
    password,
    validationError,
    loginState,
    setUsername,
    setPassword,
    setRemember,
    handleLogin,
    handleLoginSuccess,
  };
}
