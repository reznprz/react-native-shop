import { useMutation } from '@tanstack/react-query';
import {
  OtpRequest,
  OtpRequestResponse,
  OtpValidateRequest,
  OtpValidateResponse,
  requesOtpApi,
  validateOtpApi,
} from 'app/api/services/authService';

export const useOtpMutations = () => {
  const requestOtpMutation = useMutation<OtpRequestResponse, unknown, OtpRequest>({
    mutationFn: requesOtpApi,
  });

  const validateOtpMutation = useMutation<OtpValidateResponse, unknown, OtpValidateRequest>({
    mutationFn: validateOtpApi,
  });

  return {
    requestOtpMutation,
    validateOtpMutation,
  };
};
