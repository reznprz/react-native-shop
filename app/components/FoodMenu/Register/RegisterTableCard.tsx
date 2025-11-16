import React, { useMemo } from 'react';
import { Text, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import IconLabel from 'app/components/common/IconLabel';
import { StatusChip } from 'app/components/common/StatusChip';
import { useTheme } from 'app/hooks/useTheme';

interface RegisterTableCardProps {
  name: string;
  status: string;
  seats: number;
  items: number;
  currentTable: string;
  screenWidth: number;
  numColumnsRegisterScreen: number;
  onSelectTable: (name: string) => void;
}

const calcWidth = (cols: number): `${number}%` => `${(100 - 4) / cols}%` as `${number}%`;

const RegisterTableCard: React.FC<RegisterTableCardProps> = ({
  name,
  status,
  seats,
  items,
  currentTable,
  screenWidth,
  numColumnsRegisterScreen,
  onSelectTable,
}) => {
  const theme = useTheme();

  const boxDynamicStyle = useMemo<ViewStyle>(
    () => ({ width: calcWidth(numColumnsRegisterScreen) }),
    [numColumnsRegisterScreen],
  );

  return (
    <TouchableOpacity
      style={[
        styles.card,
        boxDynamicStyle,
        {
          backgroundColor: currentTable === name ? theme.quaternary : theme.secondaryBg,
          shadowColor: theme.textSecondary,
          borderColor: theme.borderColor ?? theme.textTertiary, // or a fixed fallback
        },
      ]}
      onPress={() => {
        onSelectTable(name);
      }}
      activeOpacity={0.7}
    >
      <View style={styles.cardInner}>
        {/* Top header name and status */}
        <View className="flex-row justify-between items-center">
          <IconLabel
            iconName="clipboard-list"
            iconType={'TableIcon'}
            label={name}
            labelTextSize="text-base"
            iconSize={16}
            containerStyle="justify-between"
            parentWidthHeight="w-8 h-8"
            bgColor={theme.quaternary}
          />
          <StatusChip
            status={status}
            customSize="px-1 py-0.5 text-xs"
            textSize="text-xs"
            applyBg={false}
            hideText={screenWidth <= 1024}
          />
        </View>

        {/* seat count */}
        <View className="flex-col justify-between mt-1">
          <IconLabel
            label={`Seats: ${seats}`}
            iconName="chair"
            containerStyle="ml-2"
            textColor="text-base"
            labelTextSize="text-base pl-2 text-gray-500"
            iconSize={14}
            parentWidthHeight="w-6 h-6"
            applyCircularIconBg={false}
            bgColor=""
          />
        </View>

        {/* footer items count and more action button */}
        <View className="flex-row justify-between items-center mt-2">
          <IconLabel
            iconName="utensils"
            label={`Items: ${items}`}
            containerStyle="justify-between ml-2"
            labelTextSize="text-base pl-2 text-gray-500"
            iconSize={14}
            parentWidthHeight="w-6 h-6"
            applyCircularIconBg={false}
            bgColor=""
          />
        </View>
        {/* Conditional Actions Menu */}
      </View>
    </TouchableOpacity>
  );
};

export default RegisterTableCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    paddingHorizontal: 6,
    borderWidth: 1,
    marginTop: 2,
  },
  cardInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
});
