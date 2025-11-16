import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, GestureResponderEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { BaseBottomSheetModal } from '../common/modal/BaseBottomSheetModal';
import CheckableChip from '../common/CheckableChip';
import FiltersSection from './FiltersSection';
import { Filter, FilterStatus, ALL_FILTER } from './filter';
import CustomIcon from '../common/CustomIcon';
import CustomButton from '../common/button/CustomButton';
import { useTheme } from 'app/hooks/useTheme';

interface FiltersBottomSheetModalProps {
  visible: boolean;
  orderStatuses: FilterStatus[];
  paymentStatuses: FilterStatus[];
  orderTypes: FilterStatus[];
  paymentMethods: FilterStatus[];
  onClose: () => void;
  onApplyFilters: (
    finalOrderStatuses: FilterStatus[],
    finalPaymentStatuses: FilterStatus[],
    finalOrderTypes: FilterStatus[],
    finalPaymentMethods: FilterStatus[],
  ) => void;
  onClearFilter: () => void;
}

export const FiltersBottomSheetModal: React.FC<FiltersBottomSheetModalProps> = ({
  visible,
  orderStatuses,
  paymentStatuses,
  orderTypes,
  paymentMethods,
  onClose,
  onApplyFilters,
  onClearFilter,
}) => {
  const theme = useTheme();

  //  Local Filter States
  const [orderStatusesFilter, setOrderStatusesFilter] = useState(
    () =>
      new Filter(
        orderStatuses.map((f) => f.name),
        orderStatuses,
      ),
  );
  const [paymentStatusesFilter, setPaymentStatusesFilter] = useState(
    () =>
      new Filter(
        paymentStatuses.map((f) => f.name),
        paymentStatuses,
      ),
  );
  const [orderTypesFilter, setOrderTypesFilter] = useState(
    () =>
      new Filter(
        orderTypes.map((f) => f.name),
        orderTypes,
      ),
  );
  const [paymentMethodsFilter, setPaymentMethodsFilter] = useState(
    () =>
      new Filter(
        paymentMethods.map((f) => f.name),
        paymentMethods,
      ),
  );

  // Sync State on Parent Change
  useEffect(() => {
    setOrderStatusesFilter(
      new Filter(
        orderStatuses.map((f) => f.name),
        orderStatuses,
      ),
    );
  }, [orderStatuses]);

  useEffect(() => {
    setPaymentStatusesFilter(
      new Filter(
        paymentStatuses.map((f) => f.name),
        paymentStatuses,
      ),
    );
  }, [paymentStatuses]);

  useEffect(() => {
    setOrderTypesFilter(
      new Filter(
        orderTypes.map((f) => f.name),
        orderTypes,
      ),
    );
  }, [orderTypes]);

  useEffect(() => {
    setPaymentMethodsFilter(
      new Filter(
        paymentMethods.map((f) => f.name),
        paymentMethods,
      ),
    );
  }, [paymentMethods]);

  const anyOrderStatusesSelected = useMemo(
    () => orderStatusesFilter.filterStatuses.some((f) => f.isSelected && f.name !== ALL_FILTER),
    [orderStatusesFilter],
  );
  const anyPaymentStatusesSelected = useMemo(
    () => paymentStatusesFilter.filterStatuses.some((f) => f.isSelected && f.name !== ALL_FILTER),
    [paymentStatusesFilter],
  );
  const anyOrderTypesSelected = useMemo(
    () => orderTypesFilter.filterStatuses.some((f) => f.isSelected && f.name !== ALL_FILTER),
    [orderTypesFilter],
  );
  const anyPaymentMethodsSelected = useMemo(
    () => paymentMethodsFilter.filterStatuses.some((f) => f.isSelected && f.name !== ALL_FILTER),
    [paymentMethodsFilter],
  );

  const handleApply = () => {
    onApplyFilters(
      orderStatusesFilter.getFinalFilterStatuses(),
      paymentStatusesFilter.getFinalFilterStatuses(),
      orderTypesFilter.getFinalFilterStatuses(),
      paymentMethodsFilter.getFinalFilterStatuses(),
    );
    onClose();
  };

  // ====== Create a list for filter sections ======
  const filterSections = [
    {
      title: 'Order Status',
      filter: orderStatusesFilter,
      anySelected: anyOrderStatusesSelected,
      setFilter: setOrderStatusesFilter,
    },
    {
      title: 'Payment Status',
      filter: paymentStatusesFilter,
      anySelected: anyPaymentStatusesSelected,
      setFilter: setPaymentStatusesFilter,
    },
    {
      title: 'Order Types',
      filter: orderTypesFilter,
      anySelected: anyOrderTypesSelected,
      setFilter: setOrderTypesFilter,
    },
    {
      title: 'Payment Methods',
      filter: paymentMethodsFilter,
      anySelected: anyPaymentMethodsSelected,
      setFilter: setPaymentMethodsFilter,
    },
  ];

  return (
    <BaseBottomSheetModal visible={visible} onClose={onClose}>
      <ScrollView contentContainerStyle={styles.modalContent}>
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <CustomIcon name="filter" size={18} color={theme.secondary} type="Fontisto" />
            <Text style={[styles.headerTitle, { color: theme.secondary }]}>Filters</Text>
          </View>
          <Pressable
            onPress={onClose}
            style={[styles.closeIcon, { backgroundColor: theme.primaryBg }]}
          >
            <Ionicons name="close" size={24} color={theme.secondary} />
          </Pressable>
        </View>

        {filterSections.map(({ title, filter, anySelected, setFilter }) => (
          <FiltersSection
            key={title}
            title={title}
            filters={filter.selectAllFilterIfAllSelected(anySelected)}
            context={(status) => (
              <CheckableChip
                key={status.name}
                label={status.name}
                isChecked={status.isSelected}
                onClick={() => setFilter((prev) => prev.updateFilterWithAll(status))}
              />
            )}
          />
        ))}

        <View className="flex-row mt-4 pb-[8px] justify-end gap-4 mr-6">
          <CustomButton
            title={'Clear all'}
            onPress={onClearFilter}
            customButtonStyle=" py-3 px-10 mb-3 rounded-lg border border-black shadow"
            customTextStyle="text-black font-semibold text-xl text-center"
          />
          <CustomButton
            title={'Apply Filters'}
            onPress={handleApply}
            customButtonStyle=" bg-deepTeal py-3 px-10 mb-3 rounded-lg shadow"
            customTextStyle="text-white font-semibold text-xl text-center"
          />
        </View>
      </ScrollView>
    </BaseBottomSheetModal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 12,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeIcon: {
    padding: 6,
    borderRadius: 50,
  },
});
