import { StyleSheet } from 'react-native';
import { RestaurantTheme } from 'app/theme/theme';

export const makeCalendarStyles = (theme: RestaurantTheme) => {
  const bg = theme.primaryBg ?? '#F4F6F8';

  // Prefer a dedicated surface token if you have one.
  // Using primaryBg as surface can look “flat”, but ok if that’s your system.
  const surface = theme.primaryBg ?? '#FFFFFF';

  const primary = theme.primary ?? '#2A4759';
  const border = theme.borderColor ?? '#DDD';

  const text = theme.textSecondary ?? '#111';
  const textMuted = theme.textSecondary ?? '#666';

  // Range highlight (soft)
  // If you later add theme.primarySoft, use it here.
  const primarySoft = 'rgba(11, 12, 12, 0.14)';

  // For AD hints (optional). BS uses hint color.
  const danger = '#B00020';
  const dangerOnPrimary = 'rgba(255, 214, 214, 0.95)';

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

    // day chip
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

    textStrong: { fontSize: 14, fontWeight: '900', color: text },
    textOnPrimary: { color: '#FFF' },

    // Optional small second-line hint (BS uses this)
    hint: { marginTop: 2, fontSize: 10, fontWeight: '900', color: danger },
    hintOnPrimary: { color: dangerOnPrimary },

    muted: { opacity: 0.45 },

    pressable: { overflow: 'hidden' },
  });
};
