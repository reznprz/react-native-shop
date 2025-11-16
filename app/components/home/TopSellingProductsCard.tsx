import React from 'react';
import { View, Text } from 'react-native';
import CustomIcon from '../common/CustomIcon';
import { IconType } from 'app/navigation/screenConfigs';
import { TopSellingProduct } from 'app/api/services/restaurantOverviewService';
import EmptyState from '../common/EmptyState';
import CustomButton from '../common/button/CustomButton';
import { RequirePermission } from 'app/security/RequirePermission';
import { Permission } from 'app/security/permission';
import { useTheme } from 'app/hooks/useTheme';

interface Props {
  topSellingProducts: TopSellingProduct[];
  onViewAllPress?: () => void;
}

const TopSellingProductsCard: React.FC<Props> = ({ topSellingProducts, onViewAllPress }) => {
  const theme = useTheme();

  return (
    <View className="bg-white rounded-lg p-5  shadow-sm">
      {!topSellingProducts || topSellingProducts.length === 0 ? (
        <EmptyState
          iconName="package-variant"
          message="No Products available"
          subMessage="Create new Orders or refresh the screen!."
          iconSize={60}
        />
      ) : (
        <>
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-lg font-bold">Top Selling Products</Text>
            {onViewAllPress && (
              <CustomButton
                title="View All"
                onPress={() => {
                  onViewAllPress();
                }}
                buttonType="TouchableOpacity"
                buttonStyle={{
                  backgroundColor: 'transparent',
                  paddingVertical: 0,
                  paddingHorizontal: 0,
                  elevation: 0,
                }}
                textStyle={{
                  color: theme.secondary,
                  fontSize: 16,
                  fontWeight: '800',
                }}
              />
            )}
          </View>
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

              <RequirePermission permission={Permission.VIEW_HOME_SCREEN_TOPSOLDITEM_AMOUNT}>
                {/* Right: Total Sales */}
                <Text className="text-black font-semibold">रु {product.totalSales.toFixed(2)}</Text>
              </RequirePermission>
            </View>
          ))}
        </>
      )}
    </View>
  );
};

export default TopSellingProductsCard;
