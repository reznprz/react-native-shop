import React, { useMemo, useState } from 'react';
import { FlatList, Text, TouchableOpacity, StyleSheet, ViewStyle, View } from 'react-native';
import CustomIcon from 'app/components/common/CustomIcon';
import { getFilterIcon } from 'app/hooks/utils/getFilterIcon';
import EmptyState from 'app/components/common/EmptyState';
import { useTheme } from 'app/hooks/useTheme';

interface Props {
  categories: string[];
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
  numColumnsRegisterScreen: number;
  refetchFoods: () => void;
  handleAddNewCategoryClick: () => void;
}

/** helper: 100 % minus a 4 % gap, divided by the column count */
const calcWidth = (cols: number): `${number}%` => `${(100 - 4) / cols}%` as `${number}%`;

const RegisterCategoryList: React.FC<Props> = ({
  categories,
  selectedCategory,
  numColumnsRegisterScreen,
  onSelectCategory,
  refetchFoods,
  handleAddNewCategoryClick,
}) => {
  const theme = useTheme();

  const [refreshing, setRefreshing] = useState(false);

  const boxDynamicStyle = useMemo<ViewStyle>(
    () => ({ width: calcWidth(numColumnsRegisterScreen) }),
    [numColumnsRegisterScreen],
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchFoods();
    setRefreshing(false);
  };

  if (!categories || categories.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <EmptyState
          iconName="food-off"
          message="No Categories available"
          subMessage="Please add categories to start taking orders."
          iconSize={90}
          onAddPress={() => handleAddNewCategoryClick()}
          addButtonLabel="Add New Table"
        />
      </View>
    );
  }

  return (
    <FlatList
      data={categories}
      numColumns={numColumnsRegisterScreen}
      key={numColumnsRegisterScreen} // re‑layout on column change
      keyExtractor={(item) => item}
      contentContainerStyle={styles.listContainer}
      columnWrapperStyle={styles.columnWrapper}
      showsVerticalScrollIndicator={false}
      onRefresh={handleRefresh}
      refreshing={refreshing}
      renderItem={({ item }) => {
        const isSelected = selectedCategory === item;
        const { iconName, iconType } = getFilterIcon('Categories', item);

        return (
          <TouchableOpacity
            onPress={() => onSelectCategory(item)}
            style={[
              styles.box,
              boxDynamicStyle,
              isSelected && { backgroundColor: theme.quaternary },
            ]}
          >
            <View>
              <CustomIcon
                type={iconType}
                name={iconName}
                size={24}
                color={isSelected ? theme.secondaryBg : theme.buttonBg}
              />
            </View>
            <Text style={[styles.label, { color: theme.primary }]} numberOfLines={2}>
              {item}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default RegisterCategoryList;

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 16,
    paddingHorizontal: 6,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  box: {
    borderRadius: 10,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  label: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
