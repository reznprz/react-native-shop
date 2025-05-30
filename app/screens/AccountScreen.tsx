import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import UserProfileCard from 'app/components/common/UserProfileCard';
import SettingOption from 'app/components/settings/SettingOption';
import { IconType } from 'app/navigation/screenConfigs';
import CustomButton from 'app/components/common/button/CustomButton';
import AvatarPickerModal from 'app/components/modal/AvatarPickerModal';
import { useSettingsAccount } from 'app/hooks/useSettingsAccount';
import { useUsers } from 'app/hooks/useUser';
import { AccessLevel, User } from 'app/api/services/userService';

export default function AccountScreen() {
  const { sections, restaurantInfo, handlePress, handleLogout } = useSettingsAccount();
  const { updateUserMutation } = useUsers();
  const {
    userFirstName = '',
    userLastName = '',
    restaurantName = '',
    userAvatarUrl = '',
    userId,
    initials,
  } = restaurantInfo ?? {};
  const [avatarsModalVisible, setAvatarsModalVisible] = useState(false);

  return (
    <ScrollView
      contentContainerStyle={{ padding: 18, paddingTop: 18, backgroundColor: '#F3F4F6' }}
      showsVerticalScrollIndicator={false}
    >
      {/* User Profile Card */}
      <UserProfileCard
        name={`${userFirstName} ${userLastName}`}
        email={restaurantName}
        imageUri={userAvatarUrl}
        initials={initials}
        onEditClick={() => setAvatarsModalVisible(true)}
      />

      {/* Sections */}
      {sections.map((section) => (
        <View key={section.title} className="p-2 pb-0 pt-4 gap-1">
          <Text className="text-xl font-bold text-gray-800 mb-1">{section.title}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {section.data.map((option) => (
              <View
                key={option.label}
                style={{
                  width: '49.5%',
                  marginBottom: 10,
                }}
              >
                <SettingOption
                  label={option.label}
                  icon={option.icon}
                  iconType={option.iconType as IconType}
                  onPress={() => {
                    handlePress(option.label);
                  }}
                />
              </View>
            ))}
          </View>
        </View>
      ))}

      {/* Logout Button */}
      <View className="p-4">
        <CustomButton
          title={'Logout'}
          onPress={() => {
            handleLogout();
          }}
          width="full"
          height="l"
          bgColor="bg-gray-300"
          textColor="black"
          iconType="FontAwesome5"
          iconName="sign-out-alt"
          iconColor="black"
        />
      </View>
      {/* Avatar selection modal */}
      <AvatarPickerModal
        visible={avatarsModalVisible}
        onRequestClose={() => setAvatarsModalVisible(false)}
        onSelect={(avatarUrl) => {
          setAvatarsModalVisible(false);
          const updatedUser: User = {
            avatarUrl: avatarUrl,
            id: 0,
            accessLevel: AccessLevel.ADMIN,
            passcode: '',
            firstName: '',
            lastName: '',
            username: '',
            password: '',
            phoneNumber: '',
            email: '',
            restaurantId: 0,
          };

          updateUserMutation.mutate({
            userId: userId || 0,
            updatedUser: updatedUser,
            updateImageOnly: true,
          });
        }}
      />
    </ScrollView>
  );
}
