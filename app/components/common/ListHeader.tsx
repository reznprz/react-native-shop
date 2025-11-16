import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import IconLabel from 'app/components/common/IconLabel';
import { useTheme } from 'app/hooks/useTheme';

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
}) => {
  const theme = useTheme();

  return (
    <View
      className="flex-row items-center p-5 justify-between rounded-lg shadow-sm mx-2"
      style={{
        backgroundColor: theme.secondaryBg,
        borderBottomWidth: 1,
        borderColor: theme.infoBg,
      }}
    >
      {/* Title */}
      <Text className="font-semibold text-xl" style={{ color: theme.textSecondary }}>
        {title}
      </Text>

      {/* Search + Filter */}
      <View className="flex-row">
        {/* Search Box */}
        <View
          className="flex-row rounded-md p-2 w-64"
          style={{
            backgroundColor: theme.secondaryBg,
            borderWidth: 1,
            borderColor: theme.mutedIcon,
          }}
        >
          <Feather name="search" size={20} color={theme.mutedIcon} />

          <TextInput
            placeholder={searchPlaceholder}
            placeholderTextColor={theme.textTertiary}
            className="ml-2 flex-1"
            style={{ color: theme.textSecondary }}
            onChangeText={onSearch}
            value={searchTerm}
          />
        </View>

        {/* Filter Button */}
        <IconLabel
          iconType="Fontisto"
          iconName="filter"
          iconSize={18}
          iconColor={theme.secondary}
          bgColor="bg-white"
          containerStyle="ml-2"
          rounded="rounded-sm"
        />
      </View>
    </View>
  );
};

export default ListHeader;
