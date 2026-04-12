import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  useWindowDimensions,
} from 'react-native';
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
  const { width } = useWindowDimensions();

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1100;
  const isLargeScreen = width >= 1100;

  const contentMaxWidth = isLargeScreen ? 980 : isTablet ? 760 : '100%';
  const formGap = isMobile ? 0 : 12;

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

  const { reset: sendOtpReset } = sendOtpState;
  const { reset: verifyOtpReset } = verifyOtpState;

  const resetForm = useCallback(() => {
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
  }, []);

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

  const handleAddUser = useCallback(() => {
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
  }, [
    validate,
    localOtpVerified,
    accessLevel,
    passcode,
    firstName,
    lastName,
    username,
    phoneNumber,
    email,
    onAddUser,
    resetForm,
    onRequestClose,
  ]);

  const renderFooter = useCallback(() => {
    const footerInnerStyle = {
      width: '100%' as const,
      maxWidth: contentMaxWidth as number | '100%',
      alignSelf: 'center' as const,
    };

    if (!showOtp) {
      return (
        <View style={footerInnerStyle}>
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
        </View>
      );
    }

    if (!localOtpVerified) {
      return (
        <View style={footerInnerStyle}>
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
        </View>
      );
    }

    return (
      <View style={footerInnerStyle}>
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
      </View>
    );
  }, [
    contentMaxWidth,
    resetForm,
    onRequestClose,
    handleAddUser,
    showOtp,
    validate,
    localOtpVerified,
  ]);

  const renderField = (
    label: string,
    value: string,
    onChange: (text: string) => void,
    extra?: Partial<React.ComponentProps<typeof InputField>>,
  ) => (
    <View
      style={{
        width: isMobile ? '100%' : '48.8%',
        marginBottom: isMobile ? 10 : 2,
      }}
    >
      <InputField label={label} value={value} onChange={onChange} {...extra} />
    </View>
  );

  const innerContainerStyle = {
    width: '100%' as const,
    maxWidth: contentMaxWidth as number | '100%',
    alignSelf: 'center' as const,
  };

  return (
    <ScrollableBaseModal
      visible={visible}
      onRequestClose={onRequestClose}
      containerStyle={{
        width: '100%',
        maxWidth: contentMaxWidth as any,
        alignSelf: 'center',
      }}
      header={
        <View style={innerContainerStyle}>
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold" style={{ color: theme.headerText }}>
              Add New User
            </Text>
            <Pressable
              onPress={() => {
                resetForm();
                onRequestClose();
              }}
              className="p-1"
            >
              <Text style={{ color: theme.headerText, fontSize: 20 }}>✕</Text>
            </Pressable>
          </View>
        </View>
      }
      body={
        <View style={innerContainerStyle}>
          <ConditionalWrapper>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={{ flex: 1 }}
            >
              {showOtp ? (
                <View
                  style={{
                    width: '100%',
                    maxWidth: isLargeScreen ? 560 : '100%',
                    alignSelf: 'center',
                    paddingHorizontal: isMobile ? 4 : 8,
                  }}
                >
                  <OtpVerification
                    phone={primaryPhone}
                    email={primaryEmail}
                    localOtpVerified={localOtpVerified}
                    isSending={sendOtpState.isPending}
                    sendError={(sendOtpState.error as Error | undefined)?.message}
                    isVerifying={verifyOtpState.isPending}
                    verifyError={
                      verifyApiError || (verifyOtpState.error as Error | undefined)?.message
                    }
                    validateError={error}
                    setValidateError={setError}
                    onResend={sendOtp}
                    onVerify={verifyOtp}
                  />
                </View>
              ) : (
                <View
                  style={{
                    paddingHorizontal: isMobile ? 4 : 8,
                    paddingBottom: isMobile ? 6 : 12,
                    width: '100%',
                    alignSelf: 'center',
                  }}
                >
                  {error && <ErrorMessagePopUp errorMessage={error} onClose={() => setError('')} />}

                  <View style={{ marginBottom: 14 }}>
                    <Text
                      className="mb-1 text-lg font-medium"
                      style={{ color: theme.textSecondary }}
                    >
                      Access Level
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        borderRadius: 12,
                        overflow: 'hidden',
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
                            style={{
                              flex: 1,
                              minHeight: isMobile ? 44 : 48,
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: active ? theme.buttonBg : 'transparent',
                              paddingHorizontal: 12,
                            }}
                          >
                            <Text
                              style={{
                                fontWeight: '500',
                                color: active ? theme.textPrimary : theme.textSecondary,
                                fontSize: isMobile ? 14 : 15,
                              }}
                            >
                              {lvl === Role.ADMIN ? 'Admin' : 'Staff'}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: isMobile ? 'column' : 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      columnGap: formGap,
                    }}
                  >
                    {renderField('First Name', firstName, setFirstName)}
                    {renderField('Last Name', lastName, setLastName)}

                    {accessLevel === Role.ADMIN && renderField('Username', username, setUsername)}

                    {renderField('Phone Number', phoneNumber, setPhoneNumber, {
                      placeholder: '+1 555 123 4567',
                      keyboardType: 'phone-pad',
                      maxLength: 15,
                    })}

                    {renderField('E-mail', email, setEmail, {
                      placeholder: 'me@example.com',
                      keyboardType: 'email-address',
                    })}

                    {renderField('Password', passcode, setPasscode, {
                      secureTextEntry: true,
                      maxLength: 6,
                      keyboardType: 'numeric',
                    })}
                  </View>
                </View>
              )}
            </KeyboardAvoidingView>
          </ConditionalWrapper>
        </View>
      }
      footer={renderFooter()}
    />
  );
};

export default AddUserModal;
