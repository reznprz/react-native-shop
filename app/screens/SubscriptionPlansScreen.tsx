import FoodLoadingSpinner from 'app/components/FoodLoadingSpinner';
import { useIsDesktop } from 'app/hooks/useIsDesktop';
import { useRestaurant } from 'app/hooks/useRestaurant';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'app/hooks/useTheme';

const SubscriptionPlansScreen: React.FC = () => {
  const { isLargeScreen } = useIsDesktop();
  const { subscriptionPlans, getSubscriptionPlansMutation, storedAuthData } = useRestaurant();
  const theme = useTheme();

  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const { subscriptionExpirationInfo } = storedAuthData || {};

  useEffect(() => {
    getSubscriptionPlansMutation.mutate();
  }, []);

  const plans = useMemo(() => {
    return subscriptionPlans ? Object.values(subscriptionPlans) : [];
  }, [subscriptionPlans]);

  if (getSubscriptionPlansMutation.isPending) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: theme.primaryBg }}
      >
        <FoodLoadingSpinner iconName="coffee" />
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: theme.primaryBg }}>
      {/* Header */}
      <View className="px-6 pt-10 pb-4">
        <Text
          className="text-3xl font-extrabold text-center mb-2"
          style={{ color: theme.textSecondary }}
        >
          Choose Your Subscription Plan
        </Text>
        <Text className="text-center mb-6 text-base" style={{ color: theme.textTertiary }}>
          Flexible pricing plans designed for your restaurant&apos;s needs.
        </Text>

        {/* Billing Toggle */}
        <View
          className="self-center rounded-full p-1 flex-row shadow-sm"
          style={{ backgroundColor: theme.secondaryBg }}
        >
          {(['monthly', 'yearly'] as const).map((period, index) => {
            const isSelected = billingPeriod === period;

            return (
              <TouchableOpacity
                key={period}
                onPress={() => setBillingPeriod(period)}
                activeOpacity={0.8}
                className="items-center justify-center px-5 py-2 rounded-full"
                style={{
                  marginLeft: index === 0 ? 0 : 4,
                  marginRight: index === 1 ? 0 : 4,
                  backgroundColor: isSelected ? theme.secondary : 'transparent',
                }}
              >
                <Text
                  className="text-sm font-semibold"
                  style={{ color: isSelected ? theme.textPrimary : theme.textTertiary }}
                >
                  {period === 'monthly' ? 'Monthly' : 'Yearly (save 2 months)'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Plans */}
      <ScrollView
        horizontal={!isLargeScreen}
        showsHorizontalScrollIndicator={false}
        contentContainerClassName={`gap-6 ${
          isLargeScreen ? 'flex-row flex-wrap justify-center px-4' : 'px-4'
        } pb-12`}
      >
        {plans.map((plan) => {
          const isPopular = plan?.planName?.toUpperCase() === 'STANDARD';
          const isCurrent = plan?.planName === subscriptionExpirationInfo?.planType;
          const price = billingPeriod === 'monthly' ? plan?.monthlyCost : plan?.yearlyCost;
          const features = Array.isArray(plan?.features) ? plan.features : [];

          return (
            <View
              key={plan?.planName}
              className="rounded-3xl p-6 shadow-md mx-2 w-72 md:w-80 lg:w-96 relative"
              style={{
                backgroundColor: theme.secondaryBg,
                borderWidth: 1,
                borderColor: isCurrent ? theme.secondary : theme.borderColor,
              }}
            >
              <View className="flex-row justify-center items-center mb-2 relative">
                <Text
                  className={`text-2xl font-bold text-center ${isPopular ? 'mt-2' : ''}`}
                  style={{ color: theme.secondary }}
                >
                  {plan?.planName}
                </Text>

                {isPopular && (
                  <View className="absolute -top-4 right-0 px-3 py-1 rounded-full bg-orange-500">
                    <Text className="text-xs font-bold text-white">Most Popular</Text>
                  </View>
                )}
                {isCurrent && (
                  <View
                    className="absolute -top-4 left-0 px-3 py-1 rounded-full"
                    style={{ backgroundColor: theme.secondary }}
                  >
                    <Text className="text-xs font-bold" style={{ color: theme.textPrimary }}>
                      Current Plan
                    </Text>
                  </View>
                )}
              </View>

              {/* Pricing */}
              <Text
                className="text-4xl font-extrabold text-center mt-4"
                style={{ color: theme.textSecondary }}
              >
                {price || 'Free'}
                <Text className="text-base font-medium" style={{ color: theme.textTertiary }}>
                  /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                </Text>
              </Text>

              {/* Divider */}
              <View className="h-px my-5" style={{ backgroundColor: theme.borderColor }} />

              {/* Features */}
              <View className="space-y-3">
                {features.map((feature, index) => (
                  <View key={feature?.featureName || index} className="flex-row items-start gap-2">
                    <Text
                      className="text-lg"
                      style={{ color: feature?.enabled ? theme.secondary : theme.textTertiary }}
                    >
                      {feature?.enabled ? '✓' : '✗'}
                    </Text>
                    <Text
                      className="flex-1 text-sm leading-5"
                      style={{ color: theme.textSecondary }}
                    >
                      {feature?.featureName || 'Unknown feature'}
                    </Text>
                  </View>
                ))}
              </View>

              {/* CTA Button */}
              <TouchableOpacity
                className="mt-8 py-3 rounded-xl"
                onPress={() => {
                  // TODO: handle plan selection
                }}
                style={{
                  backgroundColor: isCurrent ? theme.secondaryBtnBg : theme.buttonBg,
                }}
                activeOpacity={0.85}
              >
                <Text
                  className="text-center font-semibold"
                  style={{ color: isCurrent ? theme.textTertiary : theme.textPrimary }}
                >
                  {isCurrent ? 'Your Current Plan' : `Select ${plan?.planName}`}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default SubscriptionPlansScreen;
