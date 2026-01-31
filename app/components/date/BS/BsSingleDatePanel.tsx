import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BsDate, BsMonth, bsToIso } from './bs-adapter';
import { buildBsMonthGrid } from './bs-calendar-grid';

const BS_MONTHS = [
  'Baishakh',
  'Jestha',
  'Asar',
  'Shrawan',
  'Bhadra',
  'Ashwin',
  'Kartik',
  'Mangsir',
  'Poush',
  'Magh',
  'Falgun',
  'Chaitra',
];

type Props = {
  selected: BsDate;
  currentMonth: BsMonth;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelect: (d: BsDate) => void;
};

export const BsSingleDatePanel: React.FC<Props> = ({
  selected,
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onSelect,
}) => {
  const title = `${BS_MONTHS[currentMonth.month - 1]} ${currentMonth.year}`;
  const selectedKey = bsToIso(selected);

  const cells = useMemo(
    () => buildBsMonthGrid(currentMonth),
    [currentMonth.year, currentMonth.month],
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onPrevMonth}>
          <Text style={styles.navBtn}>{'‹'}</Text>
        </Pressable>
        <Text style={styles.headerText}>{title}</Text>
        <Pressable onPress={onNextMonth}>
          <Text style={styles.navBtn}>{'›'}</Text>
        </Pressable>
      </View>

      <View style={styles.weekRow}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <Text key={d} style={styles.weekDay}>
            {d}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((cell) => {
          const isSelected = cell.key === selectedKey;
          return (
            <Pressable
              key={cell.key}
              onPress={() => onSelect(cell.bs)}
              style={[
                styles.cell,
                isSelected && styles.cellSelected,
                !cell.inMonth && styles.cellMuted,
              ]}
            >
              <Text style={[styles.bsText, isSelected && styles.bsTextSelected]}>
                {cell.bs.day}
              </Text>
              <Text style={[styles.adHint, isSelected && styles.adHintSelected]}>
                {cell.adHint}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 0 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  navBtn: { fontSize: 22, fontWeight: '700', paddingHorizontal: 12 },
  headerText: { fontSize: 16, fontWeight: '700' },

  weekRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  weekDay: { width: '14.28%', textAlign: 'center', fontWeight: '600', color: '#666' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', flexShrink: 1 },

  cell: {
    width: '14.28%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 1,
    borderRadius: 6,
  },

  cellSelected: { backgroundColor: '#2A4759' },
  cellMuted: { opacity: 0.45 },

  bsText: { fontSize: 14, fontWeight: '800', color: '#111' },
  bsTextSelected: { color: '#FFF' },

  adHint: { marginTop: 2, fontSize: 10, fontWeight: '800', color: '#B00020' },
  adHintSelected: { color: '#FFD6D6' },
});
