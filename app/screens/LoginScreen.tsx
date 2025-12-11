import React, { useEffect, useState } from 'react';
import { config } from 'app/config/config';
import {
  View,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  ImageBackground,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import { useLogin } from 'app/hooks/useLogin';
import LoginCard from 'app/components/login/LoginCard';
import { useIsDesktop } from 'app/hooks/useIsDesktop';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import CreateRestaurantModal from 'app/components/modal/CreateRestaurantModal';
import { useCreateRestaurantMutation } from 'app/hooks/apiQuery/useCreateRestaurantQuery';
import { ButtonState } from 'app/components/common/button/LoadingButton';
import NotificationBar from 'app/components/common/NotificationBar';
import { useTheme } from 'app/hooks/useTheme';

// If you have the asset locally, prefer require(...) for performance.
// const bgSource = require("../../assets/pos.jpg");
const bgSource = {
  uri: 'https://storage.googleapis.com/image-box-shk/%20pos-2.jpg',
};

const LoginScreen: React.FC = () => {
  const {
    username,
    password,
    loginState,
    setUsername,
    setPassword,
    handleLogin,
    handleLoginSuccess,
  } = useLogin();

  const {
    mutate: createRestaurantMutation,
    error: createRestaurantError,
    data: createRestaurantRes,
    isPending: isLoading,
    isError,
    isSuccess,
    reset: resetCreateRestaurantState,
  } = useCreateRestaurantMutation();

  const { isMobile } = useIsDesktop();
  const theme = useTheme();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [successNotification, setSuccessNotificaton] = useState('');

  const appVersion = 'v1.0.0';
  const showEnvDetails = config.env === 'local' || config.env === 'uat';

  useEffect(() => {
    if (loginState.status === 'success') handleLoginSuccess();
  }, [loginState, handleLoginSuccess]);

  useEffect(() => {
    if (createRestaurantRes?.success) {
      setShowCreateModal(false);
    }
  }, [createRestaurantRes]);

  useEffect(() => {
    if (isSuccess) {
      setSuccessNotificaton('New Restauarnt Created, Please Login !');
      resetCreateRestaurantState();
    }
  }, [isSuccess, resetCreateRestaurantState]);

  const dismissKeyboard = () => Keyboard.dismiss();

  // Shift the image left on larger screens so the POS terminal is visible
  const imageShiftX = isMobile ? 0 : -100; // tweak -80/-120 to taste
  const rightGutter = isMobile ? '' : 'mr-10';

  const createRestaurantState: ButtonState = isLoading
    ? { status: 'loading' }
    : isError
      ? {
          status: 'error',
          message: String(createRestaurantError),
          reset: resetCreateRestaurantState,
        }
      : isSuccess
        ? { status: 'success', reset: resetCreateRestaurantState }
        : { status: 'idle' };

  const renderLoginCard = () => (
    <LoginCard
      username={username}
      password={password}
      isPasswordVisible={isPasswordVisible}
      rememberMe={rememberMe}
      loginState={loginState}
      showEnvDetails={showEnvDetails}
      appVersion={appVersion}
      setUsername={setUsername}
      setPassword={setPassword}
      togglePasswordVisibility={() => setIsPasswordVisible((p) => !p)}
      setRememberMe={setRememberMe}
      handleLogin={handleLogin}
    />
  );

  const renderLoginLayout = () => (
    <>
      <ImageBackground
        source={bgSource}
        resizeMode="cover"
        className="flex-1"
        imageStyle={{
          // move the background art to the left on desktop so the POS screen shows
          transform: [{ translateX: imageShiftX }],
        }}
      >
        {/* subtle dark overlay to improve form contrast */}
        <View className="absolute inset-0 bg-black/20" />

        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          {/* Positioning container */}
          <View
            className={`flex-1 px-4 py-8 ${
              isMobile ? 'items-center justify-center' : `items-end justify-center ${rightGutter}`
            }`}
          >
            {/* Right-aligned card on desktop, centered card on mobile */}
            <View className={`w-full ${isMobile ? 'max-w-md' : 'max-w-lg'} drop-shadow-lg`}>
              {renderLoginCard()}
            </View>

            <View className="mt-4 items-center">
              <TouchableOpacity
                onPress={() => setShowCreateModal(true)}
                className="px-4 py-3 rounded-xl shadow-sm flex-row items-center"
                style={{ backgroundColor: theme.buttonBg }}
              >
                <MaterialCommunityIcons
                  name="store-plus-outline"
                  size={20}
                  color={theme.textPrimary}
                />
                <Text className="ml-2 text-base font-semibold" style={{ color: theme.textPrimary }}>
                  Create Restaurant
                </Text>
              </TouchableOpacity>
              <Text className="text-xs mt-2" style={{ color: theme.textSecondary }}>
                New to the platform? Create your restaurant in seconds.
              </Text>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>

      <CreateRestaurantModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={(payload) => {
          createRestaurantMutation(payload);
        }}
        error={createRestaurantError?.message}
        createRestaurantBtnState={createRestaurantState}
      />

      {/* Success notification */}
      <NotificationBar message={successNotification} onClose={() => setSuccessNotificaton('')} />
    </>
  );

  return (
    <>
      {Platform.OS === 'web' ? (
        <KeyboardAvoidingView className="flex-1">{renderLoginLayout()}</KeyboardAvoidingView>
      ) : (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1"
          >
            {renderLoginLayout()}
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      )}
    </>
  );
};

export default LoginScreen;
