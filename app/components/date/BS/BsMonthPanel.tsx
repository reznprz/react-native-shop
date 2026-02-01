import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { bsToAd, getBsMonthDays } from './bs-adapter';
import { useTheme } from 'app/hooks/useTheme';

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
const adMonthShort = (m: number) => AD_MONTHS_SHORT[m - 1];

export const BsMonthPanel: React.FC<Props> = ({
  year,
  selectedMonth,
  onYearChange,
  onSelectMonth,
}) => {
  const theme = useTheme();

  const bg = theme.primaryBg ?? '#F4F6F8';
  const text = theme.textSecondary ?? '#111';
  const danger = '#B00020';
  const dangerOnPrimary = theme.errorBg ?? 'rgba(255, 214, 214, 0.95)';

  const surface = theme.primaryBg ?? '#FFFFFF';
  const primary = theme.primary ?? '#2A4759';
  const border = theme.borderColor ?? '#DDD';
  const textMuted = theme.textSecondary ?? '#666';

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
    <View
      style={{
        flex: 1,
        minHeight: 0,
        backgroundColor: bg,
        borderRadius: 12,
        padding: 12,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <Pressable
          onPress={() => onYearChange(year - 1)}
          style={{
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 10,
            backgroundColor: surface,
            borderWidth: 1,
            borderColor: border,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '900', color: textMuted }}>{'‹'}</Text>
        </Pressable>

        <Text style={{ fontSize: 20, fontWeight: '900', color: text }}>{year}</Text>

        <Pressable
          onPress={() => onYearChange(year + 1)}
          style={{
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 10,
            backgroundColor: surface,
            borderWidth: 1,
            borderColor: border,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '900', color: textMuted }}>{'›'}</Text>
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {BS_MONTHS.map((name, idx) => {
          const month = idx + 1;
          const active = month === selectedMonth;

          return (
            <Pressable
              key={name}
              onPress={() => onSelectMonth(month)}
              style={{ width: '33.33%', paddingHorizontal: 6, paddingVertical: 6 }}
            >
              <View
                style={{
                  backgroundColor: active ? primary : surface,
                  borderRadius: 12,
                  paddingVertical: 10,
                  borderWidth: 1,
                  borderColor: active ? primary : border,
                }}
              >
                <Text
                  style={{ textAlign: 'center', fontWeight: '900', color: active ? '#FFF' : text }}
                >
                  {name}
                </Text>
                <Text
                  style={{
                    marginTop: 4,
                    textAlign: 'center',
                    fontSize: 10,
                    fontWeight: '900',
                    color: active ? dangerOnPrimary : danger,
                  }}
                >
                  {adHints[month]}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <Text style={{ marginTop: 10, textAlign: 'center', color: textMuted, fontWeight: '800' }}>
        Select a month, then press Apply.
      </Text>
    </View>
  );
};
