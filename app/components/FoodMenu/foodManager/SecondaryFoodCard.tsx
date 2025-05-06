import MaterialIcons from '@expo/vector-icons/build/MaterialIcons';
import { Food } from 'app/api/services/foodService';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SwipeRow } from 'react-native-swipe-list-view';

interface SecondaryFoodCardProps {
  food: Food;
  isMobile: boolean;
  onUpdate?: () => void;
  onDelete?: () => void;
}

const ITEM_HEIGHT = 155;
const SWIPE_WIDTH = 200;

const SecondaryFoodCard: React.FC<SecondaryFoodCardProps> = ({
  food,
  isMobile,
  onUpdate,
  onDelete,
}) => {
  const imageUrl = food.img?.trim() ? food.img : 'https://picsum.photos/300/200';

  return (
    // @ts-ignore
    <SwipeRow rightOpenValue={-SWIPE_WIDTH} disableLeftSwipe={false} disableRightSwipe={true}>
      {/* Hidden Swipe Buttons */}
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[styles.updateButton, { backgroundColor: '#2a4759' }]}
          onPress={onUpdate}
        >
          <MaterialIcons name="edit" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: 'red' }]}
          onPress={onDelete}
        >
          <MaterialIcons name="delete" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>

      {/* Front Card View */}
      <View className="flex-row p-4 bg-white rounded-2xl shadow-sm border border-gray-200 mb-3">
        {/* Image */}
        <Image
          source={{ uri: imageUrl }}
          className={`${isMobile ? 'w-20 h-20' : 'w-28 h-28'} rounded-lg mr-4`}
          resizeMode="cover"
        />

        {/* Content */}
        <View className="flex-1 justify-between">
          {/* Header */}
          <View className="flex-row justify-between items-start mb-1">
            <View>
              <Text className="text-gray-900 font-semibold text-base mb-0.5">{food.name}</Text>
              <Text className="text-gray-500 text-xs">Category: {food.categoryName}</Text>
            </View>
          </View>

          {/* Description */}
          <Text
            className={`text-gray-700 ${isMobile ? 'text-xs' : 'text-sm'} mb-2`}
            numberOfLines={2}
          >
            {food.description}
          </Text>

          {/* Info Grid */}
          <View
            className={`flex-row flex-wrap ${isMobile ? 'gap-y-2' : 'gap-y-1'} justify-between`}
          >
            <View className="w-[48%]">
              <Text className="text-gray-400 text-xs">Regular Price</Text>
              <Text className="text-gray-800 font-medium text-sm">${food.price.toFixed(2)}</Text>
            </View>
            <View className="w-[48%]">
              <Text className="text-gray-400 text-xs">Tourist Price</Text>
              <Text className="text-gray-800 font-medium text-sm">
                ${food.touristPrice.toFixed(2)}
              </Text>
            </View>
            <View className="w-[48%]">
              <Text className="text-gray-400 text-xs">Calories</Text>
              <Text className="text-gray-800 font-medium text-sm">{food.calories} kcal</Text>
            </View>
            <View className="w-[48%]">
              <Text className="text-gray-400 text-xs">Serving Size</Text>
              <Text className="text-gray-800 font-medium text-sm">{food.servingSize}</Text>
            </View>
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
