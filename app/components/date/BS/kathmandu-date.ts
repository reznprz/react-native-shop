import { DateTime } from 'luxon';

export const KTM_TZ = 'Asia/Kathmandu';

export type AdDate = { year: number; month: number; day: number };

export function pad2(n: number) {
  return String(n).padStart(2, '0');
}

export function adToIso(ad: AdDate) {
  return `${ad.year}-${pad2(ad.month)}-${pad2(ad.day)}`;
}

/**
 * Canonical "today" in Kathmandu (same for all users worldwide)
 */
export function getTodayAdInKathmandu(): AdDate {
  const d = DateTime.now().setZone(KTM_TZ);
  return { year: d.year, month: d.month, day: d.day };
}

/**
 * Add days in Kathmandu timezone and return date-only.
 */
export function addDaysKtm(ad: AdDate, days: number): AdDate {
  const dt = DateTime.fromObject(
    { year: ad.year, month: ad.month, day: ad.day, hour: 12 }, // noon avoids DST-like edge cases
    { zone: KTM_TZ }
  ).plus({ days });

  return { year: dt.year, month: dt.month, day: dt.day };
}

/**
 * Kathmandu weekday index, Monday=0..Sunday=6
 */
export function weekdayMon0Ktm(ad: AdDate): number {
  const dt = DateTime.fromObject(
    { year: ad.year, month: ad.month, day: ad.day, hour: 12 },
    { zone: KTM_TZ }
  );
  return dt.weekday - 1; // Luxon: Mon=1..Sun=7
}
