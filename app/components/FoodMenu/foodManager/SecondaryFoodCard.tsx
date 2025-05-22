import MaterialIcons from '@expo/vector-icons/build/MaterialIcons';
import { Food } from 'app/api/services/foodService';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { SwipeRow } from 'react-native-swipe-list-view';

interface SecondaryFoodCardProps {
  food: Food;
  isMobile: boolean;
  onUpdate: (food: Food) => void;
  onDelete: (foodId: number) => void;
}

const ITEM_HEIGHT = 150;
const SWIPE_WIDTH = 220;

const SecondaryFoodCard: React.FC<SecondaryFoodCardProps> = ({
  food,
  isMobile,
  onUpdate,
  onDelete,
}) => {
  const img = food.img?.trim() ? food.img : 'https://picsum.photos/300/200';
  const { width } = useWindowDimensions();

  return (
    // @ts-ignore
    <SwipeRow rightOpenValue={-SWIPE_WIDTH} disableLeftSwipe={false} disableRightSwipe={true}>
      {/* Hidden Swipe Buttons */}
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[styles.updateButton, { backgroundColor: '#2a4759' }]}
          onPress={() => onUpdate(food)}
        >
          <MaterialIcons name="edit" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: 'red' }]}
          onPress={() => onDelete(food.id)}
        >
          <MaterialIcons name="delete" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>

      {/* Front Card View */}
      <View className="flex-row  px-4  mx-2 mt-1 py-4  bg-white rounded-2xl shadow-sm border border-gray-200 mb-4">
        {/* Image */}
        <Image
          source={{ uri: img }}
          className="self-center mr-3 rounded-lg
                     w-20 h-20      /* phone */
                     sm:w-24 sm:h-24
                     md:w-28 md:h-28"
          resizeMode="cover"
        />

        {/* Content */}
        <View className="flex-1 justify-between">
          {/* Header */}
          <View className="flex-row justify-between items-start mb-2">
            <View>
              <Text className="text-gray-900 font-semibold text-lg mb-0.5">{food.name}</Text>
              <Text className="text-gray-500 text-md">Category: {food.categoryName}</Text>
            </View>
          </View>

          {/* Description */}
          {food.description && food.description.length > 0 && (
            <Text
              className={`text-gray-700 ${isMobile ? 'text-xs' : 'text-sm'} mb-2`}
              numberOfLines={2}
            >
              {food.description}
            </Text>
          )}

          {/* Info Grid */}
          <View className="flex-row flex-wrap justify-between gap-x-2 gap-y-1">
            {[
              { label: 'Regular Price', value: `रु ${food.price.toFixed(2)}` },
              { label: 'Tourist Price', value: `रु ${food.touristPrice.toFixed(2)}` },
              { label: 'Calories', value: `${food.calories || 0} kcal` },
              { label: 'Serving Size', value: food.servingSize },
            ].map((item) => (
              <View key={item.label} className="w-[48%]">
                <Text className="text-[14px] sm:text-[18px] md:text-[18px] lg:text-base text-gray-400 uppercase">
                  {item.label}
                </Text>
                <Text className="text-base sm:text-sm md:text-base text-gray-800 font-medium">
                  {item.value && item.value.length > 0 ? item.value : 'N/A'}
                </Text>
              </View>
            ))}
          </View>

          {/* Kitchen Tag */}
          {food.isKitchenFood && (
            <View className="mt-2">
              <Text className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full self-start">
                🍽️ Kitchen Food
              </Text>
            </View>
          )}
        </View>
      </View>
    </SwipeRow>
  );
};

export default SecondaryFoodCard;

const styles = StyleSheet.create({
  rowBack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: ITEM_HEIGHT,
    marginRight: 14,
    marginTop: 8,
  },
  backButton: {
    width: SWIPE_WIDTH / 2,
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    marginTop: 2,
  },
  updateButton: {
    width: SWIPE_WIDTH / 2,
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  buttonText: {
    color: '#FFF',
    marginTop: 4,
    fontSize: 12,
  },
});
