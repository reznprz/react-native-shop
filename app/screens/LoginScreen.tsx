import React, { useEffect, useState } from 'react';
import { config } from 'app/config/config';
import { View, Keyboard, TouchableWithoutFeedback, ScrollView, Image } from 'react-native';
import { useLogin } from 'app/hooks/useLogin';
import LoginCard from 'app/components/login/LoginCard';
import { useIsDesktop } from 'app/hooks/useIsDesktop';

const logoSource = { uri: 'https://storage.googleapis.com/image-box-sp/res.png' };

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

  const { isMobile } = useIsDesktop();

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

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, backgroundColor: '#f3f4f6' }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 bg-gray-100 items-center justify-center px-4">
          <View className="flex-row w-full max-w-4xl items-center space-x-6">
            {isMobile ? (
              renderLoginCard()
            ) : (
              <>
                <View className="flex-1 rounded-xl overflow-hidden rounded-xl shadow-md">
                  <Image source={logoSource} className="w-full h-full" resizeMode="contain" />
                </View>
                <View className="flex-1 justify-center">{renderLoginCard()}</View>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
