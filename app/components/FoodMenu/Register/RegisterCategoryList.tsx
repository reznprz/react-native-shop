import React, { useMemo } from 'react';
import { FlatList, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useIsDesktop } from 'app/hooks/useIsDesktop';

interface Props {
  categories: string[];
  onSelectCategory: (category: string) => void;
}

/** helper: 100 % minus a 4 % gap, divided by the column count */
const calcWidth = (cols: number): `${number}%` => `${(100 - 4) / cols}%` as `${number}%`;

const RegisterCategoryList: React.FC<Props> = ({ categories, onSelectCategory }) => {
  const { numColumnsRegisterScreen } = useIsDesktop();

  const boxDynamicStyle = useMemo<ViewStyle>(
    () => ({ width: calcWidth(numColumnsRegisterScreen) }),
    [numColumnsRegisterScreen],
  );

  return (
    <FlatList
      data={categories}
      numColumns={numColumnsRegisterScreen}
      key={numColumnsRegisterScreen} // re‑layout on column change
      keyExtractor={(item) => item}
      contentContainerStyle={styles.listContainer}
      columnWrapperStyle={styles.columnWrapper}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => onSelectCategory(item)}
          style={[styles.box, boxDynamicStyle]}
        >
          <Text style={styles.label} numberOfLines={2}>
            {item}
          </Text>
        </TouchableOpacity>
      )}
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
    backgroundColor: '#ffffff',
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
    color: '#2a4759',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
