import MaterialIcons from '@expo/vector-icons/build/MaterialIcons';
import { Category } from 'app/api/services/foodService';
import CustomIcon from 'app/components/common/CustomIcon';
import { getFilterIcon } from 'app/hooks/utils/getFilterIcon';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { SwipeRow } from 'react-native-swipe-list-view';

interface SecondaryCategoryCardProps {
  category: Category;
  isMobile: boolean;
  onUpdate: (selectedCat: Category) => void;
  onDelete: (id: number) => void;
}

const ITEM_HEIGHT = 80;
const SWIPE_WIDTH = 200;

const SecondaryCategoryCard: React.FC<SecondaryCategoryCardProps> = ({
  category,
  isMobile,
  onUpdate,
  onDelete,
}) => {
  const { iconName, iconType } = getFilterIcon('Categories', category.name);

  return (
    // @ts-ignore
    <SwipeRow rightOpenValue={-SWIPE_WIDTH} disableLeftSwipe={false} disableRightSwipe={true}>
      {/* Hidden Swipe Buttons */}
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[styles.updateButton, { backgroundColor: '#2a4759' }]}
          onPress={() => onUpdate(category)}
        >
          <MaterialIcons name="edit" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: 'red' }]}
          onPress={() => onDelete(category.id)}
        >
          <MaterialIcons name="delete" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>

      {/* Front Card View */}
      <View className="flex-row px-4  mx-2 mt-1 py-4 bg-white rounded-2xl shadow-sm border border-gray-200 mb-4 ">
        {/* Icon */}
        <View className="p-2">
          <CustomIcon type={iconType} name={iconName} size={30} color={'#2a4759'} />
        </View>
        {/* Content */}
        <View className="flex-1 justify-between">
          {/* Header */}
          <View className="flex-row justify-between items-start mb-2">
            <View>
              <Text className="text-gray-900 font-semibold text-lg mb-1 mt-1 ml-4">
                {category.name}
              </Text>

              <Text className="text-gray-500 text-md ml-4">
                Secondary Name:{' '}
                {category.categoryNameTwo?.length > 0 ? category.categoryNameTwo : 'None'}
              </Text>
            </View>
          </View>

          {/* Description */}
          {category.description && category.description.length > 0 && (
            <Text
              className={`text-gray-700 pl-8 ${isMobile ? 'text-xs' : 'text-sm'} mb-2`}
              numberOfLines={2}
            >
              {category.description}
            </Text>
          )}
        </View>
      </View>
    </SwipeRow>
  );
};

export default SecondaryCategoryCard;

const styles = StyleSheet.create({
  rowBack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: ITEM_HEIGHT,
    marginRight: 8,
  },
  backButton: {
    width: SWIPE_WIDTH / 2,
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    marginTop: 8,
  },
  updateButton: {
    width: SWIPE_WIDTH / 2,
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFF',
    marginTop: 4,
    fontSize: 12,
  },
});
