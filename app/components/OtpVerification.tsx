import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ErrorMessagePopUp from './common/ErrorMessagePopUp';

interface Props {
  onVerify: (code: string, method: 'sms' | 'email') => void;
  onResend: (method: 'sms' | 'email') => void;
  setValidateError: (msg: string) => void;
  validateError: string;
  phone: string;
  email: string;
  localOtpVerified: boolean;
  isSending: boolean;
  sendError?: string;
  isVerifying: boolean;
  verifyError?: string;
  ttlSeconds?: number;
}

const OtpVerification: React.FC<Props> = ({
  onVerify,
  onResend,
  setValidateError,
  validateError,
  localOtpVerified,
  phone,
  email,
  isSending,
  sendError,
  isVerifying,
  verifyError,
  ttlSeconds = 180,
}) => {
  const [otpCode, setOtpCode] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(ttlSeconds);
  const [expired, setExpired] = useState(false);
  const [method, setMethod] = useState<'sms' | 'email' | null>(null);

  useEffect(() => {
    if (secondsLeft <= 0) return setExpired(true);
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  const Spinner = () => (
    <Ionicons name="refresh-circle" size={22} color="#2563eb" className="animate-spin" />
  );

  const selectMethod = (m: 'sms' | 'email') => {
    setMethod(m);
    setExpired(false);
    setSecondsLeft(ttlSeconds);
    setOtpCode('');
    onResend(m);
  };

  const handleVerify = () => {
    if (!expired && otpCode.length === 6 && method) onVerify(otpCode, method);
  };

  const maskPhone = (v: string) => v.replace(/^(\+?)(\d{0,3})\d*(\d{3})$/, '$1*******$3');
  const maskEmail = (v: string) => {
    const [u, d] = v.split('@');
    const s = u.slice(0, 2);
    const e = u.length > 5 ? u.slice(-2) : '';
    return `${s}${'*'.repeat(u.length - s.length - e.length)}${e}@${d}`;
  };

  const masked = method === 'sms' ? maskPhone(phone) : maskEmail(email);

  if (localOtpVerified) {
    return (
      <View className="bg-white rounded-xl shadow-md p-20 mt-4 items-center space-y-3">
        <Ionicons name="checkmark-circle-outline" size={68} color="green" />
        <Text className="text-green-600 font-semibold text-lg">OTP Verified Successfully</Text>
        <Text className="text-gray-600 text-sm">You may now proceed to add the user.</Text>
        {validateError && (
          <ErrorMessagePopUp errorMessage={validateError} onClose={() => setValidateError('')} />
        )}
      </View>
    );
  }

  return (
    <View className="bg-white rounded-xl shadow-md p-5 space-y-2">
      <Text className="text-2xl font-bold text-blue-900 text-center tracking-wide mb-2">
        Verify Your Identity
      </Text>

      {/* Channel choices */}
      <View className="space-y-3 gap-2">
        {(['sms', 'email'] as const).map((m) => (
          <Pressable
            key={m}
            onPress={() => selectMethod(m)}
            disabled={isSending}
            className={`flex-row items-center justify-between border p-4 rounded-lg ${
              method === m ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <View className="flex-row items-center space-x-3">
              <Ionicons
                name={m === 'sms' ? 'call-outline' : 'mail-outline'}
                size={20}
                color="#2563eb"
              />
              <Text className="text-gray-800 text-sm">
                {m === 'sms' ? maskPhone(phone) : maskEmail(email)}
              </Text>
            </View>
            {isSending && method === m ? (
              <Spinner />
            ) : (
              <Text className="text-blue-600 font-medium">Send Code</Text>
            )}
          </Pressable>
        ))}
        {sendError && <Text className="text-red-500 text-center text-sm mt-1">{sendError}</Text>}
      </View>

      {/* OTP input */}
      {method && (
        <View className="space-y-4 pt-2">
          <TextInput
            value={otpCode}
            onChangeText={setOtpCode}
            keyboardType="number-pad"
            maxLength={6}
            placeholder="Enter 6-digit code"
            className="text-center text-lg p-4 border border-gray-300 rounded-lg tracking-widest"
          />

          {!expired ? (
            <Text className="text-sm text-gray-500 text-center mt-4 mb-4">
              Code sent to <Text className="font-medium text-gray-700">{masked}</Text>. Expires in{' '}
              <Text className="text-gray-800 font-semibold">{secondsLeft}s</Text>
            </Text>
          ) : (
            <Text className="text-sm text-red-500 text-center mt-4 mb-4">
              Code expired. Please resend.
            </Text>
          )}

          {verifyError && (
            <Text className="text-red-500 text-center text-sm mt-2 mb-2">{verifyError}</Text>
          )}

          <View className="flex-row justify-between items-center">
            <Pressable
              onPress={() => selectMethod(method)}
              disabled={isSending}
              className={`border px-4 py-2 rounded-lg ${
                isSending ? 'border-gray-300' : 'border-blue-500'
              }`}
            >
              {isSending ? <Spinner /> : <Text className="text-blue-600 font-medium">Resend</Text>}
            </Pressable>

            <Pressable
              onPress={handleVerify}
              disabled={expired || otpCode.length < 6 || isVerifying}
              className={`px-5 py-2 rounded-lg ${
                expired || otpCode.length < 6 || isVerifying ? 'bg-paleSkyBlue' : 'bg-deepTeal'
              }`}
            >
              {isVerifying ? <Spinner /> : <Text className="text-white font-medium">Verify</Text>}
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

export default OtpVerification;
