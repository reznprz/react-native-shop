import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import LoadingButton, { ButtonState } from 'app/components/common/button/LoadingButton';
import { config } from 'app/config/config';
import { useTheme } from 'app/hooks/useTheme';

interface LoginCardProps {
  username: string;
  password: string;
  isPasswordVisible: boolean;
  rememberMe: boolean;
  loginState: ButtonState;
  showEnvDetails: boolean;
  appVersion: string;
  setUsername: (text: string) => void;
  setPassword: (text: string) => void;
  togglePasswordVisibility: () => void;
  setRememberMe: (flag: boolean) => void;
  handleLogin: () => void;
}

const LoginCard: React.FC<LoginCardProps> = ({
  username,
  password,
  isPasswordVisible,
  rememberMe,
  loginState,
  showEnvDetails,
  appVersion,
  setUsername,
  setPassword,
  togglePasswordVisibility,
  setRememberMe,
  handleLogin,
}) => {
  const theme = useTheme();

  return (
    <View className="bg-gray-100 w-full rounded-xl shadow-sm p-8">
      <View className="pb-3 px-8 pt-3">
        {/* Icon */}
        <View className="items-center mb-4">
          <MaterialCommunityIcons
            name="silverware-fork-knife"
            size={48}
            color={theme.primary} // was #374151
          />
        </View>

        {/* Env + Version */}
        {showEnvDetails && (
          <View className="items-center mb-4">
            <View className="bg-gray-100 px-3 py-1 rounded-full flex-row space-x-2 items-center border border-gray-300">
              <Text className="text-sm text-gray-700 font-medium">{config.env.toUpperCase()}</Text>
              <Text className="text-sm text-gray-500">{appVersion}</Text>
            </View>
          </View>
        )}

        {/* Title */}
        <Text className="text-2xl font-semibold text-center" style={{ color: theme.textSecondary }}>
          Restaurant POS Login
        </Text>
        <Text className="text-center mt-2" style={{ color: theme.textSecondary }}>
          Please sign in to continue
        </Text>

        {/* Username */}
        <View className="mt-8">
          <Text className="mb-2" style={{ color: theme.textSecondary }}>
            Username
          </Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-white">
            <MaterialCommunityIcons name="account-outline" size={20} color={theme.icon} />
            <TextInput
              placeholder="Enter your username"
              placeholderTextColor={theme.icon}
              value={username}
              onChangeText={setUsername}
              className="flex-1 ml-2"
              autoFocus={Platform.OS === 'web'}
              style={{ color: theme.textSecondary }} // was text-gray-900
            />
          </View>
        </View>

        {/* Password */}
        <View className="mt-6">
          <Text
            className="mb-2"
            style={{ color: theme.textSecondary }} // was text-gray-700
          >
            Password
          </Text>
          <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
            <MaterialCommunityIcons name="lock-outline" size={20} color={theme.icon} />
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor={theme.icon}
              secureTextEntry={!isPasswordVisible}
              value={password}
              autoFocus={Platform.OS === 'web'}
              onChangeText={setPassword}
              className="flex-1 ml-2"
              style={{ color: theme.textSecondary }}
            />
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <MaterialCommunityIcons
                name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={theme.icon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Remember Me & Forgot */}
        <View className="flex-row justify-between items-center mt-4">
          <TouchableOpacity
            onPress={() => setRememberMe(!rememberMe)}
            className="flex-row items-center"
          >
            <View
              className={`
              w-5 h-5 rounded-md border 
              border-gray-400 mr-2 justify-center items-center
              ${rememberMe ? '' : 'bg-white'}
            `}
              style={rememberMe ? { backgroundColor: theme.textSecondary } : undefined}
            >
              {rememberMe && <MaterialCommunityIcons name="check" size={16} color={theme.icon} />}
            </View>
            <Text className="text-sm" style={{ color: theme.textSecondary }}>
              Remember me
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Alert.alert('Forgot Password')}>
            <Text className="font-medium" style={{ color: theme.textSecondary }}>
              Forgot password?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign In Button */}
        <View className="mt-6">
          <LoadingButton
            title="Sign In"
            onPress={handleLogin}
            buttonStyle={{ paddingVertical: 14, backgroundColor: theme.buttonBg }}
            textStyle={{ fontSize: 20, color: theme.textPrimary }}
            buttonState={loginState}
          />
        </View>

        {/* Help */}
        <View className="mt-8 items-center">
          <Text style={{ color: theme.textTertiary }}>Need help? Contact</Text>
          <Text className="font-semibold" style={{ color: theme.textSecondary }}>
            System Administrator
          </Text>
        </View>
      </View>
    </View>
  );
};

export default LoginCard;
