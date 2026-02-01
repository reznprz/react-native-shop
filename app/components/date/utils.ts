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
      meta?: {
        calendar: 'AD' | 'BS';
        bsDate?: string; // BS: "2082-10-01" (when NP mode)
      };
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
        bsMonth?: { year: number; month: number };
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

function formatAdIso(iso: string) {
  return iso; // keep "YYYY-MM-DD" (safe & consistent)
}

function parseBsIso(bsIso: string) {
  // "2082-10-01"
  const [y, m, d] = bsIso.split('-').map(Number);
  return { year: y, month: m, day: d };
}

function formatBsDate(bsIso: string) {
  const { year, month, day } = parseBsIso(bsIso);
  const monthName = BS_MONTHS[month - 1] ?? `M${month}`;
  return `${monthName} ${day}, ${year}`;
}

function formatBsMonthLabel(year: number, month: number) {
  const monthName = BS_MONTHS[month - 1] ?? `M${month}`;
  return `${monthName} ${year}`;
}

/**
 * Display label rules:
 * - QUICK_RANGE: label
 * - TIME_RANGE_TODAY: same as before
 * - SINGLE_DATE:
 *    - if meta.calendar === 'BS' and meta.bsDate exists => "BS (AD)"
 *    - else => "Date: AD"
 * - DATE_RANGE:
 *    - if meta.calendar === 'BS' and mode === 'MONTH' and meta.bsMonth exists => "MonthName Year (AD range)"
 *    - else if meta.calendar === 'BS' and bsStart/bsEnd exist => "BS range (AD range)"
 *    - else => "AD range"
 */
export function getDisplayDateRange(selection: DateRangeSelection): string {
  switch (selection.selectionType) {
    case DateRangeSelectionType.QUICK_RANGE:
      return selection.quickRange.label;

    case DateRangeSelectionType.TIME_RANGE_TODAY: {
      const { startHour, startMin, endHour, endMin } = selection;
      const formatHM = (h: number, m: number) =>
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      return `Today ${formatHM(startHour, startMin)} → ${formatHM(endHour, endMin)}`;
    }

    case DateRangeSelectionType.SINGLE_DATE: {
      const adText = formatAdIso(selection.date);

      // If BS selection, show BS + AD
      if (selection.meta?.calendar === 'BS' && selection.meta.bsDate) {
        const bsText = formatBsDate(selection.meta.bsDate);
        return `${bsText} (${adText})`;
      }

      // Otherwise AD-only
      return `Date: ${adText}`;
    }

    case DateRangeSelectionType.DATE_RANGE:
    default: {
      const adStart = formatAdIso(selection.startDate);
      const adEnd = formatAdIso(selection.endDate);
      const adRange = `${adStart} → ${adEnd}`;

      const meta = selection.meta;

      // Month mode (BS): use month name label
      if (meta?.calendar === 'BS' && meta.mode === 'MONTH' && meta.bsMonth) {
        const monthLabel = formatBsMonthLabel(meta.bsMonth.year, meta.bsMonth.month);
        return `${monthLabel} (${adRange})`;
      }

      // BS range: show BS + AD
      if (meta?.calendar === 'BS' && meta.bsStart && meta.bsEnd) {
        const bsStartText = formatBsDate(meta.bsStart);
        const bsEndText = formatBsDate(meta.bsEnd);
        return `${bsStartText} → ${bsEndText} (${adRange})`;
      }

      // Otherwise AD-only
      return adRange;
    }
  }
}
