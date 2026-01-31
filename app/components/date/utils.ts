export enum DateRangeSelectionType {
  QUICK_RANGE = 'QUICK_RANGE',
  TIME_RANGE_TODAY = 'TIME_RANGE_TODAY',
  SINGLE_DATE = 'SINGLE_DATE',
  DATE_RANGE = 'DATE_RANGE',
}

export interface QuickRangeItem {
  label: string;
  unit?: 'minutes' | 'days';
  value?: number;
}

/**
 * For Quick Ranges, we just send label + optional numeric value and unit
 * (like minutes or days). The backend can interpret them.
 */
export interface QuickRangePayload {
  label: string; // e.g. "Past 15 Mins" or "Last 7 Days"
  unit?: 'minutes' | 'days';
  value?: number; // e.g. 15, 7, etc.
}

export type DateRangeSelection =
  | {
      selectionType: DateRangeSelectionType.QUICK_RANGE;
      quickRange: QuickRangePayload;
    }
  | {
      selectionType: DateRangeSelectionType.TIME_RANGE_TODAY;
      startHour: number;
      startMin: number;
      endHour: number;
      endMin: number;
    }
  | {
      selectionType: DateRangeSelectionType.SINGLE_DATE;
      date: string;
    }
  | {
      selectionType: DateRangeSelectionType.DATE_RANGE;
      startDate: string;
      endDate: string;
      // optional metadata (nice for UI/debug)
      meta?: {
        calendar: 'AD' | 'BS';
        bsStart?: string; // "2082-01-01"
        bsEnd?: string; // "2082-01-31"
        mode?: 'DATE_RANGE' | 'MONTH';
      };
    };

export const BS_MONTHS = [
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
] as const;

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
