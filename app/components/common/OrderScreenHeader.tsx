import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { FilterStatus } from '../filter/filter';
import { DateRangePickerModal } from '../DateRangePickerModal';
import { DateRangeSelection, getDisplayDateRange } from '../date/utils';

import CustomIcon from './CustomIcon';
import FilterHeader from '../filter/FilterHeader';

type OrderScreenHeaderProps = {
  orderStatuses: FilterStatus[];
  paymentStatuses: FilterStatus[];
  orderTypes: FilterStatus[];
  paymentMethods: FilterStatus[];
  activeTab: string;
  selectedDate?: DateRangeSelection | null;
  onFilterPress?: () => void;
  onRemoveFilter: (label: string) => void;
  onOverflowPress: () => void;
  handleApplyDate: (selectedDateRange: DateRangeSelection) => void;
};

const OrderScreenHeader: React.FC<OrderScreenHeaderProps> = ({
  orderStatuses = [],
  paymentStatuses = [],
  orderTypes = [],
  paymentMethods = [],
  activeTab,
  selectedDate,
  onFilterPress,
  onRemoveFilter,
  onOverflowPress,
  handleApplyDate,
}) => {
  const [isRangeModalVisible, setRangeModalVisible] = useState(false);
  const [displayDateRange, setDisplayDateRange] = useState('Last 7 Days');
  const [isPressed, setIsPressed] = useState(false);

  const combinedFilters = useMemo(() => {
    const all = [...orderStatuses, ...paymentStatuses, ...orderTypes, ...paymentMethods];
    return all.filter((f) => f.isSelected);
  }, [orderStatuses, paymentStatuses, orderTypes, paymentMethods]);

  const handleDateRangeApply = (selection: DateRangeSelection) => {
    setRangeModalVisible(false);
    const label = getDisplayDateRange(selection);
    setDisplayDateRange(label);
    handleApplyDate(selection);
  };

  useEffect(() => {
    if (selectedDate) {
      const label = getDisplayDateRange(selectedDate);

      setDisplayDateRange(label);
    }
  }, [selectedDate]);

  return (
    <View>
      <View
        style={{
          ...styles.headerRow,
          ...(activeTab !== 'Past Orders' && {
            borderWidth: 0,
            backgroundColor: '#F3F4F6',
          }),
        }}
      >
        {activeTab === 'Past Orders' ? (
          <TouchableOpacity onPress={() => setRangeModalVisible(true)} style={styles.dateRangeBtn}>
            <View style={styles.btnContent}>
              <FontAwesome5 name="calendar-alt" size={16} color="gray" />
              <Text style={styles.dateRangeBtnText}>{displayDateRange}</Text>
              <FontAwesome5 name="chevron-down" size={12} color="gray" />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.dateRangeBtnPlaceholder} />
        )}

        <View style={styles.filterContainer}>
          <Pressable
            onPress={onFilterPress}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            style={[
              combinedFilters.length > 0 ? styles.iconOnlyBtn : styles.filterBtn,
              isPressed && styles.pressedBtn,
            ]}
          >
            <View style={styles.btnContent}>
              <CustomIcon
                name="filter"
                size={combinedFilters.length > 0 ? 20 : 16}
                color={combinedFilters.length > 0 ? '#2A4759' : '#fff'}
                type="Fontisto"
              />
              {combinedFilters.length === 0 && <Text style={styles.filterBtnText}>Filters</Text>}
            </View>
          </Pressable>

          <FilterHeader
            filters={combinedFilters}
            onRemoveFilter={onRemoveFilter}
            onOverflowPress={onOverflowPress}
          />
        </View>
      </View>

      <DateRangePickerModal
        visible={isRangeModalVisible}
        onClose={() => setRangeModalVisible(false)}
        onApply={handleDateRangeApply}
      />
    </View>
  );
};

export default OrderScreenHeader;

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  dateRangeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F3F5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D4D4D8',
  },
  dateRangeBtnText: {
    marginHorizontal: 6,
    color: '#666',
    fontWeight: '600',
  },
  dateRangeBtnPlaceholder: {
    width: 1, // keeps spacing consistent when the button is hidden
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconOnlyBtn: {
    padding: 8,
    borderRadius: 6,
  },
  filterBtn: {
    backgroundColor: '#2A4759',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2A4759',
    marginRight: 8,
  },
  pressedBtn: {
    transform: [{ scale: 0.97 }],
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSpacing: {
    marginRight: 6,
  },
  filterBtnText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 6,
  },
});
