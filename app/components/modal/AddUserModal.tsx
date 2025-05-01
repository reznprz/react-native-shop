import React, { useState } from 'react';
import { View, Text, Pressable, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import ScrollableBaseModal from '../common/modal/ScrollableBaseModal';
import ErrorMessagePopUp from '../common/ErrorMessagePopUp';
import ModalActionsButton from '../common/modal/ModalActionsButton';
import { User, AccessLevel } from 'app/api/services/userService';

interface AddUserModalProps {
  visible: boolean;
  onRequestClose: () => void;
  onAddUser: (newUser: User) => void;
  /** optionally pass restaurantId if it should be pre-filled */
  restaurantId?: number;
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  visible,
  onRequestClose,
  onAddUser,
  restaurantId = 0,
}) => {
  const [accessLevel, setAccessLevel] = useState<AccessLevel>(AccessLevel.USER);
  const [passcode, setPasscode] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const resetForm = () => {
    setAccessLevel(AccessLevel.USER);
    setPasscode('');
    setFirstName('');
    setLastName('');
    setUsername('');
    setPhoneNumber('');
    setEmail('');
  };

  const validate = (): boolean => {
    if (!firstName.trim() || !lastName.trim()) {
      setError('First & last name are required');
      return false;
    }
    if (!username.trim()) {
      setError('Username is required');
      return false;
    }
    if (!passcode.trim() || passcode.length < 4) {
      setError('Passcode must be at least 4 digits');
      return false;
    }
    if (!/^\d+$/.test(passcode)) {
      setError('Passcode can contain only numbers');
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
  };

  const handleAddUser = () => {
    if (!validate()) return;
    setError('');

    const user: User = {
      id: 0, // back-end will set real id
      restaurantId,
      accessLevel,
      passcode,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: username.trim(),
      password: passcode, // change if you collect a real password
      phoneNumber: phoneNumber.trim(),
      email: email.trim(),
    };

    onAddUser(user);
    resetForm();
    onRequestClose();
  };

  /* ───────────── UI sections ───────── */
  const header = (
    <View className="flex-row items-center justify-between">
      <Text className="text-white text-lg font-semibold">Add New User</Text>
      <Pressable onPress={onRequestClose} className="p-1">
        <Text className="text-white text-xl">✕</Text>
      </Pressable>
    </View>
  );

  const accessPicker = (
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
                 ${active ? 'bg-blue-600' : ''}
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
  );

  const renderInput = (
    label: string,
    value: string,
    setter: (t: string) => void,
    options?: {
      placeholder?: string;
      keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
      secure?: boolean;
      maxLength?: number;
    },
  ) => (
    <View className="mb-3">
      <Text className="mb-1 text-lg text-gray-800">{label}</Text>
      <TextInput
        className="bg-gray-100 rounded-md py-3 px-3 border border-gray-300"
        value={value}
        onChangeText={setter}
        placeholder={options?.placeholder}
        keyboardType={options?.keyboardType ?? 'default'}
        secureTextEntry={options?.secure}
        maxLength={options?.maxLength}
        autoCapitalize="none"
      />
    </View>
  );

  const body = (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1"
    >
      {accessPicker}

      {renderInput('Passcode', passcode, setPasscode, {
        placeholder: '4-6 digit pin',
        keyboardType: 'numeric',
        maxLength: 6,
        secure: true,
      })}
      {renderInput('First Name', firstName, setFirstName)}
      {renderInput('Last Name', lastName, setLastName)}
      {renderInput('Username', username, setUsername)}
      {renderInput('Phone Number', phoneNumber, setPhoneNumber, {
        placeholder: '+1 555 123 4567',
        keyboardType: 'phone-pad',
      })}
      {renderInput('E-mail', email, setEmail, {
        placeholder: 'me@example.com',
        keyboardType: 'email-address',
      })}

      {error && <ErrorMessagePopUp errorMessage={error} onClose={() => setError('')} />}
    </KeyboardAvoidingView>
  );

  const footer = (
    <ModalActionsButton
      cancelProps={{ title: 'Cancel', onPress: onRequestClose }}
      actionProps={{ title: 'Save User', onPress: handleAddUser }}
    />
  );

  return (
    <ScrollableBaseModal
      visible={visible}
      onRequestClose={onRequestClose}
      header={header}
      body={body}
      footer={footer}
    />
  );
};

export default AddUserModal;
