import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import ScrollableBaseModal from '../common/modal/ScrollableBaseModal';
import ErrorMessagePopUp from '../common/ErrorMessagePopUp';
import ModalActionsButton from '../common/modal/ModalActionsButton';
import { User, AccessLevel } from 'app/api/services/userService';
import ConditionalWrapper from '../common/ConditionalWrapper';
import InputField from '../common/InputField';

interface AddUserModalProps {
  visible: boolean;
  onRequestClose: () => void;
  onAddUser: (newUser: User) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ visible, onRequestClose, onAddUser }) => {
  const [accessLevel, setAccessLevel] = useState<AccessLevel>(AccessLevel.USER);
  const [passcode, setPasscode] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const resetForm = useCallback(() => {
    setAccessLevel(AccessLevel.USER);
    setPasscode('');
    setFirstName('');
    setLastName('');
    setUsername('');
    setPhoneNumber('');
    setEmail('');
    setError('');
  }, []);

  const validate = useCallback((): boolean => {
    if (!firstName.trim() || !lastName.trim()) {
      setError('First & last name are required');
      return false;
    }
    if (accessLevel === AccessLevel.ADMIN && !username.trim()) {
      setError('Username is required for admins');
      return false;
    }
    if (!passcode.trim() || passcode.length < 4) {
      setError('Passcode must be at least 4 digits');
      return false;
    }
    if (!/^\+?\d{7,15}$/.test(phoneNumber)) {
      setError('Enter a valid phone number');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Enter a valid e-mail');
      return false;
    }
    return true;
  }, [firstName, lastName, username, passcode, phoneNumber, email, accessLevel]);

  const handleAddUser = useCallback(() => {
    if (!validate()) return;

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

  const header = useMemo(
    () => (
      <View className="flex-row items-center justify-between">
        <Text className="text-white text-lg font-semibold">Add New User</Text>
        <Pressable onPress={onRequestClose} className="p-1">
          <Text className="text-white text-xl">✕</Text>
        </Pressable>
      </View>
    ),
    [onRequestClose],
  );

  const accessPicker = useMemo(
    () => (
      <View className="mb-3">
        <Text className="mb-1 text-lg text-gray-800">Access&nbsp;Level</Text>
        <View className="flex-row bg-gray-100 rounded-lg overflow-hidden">
          {[AccessLevel.ADMIN, AccessLevel.USER].map((lvl) => {
            const active = lvl === accessLevel;
            return (
              <Pressable
                key={lvl}
                onPress={() => setAccessLevel(lvl)}
                className={`flex-1 py-3 items-center
                 ${active ? 'bg-deepTeal' : ''}
              `}
              >
                <Text className={`font-medium ${active ? 'text-white' : 'text-gray-700'}`}>
                  {lvl === AccessLevel.ADMIN ? 'Admin' : 'Staff'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    ),
    [accessLevel],
  );

  return (
    <ScrollableBaseModal
      visible={visible}
      onRequestClose={onRequestClose}
      header={header}
      body={
        <ConditionalWrapper>
          <View className="flex-1">
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              className="flex-1"
            >
              {accessPicker}
              <InputField label="First Name" value={firstName} onChange={setFirstName} />
              <InputField label="Last Name" value={lastName} onChange={setLastName} />
              {accessLevel === AccessLevel.ADMIN && (
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
              {error ? (
                <ErrorMessagePopUp errorMessage={error} onClose={() => setError('')} />
              ) : null}
            </KeyboardAvoidingView>
          </View>
        </ConditionalWrapper>
      }
      footer={
        <ModalActionsButton
          cancelProps={{ title: 'Cancel', onPress: onRequestClose }}
          actionProps={{ title: 'Save User', onPress: handleAddUser }}
        />
      }
    />
  );
};

export default AddUserModal;
