import { DateRangeSelection, DateRangeSelectionType } from '../DateRangePickerModal';

export function atMidnight(d: Date) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function getDisplayDateRange(selection: DateRangeSelection): string {
  switch (selection.selectionType) {
    case DateRangeSelectionType.QUICK_RANGE:
      // e.g. "Past 15 Mins"
      return selection.quickRange.label;

    case DateRangeSelectionType.TIME_RANGE_TODAY: {
      // e.g. "Today 00:00 → 01:00"
      const { startHour, startMin, endHour, endMin } = selection;
      const formatHM = (h: number, m: number) =>
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      return `Today ${formatHM(startHour, startMin)} → ${formatHM(endHour, endMin)}`;
    }

    case DateRangeSelectionType.SINGLE_DATE:
      // e.g. "Date: 2025-03-25"
      return `Date: ${selection.date}`;

    case DateRangeSelectionType.DATE_RANGE:
    default:
      // e.g. "2025-03-20 → 2025-03-22"
      const { startDate, endDate } = selection;
      return `${startDate} → ${endDate}`;
  }
}
