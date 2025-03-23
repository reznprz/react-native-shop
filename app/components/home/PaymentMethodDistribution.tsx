import { PaymentDistribution } from 'app/api/services/restaurantOverviewService';
import React from 'react';
import { View, Text } from 'react-native';
import EmptyState from '../common/EmptyState';
import LabeledProgressItem from '../common/LabeledProgressItem';

interface Props {
  paymentMethods: PaymentDistribution[];
  fontSize?: number;
}

const PaymentMethodDistribution: React.FC<Props> = ({ paymentMethods, fontSize = 14 }) => {
  const getFillColor = (method: string) => {
    return method === 'Cash'
      ? '#10B981' // green-500
      : method === 'QR Payment'
        ? '#3B82F6' // blue-500
        : method === 'Esewa'
          ? '#60A5FA' // blue-500
          : method === 'Fone_Pay'
            ? '#93C5FD' // blue-500
            : '#EF4444'; // red-500
  };

  const totalAmount = paymentMethods.reduce((sum, pm) => sum + pm.amount, 0);

  return (
    <View className="bg-white rounded-lg p-5 mt-4">
      <Text className="font-bold mb-5" style={{ fontSize: fontSize + 2 }}>
        Payment Methods Distribution
      </Text>

      {!paymentMethods || paymentMethods.length === 0 || totalAmount === 0 ? (
        <EmptyState
          iconName="credit-card-outline"
          message="No Payment available"
          subMessage="Complete order or refresh the screen!"
          iconSize={60}
        />
      ) : (
        <>
          {paymentMethods.map((method, index) => (
            <View key={`payment-${index}`} className="mb-2">
              {/* Parent Method */}
              <LabeledProgressItem
                label={`${method.method} ( रु ${method.amount})`}
                valueText={`${method.percentage.toFixed(2)}%`}
                percentage={method.percentage}
                fillColor={getFillColor(method.method)}
              />

              {/* Sub Progress for QR details if exists and length > 1 */}
              {method.qrPaymentsDetails && method.qrPaymentsDetails.length > 1 && (
                <View className="ml-6 mt-2 justify-center">
                  {method.qrPaymentsDetails.map((qrMethod, qrIndex) => (
                    <LabeledProgressItem
                      key={`qr-${index}-${qrIndex}`}
                      label={`• ${qrMethod.method} ( रु ${qrMethod.amount})`}
                      valueText={`${qrMethod.percentage.toFixed(2)}%`}
                      percentage={qrMethod.percentage}
                      fillColor={getFillColor(qrMethod.method)}
                      pbContainerStyle={{ width: '80%', marginVertical: 1 }}
                    />
                  ))}
                </View>
              )}
            </View>
          ))}
        </>
      )}
    </View>
  );
};

export default PaymentMethodDistribution;
