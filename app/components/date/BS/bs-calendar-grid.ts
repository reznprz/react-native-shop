import { DateTime } from 'luxon';
import { BsDate, BsMonth, adToBs, bsToAd, bsToIso } from './bs-adapter';
import { KTM_TZ, weekdayMon0Ktm, addDaysKtm, AdDate } from './kathmandu-date';

export type BsGridCell = {
  bs: BsDate;
  key: string;
  inMonth: boolean;
  adHint: string;
};

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

function adHint(ad: AdDate) {
  return `${AD_MONTHS_SHORT[ad.month - 1]} ${ad.day}`;
}

/**
 * Build a 42-cell Mon-Sun BS calendar grid.
 * Canonical to Kathmandu timezone AND stabilized against converter timezone issues.
 */
export function buildBsMonthGrid(currentMonth: BsMonth): BsGridCell[] {
  // Stable mapping: BS first day -> AD
  const adFirst = bsToAd({ year: currentMonth.year, month: currentMonth.month, day: 1 });

  // Compute Monday-start offset using Kathmandu weekday
  const offset = weekdayMon0Ktm(adFirst); // Mon=0..Sun=6

  // Grid start AD (Kathmandu-canonical)
  const gridStart = addDaysKtm(adFirst, -offset);

  const out: BsGridCell[] = [];

  for (let i = 0; i < 42; i++) {
    const adDay = addDaysKtm(gridStart, i);

    // Convert AD -> BS (stable)
    const bs = adToBs(adDay);

    out.push({
      bs,
      key: bsToIso(bs),
      inMonth: bs.year === currentMonth.year && bs.month === currentMonth.month,
      adHint: adHint(adDay),
    });
  }

  return out;
}
