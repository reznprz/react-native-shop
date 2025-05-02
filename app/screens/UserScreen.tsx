import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import IconLabel from 'app/components/common/IconLabel';
import CustomButton from 'app/components/common/button/CustomButton';
import FoodLoadingSpinner from 'app/components/FoodLoadingSpinner';
import EmptyState from 'app/components/common/EmptyState';
import NotificationBar from 'app/components/common/NotificationBar';
import CustomIcon from 'app/components/common/CustomIcon';
import { IconType } from 'app/navigation/screenConfigs';
import ConfirmationModal from 'app/components/modal/ConfirmationModal';
import UserDetailCard from 'app/components/user/UserDetailCard';
import { useUsers } from 'app/hooks/useUser';
import AddUserModal from 'app/components/modal/AddUserModal';
import { User, UserRegisterRequest } from 'app/api/services/userService';

const UserScreen = () => {
  const {
    users,
    getUsersState,
    fetchUsers,
    createUserMutation,
    deleteUserState,
    handleDeleteUser,
  } = useUsers();

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [errorNotification, setErrorNotificaton] = useState('');
  const [successNotification, setSuccessNotificaton] = useState('');
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState<number | null>(
    null,
  );

  const {
    mutate: addUser,
    status: addUserState,
    reset: addUserReset,
    error: addUserError,
  } = createUserMutation;

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (addUserState === 'error') {
      setErrorNotificaton(addUserError?.message || 'Opps Something went wrong!.');
      addUserReset?.();
    }
    if (addUserState === 'success') {
      setSuccessNotificaton('New user added!.');
      addUserReset?.();
    }
  }, [getUsersState]);

  useEffect(() => {
    if (deleteUserState.status === 'error') {
      setErrorNotificaton(deleteUserState.error?.message || 'Opps Something went wrong!.');
      deleteUserState.reset?.();
    }
    if (deleteUserState.status === 'success') {
      setSuccessNotificaton('User removed success!.');
      deleteUserState.reset?.();
    }
  }, [deleteUserState]);

  return (
    <View className="flex-1 bg-gray-100 p-4">
      {/* Add User Button */}
      <View className="flex-row justify-end items-end ml-2 mt-1 mb-6">
        <CustomButton
          title={'+ Add User'}
          onPress={() => {
            setShowAddUserModal(true);
          }}
          customButtonStyle="w-40 h-12 mr-2 flex items-center justify-center rounded-lg  bg-[#2a4759] shadow-md"
        />
      </View>

      {getUsersState?.status === 'pending' || addUserState === 'pending' ? (
        <FoodLoadingSpinner iconName="coffee" />
      ) : !users || users.length === 0 ? (
        <EmptyState
          iconName="user"
          message="No User available"
          subMessage="Please add new User ."
          iconSize={100}
        />
      ) : (
        <>
          <ScrollView style={{ backgroundColor: '#f9fafb' }}>
            {/* Expenses List */}
            <View className="bg-white rounded-lg shadow-sm">
              {/* Search Bar */}
              <View className="flex-row items-between p-5 justify-between rounded-lg shadow-xl border-b border-gray-200">
                <Text className="text-center text-black font-semibold text-xl mt-2">All Users</Text>
                <View className="flex-row">
                  <View className="flex-row shadow-sm rounded-md border border-gray-200 p-2">
                    <Feather name="search" size={20} color="gray" />
                    <TextInput placeholder="Search users..." className="ml-2 text-black-700" />
                  </View>
                  <IconLabel
                    iconType={'Fontisto'}
                    iconName={'filter'}
                    iconSize={16}
                    iconColor={'#2A4759'}
                    bgColor={`bg-white`}
                    containerStyle="border border-gray-200 rounded-md ml-2"
                  />
                </View>
              </View>
              {users.map((user) => (
                <UserDetailCard
                  key={user.id}
                  user={user}
                  iconBgColor={`blue-400`}
                  icon={
                    <CustomIcon
                      name={'account-tie-outline'}
                      type={'MaterialCommunityIcons'}
                      size={30}
                    />
                  }
                  onDelete={() => {
                    setShowDeleteConfirmationModal(user.id);
                  }}
                />
              ))}
            </View>
          </ScrollView>
        </>
      )}

      <AddUserModal
        visible={showAddUserModal}
        onRequestClose={() => setShowAddUserModal(false)}
        onAddUser={(data) => {
          // Validate the data before sending it to the API and mapped to request obj
          const newUser: UserRegisterRequest = {
            restaurantName: '',
            accessLevel: data.accessLevel,
            firstName: data.firstName,
            lastName: data.lastName,
            username: data.username,
            password: data.passcode,
            phoneNumber: data.phoneNumber,
            email: data.email,
          };

          // Call the API to create the user
          addUser({ newUser: newUser });
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
            handleDeleteUser(showDeleteConfirmationModal);
          }
          setShowDeleteConfirmationModal(null);
        }}
        confirmationText="Are you sure you want to delete this user? This action cannot be undone."
      />
    </View>
  );
};

export default UserScreen;
