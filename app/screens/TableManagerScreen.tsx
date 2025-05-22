import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import CustomButton from 'app/components/common/button/CustomButton';
import FoodLoadingSpinner from 'app/components/FoodLoadingSpinner';
import EmptyState from 'app/components/common/EmptyState';
import NotificationBar from 'app/components/common/NotificationBar';
import ConfirmationModal from 'app/components/modal/ConfirmationModal';
import ListHeader from 'app/components/common/ListHeader';
import TableDetailCard from 'app/components/table/TableDetailCard';
import { useTableManager } from 'app/hooks/useTableManager';
import { useIsDesktop } from 'app/hooks/useIsDesktop';
import AddUpdateTableModal from 'app/components/modal/AddUpdateTableModal';
import { RestaurantTableInfo } from 'app/api/services/tableService';

const TableManagerScreen = () => {
  const {
    restaurantId,
    tables,
    getTableMutation,
    addTableMutation,
    updateTableMutation,
    deleteTableMutation,
  } = useTableManager();

  const { isDesktop } = useIsDesktop();

  const [showAddUpdateTableModal, setShowAddUpdateTableModal] = useState(false);
  const [updateTable, setUpdateTable] = useState<RestaurantTableInfo | null>(null);
  const [errorNotification, setErrorNotificaton] = useState('');
  const [successNotification, setSuccessNotificaton] = useState('');
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState<number | null>(
    null,
  );

  useEffect(() => {
    getTableMutation.mutate({ restaurantId: restaurantId });
  }, []);

  useEffect(() => {
    if (addTableMutation.status === 'error') {
      setErrorNotificaton(addTableMutation.error.message || 'Opps Something went wrong!.');
      addTableMutation.reset?.();
    }
    if (addTableMutation.status === 'success') {
      setSuccessNotificaton('New table added!.');
      addTableMutation.reset?.();
    }
  }, [addTableMutation]);

  useEffect(() => {
    if (updateTableMutation.status === 'error') {
      setErrorNotificaton(updateTableMutation.error?.message || 'Opps Something went wrong!.');
      updateTableMutation.reset?.();
    }
    if (updateTableMutation.status === 'success') {
      setSuccessNotificaton('table updated success!.');
      updateTableMutation.reset?.();
    }
  }, [updateTableMutation]);

  useEffect(() => {
    if (deleteTableMutation.status === 'error') {
      setErrorNotificaton(deleteTableMutation.error?.message || 'Opps Something went wrong!.');
      deleteTableMutation.reset?.();
    }
    if (deleteTableMutation.status === 'success') {
      setSuccessNotificaton('table deleted success!.');
      deleteTableMutation.reset?.();
    }
  }, [deleteTableMutation]);

  const loading =
    getTableMutation?.status === 'pending' ||
    addTableMutation?.status === 'pending' ||
    updateTableMutation?.status === 'pending' ||
    deleteTableMutation?.status === 'pending';

  return (
    <View className="flex-1 bg-gray-100 p-4">
      {/* Add User Button */}
      <View className="flex-row justify-end items-end ml-2 mt-1 mb-6">
        <CustomButton
          title={'+ Add Table'}
          onPress={() => {
            setShowAddUpdateTableModal(true);
          }}
          customButtonStyle="w-40 h-12 mr-2 flex items-center justify-center rounded-lg  bg-[#2a4759] shadow-md"
        />
      </View>

      {loading ? (
        <FoodLoadingSpinner iconName="coffee" />
      ) : !tables || tables.length === 0 ? (
        <EmptyState
          iconName="user"
          message="No Table available"
          subMessage="Please refresh or add new Table ."
          iconSize={100}
        />
      ) : (
        <FlatList
          data={tables}
          keyExtractor={(item) => item.id.toString()}
          numColumns={isDesktop ? 2 : 1}
          key={isDesktop ? 'h' : 'v'}
          ListHeaderComponent={() => (
            <ListHeader
              title="All Tables"
              searchTerm={''}
              searchPlaceholder={'Search tables...'}
              onSearch={() => {}}
            />
          )}
          stickyHeaderIndices={[0]}
          renderItem={({ item }) => (
            <View className={`${isDesktop ? 'w-1/2 p-2' : 'w-full'} `}>
              <TableDetailCard
                key={item.id}
                table={item}
                onDelete={() => {
                  setShowDeleteConfirmationModal(item.id);
                }}
                onUpdate={(selectedTable) => {
                  setUpdateTable(selectedTable);
                  setShowAddUpdateTableModal(true);
                }}
              />
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}

      <AddUpdateTableModal
        table={updateTable}
        visible={showAddUpdateTableModal}
        onClose={() => setShowAddUpdateTableModal(false)}
        onAddUpdateTable={(data) => {
          if (updateTable) {
            updateTableMutation.mutate({ tableId: updateTable.id, updatedTable: data });
          } else {
            addTableMutation.mutate({ restaurantId: restaurantId, newTable: data });
          }
        }}
      />

      <NotificationBar
        message={errorNotification}
        variant="error"
        onClose={() => setErrorNotificaton('')}
      />

      <NotificationBar message={successNotification} onClose={() => setSuccessNotificaton('')} />

      <ConfirmationModal
        visible={showDeleteConfirmationModal !== null}
        onRequestClose={() => setShowDeleteConfirmationModal(null)}
        onConfirm={() => {
          // showDeleteConfirmationModal carry the userId
          if (showDeleteConfirmationModal) {
            deleteTableMutation.mutate({ tableId: showDeleteConfirmationModal });
          }
          setShowDeleteConfirmationModal(null);
        }}
        confirmationText="Are you sure you want to delete this user? This action cannot be undone."
      />
    </View>
  );
};

export default TableManagerScreen;
