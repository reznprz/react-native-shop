import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { getSubTabIcon } from 'app/hooks/utils/getSubTabIcon';
import CustomIcon from './CustomIcon';

interface SubTabProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabStyle?: string;
}

const SubTab: React.FC<SubTabProps> = ({ tabs, activeTab, onTabChange, tabStyle = 'py-4' }) => {
  return (
    <View className="flex flex-row bg-slate-50 border-b-2 border-gray-200 items-center mb-1">
      {tabs.map((tab) => {
        // Get the icon information for the current tab.
        const iconInfo = getSubTabIcon(tab);

        // If no icon info is found, render a fallback (text only).
        if (!iconInfo || tab === 'NORMAL') {
          return (
            <Pressable
              key={tab}
              className={`flex-1 ${tabStyle} flex flex-row items-center justify-center relative ${
                activeTab === tab
                  ? 'border-b-[3px] border-deepTeal'
                  : 'border-b-[3px] border-transparent'
              }`}
              onPress={() => onTabChange(tab)}
            >
              <Text style={{ fontSize: 24 }}>🇳🇵</Text>

              <Text
                className={`text-lg font-semibold ${
                  activeTab === tab ? 'text-deepTeal' : 'text-slate-500'
                }`}
              >
                {tab}
              </Text>
            </Pressable>
          );
        }

        return (
          <Pressable
            key={tab}
            className={`flex-1 ${tabStyle} flex flex-row items-center justify-center relative ${
              activeTab === tab
                ? 'border-b-[3px] border-deepTeal'
                : 'border-b-[3px] border-transparent'
            }`}
            onPress={() => onTabChange(tab)}
          >
            <CustomIcon
              name={iconInfo.iconName}
              type={iconInfo.iconType}
              size={iconInfo.iconSize}
              color={activeTab === tab ? '#2a4759' : '#64748B'}
              iconStyle="mr-1.5"
            />
            <Text
              className={`text-lg font-semibold pl-1 ${
                activeTab === tab ? 'text-[#2a4759]' : 'text-slate-500'
              }`}
            >
              {tab}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default SubTab;
