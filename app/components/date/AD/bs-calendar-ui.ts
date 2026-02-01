import { RestaurantTheme } from 'app/theme/theme';
import { makeCalendarStyles } from '../common/ad-calendar-ui';

export type BsDate = { year: number; month: number; day: number };

export const makeBsCalendarStyles = (theme: RestaurantTheme) => {
  // BS calendar uses the same base styles as AD
  return makeCalendarStyles(theme);
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
