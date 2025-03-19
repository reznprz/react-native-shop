import React from 'react';
import { View, Text } from 'react-native';
import { Expense } from 'app/api/services/expenseService';
import CustomIcon from '../common/CustomIcon';
import { IconType } from 'app/navigation/screenConfigs';
import EmptyState from '../common/EmptyState';

interface ExpenseSummaryProps {
  expenses: Expense[];
}

const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ expenses }) => {
  return (
    <View className="bg-white rounded-lg shadow-sm">
      <Text className="text-lg font-bold p-5">{'Expenses Summary'}</Text>

      {!expenses || expenses.length === 0 ? (
        <EmptyState
          iconName="bank"
          message="No Expenses available"
          subMessage="Add expense or refresh the screen!."
          iconSize={60}
        />
      ) : (
        <>
          {expenses.map((item) => {
            const iconBgColor = item.iconMetadataDetails?.bgColor || '#E5E7EB';
            const date = item.expensesDate || '';
            const amount = item.amount || 0;
            const quantity = item.quantity || 0;

            return (
              <View
                key={item.id}
                className="flex-row justify-between items-center p-5 bg-white border-b border-gray-200"
              >
                <View className="flex-row items-center">
                  <View className="p-3 rounded-md mr-3" style={{ backgroundColor: iconBgColor }}>
                    <CustomIcon
                      name={item.iconMetadataDetails?.iconName || ''}
                      type={(item.iconMetadataDetails?.iconType as IconType) || 'Feather'}
                      size={20}
                      color={item.iconMetadataDetails?.filledColor}
                      validate={true}
                    />
                  </View>
                  <View>
                    <Text className="text-gray-800 font-semibold">{item.description}</Text>
                    <Text className="text-gray-600">{date}</Text>
                  </View>
                </View>

                <View className="items-end">
                  <Text className="text-gray-800 font-semibold">रु {amount.toFixed(2)}</Text>
                  <Text className="text-gray-600 text-sm">Qty: {quantity} items</Text>
                </View>
              </View>
            );
          })}
        </>
      )}
    </View>
  );
};

export default ExpenseSummary;
