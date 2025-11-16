import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { getSubTabIcon } from 'app/hooks/utils/getSubTabIcon';
import CustomIcon from './CustomIcon';
import { useTheme } from 'app/hooks/useTheme';

interface SubTabProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabStyle?: string;
}

const SubTab: React.FC<SubTabProps> = ({ tabs, activeTab, onTabChange, tabStyle = 'py-4' }) => {
  const theme = useTheme();

  return (
    <View className="flex flex-row bg-slate-50 border-b-2 border-gray-200 items-center mb-1">
      {tabs.map((tab) => {
        // Get the icon information for the current tab.
        const iconInfo = getSubTabIcon(tab);
        const isActive = activeTab === tab;

        const borderColor = isActive ? theme.secondary : 'transparent';
        const textColor = isActive ? theme.textSecondary : theme.textTertiary;
        const iconColor = isActive ? theme.secondary : theme.textTertiary;

        // If no icon info is found, render a fallback (text only).
        if (!iconInfo || tab === 'NORMAL') {
          return (
            <Pressable
              key={tab}
              className={`flex-1 ${tabStyle} flex flex-row items-center justify-center relative`}
              onPress={() => onTabChange(tab)}
              style={{ borderBottomWidth: 3, borderBottomColor: borderColor }}
            >
              <Text style={{ fontSize: 24 }}>🇳🇵</Text>

              <Text className="text-lg font-semibold" style={{ color: textColor }}>
                {tab}
              </Text>
            </Pressable>
          );
        }

        return (
          <Pressable
            key={tab}
            className={`flex-1 ${tabStyle} flex flex-row items-center justify-center relative`}
            onPress={() => onTabChange(tab)}
            style={{ borderBottomWidth: 3, borderBottomColor: borderColor }}
          >
            <CustomIcon
              name={iconInfo.iconName}
              type={iconInfo.iconType}
              size={iconInfo.iconSize}
              color={iconColor}
              iconStyle="mr-1.5"
            />
            <Text className="text-lg font-semibold pl-1" style={{ color: textColor }}>
              {tab}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default SubTab;
