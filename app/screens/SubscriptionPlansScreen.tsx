import FoodLoadingSpinner from 'app/components/FoodLoadingSpinner';
import { useIsDesktop } from 'app/hooks/useIsDesktop';
import { useRestaurant } from 'app/hooks/useRestaurant';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const SubscriptionPlansScreen: React.FC = () => {
  const { isLargeScreen } = useIsDesktop();
  const { subscriptionPlans, getSubscriptionPlansMutation, storedAuthData } = useRestaurant();

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
      <View className="flex-1 items-center justify-center bg-white">
        <FoodLoadingSpinner iconName="coffee" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 pt-10 pb-4">
        <Text className="text-3xl font-extrabold text-gray-900 text-center mb-2">
          Choose Your Subscription Plan
        </Text>
        <Text className="text-gray-500 text-center mb-6 text-base">
          Flexible pricing plans designed for your restaurant's needs.
        </Text>

        {/* Billing Toggle */}
        <View className="self-center bg-gray-100 rounded-full p-1 flex-row shadow-sm">
          {(['monthly', 'yearly'] as const).map((period, index) => {
            const isSelected = billingPeriod === period;

            return (
              <TouchableOpacity
                key={period}
                onPress={() => setBillingPeriod(period)}
                activeOpacity={0.8}
                className={` items-center justify-center px-5 py-2 rounded-full ${
                  isSelected ? 'bg-white ' : 'bg-transparent'
                }`}
                style={{
                  marginLeft: index === 0 ? 0 : 4,
                  marginRight: index === 1 ? 0 : 4,
                }}
              >
                <Text
                  className={`text-sm font-semibold ${
                    isSelected ? 'text-gray-900' : 'text-gray-500'
                  }`}
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
              className={`bg-white rounded-3xl p-6 border shadow-md mx-2 w-72 md:w-80 lg:w-96 relative ${
                isCurrent ? '#2a4759' : 'border-gray-100'
              }`}
            >
              <View className="flex-row justify-center items-center mb-2 relative">
                <Text
                  className={`text-2xl font-bold text-center text-[#2a4759] ${isPopular ? 'mt-2' : ''}`}
                >
                  {plan?.planName}
                </Text>

                {isPopular && (
                  <View className="absolute -top-4 right-0 bg-orange-500 px-3 py-1 rounded-full">
                    <Text className="text-xs font-bold text-white">Most Popular</Text>
                  </View>
                )}
                {isCurrent && (
                  <View className="absolute -top-4 left-0 bg-deepTeal px-3 py-1 rounded-full">
                    <Text className="text-xs font-bold text-white">Current Plan</Text>
                  </View>
                )}
              </View>

              {/* Pricing */}
              <Text className="text-4xl font-extrabold text-center text-gray-900 mt-4">
                {price || 'Free'}
                <Text className="text-base font-medium text-gray-500">
                  /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                </Text>
              </Text>

              {/* Divider */}
              <View className="h-px bg-gray-200 my-5" />

              {/* Features */}
              <View className="space-y-3">
                {features.map((feature, index) => (
                  <View key={feature?.featureName || index} className="flex-row items-start gap-2">
                    <Text className="text-lg">{feature?.enabled ? '✓' : '✗'}</Text>
                    <Text className="flex-1 text-gray-700 text-sm leading-5">
                      {feature?.featureName || 'Unknown feature'}
                    </Text>
                  </View>
                ))}
              </View>

              {/* CTA Button */}
              <TouchableOpacity
                className="mt-8 bg-[#2a4759] py-3 rounded-xl active:bg-[#1f3642]"
                onPress={() => {
                  // TODO: handle plan selection
                }}
              >
                <Text
                  className={`text-center font-semibold ${isCurrent ? 'text-gray-300' : 'text-white'}`}
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
