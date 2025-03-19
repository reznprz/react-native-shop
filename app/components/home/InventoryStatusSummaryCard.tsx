import { InventoryStatus } from 'app/api/services/restaurantOverviewService';
import React from 'react';
import { View, Text } from 'react-native';
import EmptyState from '../common/EmptyState';

interface Props {
  inventoryStatus: InventoryStatus[];
}

const getStatusColor = (percentage: number) => {
  if (percentage >= 75) return 'text-green-600';
  if (percentage >= 50) return 'text-blue-600';
  if (percentage >= 30) return 'text-yellow-600';
  return 'text-red-600';
};

const InventoryStatusSummaryCard: React.FC<Props> = ({ inventoryStatus }) => {
  return (
    <View className="bg-white rounded-lg p-5 mt-4 shadow-sm">
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-lg font-bold">Inventory Status</Text>
        <Text className="text-blue-600 font-medium">View Details</Text>
      </View>

      {/* Responsive Two-column layout */}
      <View className="flex flex-row flex-wrap -mx-2">
        {!inventoryStatus || inventoryStatus.length === 0 ? (
          <EmptyState
            iconName="warehouse"
            message="No Inventory available"
            subMessage="Add Inventory or refresh the screen!."
            iconSize={60}
          />
        ) : (
          <>
            {inventoryStatus.map((item, index) => (
              <View key={index} className="w-full sm:w-1/2 px-2 mb-4 h-28">
                <View className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-full">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-black font-semibold">{item.name}</Text>
                    <Text className={`${getStatusColor(item.percentage)} font-semibold`}>
                      {item.percentage}%
                    </Text>
                  </View>

                  {/* Progress Bar */}
                  <View className="h-2 rounded-full bg-gray-200 overflow-hidden mb-3">
                    <View
                      className="h-2 bg-gray-700 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </View>

                  <Text className="text-gray-600">{item.status}</Text>
                </View>
              </View>
            ))}
          </>
        )}
      </View>
    </View>
  );
};

export default InventoryStatusSummaryCard;
