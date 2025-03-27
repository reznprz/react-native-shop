import { useMemo, useState } from 'react';
import { useLoginMutation } from './apiQuery/useLoginQuery';
import { Credentials } from 'app/api/services/authService';
import { ButtonState } from 'app/components/common/button/LoadingButton';
import { navigate } from 'app/navigation/navigationService';
import { useFood } from './useFood';

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

  const {
    mutate: loginMutate,
    error: apiError,
    status: loginApiState,
    reset: resetLoginState,
  } = useLoginMutation();

  const { refetch: fetchFood } = useFood();

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

  const handleLoginSuccess = () => {
    fetchFood();
    navigate('MainTabs', {
      screen: 'Home',
    });
  };

  const loginState: ButtonState = useMemo(() => {
    if (loginApiState === 'pending') {
      return { status: 'loading' };
    }
    if (loginApiState === 'error') {
      return {
        status: 'error',
        message: String(apiError) || 'An error occurred',
        reset: () => resetLoginState(),
      };
    }
    if (loginApiState === 'success') {
      return { status: 'success', reset: () => resetLoginState() };
    }
    return { status: 'idle' };
  }, [loginApiState]);

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
