import { RestaurantTheme } from 'app/theme/theme';
import { StyleSheet } from 'react-native';

export type BsDate = { year: number; month: number; day: number };

// If your theme has stronger typing, replace `any`.
export const makeBsCalendarStyles = (theme: RestaurantTheme) => {
  const bg = theme.primaryBg ?? '#F4F6F8';

  const text = theme.textSecondary ?? '#111';

  const primarySoft = 'rgba(11, 12, 12, 0.14)';

  const danger = '#B00020';
  const dangerOnPrimary = 'rgba(255, 214, 214, 0.95)';

  const surface = theme.primaryBg ?? '#FFFFFF';
  const primary = theme.primary ?? '#2A4759';
  const border = theme.borderColor ?? '#DDD';
  const textMuted = theme.textSecondary ?? '#666';

  return StyleSheet.create({
    panel: {
      flex: 1,
      minHeight: 0,
      backgroundColor: bg,
      borderRadius: 12,
      padding: 12,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },

    headerText: {
      fontSize: 18,
      fontWeight: '900',
      color: text,
      letterSpacing: 0.2,
    },

    navBtn: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 10,
      backgroundColor: surface,
      borderWidth: 1,
      borderColor: border,
    },
    navIcon: { fontSize: 18, fontWeight: '900', color: textMuted },

    weekRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      marginBottom: 6,
      borderBottomWidth: 1,
      borderBottomColor: border,
    },

    weekDay: {
      width: '14.28%',
      textAlign: 'center',
      fontWeight: '800',
      fontSize: 12,
      color: textMuted,
    },

    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignContent: 'flex-start',
      flexGrow: 0,
      flexShrink: 1,
    },

    cell: {
      width: '14.28%',
      paddingVertical: 6,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
      marginVertical: 3,
    },

    cellEmpty: {
      width: '14.28%',
      paddingVertical: 6,
      marginVertical: 3,
    },

    selected: { backgroundColor: primary },
    inRange: { backgroundColor: primarySoft },

    bsText: { fontSize: 14, fontWeight: '900', color: text },
    bsTextOnPrimary: { color: '#FFF' },

    adHint: { marginTop: 2, fontSize: 10, fontWeight: '900', color: danger },
    adHintOnPrimary: { color: dangerOnPrimary },

    pressable: { overflow: 'hidden' },
  });
};

export function trimToMonthOnly<T extends { inMonth: boolean }>(cells: T[]) {
  const first = cells.findIndex((c) => c.inMonth);
  let last = -1;
  for (let i = cells.length - 1; i >= 0; i--) {
    if (cells[i].inMonth) {
      last = i;
      break;
    }
  }
  if (first === -1 || last === -1) return [];

  return cells.slice(0, last + 1).map((c, idx) => {
    if (idx < first) return { ...(c as any), __empty: true };
    if (!c.inMonth) return { ...(c as any), __empty: true };
    return c as any;
  });
}
