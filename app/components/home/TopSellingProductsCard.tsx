import React from 'react';
import { View, Text } from 'react-native';
import CustomIcon from '../common/CustomIcon';
import { IconType } from 'app/navigation/screenConfigs';
import { TopSellingProduct } from 'app/api/services/restaurantOverviewService';
import EmptyState from '../common/EmptyState';

interface Props {
  topSellingProducts: TopSellingProduct[];
}

const TopSellingProductsCard: React.FC<Props> = ({ topSellingProducts }) => {
  return (
    <View className="bg-white rounded-lg p-5 mt-4 shadow-sm">
      <Text className="text-lg font-bold mb-5">Top Selling Products</Text>

      {!topSellingProducts || topSellingProducts.length === 0 ? (
        <EmptyState
          iconName="package-variant"
          message="No Products available"
          subMessage="Create new Orders or refresh the screen!."
          iconSize={60}
        />
      ) : (
        <>
          {topSellingProducts.map((product, index) => (
            <View key={index} className="flex-row justify-between items-start mb-5">
              {/* Left: Icon + Name + Orders */}
              <View className="flex-row items-start">
                <View
                  className="p-3 rounded-lg mr-4"
                  style={{ backgroundColor: product.iconMetadata.bgColor }}
                >
                  <CustomIcon
                    name={product.iconMetadata.iconName}
                    type={product.iconMetadata.iconType as IconType}
                    size={20}
                    color={product.iconMetadata.filledColor}
                    validate={true}
                  />
                </View>
                <View>
                  <Text className="text-black font-semibold">{product.name}</Text>
                  <Text className="text-gray-500 text-sm mt-1">{product.totalNoSold} orders</Text>
                </View>
              </View>

              {/* Right: Total Sales */}
              <Text className="text-black font-semibold">रु {product.totalSales.toFixed(2)}</Text>
            </View>
          ))}
        </>
      )}
    </View>
  );
};

export default TopSellingProductsCard;
