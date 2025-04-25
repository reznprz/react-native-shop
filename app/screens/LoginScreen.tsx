import React, { useEffect, useState } from 'react';
import { config } from 'app/config/config';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import LoadingButton from 'app/components/common/button/LoadingButton';
import { useLogin } from 'app/hooks/useLogin';

const LoginScreen: React.FC = () => {
  const {
    username,
    password,
    validationError,
    loginState,
    setUsername,
    setPassword,
    handleLogin,
    handleLoginSuccess,
  } = useLogin();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const appVersion = 'v1.0.0';
  const showEnvDetails = config.env === 'local' || config.env === 'uat';

  useEffect(() => {
    if (loginState.status === 'success') {
      handleLoginSuccess();
    }
  }, [loginState]);

  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);
  const dismissKeyboard = () => Keyboard.dismiss();

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, backgroundColor: '#f3f4f6' }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 bg-gray-100 items-center justify-center px-4">
          {/* Card Container */}
          <View className="bg-white w-full max-w-md rounded-xl shadow-md p-8">
            {/* Icon */}
            <View className="items-center mb-4">
              <MaterialCommunityIcons name="silverware-fork-knife" size={48} color="#374151" />
            </View>

            {/* Env + Version */}
            {showEnvDetails && (
              <View className="items-center mb-4">
                <View className="bg-gray-100 px-3 py-1 rounded-full flex-row space-x-2 items-center border border-gray-300">
                  <Text className="text-sm text-gray-700 font-medium">
                    {config.env.toUpperCase()}
                  </Text>
                  <Text className="text-sm text-gray-500">{appVersion}</Text>
                </View>
              </View>
            )}

            {/* Title */}
            <Text className="text-2xl font-semibold text-center text-gray-900">
              Restaurant POS Login
            </Text>
            <Text className="text-center text-gray-500 mt-2">Please sign in to continue</Text>

            {/* Username */}
            <View className="mt-8">
              <Text className="text-gray-700 mb-2">Username</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-white">
                <MaterialCommunityIcons name="account-outline" size={20} color="#9CA3AF" />
                <TextInput
                  placeholder="Enter your username"
                  placeholderTextColor="#9CA3AF"
                  value={username}
                  onChangeText={setUsername}
                  className="flex-1 ml-2 text-gray-900"
                />
              </View>
            </View>

            {/* Password */}
            <View className="mt-6">
              <Text className="text-gray-700 mb-2">Password</Text>
              <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
                <MaterialCommunityIcons name="lock-outline" size={20} color="#9CA3AF" />
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!isPasswordVisible}
                  value={password}
                  onChangeText={setPassword}
                  className="flex-1 ml-2 text-gray-900"
                />
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  <MaterialCommunityIcons
                    name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#9CA3AF"
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
                    ${rememberMe ? 'bg-blue-600' : 'bg-white'}
                  `}
                >
                  {rememberMe && <MaterialCommunityIcons name="check" size={16} color="white" />}
                </View>
                <Text className="text-gray-700 text-sm">Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => Alert.alert('Forgot Password')}>
                <Text className="text-blue-900 font-medium">Forgot password?</Text>
              </TouchableOpacity>
            </View>

            {/* Sign In Button */}
            <View className="mt-6">
              <LoadingButton
                title={'Sign In'}
                onPress={handleLogin}
                buttonStyle={{ paddingVertical: 14 }}
                textStyle={{ fontSize: 20 }}
                buttonState={loginState}
              />
            </View>

            {/* Help */}
            <View className="mt-8 items-center">
              <Text className="text-gray-500">Need help? Contact</Text>
              <Text className="text-gray-800 font-semibold">System Administrator</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
