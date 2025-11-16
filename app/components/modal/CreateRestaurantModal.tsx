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
import Ionicons from '@expo/vector-icons/Ionicons';

import { BaseBottomSheetModal } from '../common/modal/BaseBottomSheetModal';
import { CreateRestaurantRequest } from 'app/api/services/authService';
import LoadingButton, { ButtonState } from '../common/button/LoadingButton';
import CustomButton from '../common/button/CustomButton';
import { useTheme } from 'app/hooks/useTheme';

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
  themeVariant: 'BLUE', // default theme
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
  const theme = useTheme();

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
      f.lastName.trim() &&
      f.themeVariant
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
        <ScrollView
          contentContainerStyle={{ paddingBottom: 12 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.secondaryBtnBg }]}>
            <View style={styles.headerTitleContainer}>
              <MaterialCommunityIcons name="store-plus" size={24} color={theme.primary} />
              <Text style={[styles.headerTitle, { color: theme.primary }]}>Create Restaurant</Text>
            </View>
            <Pressable
              onPress={onClose}
              style={[styles.closeIcon, { backgroundColor: theme.secondaryBtnBg }]}
            >
              <Ionicons name="close" size={24} color={theme.primary} />
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

          {/* Theme picker */}
          <ThemeColorPicker
            value={form.themeVariant}
            onChange={(variant) => setField('themeVariant', variant)}
          />

          {/* Actions */}
          <View className="flex flex-row justify-between m-4">
            <CustomButton
              title="Cancel"
              onPress={onClose}
              disabled={loading}
              buttonType="Normal"
              customButtonStyle="flex-1 mr-12 h-12 rounded-xl border border-gray-300 items-center justify-center"
            />

            <LoadingButton
              buttonState={createRestaurantBtnState}
              onPress={handleSubmit}
              disabled={!canSubmit || loading}
              title="Create Restaurant"
              buttonType="Normal"
              customButtonStyle={`flex-1 ml-2 h-12 rounded-xl items-center justify-center ${
                !canSubmit || loading ? 'bg-gray-300' : ''
              }`}
              buttonStyle={!canSubmit || loading ? undefined : { backgroundColor: theme.buttonBg }}
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

/** ---------- ThemeColorPicker helper ---------- */

type ThemeOption = {
  id: 'BLUE' | 'GREEN' | 'BROWN' | 'PURPLE' | 'SUNSET';
  label: string;
  description: string;
  primary: string;
  secondary: string;
};

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'BLUE',
    label: 'Ocean Blue',
    description: 'Cool, modern & professional.',
    primary: '#2A4759',
    secondary: '#A0C4DC',
  },
  {
    id: 'GREEN',
    label: 'Fresh Green',
    description: 'Organic, fresh & calm.',
    primary: '#047857',
    secondary: '#A7F3D0',
  },
  {
    id: 'BROWN',
    label: 'Café Brown',
    description: 'Warm, cozy café vibes.',
    primary: '#3F2A20',
    secondary: '#F5E9DD',
  },
  {
    id: 'PURPLE',
    label: 'Grape Purple',
    description: 'Soft, modern & premium.',
    primary: '#4C1D95',
    secondary: '#EDE9FE',
  },
  {
    id: 'SUNSET',
    label: 'Sunset Orange',
    description: 'Warm & energetic.',
    primary: '#C2410C',
    secondary: '#FFE4D5',
  },
];

const ThemeColorPicker: React.FC<{
  value: string;
  onChange: (variant: ThemeOption['id']) => void;
}> = ({ value, onChange }) => {
  const theme = useTheme();

  return (
    <View className="mt-5">
      <Text className="text-gray-700 font-semibold mb-1">Choose a theme</Text>
      <Text className="text-gray-500 text-xs mb-3">
        You can change this later from restaurant settings.
      </Text>

      <View className="flex-row flex-wrap justify-between">
        {THEME_OPTIONS.map((opt) => {
          const isActive = opt.id === value;
          return (
            <Pressable
              key={opt.id}
              onPress={() => onChange(opt.id)}
              style={[
                styles.themeTile,
                {
                  borderColor: isActive ? theme.buttonBg : theme.borderColor,
                  backgroundColor: theme.secondaryBg,
                },
              ]}
            >
              {/* Color stripe */}
              <View
                style={{
                  height: 26,
                  backgroundColor: opt.primary,
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                }}
              />

              {/* Inner content */}
              <View style={{ paddingHorizontal: 10, paddingVertical: 8 }}>
                <View
                  style={{
                    width: 32,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: opt.secondary,
                    marginBottom: 6,
                  }}
                />
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: 2,
                  }}
                  numberOfLines={1}
                >
                  {opt.label}
                </Text>
                <Text style={{ fontSize: 11, color: '#6B7280' }} numberOfLines={2}>
                  {opt.description}
                </Text>
              </View>

              {isActive && (
                <View
                  style={[
                    styles.themeCheck,
                    { backgroundColor: theme.buttonBg, borderColor: theme.secondaryBg },
                  ]}
                >
                  <Ionicons name="checkmark" size={14} color={theme.textPrimary} />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

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
  },
  closeIcon: {
    padding: 6,
    borderRadius: 50,
  },
  themeTile: {
    width: '48%', // <-- 2 per row (2x2 feel)
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  themeCheck: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
