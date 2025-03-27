import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
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

  useEffect(() => {
    if (loginState.status === 'success') {
      handleLoginSuccess();
    }
  }, [loginState]);

  return (
    // Outer container for background
    <View className="flex-1 bg-gray-100 items-center justify-center px-4">
      {/* Card Container */}
      <View className="bg-white w-full max-w-md rounded-xl shadow-md p-8">
        {/* Icon */}
        <View className="items-center mb-6">
          <MaterialCommunityIcons name="silverware-fork-knife" size={48} color="#374151" />
        </View>

        {/* Title */}
        <Text className="text-2xl font-semibold text-center text-gray-900">
          Restaurant POS Login
        </Text>
        <Text className="text-center text-gray-500 mt-2">Please sign in to continue</Text>

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

        {/* Password Field */}
        <View className="mt-6">
          <Text className="text-gray-700 mb-2">Password</Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-white">
            <MaterialCommunityIcons name="lock" size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              className="flex-1 ml-2 text-gray-900"
            />
          </View>
        </View>

        {/* Remember Me & Forgot */}
        <View className="flex-row justify-between items-center mt-4">
          <TouchableOpacity onPress={() => {}} className="flex-row items-center">
            <View
              className={`
                w-5 h-5 rounded border 
                border-gray-400 mr-2 
                ${true ? 'bg-blue-600' : 'bg-white'}
              `}
            />
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
            onPress={() => {
              handleLogin();
            }}
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
  );
};

export default LoginScreen;
