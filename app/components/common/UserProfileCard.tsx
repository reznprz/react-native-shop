import React from 'react';
import { View, Text, Image } from 'react-native';

interface UserProfileCardProps {
  name?: string;
  email?: string;
  imageUri?: string;
  containerStyle?: string;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  name = 'John Doe',
  email = 'john.doe@example.com',
  imageUri = 'https://randomuser.me/api/portraits/men/1.jpg',
  containerStyle = '',
}) => {
  return (
    <View className={`bg-white rounded-xl ${containerStyle} flex-row items-center shadow-sm p-4`}>
      <Image source={{ uri: imageUri }} className="w-14 h-14 rounded-full mr-4" />
      <View>
        <Text className="text-base font-semibold text-[#2A4759]">{name}</Text>
        <Text className="text-sm text-gray-500">{email}</Text>
      </View>
    </View>
  );
};

export default UserProfileCard;
