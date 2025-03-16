import { PaymentDetails } from 'app/api/services/orderService';
import React from 'react';
import { View, Text, SectionList, StyleSheet } from 'react-native';
import IconLabel from '../common/IconLabel';
import { getIconDetail } from 'app/utils/getIconDetail';

interface PaymentNotesInfoProps {
  groupedPaymentByNotesAndDate?: Record<string, PaymentDetails[]>;
}

interface SectionData {
  title: string;
  data: PaymentDetails[];
}

const PaymentNotesInfo: React.FC<PaymentNotesInfoProps> = ({ groupedPaymentByNotesAndDate }) => {
  const sections: SectionData[] = Object.keys(groupedPaymentByNotesAndDate || {}).map(
    (key, index) => ({
      title: `Payment ${index + 1}: ${key}`,
      data: groupedPaymentByNotesAndDate ? groupedPaymentByNotesAndDate[key] : [],
    }),
  );

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id.toString()}
      scrollEnabled={false}
      renderItem={() => null}
      renderSectionHeader={({ section }) => (
        <View style={styles.sectionContainer}>
          {/* Display the note (or note + date) as the card title */}
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {/* Render the list of payments for this section */}
          {section.data.map((item) => {
            const iconDetails = getIconDetail(item.paymentMethod, 'Payment');

            return (
              <View key={item.id} style={styles.itemContainer}>
                <View style={styles.row}>
                  <Text style={styles.label}>Method:</Text>
                  <IconLabel
                    label={item.paymentMethod}
                    iconSize={14}
                    applyCircularIconBg={false}
                    iconName={iconDetails.iconName}
                    iconType={iconDetails.iconType}
                    labelTextSize="text-sm pl-2"
                    textColor="text-gray-500"
                    containerStyle={''}
                  />
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Amount:</Text>
                  <Text style={styles.value}>रु {item.amount}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Date:</Text>
                  <Text style={styles.value}>{item.paymentDate}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {},
  sectionContainer: {
    backgroundColor: '#fff',
    padding: 8,
    margin: 4,
    marginBottom: 2,
    borderRadius: 8,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    // Android elevation
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  itemContainer: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 8,
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    fontWeight: '600',
    color: '#666',
    marginRight: 8,
  },
  value: {
    fontWeight: '400',
    color: '#333',
  },
});

export default PaymentNotesInfo;
