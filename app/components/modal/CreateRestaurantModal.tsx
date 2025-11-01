import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
  StyleSheet,
  Pressable,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { BaseBottomSheetModal } from '../common/modal/BaseBottomSheetModal';
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomIcon from '../common/CustomIcon';
import { CreateRestaurantRequest } from 'app/api/services/authService';
import LoadingButton, { ButtonState } from '../common/button/LoadingButton';
import CustomButton from '../common/button/CustomButton';

export type CreateRestaurantModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateRestaurantRequest) => void;
  error?: string;
  createRestaurantBtnState: ButtonState;
};

const emptyRestaurant: CreateRestaurantRequest = {
  restaurantName: '',
  email: '',
  phoneNumber: '',
  username: '',
  password: '',
  firstName: '',
  lastName: '',
};

const CreateRestaurantModal: React.FC<CreateRestaurantModalProps> = ({
  visible,
  onClose,
  onSubmit,
  error,
  createRestaurantBtnState,
}) => {
  const [form, setForm] = useState<CreateRestaurantRequest>(emptyRestaurant);
  const loading = createRestaurantBtnState.status === 'loading';

  const setField = (k: keyof CreateRestaurantRequest, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const canSubmit = useMemo(() => {
    const f = form;
    return (
      f.restaurantName.trim() &&
      f.email.trim() &&
      f.phoneNumber.trim() &&
      f.username.trim() &&
      f.password.trim() &&
      f.firstName.trim() &&
      f.lastName.trim()
    );
  }, [form]);

  const handleSubmit = async () => {
    if (!canSubmit) {
      Alert.alert('Missing info', 'Please fill out all fields.');
      return;
    }
    onSubmit(form);
  };

  return (
    <BaseBottomSheetModal visible={visible} onClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="w-full p-2"
      >
        {/* Content */}
        <ScrollView
          contentContainerStyle={{ paddingBottom: 12 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <MaterialCommunityIcons name="store-plus" size={24} color="#2A4759" />
              <Text style={styles.headerTitle}>Create Restaurant</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeIcon}>
              <Ionicons name="close" size={24} color="#2A4759" />
            </Pressable>
          </View>
          <Field
            label="Restaurant Name"
            value={form.restaurantName}
            onChangeText={(t) => setField('restaurantName', t)}
            icon="store-outline"
          />

          <View className="flex-row mt-2">
            <View className="flex-1 mr-2">
              <Field
                label="Email"
                value={form.email}
                onChangeText={(t) => setField('email', t)}
                keyboardType="email-address"
                autoCapitalize="none"
                icon="email-outline"
              />
            </View>
            <View className="flex-1 ml-2">
              <Field
                label="Phone Number"
                value={form.phoneNumber}
                onChangeText={(t) => setField('phoneNumber', t)}
                keyboardType="phone-pad"
                icon="phone-outline"
              />
            </View>
          </View>

          <View className="flex-row mt-2">
            <View className="flex-1 mr-2">
              <Field
                label="First Name"
                value={form.firstName}
                onChangeText={(t) => setField('firstName', t)}
                icon="account-outline"
              />
            </View>
            <View className="flex-1 ml-2">
              <Field
                label="Last Name"
                value={form.lastName}
                onChangeText={(t) => setField('lastName', t)}
                icon="account-outline"
              />
            </View>
          </View>

          <View className="flex-row mt-2">
            <View className="flex-1 mr-2">
              <Field
                label="Username"
                value={form.username}
                onChangeText={(t) => setField('username', t)}
                autoCapitalize="none"
                icon="account-key-outline"
              />
            </View>
            <View className="flex-1 ml-2">
              <Field
                label="Password"
                value={form.password}
                onChangeText={(t) => setField('password', t)}
                secureTextEntry
                autoCapitalize="none"
                icon="lock-outline"
              />
            </View>
          </View>

          {/* Actions */}
          <View className="flex flex-row justify-between m-4">
            <CustomButton
              title={'Cancel'}
              onPress={onClose}
              disabled={loading}
              buttonType="Normal"
              customButtonStyle="flex-1 mr-12 h-12 rounded-xl border border-gray-300 items-center justify-center"
            />

            <LoadingButton
              buttonState={createRestaurantBtnState}
              onPress={handleSubmit}
              disabled={!canSubmit || loading}
              title={'Create Restaurant'}
              buttonType="Normal"
              customButtonStyle={`flex-1 ml-2 h-12 rounded-xl items-center justify-center ${
                !canSubmit || loading ? 'bg-gray-300' : 'bg-deepTeal'
              }`}
              iconType="MaterialCommunityIcons"
              iconName="content-save-outline"
              iconColor="#ffffff"
              iconSize={26}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </BaseBottomSheetModal>
  );
};

export default CreateRestaurantModal;

/** ---------- Local Field helper ---------- */
type FieldProps = {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
};

const Field: React.FC<FieldProps> = ({
  label,
  value,
  onChangeText,
  icon,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'none',
}) => (
  <View className="mt-3">
    <Text className="text-gray-700 mb-2">{label}</Text>
    <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
      {icon ? <MaterialCommunityIcons name={icon} size={20} color="#9CA3AF" /> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor="#9CA3AF"
        className="flex-1 ml-2 text-gray-900"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  modalContent: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 12,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2A4759',
  },
  closeIcon: {
    padding: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 50,
  },
});
