import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import UserProfileCard from 'app/components/common/UserProfileCard';
import SettingOption from 'app/components/settings/SettingOption';
import { IconType } from 'app/navigation/screenConfigs';
import CustomButton from 'app/components/common/button/CustomButton';
import { useSettingsHook } from 'app/hooks/useSettingsHook';

export default function ProfileScreen() {
  const { sections, handlePress, handleLoginPress, handleLogout } = useSettingsHook();

  return (
    <ScrollView
      contentContainerStyle={{ padding: 18, paddingTop: 18, backgroundColor: '#F3F4F6' }}
      showsVerticalScrollIndicator={false}
    >
      {/* User Profile Card */}
      <UserProfileCard name="John Doe" email="john.doe@example.com" />

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

      <View className="p-4 mt-4">
        <CustomButton
          title={'Login'}
          onPress={() => {
            handleLoginPress();
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
    </ScrollView>
  );
}
