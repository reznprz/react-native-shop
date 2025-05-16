import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRestaurant } from 'app/hooks/useRestaurant';
import { PlanType, SubscriptionExpirationInfo } from 'app/api/services/authService';
import UserProfileCard from 'app/components/common/UserProfileCard';
import { Feather } from '@expo/vector-icons';

const defaultSubscriptionInfo: SubscriptionExpirationInfo = {
  planType: PlanType.NONE,
  subscriptionExpired: false,
  expirationBannerMessage: 'Your subscription is active.',
  remainingDays: 0,
  remainingHours: 0,
  remainingMinutes: 0,
  remainingSeconds: 0,
};

const ProfileScreen = () => {
  const { storedAuthData } = useRestaurant();
  const {
    restaurantName = '',
    emails = [],
    phoneNumbers = [],
    subscriptionExpirationInfo = defaultSubscriptionInfo,
  } = storedAuthData || {};

  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      <UserProfileCard name={restaurantName} email={'Fine Dining Restaurant'} />

      <View
        className={`flex-row items-start gap-3 p-4 rounded-xl mb-6 shadow-sm border mt-4 ${
          subscriptionExpirationInfo.subscriptionExpired
            ? 'bg-red-50 border-red-200'
            : 'bg-emerald-50 border-emerald-200'
        }`}
      >
        <Feather
          name={subscriptionExpirationInfo.subscriptionExpired ? 'alert-triangle' : 'check-circle'}
          size={20}
          color={subscriptionExpirationInfo.subscriptionExpired ? '#DC2626' : '#10B981'}
          style={{ marginTop: 2 }}
        />
        <View className="flex-1">
          <Text
            className={`text-sm font-medium ${
              subscriptionExpirationInfo.subscriptionExpired ? 'text-red-700' : 'text-emerald-700'
            }`}
          >
            {subscriptionExpirationInfo.expirationBannerMessage}
          </Text>
          {!subscriptionExpirationInfo.subscriptionExpired && (
            <Text className="text-xs text-gray-600 mt-1">
              Time remaining:{' '}
              <Text className="font-medium text-gray-800">
                {subscriptionExpirationInfo.remainingDays}d{' '}
                {subscriptionExpirationInfo.remainingHours}h{' '}
                {subscriptionExpirationInfo.remainingMinutes}m{' '}
                {subscriptionExpirationInfo.remainingSeconds}s
              </Text>
            </Text>
          )}
        </View>
      </View>

      {/* Contact Info Card */}
      <View className="bg-white rounded-2xl p-5 mb-6 border border-gray-100 shadow-sm">
        <Text className="text-lg font-bold text-gray-900 mb-4">Contact Information</Text>

        <View className="mb-5">
          <Text className="text-sm text-gray-500 mb-1">Phone Numbers</Text>
          {phoneNumbers.map((phone) => (
            <View
              key={phone.id}
              className="flex-row items-center justify-between px-4 py-3 bg-gray-50 rounded-xl shadow-sm mt-2"
            >
              <Text className="text-gray-800">{phone.phoneNumber}</Text>
              <TouchableOpacity>
                <Feather name="trash-2" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity className="mt-2">
            <Text className="text-blue-600 text-sm font-medium">+ Add Phone Number</Text>
          </TouchableOpacity>
        </View>

        <View className="h-px bg-gray-200 my-2" />

        <View className="mb-2">
          <Text className="text-sm text-gray-500 mb-1">Email Addresses</Text>
          {emails.map((email) => (
            <View
              key={email.id}
              className="flex-row items-center justify-between px-4 py-3 bg-gray-50 rounded-xl shadow-sm mt-2"
            >
              <Text className="text-gray-800">{email.email}</Text>
              <TouchableOpacity>
                <Feather name="trash-2" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity className="mt-2">
            <Text className="text-blue-600 text-sm font-medium">+ Add Email Address</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Business Info Card */}
      <View className="bg-white rounded-2xl p-5 mb-6 border border-gray-100 shadow-sm">
        <Text className="text-lg font-bold text-gray-900 mb-4">Business Details</Text>

        <View className="flex-row justify-between gap-4">
          <View className="flex-1 px-4 py-4 bg-gray-50 rounded-xl shadow-sm">
            <Text className="text-sm text-gray-500">Business Hours</Text>
            <Text className="text-gray-900 mt-1 font-medium">Mon–Sun: 11:00 AM – 11:00 PM</Text>
          </View>
          <View className="flex-1 px-4 py-4 bg-gray-50 rounded-xl shadow-sm">
            <Text className="text-sm text-gray-500">Cuisine Type</Text>
            <Text className="text-gray-900 mt-1 font-medium">French, Contemporary</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
