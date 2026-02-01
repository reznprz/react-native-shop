import React, { useMemo } from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';

import { BsDate, BsMonth, bsToIso, compareBs } from './bs-adapter';
import { buildBsMonthGrid } from './bs-calendar-grid';
import { makeBsCalendarStyles, trimToMonthOnly } from '../common/bs-calendar-ui';
import { useTheme } from 'app/hooks/useTheme';

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
  const theme = useTheme();
  const styles = useMemo(() => makeBsCalendarStyles(theme), [theme]);
  const { height } = useWindowDimensions();
  const tight = height < 700;

  const title = `${BS_MONTHS[currentMonth.month - 1]} ${currentMonth.year}`;

  const rawCells = useMemo(
    () => buildBsMonthGrid(currentMonth),
    [currentMonth.year, currentMonth.month],
  );
  const cells = useMemo(() => trimToMonthOnly(rawCells), [rawCells]);

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
    <View style={styles.panel}>
      <View style={styles.header}>
        <Pressable onPress={onPrevMonth} style={styles.navBtn}>
          <Text style={styles.navIcon}>{'‹'}</Text>
        </Pressable>

        <Text style={styles.headerText}>{title}</Text>

        <Pressable onPress={onNextMonth} style={styles.navBtn}>
          <Text style={styles.navIcon}>{'›'}</Text>
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
        {cells.map((cell: any) => {
          if (cell.__empty) return <View key={cell.key} style={styles.cellEmpty} />;

          const selected = inRange(cell.bs);
          const edge = isStart(cell.bs) || isEnd(cell.bs);

          return (
            <Pressable
              key={cell.key}
              onPress={() => handleDayClick(cell.bs)}
              style={[
                styles.cell,
                styles.pressable,
                tight && { paddingVertical: 4, marginVertical: 2 },
                selected && styles.inRange,
                edge && styles.selected,
              ]}
            >
              <Text style={[styles.bsText, edge && styles.bsTextOnPrimary]}>{cell.bs.day}</Text>
              <Text style={[styles.adHint, edge && styles.adHintOnPrimary]}>{cell.adHint}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
