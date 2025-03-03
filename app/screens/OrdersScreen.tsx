import React, { useState } from 'react';
import { ScrollView, View, Text, useWindowDimensions, TouchableOpacity } from 'react-native';
import { useOrder } from 'app/hooks/useOrder';
import OrderCard from 'app/components/order/OrderCard';
import DateSelector from 'app/components/common/DateSelector';
import OrderMetrics from 'app/components/OrderMetrics';
import { useIsDesktop } from 'app/hooks/useIsDesktop';
import OrderSummaryCard from 'app/components/order/OrderSummaryCard';
import { navigate } from 'app/navigation/navigationService';
import { ScreenNames } from 'app/types/navigation';

export default function OrdersScreen() {
  const { orders } = useOrder();
  const { isLargeScreen } = useIsDesktop();
  const [selectedDate, setSelectedDate] = useState('Today');

  // Calculate Total, Paid & Unpaid Amounts
  const totalAmount = orders.reduce((sum, order) => sum + order.total, 0);
  const paidAmount = orders
    .filter((order) => order.status === 'Paid')
    .reduce((sum, order) => sum + order.total, 0);
  const unpaidAmount = totalAmount - paidAmount;
  const totalOrders = orders.length;

  const handleOrderPress = (order: any) => {
    navigate(ScreenNames.ORDER_DETAILS, { orderId: order.id });
  };

  return (
    <View className="flex-1 bg-gray-100 p-4 pb-0">
      <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />

      <OrderMetrics
        totalAmount={totalAmount}
        paidAmount={paidAmount}
        unpaidAmount={unpaidAmount}
        totalOrders={totalOrders}
        isLargeScreen={isLargeScreen}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className={`flex gap-2 ${isLargeScreen ? 'flex-row flex-wrap justify-center' : ''}`}>
          {isLargeScreen
            ? orders.map((order) => <OrderCard key={order.id} order={order} />)
            : orders.map((order) => (
                <TouchableOpacity key={order.id} onPress={() => handleOrderPress(order)}>
                  <OrderSummaryCard order={order} />
                </TouchableOpacity>
              ))}
        </View>
      </ScrollView>
    </View>
  );
}
