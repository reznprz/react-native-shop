import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRestaurant } from 'app/hooks/useRestaurant';
import { PlanType, SubscriptionExpirationInfo } from 'app/api/services/authService';
import UserProfileCard from 'app/components/common/UserProfileCard';
import { Feather } from '@expo/vector-icons';
import EditRestaurantModal from 'app/components/profile/EditRestaurantModal';
import {
  ContactRequestDto,
  ContactStatus,
  ContactType,
  RestaurantData,
  RestaurantSubscriptionSummary,
  SubscriptionStatus,
} from 'app/api/services/restaurantService';
import FoodLoadingSpinner from 'app/components/FoodLoadingSpinner';
import NotificationBar from 'app/components/common/NotificationBar';
import InputModal from 'app/components/modal/InputModal';
import StatusModal from 'app/components/modal/StatusModal';
import { StatusChip } from 'app/components/common/StatusChip';
import CustomButton from 'app/components/common/button/CustomButton';
import ConfirmationModal from 'app/components/modal/ConfirmationModal';
import PlanSummaryCard from 'app/components/profile/PlanSummaryCard';

const defaultSubscriptionInfo: SubscriptionExpirationInfo = {
  planType: PlanType.NONE,
  subscriptionExpired: false,
  expirationBannerMessage: 'Your subscription is active.',
  remainingDays: 0,
  remainingHours: 0,
  remainingMinutes: 0,
  remainingSeconds: 0,
};

const defaultRestaurant: RestaurantData = {
  id: 0,
  restaurantName: '',
  description: '',
  imageUrl: '',
  emails: [],
  phones: [],
};

export const defaultRestaurantSubscriptionSummary: RestaurantSubscriptionSummary = {
  status: SubscriptionStatus.INACTIVE,
  plan: {
    planName: '',
    monthlyCost: 0,
    yearlyCost: 0,
    features: [],
  },
};

const ProfileScreen = () => {
  const {
    storedAuthData,
    restaurantData,
    getRestaurantMutation,
    updateRestaurantMutation,
    upsertContactMutation,
    deleteContactMutation,
  } = useRestaurant();
  const {
    restaurantName = '',
    emails = [],
    phones = [],
    description = '',
    imageUrl = '',
    subscriptionSummary = defaultRestaurantSubscriptionSummary,
  } = restaurantData || {};

  const { restaurantId = 0, subscriptionExpirationInfo = defaultSubscriptionInfo } =
    storedAuthData || {};

  const [isRestaurantEditModalVisible, setRestaurantEditModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'phone' | 'email' | null>(null);
  const [modalInput, setModalInput] = useState('');
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [editingStatus, setEditingStatus] = useState<{
    id: number;
    type: ContactType;
    current: ContactStatus;
  } | null>(null);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState<{
    type: ContactType;
    id: number;
  } | null>(null);
  const [successNotification, setSuccessNotificaton] = useState('');
  const [errorNotification, setErrorNotificaton] = useState('');

  useEffect(() => {
    getRestaurantMutation.mutate({ restaurantId: restaurantId });
  }, []);

  useEffect(() => {
    if (updateRestaurantMutation.status === 'error') {
      setErrorNotificaton(updateRestaurantMutation.error?.message || 'Opps Something went wrong!.');
      updateRestaurantMutation.reset?.();
    }
    if (updateRestaurantMutation.status === 'success') {
      setSuccessNotificaton('Update Success!.');
      updateRestaurantMutation.reset?.();
    }
  }, [updateRestaurantMutation]);

  useEffect(() => {
    if (upsertContactMutation.status === 'error') {
      setErrorNotificaton(upsertContactMutation.error?.message || 'Opps Something went wrong!.');
      upsertContactMutation.reset?.();
    }
    if (upsertContactMutation.status === 'success') {
      setSuccessNotificaton('Contact Updated Success!.');
      upsertContactMutation.reset?.();
    }
  }, [upsertContactMutation]);

  useEffect(() => {
    if (deleteContactMutation.status === 'error') {
      setErrorNotificaton(deleteContactMutation.error?.message || 'Opps Something went wrong!.');
      deleteContactMutation.reset?.();
    }
    if (deleteContactMutation.status === 'success') {
      setSuccessNotificaton('Delete Success!.');
      deleteContactMutation.reset?.();
    }
  }, [deleteContactMutation]);

  const handleModalSave = () => {
    if (!modalInput.trim()) {
      return Alert.alert(
        'Validation Error',
        `${modalType === 'phone' ? 'Phone number' : 'Email address'} is required.`,
      );
    }

    const dto: ContactRequestDto = {
      type: modalType === 'phone' ? ContactType.PHONE : ContactType.EMAIL,
      value: modalInput.trim(),
    };

    upsertContactMutation.mutate({ restaurantId, payload: dto });
    setModalType(null);
    setModalInput('');
  };

  const handleStatusSelect = (newStatus: ContactStatus) => {
    if (!editingStatus) return;
    const dto: ContactRequestDto = {
      id: editingStatus.id,
      type: editingStatus.type,
      value: '',
      status: newStatus,
    };
    upsertContactMutation.mutate({ restaurantId, payload: dto });
    setStatusModalVisible(false);
    setEditingStatus(null);
  };

  const handleDelete = (type: ContactType, id: number) => {
    deleteContactMutation.mutate({ restaurantId, type, contactId: id });
  };

  const loading =
    getRestaurantMutation?.status === 'pending' ||
    updateRestaurantMutation?.status === 'pending' ||
    upsertContactMutation?.status === 'pending' ||
    deleteContactMutation?.status === 'pending';

  return (
    <View className="flex-1 bg-gray-100 p-4">
      {loading ? (
        <FoodLoadingSpinner iconName="coffee" />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <UserProfileCard
            name={restaurantName}
            email={description}
            imageUri={imageUrl}
            onEditClick={() => setRestaurantEditModalVisible(true)}
          />

          <View
            className={`flex-row items-start gap-3 p-4 rounded-xl mb-6 shadow-sm border mt-4 ${
              subscriptionExpirationInfo.subscriptionExpired
                ? 'bg-red-50 border-red-200'
                : 'bg-emerald-50 border-emerald-200'
            }`}
          >
            <Feather
              name={
                subscriptionExpirationInfo.subscriptionExpired ? 'alert-triangle' : 'check-circle'
              }
              size={20}
              color={subscriptionExpirationInfo.subscriptionExpired ? '#DC2626' : '#10B981'}
              style={{ marginTop: 2 }}
            />
            <View className="flex-1">
              <Text
                className={`text-sm font-medium ${
                  subscriptionExpirationInfo.subscriptionExpired
                    ? 'text-red-700'
                    : 'text-emerald-700'
                }`}
              >
                {subscriptionExpirationInfo.expirationBannerMessage}
              </Text>
              {!subscriptionExpirationInfo.subscriptionExpired && (
                <Text className="text-xs text-gray-600 mt-1">
                  Time remaining:{' '}
                  <Text className="font-medium text-gray-800">
                    {subscriptionExpirationInfo.remainingDays}d{' '}
                    {subscriptionExpirationInfo.remainingHours}h{' '}
                    {subscriptionExpirationInfo.remainingMinutes}m{' '}
                    {subscriptionExpirationInfo.remainingSeconds}s
                  </Text>
                </Text>
              )}
            </View>
          </View>

          {/* Contact Info Card */}
          <View className="bg-white rounded-2xl p-5 mb-6 border border-gray-100 shadow-sm">
            <Text className="text-lg font-bold text-gray-900 mb-4">Contact Information</Text>

            <View className="mb-5">
              <Text className="text-sm text-gray-500 mb-1">Phone Numbers</Text>
              {phones.map((p) => (
                <View
                  key={p.id}
                  className="flex-row items-center justify-between px-4 py-3 bg-gray-50 rounded-xl shadow-sm mt-2"
                >
                  <View>
                    <Text className="text-gray-800">{p.phoneNumber}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setEditingStatus({ id: p.id, type: ContactType.PHONE, current: p.status });
                        setStatusModalVisible(true);
                      }}
                    >
                      <StatusChip status={p.status} />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      setShowDeleteConfirmationModal({ type: ContactType.PHONE, id: p.id })
                    }
                  >
                    <Feather name="trash-2" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                className="mt-2"
                onPress={() => {
                  setModalType('phone');
                  setModalInput('');
                }}
              >
                <Text className="text-blue-600 text-sm font-medium">+ Add Phone Number</Text>
              </TouchableOpacity>
            </View>

            <View className="h-px bg-gray-200 my-2" />

            <View className="mb-2">
              <Text className="text-sm text-gray-500 mb-1">Email Addresses</Text>
              {emails.map((e) => (
                <View
                  key={e.id}
                  className="px-4 py-3 bg-gray-50 rounded-xl shadow-sm mt-2 flex-col space-y-2"
                >
                  {/* Top Row: Email + Trash */}
                  <View className="flex-row items-center justify-between">
                    <Text className="text-gray-800">{e.email}</Text>
                    <TouchableOpacity
                      onPress={() =>
                        setShowDeleteConfirmationModal({ type: ContactType.EMAIL, id: e.id })
                      }
                    >
                      <Feather name="trash-2" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>

                  {/* Status Row: Touch-enabled chip */}
                  <TouchableOpacity
                    onPress={() => {
                      setEditingStatus({ id: e.id, type: ContactType.EMAIL, current: e.status });
                      setStatusModalVisible(true);
                    }}
                    className="self-start"
                  >
                    <StatusChip status={e.status} />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                className="mt-2"
                onPress={() => {
                  setModalType('email');
                  setModalInput('');
                }}
              >
                <Text className="text-blue-600 text-sm font-medium">+ Add Email Address</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Business Info Card */}
          <View className="bg-white rounded-2xl p-5 mb-6 border border-gray-100 shadow-sm">
            <Text className="text-lg font-bold text-gray-900 mb-4">Business Details</Text>

            <View className="flex-row justify-between gap-4">
              <View className="flex-1 px-4 py-4 bg-gray-50 rounded-xl shadow-sm">
                <Text className="text-sm text-gray-500">Business Hours</Text>
                <Text className="text-gray-900 mt-1 font-medium">Mon–Sun: 11:00 AM – 11:00 PM</Text>
              </View>
              <View className="flex-1 px-4 py-4 bg-gray-50 rounded-xl shadow-sm">
                <Text className="text-sm text-gray-500">Cuisine Type</Text>
                <Text className="text-gray-900 mt-1 font-medium">Newari, Contemporary</Text>
              </View>
            </View>
          </View>

          <PlanSummaryCard summary={subscriptionSummary} />

          {/* Logout Button */}
          <View className="p-2">
            <CustomButton
              title={'Delete Restaurant'}
              onPress={() => {}}
              width="full"
              height="l"
              backgroundColor="#DC2626"
              textColor="black"
              iconType="FontAwesome5"
              iconName="sign-out-alt"
              iconColor="black"
            />
          </View>
        </ScrollView>
      )}
      <EditRestaurantModal
        visible={isRestaurantEditModalVisible}
        onRequestClose={() => setRestaurantEditModalVisible(false)}
        restaurantData={restaurantData ? restaurantData : defaultRestaurant}
        onSave={(updatedRestaurant, filePart) => {
          updateRestaurantMutation.mutate({
            restaurantId: updatedRestaurant.id!,
            updatedRestaurant: updatedRestaurant,
            file: filePart,
          });
        }}
      />
      <NotificationBar message={successNotification} onClose={() => setSuccessNotificaton('')} />
      <NotificationBar
        message={errorNotification}
        variant="error"
        onClose={() => setErrorNotificaton('')}
      />
      {modalType && (
        <InputModal
          visible={!!modalType}
          title={modalType === 'phone' ? 'Add Phone Number' : 'Add Email Address'}
          placeholder={modalType === 'phone' ? 'Enter phone number' : 'Enter email address'}
          value={modalInput}
          onChangeText={setModalInput}
          onSave={handleModalSave}
          onRequestClose={() => {
            setModalType(null);
            setModalInput('');
          }}
        />
      )}

      {editingStatus && (
        <StatusModal
          visible={statusModalVisible}
          selected={editingStatus.current}
          onSelect={handleStatusSelect}
          onRequestClose={() => {
            setStatusModalVisible(false);
            setEditingStatus(null);
          }}
        />
      )}

      <ConfirmationModal
        visible={showDeleteConfirmationModal !== null}
        onRequestClose={() => setShowDeleteConfirmationModal(null)}
        onConfirm={() => {
          // showDeleteConfirmationModal carry the type and id
          if (showDeleteConfirmationModal) {
            handleDelete(showDeleteConfirmationModal.type, showDeleteConfirmationModal.id);
          }
          setShowDeleteConfirmationModal(null);
        }}
        confirmationText="Are you sure you want to delete this user? This action cannot be undone."
      />
    </View>
  );
};

export default ProfileScreen;
