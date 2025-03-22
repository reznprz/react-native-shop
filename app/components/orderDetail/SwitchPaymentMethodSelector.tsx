import { PaymentDetails } from 'app/api/services/orderService';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PaymentChip from '../table/PaymentChip';

interface PaymentTypeSelectorProps {
  paymentTypes?: string[];
  paidPaymentTypes: PaymentDetails[] | null;
  onSelectPaymentType?: (selectedPaymentType: string, paymentId: number) => void;
}

const defaultPaymentTypes = ['CASH', 'ESEWA', 'FONE_PAY', 'CREDIT'];

const SwitchPaymentMethodSelector: React.FC<PaymentTypeSelectorProps> = ({
  paymentTypes = defaultPaymentTypes,
  paidPaymentTypes = [],
  onSelectPaymentType,
}) => {
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null);
  const [selectedPaymentType, setSelectedPaymentType] = useState<string>('');

  const handleSelect = (selectedPaymentType: string) => {
    setSelectedPaymentType(selectedPaymentType);
    if (onSelectPaymentType && selectedPaymentId !== null) {
      onSelectPaymentType(selectedPaymentType, selectedPaymentId);
    }
  };

  // Determine the payment method selected from the paidPaymentTypes
  const selectedPaidPayment = paidPaymentTypes?.find(
    (payment) => payment?.id === selectedPaymentId,
  );

  // Filter out the selected payment method from available paymentTypes
  const filteredPaymentTypes = selectedPaidPayment
    ? paymentTypes.filter((pt) => pt !== selectedPaidPayment.paymentMethod)
    : paymentTypes;

  return (
    <View className="p-4 bg-white border border-gray-200">
      <Text className="text-xl font-semibold mb-4 text-gray-800">
        Paid Payment Details, Select Payment to Switch PaymentType.
      </Text>

      {/* Paid Payment Detail Cards */}
      <View className="flex-row flex-wrap justify-start gap-4 mb-4">
        {paidPaymentTypes?.map((payment) => {
          const isSelected = selectedPaymentId === payment.id;
          return (
            <TouchableOpacity
              key={payment.id}
              onPress={() => setSelectedPaymentId(payment.id)}
              activeOpacity={0.8}
              style={[
                styles.detailCard,
                isSelected ? styles.selectedDetailCard : styles.detailCardDefault,
              ]}
            >
              <PaymentChip
                paymentType={payment.paymentMethod}
                paymentText={`${payment.paymentMethod} Amount: रु ${payment.amount}`}
                textSize={'text-lg ml-2'}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedPaymentId !== null && (
        <View className="mt-2">
          <Text className="text-base font-medium mb-2 text-gray-700">
            Select a payment type to switch: (Filtered list)
          </Text>

          {/* Payment types displayed inline with wrapping */}
          <View className="flex-row flex-wrap gap-3">
            {filteredPaymentTypes.map((item) => {
              const isSelected = item === selectedPaymentType;
              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.8}
                  style={[
                    styles.paymentTypeCard,
                    isSelected ? styles.paymentTypeCardSelected : styles.paymentTypeCardDefault,
                  ]}
                >
                  <Text
                    className={`text-base ${
                      isSelected ? 'text-white font-semibold' : 'text-gray-600'
                    }`}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  detailCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12, // similar to tailwind py-3
    paddingHorizontal: 16, // similar to tailwind px-4
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  selectedDetailCard: {
    backgroundColor: '#DBEAFE', // blue-100
    borderColor: '#3B82F6', // blue-500
  },
  detailCardDefault: {
    backgroundColor: '#F3F4F6', // gray-100
    borderColor: '#D1D5DB', // gray-300
  },
  paymentTypeCard: {
    paddingVertical: 16, // tailwind py-4
    paddingHorizontal: 24, // tailwind px-6
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  paymentTypeCardSelected: {
    backgroundColor: '#3B82F6', // blue-500
    borderColor: '#3B82F6',
  },
  paymentTypeCardDefault: {
    backgroundColor: '#E5E7EB', // gray-200
    borderColor: '#D1D5DB', // gray-300
  },
});

export default SwitchPaymentMethodSelector;
