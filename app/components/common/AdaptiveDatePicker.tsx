import React, { useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { BaseBottomSheetModal } from './modal/BaseBottomSheetModal';
import BaseModal from './modal/BaseModal';
import { useIsDesktop } from 'app/hooks/useIsDesktop';

type Props = {
  visible: boolean;
  initialDate: Date;
  onClose: () => void;
  onConfirm: (date: Date) => void;

  title?: string;
  minDate?: Date;
  maxDate?: Date;
};

export function AdaptiveDatePicker({
  visible,
  initialDate,
  onClose,
  onConfirm,
  title = 'Select date',
  minDate,
  maxDate,
}: Props) {
  const { isMobile } = useIsDesktop(); // iPhone/Android phone only
  const [temp, setTemp] = useState<Date>(initialDate);

  useEffect(() => {
    if (visible) setTemp(initialDate);
  }, [visible, initialDate]);

  const applyAndClose = (d: Date) => {
    onConfirm(d);
    onClose();
  };

  // Shared picker UI
  const picker = useMemo(
    () => (
      <View
        style={{
          marginTop: 12,
          height: Platform.OS === 'ios' ? 260 : undefined, // <-- key
          justifyContent: 'center',
        }}
      >
        <DateTimePicker
          value={temp}
          mode="date"
          display={isMobile ? 'spinner' : 'inline'} // Spinner on phones, inline on tablets/web
          themeVariant={Platform.OS === 'ios' ? 'light' : undefined}
          minimumDate={minDate}
          maximumDate={maxDate}
          style={Platform.OS === 'ios' ? { height: 260, width: '100%' } : undefined}
          onChange={(e, d) => {
            if (!d) return;

            if (Platform.OS === 'android') {
              if (e.type === 'dismissed') return;
              applyAndClose(d);
              return;
            }

            setTemp(d);
          }}
        />
      </View>
    ),
    [temp, minDate, maxDate],
  );

  // Shared header UI (for both)
  const header = (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: '700' }}>{title}</Text>

      <View style={{ flexDirection: 'row' }}>
        <Pressable onPress={onClose} style={{ padding: 10 }}>
          <Text style={{ fontSize: 16, color: '#6B7280', fontWeight: '600' }}>Cancel</Text>
        </Pressable>

        {/* iOS: Done applies */}
        {Platform.OS === 'ios' && (
          <Pressable onPress={() => applyAndClose(temp)} style={{ padding: 10 }}>
            <Text style={{ fontSize: 16, color: '#111827', fontWeight: '800' }}>Done</Text>
          </Pressable>
        )}
      </View>
    </View>
  );

  // Phones: bottom sheet
  if (isMobile && Platform.OS !== 'web') {
    return (
      <BaseBottomSheetModal visible={visible} onClose={onClose} enableSwipeClose>
        {header}
        {picker}
      </BaseBottomSheetModal>
    );
  }

  // Tablets (iPad/Android tablet) + Web: centered modal
  return (
    <BaseModal
      visible={visible}
      onRequestClose={onClose}
      headerTitle={title}
      body={
        <View>
          {/* For BaseModal, header is already in BaseModal */}
          {picker}
        </View>
      }
      footer={
        Platform.OS !== 'android' ? (
          // On Android picker already closes on select; footer optional
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Pressable onPress={onClose} style={{ padding: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: '700' }}>Cancel</Text>
            </Pressable>
            {Platform.OS === 'ios' && (
              <Pressable onPress={() => applyAndClose(temp)} style={{ padding: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: '800' }}>Done</Text>
              </Pressable>
            )}
          </View>
        ) : undefined
      }
    />
  );
}
