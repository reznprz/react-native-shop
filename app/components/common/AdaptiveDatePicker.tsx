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

const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
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
  const { isMobile } = useIsDesktop();
  const [temp, setTemp] = useState<Date>(initialDate);

  useEffect(() => {
    if (visible) {
      setTemp(initialDate);
    }
  }, [visible, initialDate]);

  const applyAndClose = (d: Date) => {
    onConfirm(d);
    onClose();
  };

  const picker = useMemo(() => {
    if (Platform.OS === 'web') {
      return (
        <View style={{ marginTop: 12 }}>
          <input
            type="date"
            value={formatDate(temp)}
            min={minDate ? formatDate(minDate) : undefined}
            max={maxDate ? formatDate(maxDate) : undefined}
            onChange={(e) => {
              const value = e.target.value;
              if (!value) return;
              setTemp(new Date(`${value}T00:00:00`));
            }}
            style={{
              width: '100%',
              height: 44,
              padding: '0 12px',
              borderRadius: 8,
              border: '1px solid #ccc',
              fontSize: 16,
              boxSizing: 'border-box',
            }}
          />
        </View>
      );
    }

    return (
      <View
        style={{
          marginTop: 12,
          height: Platform.OS === 'ios' ? 260 : undefined,
          justifyContent: 'center',
        }}
      >
        <DateTimePicker
          value={temp}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
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
    );
  }, [temp, minDate, maxDate]);

  if (isMobile && Platform.OS !== 'web') {
    return (
      <BaseBottomSheetModal visible={visible} onClose={onClose} enableSwipeClose>
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Text style={{ fontSize: 18, fontWeight: '700' }}>{title}</Text>

          <View style={{ flexDirection: 'row' }}>
            <Pressable onPress={onClose} style={{ padding: 10 }}>
              <Text style={{ fontSize: 16, color: '#6B7280', fontWeight: '600' }}>Cancel</Text>
            </Pressable>

            {Platform.OS === 'ios' && (
              <Pressable onPress={() => applyAndClose(temp)} style={{ padding: 10 }}>
                <Text style={{ fontSize: 16, color: '#111827', fontWeight: '800' }}>Done</Text>
              </Pressable>
            )}
          </View>
        </View>

        {picker}
      </BaseBottomSheetModal>
    );
  }

  return (
    <BaseModal
      visible={visible}
      onRequestClose={onClose}
      headerTitle={title}
      body={<View>{picker}</View>}
      footer={
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Pressable onPress={onClose} style={{ padding: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: '700' }}>Cancel</Text>
          </Pressable>

          <Pressable onPress={() => applyAndClose(temp)} style={{ padding: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: '800' }}>Done</Text>
          </Pressable>
        </View>
      }
    />
  );
}
