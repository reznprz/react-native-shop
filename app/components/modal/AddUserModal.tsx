import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import ScrollableBaseModal from '../common/modal/ScrollableBaseModal';
import ErrorMessagePopUp from '../common/ErrorMessagePopUp';
import ModalActionsButton from '../common/modal/ModalActionsButton';
import { Role, User } from 'app/api/services/userService';
import ConditionalWrapper from '../common/ConditionalWrapper';
import InputField from '../common/InputField';
import OtpVerification from '../OtpVerification';
import {
  OtpRequest,
  OtpRequestResponse,
  OtpValidateRequest,
  OtpValidateResponse,
} from 'app/api/services/authService';
import { UseMutationResult } from '@tanstack/react-query/build/legacy';
import { useTheme } from 'app/hooks/useTheme';

interface AddUserModalProps {
  visible: boolean;
  primaryEmail: string;
  primaryPhone: string;
  onRequestClose: () => void;
  onAddUser: (newUser: User) => void;

  // otp
  sendOtpState: UseMutationResult<OtpRequestResponse, unknown, OtpRequest>;
  verifyOtpState: UseMutationResult<OtpValidateResponse, unknown, OtpValidateRequest>;
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  visible,
  primaryEmail,
  primaryPhone,
  onRequestClose,
  onAddUser,
  sendOtpState,
  verifyOtpState,
}) => {
  const theme = useTheme();

  // form state
  const [accessLevel, setAccessLevel] = useState<Role>(Role.STAFF);
  const [passcode, setPasscode] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [localOtpVerified, setLocalOtpVerified] = useState(false);
  const [verifyApiError, setVerifyApiError] = useState('');

  // DESCTRUCTURE only the `reset` functions from each mutation:
  const { reset: sendOtpReset } = sendOtpState;
  const { reset: verifyOtpReset } = verifyOtpState;

  const resetForm = () => {
    setAccessLevel(Role.STAFF);
    setPasscode('');
    setFirstName('');
    setLastName('');
    setUsername('');
    setPhoneNumber('');
    setEmail('');
    setError('');
    setVerifyApiError('');
    setLocalOtpVerified(false);
    setShowOtp(false);
  };

  useEffect(() => {
    if (localOtpVerified) {
      verifyOtpReset();
      sendOtpReset();
    }
  }, [localOtpVerified, verifyOtpReset, sendOtpReset]);

  const validate = useMemo(() => {
    if (!firstName.trim() || !lastName.trim()) return false;
    if (accessLevel === Role.ADMIN && !username.trim()) return false;
    if (!passcode.trim() || passcode.length < 4) return false;
    if (!/^\+?\d{7,15}$/.test(phoneNumber)) return false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
    return true;
  }, [firstName, lastName, username, passcode, phoneNumber, email, accessLevel]);

  // otp actions
  const sendOtp = (method: 'sms' | 'email') => {
    const target = method === 'sms' ? primaryPhone.trim() : primaryEmail.trim();
    sendOtpState.mutate({ target, channel: method });
  };

  const verifyOtp = (code: string, method: 'sms' | 'email') => {
    const target = method === 'sms' ? primaryPhone.trim() : primaryEmail.trim();
    verifyOtpState.mutate(
      { target, code },
      {
        onSuccess: ({ verified }) => {
          if (!verified) setVerifyApiError('Incorrect code');
          else setLocalOtpVerified(true);
        },
      },
    );
  };

  // final action
  const handleAddUser = () => {
    if (!validate || !localOtpVerified) return;

    const newUser: User = {
      id: 0,
      restaurantId: 0,
      accessLevel,
      passcode,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: username.trim(),
      password: passcode,
      phoneNumber: phoneNumber.trim(),
      email: email.trim(),
    };

    onAddUser(newUser);
    resetForm();
    onRequestClose();
  };

  const renderFooter = useCallback(() => {
    // phase 1 – still on details form
    if (!showOtp) {
      return (
        <ModalActionsButton
          cancelProps={{
            title: 'Cancel',
            onPress: () => {
              resetForm();
              onRequestClose();
            },
          }}
          actionProps={{
            title: 'Send Verification Code',
            disable: !validate,
            onPress: () => setShowOtp(true),
          }}
        />
      );
    }

    // phase 2 – OTP screen visible but not yet verified
    if (!localOtpVerified) {
      return (
        <ModalActionsButton
          cancelProps={{
            title: 'Back',
            onPress: () => {
              setShowOtp(false);
            },
          }}
          actionProps={{
            title: 'Add User',
            onPress: handleAddUser,
            disable: !localOtpVerified,
          }}
        />
      );
    }

    // phase 3 – OTP verified
    return (
      <ModalActionsButton
        cancelProps={{
          title: 'Cancel',
          onPress: () => {
            resetForm();
            onRequestClose();
          },
        }}
        actionProps={{ title: 'Add User', onPress: handleAddUser }}
      />
    );
  }, [resetForm, onRequestClose, handleAddUser, showOtp, validate, localOtpVerified]);

  return (
    <ScrollableBaseModal
      visible={visible}
      onRequestClose={onRequestClose}
      header={
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-semibold" style={{ color: theme.headerText }}>
            Add New User
          </Text>
          <Pressable onPress={onRequestClose} className="p-1">
            <Text style={{ color: theme.headerText, fontSize: 20 }}>✕</Text>
          </Pressable>
        </View>
      }
      body={
        <ConditionalWrapper>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1"
          >
            {showOtp ? (
              <OtpVerification
                phone={primaryPhone}
                email={primaryEmail}
                localOtpVerified={localOtpVerified}
                isSending={sendOtpState.isPending}
                sendError={(sendOtpState.error as Error | undefined)?.message}
                isVerifying={verifyOtpState.isPending}
                verifyError={verifyApiError || (verifyOtpState.error as Error | undefined)?.message}
                validateError={error}
                setValidateError={setError}
                onResend={sendOtp}
                onVerify={verifyOtp}
              />
            ) : (
              <View className="px-2">
                {error && <ErrorMessagePopUp errorMessage={error} onClose={() => setError('')} />}

                {/* Access level toggle */}
                <View className="mb-3">
                  <Text className="mb-1 text-lg font-medium" style={{ color: theme.textSecondary }}>
                    Access&nbsp;Level
                  </Text>

                  <View
                    className="flex-row rounded-lg overflow-hidden"
                    style={{
                      backgroundColor: theme.primaryBg,
                      borderWidth: 1,
                      borderColor: theme.secondaryBtnBg,
                    }}
                  >
                    {[Role.ADMIN, Role.STAFF].map((lvl) => {
                      const active = lvl === accessLevel;
                      return (
                        <Pressable
                          key={lvl}
                          onPress={() => setAccessLevel(lvl)}
                          className="flex-1 py-3 items-center"
                          style={{
                            backgroundColor: active ? theme.buttonBg : 'transparent',
                          }}
                        >
                          <Text
                            style={{
                              fontWeight: '500',
                              color: active ? theme.textPrimary : theme.textSecondary,
                            }}
                          >
                            {lvl === Role.ADMIN ? 'Admin' : 'Staff'}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                {/* form fields */}
                <InputField label="First Name" value={firstName} onChange={setFirstName} />
                <InputField label="Last Name" value={lastName} onChange={setLastName} />
                {accessLevel === Role.ADMIN && (
                  <InputField label="Username" value={username} onChange={setUsername} />
                )}
                <InputField
                  label="Phone Number"
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  placeholder="+1 555 123 4567"
                  keyboardType="phone-pad"
                  maxLength={15}
                />
                <InputField
                  label="E-mail"
                  value={email}
                  onChange={setEmail}
                  placeholder="me@example.com"
                  keyboardType="email-address"
                />
                <InputField
                  label="Password"
                  value={passcode}
                  onChange={setPasscode}
                  secureTextEntry
                  maxLength={6}
                  keyboardType="numeric"
                />
              </View>
            )}
          </KeyboardAvoidingView>
        </ConditionalWrapper>
      }
      footer={renderFooter()}
    />
  );
};

export default AddUserModal;
