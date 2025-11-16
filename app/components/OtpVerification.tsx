import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ErrorMessagePopUp from './common/ErrorMessagePopUp';
import { useTheme } from 'app/hooks/useTheme';

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
  const theme = useTheme();

  const [otpCode, setOtpCode] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(ttlSeconds);
  const [expired, setExpired] = useState(false);
  const [method, setMethod] = useState<'sms' | 'email' | null>(null);

  useEffect(() => {
    if (secondsLeft <= 0) return setExpired(true);
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  const Spinner = () => <Ionicons name="refresh-circle" size={22} color={theme.secondary} />;

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
      <View
        className="rounded-xl shadow-md p-5 mt-4 items-center space-y-3"
        style={{ backgroundColor: theme.successBg }}
      >
        <Ionicons name="checkmark-circle-outline" size={68} color={theme.tertiary} />
        <Text className="font-semibold text-lg" style={{ color: theme.textSecondary }}>
          OTP Verified Successfully
        </Text>
        <Text className="text-sm" style={{ color: theme.textTertiary }}>
          You may now proceed to add the user.
        </Text>
        {validateError && (
          <ErrorMessagePopUp errorMessage={validateError} onClose={() => setValidateError('')} />
        )}
      </View>
    );
  }

  return (
    <View
      className="rounded-xl shadow-md p-5 space-y-2"
      style={{ backgroundColor: theme.secondaryBg }}
    >
      <Text
        className="text-2xl font-bold text-center tracking-wide mb-2"
        style={{ color: theme.secondary }}
      >
        Verify Your Identity
      </Text>

      {/* Channel choices */}
      <View className="space-y-3 gap-2">
        {(['sms', 'email'] as const).map((m) => {
          const active = method === m;
          return (
            <Pressable
              key={m}
              onPress={() => selectMethod(m)}
              disabled={isSending}
              className="flex-row items-center justify-between border p-4 rounded-lg"
              style={{
                borderColor: active ? theme.secondary : '#E5E7EB',
                backgroundColor: active ? theme.quaternary : theme.secondaryBg,
              }}
            >
              <View className="flex-row items-center space-x-3">
                <Ionicons
                  name={m === 'sms' ? 'call-outline' : 'mail-outline'}
                  size={20}
                  color={theme.secondary}
                />
                <Text style={{ color: theme.textSecondary, fontSize: 14 }}>
                  {m === 'sms' ? maskPhone(phone) : maskEmail(email)}
                </Text>
              </View>
              {isSending && method === m ? (
                <Spinner />
              ) : (
                <Text className="font-medium" style={{ color: theme.secondary }}>
                  Send Code
                </Text>
              )}
            </Pressable>
          );
        })}
        {sendError && (
          <Text className="text-center text-sm mt-1" style={{ color: '#EF4444' }}>
            {sendError}
          </Text>
        )}
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
            placeholderTextColor={theme.textTertiary}
            className="text-center text-lg p-4 border rounded-lg tracking-widest"
            style={{
              borderColor: '#D1D5DB',
              color: theme.textSecondary,
              backgroundColor: theme.primaryBg,
            }}
          />

          {!expired ? (
            <Text className="text-sm text-center mt-4 mb-4" style={{ color: theme.textTertiary }}>
              Code sent to{' '}
              <Text className="font-medium" style={{ color: theme.textSecondary }}>
                {masked}
              </Text>
              . Expires in{' '}
              <Text className="font-semibold" style={{ color: theme.textSecondary }}>
                {secondsLeft}s
              </Text>
            </Text>
          ) : (
            <Text className="text-sm text-center mt-4 mb-4" style={{ color: '#EF4444' }}>
              Code expired. Please resend.
            </Text>
          )}

          {verifyError && (
            <Text className="text-center text-sm mt-2 mb-2" style={{ color: '#EF4444' }}>
              {verifyError}
            </Text>
          )}

          <View className="flex-row justify-between items-center">
            <Pressable
              onPress={() => selectMethod(method)}
              disabled={isSending}
              className="px-4 py-2 rounded-lg border"
              style={{
                borderColor: isSending ? '#D1D5DB' : theme.secondary,
              }}
            >
              {isSending ? (
                <Spinner />
              ) : (
                <Text className="font-medium" style={{ color: theme.secondary }}>
                  Resend
                </Text>
              )}
            </Pressable>

            <Pressable
              onPress={handleVerify}
              disabled={expired || otpCode.length < 6 || isVerifying}
              className="px-5 py-2 rounded-lg"
              style={{
                backgroundColor:
                  expired || otpCode.length < 6 || isVerifying ? theme.quaternary : theme.buttonBg,
              }}
            >
              {isVerifying ? (
                <Spinner />
              ) : (
                <Text className="font-medium" style={{ color: theme.textPrimary }}>
                  Verify
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

export default OtpVerification;
