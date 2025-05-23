import React from 'react';
import { View, Text } from 'react-native';
import { RestaurantSubscriptionSummary } from 'app/api/services/restaurantService';
import { Feather } from '@expo/vector-icons';

interface PlanSummaryCardProps {
  summary: RestaurantSubscriptionSummary;
}

const PlanSummaryCard: React.FC<PlanSummaryCardProps> = ({ summary }) => {
  const { plan } = summary;

  return (
    <View className="bg-white rounded-2xl p-5 mb-6 border border-gray-100 shadow-sm">
      <Text className="text-lg font-bold text-gray-900 mb-2">Plan Summary</Text>

      <View className="mb-3">
        <Text className="text-sm text-gray-500">Plan</Text>
        <Text className="text-base text-gray-900 font-semibold mt-1">{plan.planName || '—'}</Text>
      </View>

      <View className="flex-row justify-between">
        <View>
          <Text className="text-sm text-gray-500">Monthly Cost</Text>
          <Text className="text-base text-gray-900 font-medium mt-1">
            रु{plan.monthlyCost.toFixed(2)}
          </Text>
        </View>
        <View>
          <Text className="text-sm text-gray-500">Yearly Cost</Text>
          <Text className="text-base text-gray-900 font-medium mt-1">
            रु{plan.yearlyCost.toFixed(2)}
          </Text>
        </View>
      </View>

      <View className="mt-4">
        <Text className="text-sm text-gray-500 mb-2">Features</Text>
        {plan.features.length === 0 ? (
          <Text className="text-gray-400 italic text-sm">No features listed.</Text>
        ) : (
          plan.features.map((feature, idx) => (
            <View key={idx} className="flex-row items-center mb-1">
              <Feather
                name={feature.enabled ? 'check-circle' : 'x-circle'}
                size={16}
                color={feature.enabled ? '#10B981' : '#EF4444'}
                style={{ marginRight: 8 }}
              />
              <Text
                className={`text-sm ${feature.enabled ? 'text-gray-800' : 'text-gray-400 line-through'}`}
              >
                {feature.featureName}
              </Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
};

export default PlanSummaryCard;
