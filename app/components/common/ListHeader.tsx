import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import IconLabel from 'app/components/common/IconLabel';

interface ListHeaderProps {
  title: string;
  searchTerm: string;
  onSearch: (text: string) => void;
  searchPlaceholder: string;
  containerClassName?: string;
  searchContainerClassName?: string;
}

const ListHeader: React.FC<ListHeaderProps> = ({
  title,
  searchTerm,
  onSearch,
  searchPlaceholder,
  containerClassName = '',
  searchContainerClassName = '',
}) => (
  <View className="flex-row items-center p-5 justify-between rounded-lg shadow-sm border-b border-gray-200 bg-white mx-2 ">
    <Text className="text-black font-semibold text-xl">{title}</Text>

    <View className="flex-row">
      <View className="flex-row rounded-md border border-gray-300 p-2">
        <Feather name="search" size={20} color="gray" />
        <TextInput
          placeholder={searchPlaceholder}
          className="ml-2 text-black-700"
          onChangeText={onSearch}
          value={searchTerm}
        />
      </View>

      <IconLabel
        iconType="Fontisto"
        iconName="filter"
        iconSize={18}
        iconColor="#2A4759"
        bgColor="bg-white"
        containerStyle="border border-gray-300  ml-2"
        rounded="rounded-sm"
      />
    </View>
  </View>
);

export default ListHeader;
