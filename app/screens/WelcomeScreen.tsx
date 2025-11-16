import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, Animated, TouchableOpacity, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useFoodMenuActions } from 'app/hooks/apiQuery/useFoodMenuAction';
import { useSelector } from 'react-redux';
import { RootState } from 'app/redux/rootReducer';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen: React.FC = () => {
  const { loadFoodMenu, isLoading, isError, isSuccess, error } = useFoodMenuActions();

  const authData = useSelector((state: RootState) => state.auth.authData);
  const restaurantId = authData?.restaurantId;
  const restaurantName =
    (authData as any)?.restaurantName || (authData as any)?.restaurant || 'your restaurant';

  const navigation = useNavigation();
  const spinAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Icon animation: fade in + gentle scale + continuous spin
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
        }),
      ),
    ]).start();
  }, [opacityAnim, scaleAnim, spinAnim]);

  const navigateToMainTabs = useCallback(() => {
    // @ts-ignore: navigation typing can be refined later
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' as never, params: { screen: 'Home' } as never }],
    });
  }, [navigation]);

  const runLoadMenu = useCallback(async () => {
    if (!restaurantId) {
      // If something is off with auth, just continue to app
      navigateToMainTabs();
      return;
    }

    try {
      // Just trigger the mutation; navigation will depend on isSuccess
      await loadFoodMenu(restaurantId);
    } catch (e) {
      console.warn('Failed to load food menu', e);
      // isError / error will be reflected by React Query state
    }
  }, [restaurantId, loadFoodMenu, navigateToMainTabs]);

  // Kick off the load once
  useEffect(() => {
    runLoadMenu();
  }, [runLoadMenu]);

  // Navigate ONLY when mutation is in success state
  useEffect(() => {
    if (restaurantId && isSuccess) {
      navigateToMainTabs();
    }
  }, [restaurantId, isSuccess, navigateToMainTabs]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const showError = isError && !isLoading;

  return (
    <View className="flex-1 bg-[#1b2933] items-center justify-center px-8">
      {/* Icon + animation */}
      <Animated.View
        style={{
          transform: [{ rotate: spin }, { scale: scaleAnim }],
          opacity: opacityAnim,
        }}
        className="items-center justify-center rounded-full p-5 bg-white/10"
      >
        <MaterialCommunityIcons name="food-fork-drink" size={70} color="#ffffff" />
      </Animated.View>

      {/* App / restaurant context */}
      <Text className="mt-6 text-white text-2xl font-semibold">Welcome back</Text>
      <Text className="mt-1 text-sm text-gray-200">
        Getting things ready for <Text className="font-semibold">{restaurantName}</Text>…
      </Text>

      {/* Loading / status copy */}
      {!showError && (
        <View className="mt-6 items-center" accessible accessibilityLiveRegion="polite">
          <ActivityIndicator size="small" />
          <Text className="mt-3 text-xs text-gray-300 text-center">
            We’re loading your menu, tables and today&apos;s data.
          </Text>
          <Text className="mt-1 text-[11px] text-gray-400 text-center">
            This usually takes just a moment.
          </Text>
        </View>
      )}

      {/* Error state */}
      {showError && (
        <View className="mt-6 items-center" accessible accessibilityLiveRegion="polite">
          <Text className="text-xs text-red-200 text-center px-4">
            {String(error) || 'Something went wrong while loading your data.'}
          </Text>

          <View className="flex-row mt-4 space-x-3">
            <TouchableOpacity
              className="px-4 py-2 rounded-xl bg-white/10 border border-white/30"
              onPress={runLoadMenu}
            >
              <Text className="text-white text-sm font-semibold">Retry</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="px-4 py-2 rounded-xl bg-transparent"
              onPress={() => {
                // optional: send user back to login on hard failure
                // NOTE: better UX would be to clear authData in Redux,
                // so AppContent switches back to AuthNavigator.
                // @ts-ignore
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'MainTabs' as never, params: { screen: 'Login' } as never }],
                });
              }}
            >
              <Text className="text-gray-300 text-sm underline">Back to login</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Tiny footer hint */}
      <View className="absolute bottom-8 left-0 right-0 items-center">
        <Text className="text-[11px] text-gray-500">
          Tip: Check the Home screen for today&apos;s sales summary.
        </Text>
      </View>
    </View>
  );
};

export default WelcomeScreen;
