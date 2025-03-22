import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import CustomIcon from './CustomIcon';
import { FilterStatus } from '../filter/filter';
import FilterHeader from '../filter/FilterHeader';
import {
  DateRangePickerModal,
  DateRangeSelection,
  DateRangeSelectionType,
} from '../DateRangePickerModal';

type OrderScreenHeaderProps = {
  orderStatuses: FilterStatus[];
  paymentStatuses: FilterStatus[];
  orderTypes: FilterStatus[];
  paymentMethods: FilterStatus[];
  activeTab: string;
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
  onFilterPress,
  onRemoveFilter,
  onOverflowPress,
  handleApplyDate,
}) => {
  // For the date range picker
  const [isRangeModalVisible, setRangeModalVisible] = useState(false);
  // We'll store the user-selected date range as a string, e.g. "2025-03-20 → 2025-03-22"
  const [displayDateRange, setDisplayDateRange] = useState('today');

  // Combine all filters into one array
  const combinedFilters = useMemo(() => {
    const statuses = [...orderStatuses, ...paymentStatuses, ...orderTypes, ...paymentMethods];
    return statuses.filter((f) => f.isSelected);
  }, [orderStatuses, paymentStatuses, orderTypes, paymentMethods]);

  const handleDateRangeApply = (selection: DateRangeSelection) => {
    setRangeModalVisible(false);

    switch (selection.selectionType) {
      case DateRangeSelectionType.QUICK_RANGE:
        // e.g. "Past 15 Mins"
        setDisplayDateRange(selection.quickRange.label);
        break;

      case DateRangeSelectionType.TIME_RANGE_TODAY: {
        // e.g. "Today 00:00 to 01:00"
        const { startHour, startMin, endHour, endMin } = selection;
        const formatHM = (h: number, m: number) =>
          `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        setDisplayDateRange(
          `Today ${formatHM(startHour, startMin)} → ${formatHM(endHour, endMin)}`,
        );
        break;
      }

      case DateRangeSelectionType.SINGLE_DATE: {
        // e.g. "2025-03-25"
        const dateStr = selection.date;
        setDisplayDateRange(`Date: ${dateStr}`);
        break;
      }

      case DateRangeSelectionType.DATE_RANGE: {
        // e.g. "2025-03-20 → 2025-03-22"
        const startStr = selection.startDate;
        const endStr = selection.endDate;
        setDisplayDateRange(`${startStr} → ${endStr}`);
        break;
      }
    }

    handleApplyDate(selection);
  };

  return (
    <View>
      <View
        style={{
          ...styles.headerRow,
          ...(activeTab !== 'Past Orders' && { borderWidth: 0, backgroundColor: '#F3F4F6' }),
        }}
      >
        {/* Only show date range button if tab = "Past Orders" (per your old logic) */}
        {activeTab === 'Past Orders' ? (
          <TouchableOpacity onPress={() => setRangeModalVisible(true)} style={styles.dateRangeBtn}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome5 name="calendar-alt" size={16} color="gray" />
              <Text style={styles.dateRangeBtnText}>{displayDateRange}</Text>
              <FontAwesome5 name="chevron-down" size={12} color="gray" />
            </View>
          </TouchableOpacity>
        ) : (
          <View />
        )}

        {/* Filter Button & FilterHeader */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {combinedFilters.length > 0 ? (
            <Pressable onPress={onFilterPress}>
              <CustomIcon name="filter" size={20} color="#2A4759" type="Fontisto" />
            </Pressable>
          ) : (
            <Pressable
              onPress={onFilterPress}
              style={({ pressed }) => [
                styles.filterBtn,
                pressed && { transform: [{ scale: 0.97 }] },
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <CustomIcon name="filter" size={16} color="#fff" type="Fontisto" />
                <Text style={styles.filterBtnText}>Filters</Text>
              </View>
            </Pressable>
          )}
          <FilterHeader
            filters={combinedFilters}
            onRemoveFilter={onRemoveFilter}
            onOverflowPress={onOverflowPress}
          />
        </View>
      </View>

      {/* The custom Date Range Modal */}
      <DateRangePickerModal
        visible={isRangeModalVisible}
        onClose={() => setRangeModalVisible(false)}
        onApply={(selectedDateRange) => {
          handleDateRangeApply(selectedDateRange);
        }}
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
  filterBtn: {
    backgroundColor: '#2A4759',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2A4759',
    marginRight: 8,
  },
  filterBtnText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 6,
  },
});
