import React, { useMemo } from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';

import { BsDate, BsMonth, bsToIso } from './bs-adapter';
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
  const theme = useTheme();
  const styles = useMemo(() => makeBsCalendarStyles(theme), [theme]);
  const { height } = useWindowDimensions();
  const tight = height < 700;

  const title = `${BS_MONTHS[currentMonth.month - 1]} ${currentMonth.year}`;
  const selectedKey = bsToIso(selected);

  const rawCells = useMemo(
    () => buildBsMonthGrid(currentMonth),
    [currentMonth.year, currentMonth.month],
  );

  const cells = useMemo(() => trimToMonthOnly(rawCells), [rawCells]);

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

          const isSelected = cell.key === selectedKey;

          return (
            <Pressable
              key={cell.key}
              onPress={() => onSelect(cell.bs)}
              style={[
                styles.cell,
                styles.pressable,
                tight && { paddingVertical: 4, marginVertical: 2 },
                isSelected && styles.selected,
              ]}
            >
              <Text style={[styles.bsText, isSelected && styles.bsTextOnPrimary]}>
                {cell.bs.day}
              </Text>
              <Text style={[styles.adHint, isSelected && styles.adHintOnPrimary]}>
                {cell.adHint}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
