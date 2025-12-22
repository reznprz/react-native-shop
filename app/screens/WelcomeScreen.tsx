import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  Image,
  Platform,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFoodMenuActions } from 'app/hooks/apiQuery/useFoodMenuAction';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'app/redux/rootReducer';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'app/hooks/useTheme';
import PreparingKitchenStatus from 'app/components/PreparingKitchenStatus';
import { useRestaurantTablesQuery } from 'app/hooks/apiQuery/useRestaurantTablesQuery';
import { logoutAll } from 'app/redux/actions';

const WelcomeScreen: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const isWeb = Platform.OS === 'web';
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  const { loadFoodMenu, isLoading, isError, isSuccess, error } = useFoodMenuActions();

  const authData = useSelector((state: RootState) => state.auth.authData);
  const restaurantId = authData?.restaurantId;
  const restaurantName =
    (authData as any)?.restaurantName || (authData as any)?.restaurant || 'Your restaurant';
  const restaurantImgUrl = (authData as any)?.restaurantImgUrl;

  const { refetch: refetchTables, isSuccess: isTablesSuccess } = useRestaurantTablesQuery(
    restaurantId ?? 0,
  );

  // --- Animations ---
  const spinAnim = useRef(new Animated.Value(0)).current;
  const entryScaleAnim = useRef(new Animated.Value(0.95)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;
  const ambientAnim = useRef(new Animated.Value(0)).current;

  // guard to ensure we only trigger the initial load once per mount
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // reset and run intro animations
    Animated.sequence([
      Animated.parallel([
        Animated.timing(cardOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(entryScaleAnim, {
          toValue: 1,
          friction: 7,
          tension: 60,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 350,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.timing(footerOpacity, {
        toValue: 1,
        duration: 280,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.timing(spinAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(ambientAnim, { toValue: 1, duration: 9000, useNativeDriver: true }),
        Animated.timing(ambientAnim, { toValue: 0, duration: 9000, useNativeDriver: true }),
      ]),
    ).start();
  }, [
    ambientAnim,
    cardOpacity,
    entryScaleAnim,
    floatAnim,
    footerOpacity,
    spinAnim,
    subtitleOpacity,
  ]);

  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const float = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });
  const ambientShift = ambientAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 20] });

  const navigateToMainTabs = useCallback(() => {
    // @ts-ignore
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' as never, params: { screen: 'Home' } as never }],
    });
  }, [navigation]);

  const runLoadMenuAndTables = useCallback(async () => {
    if (!restaurantId) {
      navigateToMainTabs();
      return;
    }
    try {
      await Promise.all([loadFoodMenu(restaurantId), refetchTables()]);
    } catch (err) {
      console.warn('Failed to load initial data', err);
    }
  }, [restaurantId, loadFoodMenu, refetchTables, navigateToMainTabs]);

  //  Only run the initial load once per mount (prevents infinite API loop)
  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    runLoadMenuAndTables();
  }, [runLoadMenuAndTables]);

  // navigate once data for menu + tables is ready
  useEffect(() => {
    if (restaurantId && isSuccess && isTablesSuccess) {
      navigateToMainTabs();
    }
  }, [restaurantId, isSuccess, isTablesSuccess, navigateToMainTabs]);

  const showError = isError && !isLoading;
  const friendlyError =
    (error && String(error)) ||
    'We ran into a problem while loading your data. Please check your connection and try again.';

  // responsive layout
  const cardMaxWidth = isDesktop ? 580 : isTablet ? 460 : 400;
  const cardPaddingH = isDesktop ? 42 : isTablet ? 26 : 20;
  const cardPaddingV = isDesktop ? 40 : isTablet ? 28 : 24;
  const outerMaxWidth = isDesktop ? 1400 : isTablet ? 960 : '100%';

  return (
    <View
      className="flex-1 items-center justify-center"
      style={{
        backgroundColor: theme.primaryBg,
        alignSelf: 'center',
        width: outerMaxWidth,
        paddingHorizontal: isTablet ? 48 : 24,
      }}
    >
      {/* Gradient background layer */}
      {(isTablet || isDesktop) && (
        <View style={StyleSheet.absoluteFillObject}>
          <LinearGradient
            colors={[
              theme.primaryBg,
              theme.secondary + '10',
              theme.quaternary + '15',
              theme.primaryBg,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
        </View>
      )}

      {/* Animated background orbs */}
      <Animated.View
        style={{
          position: 'absolute',
          top: -width * 0.1,
          right: -width * 0.1,
          width: width * 0.35,
          height: width * 0.35,
          borderRadius: width,
          backgroundColor: theme.secondary + '22',
          transform: [{ translateY: ambientShift }],
          opacity: 0.35,
        }}
      />
      <Animated.View
        style={{
          position: 'absolute',
          bottom: -width * 0.1,
          left: -width * 0.1,
          width: width * 0.4,
          height: width * 0.4,
          borderRadius: width,
          backgroundColor: theme.quaternary + '22',
          transform: [{ translateY: Animated.multiply(ambientShift, -1) }],
          opacity: 0.3,
        }}
      />

      {/* Main Card */}
      <Animated.View
        className="rounded-3xl shadow-xl"
        style={{
          backgroundColor: isDesktop ? theme.secondary + 'CC' : theme.secondary,
          ...(isDesktop && isWeb
            ? ({
                backdropFilter: 'blur(22px)',
                WebkitBackdropFilter: 'blur(22px)',
              } as any)
            : {}),
          borderWidth: isDesktop ? 1 : 0,
          borderColor: theme.secondary + '33',
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
          elevation: 10,
          width: '100%',
          maxWidth: cardMaxWidth,
          paddingHorizontal: cardPaddingH,
          paddingVertical: cardPaddingV,
          opacity: cardOpacity,
          transform: [{ scale: entryScaleAnim }],
        }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between" style={{ marginBottom: 10 }}>
          <Text className="text-xs font-semibold" style={{ color: theme.textSecondary }}>
            Khanapana POS
          </Text>
          <View
            className="rounded-full"
            style={{
              backgroundColor: theme.primaryBg,
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}
          >
            <Text className="text-[10px]" style={{ color: theme.textSecondary }}>
              Syncing workspace…
            </Text>
          </View>
        </View>

        {/* Restaurant Info */}
        <Animated.View
          className="flex-row items-center"
          style={{ opacity: subtitleOpacity, marginBottom: 16 }}
        >
          <Animated.View style={{ transform: [{ rotate: spin }, { translateY: float }] }}>
            <View
              style={{
                width: isTablet ? 46 : 42,
                height: isTablet ? 46 : 42,
                borderRadius: 999,
                overflow: 'hidden',
                marginRight: 10,
                borderWidth: 1,
                borderColor: theme.secondary,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.primaryBg,
              }}
            >
              {restaurantImgUrl ? (
                <Image
                  source={{ uri: restaurantImgUrl }}
                  style={{ width: '100%', height: '100%' }}
                />
              ) : (
                <MaterialCommunityIcons
                  name="storefront-outline"
                  size={22}
                  color={theme.textSecondary}
                />
              )}
            </View>
          </Animated.View>

          <View className="flex-1">
            <Text
              className="text-xs font-semibold"
              style={{ color: theme.textSecondary }}
              numberOfLines={1}
            >
              {restaurantName}
            </Text>
            <Text className="text-[11px]" style={{ color: theme.textSecondary }} numberOfLines={2}>
              Getting everything ready so your team can start serving.
            </Text>
          </View>
        </Animated.View>

        {/* Title */}
        <Text
          style={{
            color: theme.textPrimary,
            textAlign: 'center',
            fontSize: isDesktop ? 30 : isTablet ? 24 : 20,
            lineHeight: isDesktop ? 38 : 28,
            fontWeight: '700',
            letterSpacing: 0.3,
          }}
        >
          Welcome back
        </Text>

        {/* Subtitle */}
        <Animated.Text
          style={{
            color: theme.textSecondary,
            opacity: subtitleOpacity,
            textAlign: 'center',
            marginTop: 12,
            marginHorizontal: isDesktop ? 24 : 12,
            fontSize: isDesktop ? 17 : isTablet ? 15 : 13,
            lineHeight: isDesktop ? 24 : 20,
          }}
        >
          We&apos;re preparing your kitchen dashboard — menu, tables, and today&apos;s sales, all in
          one place.
        </Animated.Text>

        {/* Loader */}
        {!showError && (
          <PreparingKitchenStatus
            isTabletOrDesktop={isTablet || isDesktop}
            isWeb={isWeb}
            floatAnim={floatAnim}
          />
        )}

        {/* Error UI */}
        {showError && (
          <View
            className="items-center"
            accessible
            accessibilityLiveRegion="polite"
            style={{ marginTop: 24 }}
          >
            <View className="w-full rounded-2xl px-4 py-3" style={{ backgroundColor: '#451a1a' }}>
              <View className="flex-row items-start">
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={18}
                  color="#fecaca"
                  style={{ marginTop: 1, marginRight: 6 }}
                />
                <Text className="text-xs flex-1" style={{ color: '#fecaca' }}>
                  {friendlyError}
                </Text>
              </View>
            </View>

            <View className="flex-row mt-5">
              <TouchableOpacity
                className="px-4 py-2 rounded-xl mr-3"
                style={{ backgroundColor: theme.secondary, elevation: 3 }}
                onPress={runLoadMenuAndTables}
              >
                <Text className="text-sm font-semibold" style={{ color: theme.textPrimary }}>
                  Try again
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="px-4 py-2 rounded-xl"
                onPress={() => dispatch(logoutAll())}
              >
                <Text className="text-sm underline" style={{ color: theme.textSecondary }}>
                  Back to login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Animated.View>

      {/* Footer hint */}
      <Animated.View
        className="items-center px-6"
        style={{ opacity: footerOpacity, marginTop: isDesktop ? 60 : 30 }}
      >
        <Text
          style={{
            color: theme.mutedIcon,
            fontSize: isDesktop ? 14 : 12,
            maxWidth: isDesktop ? 560 : 420,
            textAlign: 'center',
            opacity: 0.85,
          }}
        >
          Pro tip: Once you&apos;re in, open <Text style={{ fontWeight: '600' }}>Home</Text> to see
          today&apos;s sales performance at a glance.
        </Text>
      </Animated.View>
    </View>
  );
};

export default WelcomeScreen;
