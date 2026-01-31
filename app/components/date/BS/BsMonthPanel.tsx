import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { bsToAd, getBsMonthDays } from './bs-adapter';

type Props = {
  year: number;
  selectedMonth: number; // 1-12
  onYearChange: (y: number) => void;
  onSelectMonth: (m: number) => void;
};

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

const AD_MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function adMonthShort(m: number) {
  return AD_MONTHS_SHORT[m - 1];
}

export const BsMonthPanel: React.FC<Props> = ({
  year,
  selectedMonth,
  onYearChange,
  onSelectMonth,
}) => {
  const adHints = useMemo(() => {
    const hints: Record<number, string> = {};
    for (let m = 1; m <= 12; m++) {
      try {
        const lastDay = getBsMonthDays(year, m);
        const adStart = bsToAd({ year, month: m, day: 1 });
        const adEnd = bsToAd({ year, month: m, day: lastDay });

        const a = adMonthShort(adStart.month);
        const b = adMonthShort(adEnd.month);
        hints[m] = a === b ? a : `${a}–${b}`;
      } catch {
        hints[m] = '—';
      }
    }
    return hints;
  }, [year]);

  return (
    <View style={styles.container}>
      {/* Year header */}
      <View style={styles.header}>
        <Pressable onPress={() => onYearChange(year - 1)}>
          <Text style={styles.navBtn}>{'‹'}</Text>
        </Pressable>
        <Text style={styles.headerText}>{year}</Text>
        <Pressable onPress={() => onYearChange(year + 1)}>
          <Text style={styles.navBtn}>{'›'}</Text>
        </Pressable>
      </View>

      {/* Month grid */}
      <View style={styles.grid}>
        {BS_MONTHS.map((name, idx) => {
          const month = idx + 1;
          const active = month === selectedMonth;

          return (
            <Pressable key={name} onPress={() => onSelectMonth(month)} style={styles.monthCell}>
              <Text style={[styles.monthText, active && styles.monthTextActive]}>{name}</Text>
              <Text style={[styles.adHint, active && styles.adHintActive]}>{adHints[month]}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.hint}>Select a month, then press Apply.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 0, backgroundColor: '#F4F6F8', borderRadius: 6, padding: 12 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  navBtn: { fontSize: 22, fontWeight: '700', paddingHorizontal: 12 },
  headerText: { fontSize: 16, fontWeight: '800' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', flexShrink: 1 },

  monthCell: { width: '33.33%', paddingHorizontal: 6, paddingVertical: 6 },

  monthText: {
    textAlign: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingVertical: 9,
    fontWeight: '800',
    borderWidth: 1,
    borderColor: '#DDD',
    color: '#333',
  },
  monthTextActive: { backgroundColor: '#2A4759', color: '#FFF', borderColor: '#2A4759' },

  adHint: { marginTop: 4, textAlign: 'center', fontSize: 10, fontWeight: '800', color: '#B00020' },
  adHintActive: { color: '#FFD6D6' },

  hint: { marginTop: 8, textAlign: 'center', color: '#666', fontWeight: '600' },
});
