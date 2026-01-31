import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BsDate, BsMonth, bsToIso, compareBs } from './bs-adapter';
import { buildBsMonthGrid } from './bs-calendar-grid';

const BS_MONTHS = [
  'Baishakh','Jestha','Asar','Shrawan','Bhadra','Ashwin',
  'Kartik','Mangsir','Poush','Magh','Falgun','Chaitra',
];

type Props = {
  start: BsDate;
  end: BsDate;

  clicks: number;
  setClicks: (n: number) => void;
  setStart: (d: BsDate) => void;
  setEnd: (d: BsDate) => void;

  currentMonth: BsMonth;
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

export const BsDateRangePanel: React.FC<Props> = ({
  start,
  end,
  clicks,
  setClicks,
  setStart,
  setEnd,
  currentMonth,
  onPrevMonth,
  onNextMonth,
}) => {
  const title = `${BS_MONTHS[currentMonth.month - 1]} ${currentMonth.year}`;

  const cells = useMemo(
    () => buildBsMonthGrid(currentMonth),
    [currentMonth.year, currentMonth.month]
  );

  const lo = compareBs(start, end) <= 0 ? start : end;
  const hi = compareBs(start, end) <= 0 ? end : start;

  const inRange = (d: BsDate) => compareBs(d, lo) >= 0 && compareBs(d, hi) <= 0;
  const isStart = (d: BsDate) => bsToIso(d) === bsToIso(start);
  const isEnd = (d: BsDate) => bsToIso(d) === bsToIso(end);

  const handleDayClick = (clicked: BsDate) => {
    if (clicks === 0) {
      setStart(clicked);
      setEnd(clicked);
      setClicks(1);
      return;
    }
    if (clicks === 1) {
      if (compareBs(clicked, start) < 0) {
        setEnd(start);
        setStart(clicked);
      } else {
        setEnd(clicked);
      }
      setClicks(2);
      return;
    }
    setStart(clicked);
    setEnd(clicked);
    setClicks(1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onPrevMonth}><Text style={styles.navBtn}>{'‹'}</Text></Pressable>
        <Text style={styles.headerText}>{title}</Text>
        <Pressable onPress={onNextMonth}><Text style={styles.navBtn}>{'›'}</Text></Pressable>
      </View>

      <View style={styles.weekRow}>
        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => (
          <Text key={d} style={styles.weekDay}>{d}</Text>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((cell) => {
          const selected = inRange(cell.bs);
          const edge = isStart(cell.bs) || isEnd(cell.bs);

          return (
            <Pressable
              key={cell.key}
              onPress={() => handleDayClick(cell.bs)}
              style={[
                styles.cell,
                selected && styles.inRange,
                edge && styles.edge,
                !cell.inMonth && styles.cellMuted,
              ]}
            >
              <Text style={[styles.bsText, edge && styles.edgeText]}>
                {cell.bs.day}
              </Text>
              <Text style={[styles.adHint, edge && styles.adHintOnEdge]}>
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

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
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

  inRange: { backgroundColor: '#D6E3EA' },
  edge: { backgroundColor: '#2A4759' },
  edgeText: { color: '#FFF' },

  cellMuted: { opacity: 0.45 },

  bsText: { fontSize: 14, fontWeight: '800', color: '#111' },

  adHint: { marginTop: 2, fontSize: 10, fontWeight: '800', color: '#B00020' },
  adHintOnEdge: { color: '#FFD6D6' },
});
