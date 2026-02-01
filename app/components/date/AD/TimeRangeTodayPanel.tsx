import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

type Props = {
  todayStartHour: number;
  todayStartMin: number;
  todayEndHour: number;
  todayEndMin: number;

  setTodayStartHour: (v: number) => void;
  setTodayStartMin: (v: number) => void;
  setTodayEndHour: (v: number) => void;
  setTodayEndMin: (v: number) => void;
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function toTotalMinutes(h: number, m: number) {
  return h * 60 + m;
}

function fromTotalMinutes(total: number) {
  const t = clamp(total, 0, 23 * 60 + 59);
  return { h: Math.floor(t / 60), m: t % 60 };
}

export const TimeRangeTodayPanel: React.FC<Props> = ({
  todayStartHour,
  todayStartMin,
  todayEndHour,
  todayEndMin,
  setTodayStartHour,
  setTodayStartMin,
  setTodayEndHour,
  setTodayEndMin,
}) => {
  const startTotal = toTotalMinutes(todayStartHour, todayStartMin);
  const endTotal = toTotalMinutes(todayEndHour, todayEndMin);

  // Optional: keep end >= start by nudging end forward if needed
  const ensureValid = (newStartTotal: number, newEndTotal: number) => {
    if (newEndTotal < newStartTotal) {
      newEndTotal = newStartTotal;
    }
    const s = fromTotalMinutes(newStartTotal);
    const e = fromTotalMinutes(newEndTotal);
    setTodayStartHour(s.h);
    setTodayStartMin(s.m);
    setTodayEndHour(e.h);
    setTodayEndMin(e.m);
  };

  const adjustStart = (deltaMin: number) => ensureValid(startTotal + deltaMin, endTotal);
  const adjustEnd = (deltaMin: number) => ensureValid(startTotal, endTotal + deltaMin);

  const setStartTo = (h: number, m: number) => ensureValid(toTotalMinutes(h, m), endTotal);
  const setEndTo = (h: number, m: number) => ensureValid(startTotal, toTotalMinutes(h, m));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Time Range (Today)</Text>

      {/* Start row */}
      <View style={styles.row}>
        <Text style={styles.label}>Start</Text>

        <View style={styles.pill}>
          <Text style={styles.timeText}>
            {pad2(todayStartHour)}:{pad2(todayStartMin)}
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.actionBtn} onPress={() => adjustStart(-15)}>
            <Text style={styles.actionText}>-15m</Text>
          </Pressable>
          <Pressable style={styles.actionBtn} onPress={() => adjustStart(+15)}>
            <Text style={styles.actionText}>+15m</Text>
          </Pressable>
          <Pressable style={styles.actionBtn} onPress={() => setStartTo(0, 0)}>
            <Text style={styles.actionText}>00:00</Text>
          </Pressable>
        </View>
      </View>

      {/* End row */}
      <View style={styles.row}>
        <Text style={styles.label}>End</Text>

        <View style={styles.pill}>
          <Text style={styles.timeText}>
            {pad2(todayEndHour)}:{pad2(todayEndMin)}
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.actionBtn} onPress={() => adjustEnd(-15)}>
            <Text style={styles.actionText}>-15m</Text>
          </Pressable>
          <Pressable style={styles.actionBtn} onPress={() => adjustEnd(+15)}>
            <Text style={styles.actionText}>+15m</Text>
          </Pressable>
          <Pressable style={styles.actionBtn} onPress={() => setEndTo(23, 59)}>
            <Text style={styles.actionText}>23:59</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Selected: {pad2(todayStartHour)}:{pad2(todayStartMin)} → {pad2(todayEndHour)}:
          {pad2(todayEndMin)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8', borderRadius: 6, padding: 12 },
  title: { fontSize: 16, fontWeight: '800', marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  label: { width: 50, fontWeight: '700', color: '#555' },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  timeText: { fontSize: 14, fontWeight: '800' },
  actions: { flexDirection: 'row', marginLeft: 10, flexWrap: 'wrap', gap: 6 as any },
  actionBtn: {
    backgroundColor: '#2A4759',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  actionText: { color: '#FFF', fontWeight: '700', fontSize: 12 },
  summary: { marginTop: 6, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#DDD' },
  summaryText: { color: '#444', fontWeight: '600' },
});
