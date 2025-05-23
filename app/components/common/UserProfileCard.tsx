import Feather from '@expo/vector-icons/build/Feather';
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

interface UserProfileCardProps {
  name?: string;
  email?: string;
  imageUri?: string;
  containerStyle?: string;
  onEditClick?: () => void;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  name = 'John Doe',
  email = 'john.doe@example.com',
  imageUri = 'https://randomuser.me/api/portraits/men/1.jpg',
  containerStyle = '',
  onEditClick,
}) => {
  return (
    <View
      className={`bg-white rounded-xl ${containerStyle} flex-row items-center justify-between shadow-sm p-4`}
    >
      <View className="flex-row items-center">
        <Image source={{ uri: imageUri }} className="w-14 h-14 rounded-full mr-4" />
        <View>
          <Text className="text-base font-semibold text-[#2A4759]">{name}</Text>
          <Text className="text-sm text-gray-500">{email}</Text>
        </View>
      </View>
      {onEditClick && (
        <TouchableOpacity onPress={onEditClick}>
          <Feather name="edit" size={20} color="#3B82F6" style={{ marginTop: 2 }} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default UserProfileCard;
