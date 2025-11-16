import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { FilterStatus } from '../filter/filter';
import { DateRangePickerModal } from '../DateRangePickerModal';
import { DateRangeSelection, getDisplayDateRange } from '../date/utils';

import CustomIcon from './CustomIcon';
import FilterHeader from '../filter/FilterHeader';
import { useTheme } from 'app/hooks/useTheme';

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
  const theme = useTheme();

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

  const showPastOrdersControls = activeTab === 'Past Orders';

  return (
    <View>
      <View
        style={[
          styles.headerRow,
          showPastOrdersControls
            ? {
                backgroundColor: theme.secondaryBg,
                borderColor: theme.secondaryBtnBg,
                borderWidth: 1,
              }
            : {
                backgroundColor: theme.primaryBg,
                borderWidth: 0,
              },
        ]}
      >
        {showPastOrdersControls ? (
          <TouchableOpacity
            onPress={() => setRangeModalVisible(true)}
            style={[
              styles.dateRangeBtn,
              {
                backgroundColor: theme.secondaryBg,
                borderColor: theme.secondaryBtnBg,
              },
            ]}
          >
            <View style={styles.btnContent}>
              <FontAwesome5 name="calendar-alt" size={16} color={theme.textTertiary} />
              <Text style={[styles.dateRangeBtnText, { color: theme.textTertiary }]}>
                {displayDateRange}
              </Text>
              <FontAwesome5 name="chevron-down" size={12} color={theme.textTertiary} />
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
              combinedFilters.length === 0 && {
                backgroundColor: theme.secondary,
                borderColor: theme.secondary,
              },
              combinedFilters.length > 0 && {
                backgroundColor: 'transparent',
              },
            ]}
          >
            <View style={styles.btnContent}>
              <CustomIcon
                name="filter"
                size={combinedFilters.length > 0 ? 20 : 16}
                type="Fontisto"
                color={
                  combinedFilters.length > 0
                    ? theme.secondary // icon on transparent bg
                    : theme.textPrimary // icon on solid secondary bg
                }
              />
              {combinedFilters.length === 0 && (
                <Text style={[styles.filterBtnText, { color: theme.textPrimary }]}>Filters</Text>
              )}
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
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  dateRangeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  dateRangeBtnText: {
    marginHorizontal: 6,
    fontWeight: '600',
  },
  dateRangeBtnPlaceholder: {
    width: 1, // keeps spacing when button hidden
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
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    marginRight: 8,
  },
  pressedBtn: {
    transform: [{ scale: 0.97 }],
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterBtnText: {
    fontSize: 16,
    marginLeft: 6,
  },
});
