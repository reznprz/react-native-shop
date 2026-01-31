import DateConverter from '@remotemerge/nepali-date-converter';
import {
  AdDate,
  addDaysKtm,
  adToIso,
  getTodayAdInKathmandu,
  pad2,
} from './kathmandu-date';

export type BsDate = {
  year: number;
  month: number; // 1-12
  day: number; // 1-32 (day-of-month)
};

export type BsMonth = {
  year: number;
  month: number; // 1-12
};

export function bsToIso(bs: BsDate) {
  return `${bs.year}-${pad2(bs.month)}-${pad2(bs.day)}`;
}

function sameAd(a: AdDate, b: AdDate) {
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

function sameBs(a: BsDate, b: BsDate) {
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

/**
 * RAW AD -> BS (may be timezone sensitive depending on library internals)
 */
function adToBsRaw(ad: AdDate): BsDate {
  // Passing plain YYYY-MM-DD is what the lib expects.
  // Internally it may construct a Date and be timezone-sensitive.
  const out = new DateConverter(adToIso(ad)).toBs();

  return {
    year: out.year,
    month: out.month,
    day: out.date, // ✅ IMPORTANT: out.date is day-of-month, out.day is weekday string
  };
}

/**
 * RAW BS -> AD (may be timezone sensitive depending on library internals)
 */
function bsToAdRaw(bs: BsDate): AdDate {
  const out = new DateConverter(bsToIso(bs)).toAd();

  return {
    year: out.year,
    month: out.month,
    day: out.date, // ✅ IMPORTANT
  };
}

/**
 * STABLE BS -> AD (Kathmandu-canonical)
 * Fixes off-by-one by round-trip correction:
 * bs -> adRaw -> bsCheck; if mismatch, try adRaw +/- 1 day (Kathmandu) until match.
 */
export function bsToAd(bs: BsDate): AdDate {
  const ad0 = bsToAdRaw(bs);

  // Check round trip
  const bs0 = adToBsRaw(ad0);
  if (sameBs(bs0, bs)) return ad0;

  // Try +1 day (Kathmandu)
  const adPlus = addDaysKtm(ad0, 1);
  const bsPlus = adToBsRaw(adPlus);
  if (sameBs(bsPlus, bs)) return adPlus;

  // Try -1 day (Kathmandu)
  const adMinus = addDaysKtm(ad0, -1);
  const bsMinus = adToBsRaw(adMinus);
  if (sameBs(bsMinus, bs)) return adMinus;

  // Last resort: return raw (but this should not happen for the common timezone-shift case)
  return ad0;
}

/**
 * STABLE AD -> BS (Kathmandu-canonical)
 * ad -> bsRaw -> adCheck; if mismatch, try shifting input AD by +/- 1 day (Kathmandu).
 */
export function adToBs(ad: AdDate): BsDate {
  const bs0 = adToBsRaw(ad);

  // Check round trip
  const ad0 = bsToAdRaw(bs0);
  if (sameAd(ad0, ad)) return bs0;

  // Try +1 day input
  const adPlus = addDaysKtm(ad, 1);
  const bsPlus = adToBsRaw(adPlus);
  const adPlusBack = bsToAdRaw(bsPlus);
  if (sameAd(adPlusBack, adPlus)) return bsPlus;

  // Try -1 day input
  const adMinus = addDaysKtm(ad, -1);
  const bsMinus = adToBsRaw(adMinus);
  const adMinusBack = bsToAdRaw(bsMinus);
  if (sameAd(adMinusBack, adMinus)) return bsMinus;

  return bs0;
}

/**
 * Canonical "today" BS based on Kathmandu date boundary
 */
export function getTodayBsInKathmandu(): BsDate {
  return adToBs(getTodayAdInKathmandu());
}

export function compareBs(a: BsDate, b: BsDate): number {
  if (a.year !== b.year) return a.year - b.year;
  if (a.month !== b.month) return a.month - b.month;
  return a.day - b.day;
}

/**
 * Days in BS month, derived by probing 32..28.
 * Uses RAW conversion (validity check), not stable conversion.
 */
export function getBsMonthDays(year: number, month: number): number {
  for (let d = 32; d >= 28; d--) {
    try {
      new DateConverter(`${year}-${pad2(month)}-${pad2(d)}`).toAd();
      return d;
    } catch {
      // continue
    }
  }
  return 30;
}

export function nextBsMonth(m: BsMonth): BsMonth {
  return m.month === 12 ? { year: m.year + 1, month: 1 } : { year: m.year, month: m.month + 1 };
}

export function prevBsMonth(m: BsMonth): BsMonth {
  return m.month === 1 ? { year: m.year - 1, month: 12 } : { year: m.year, month: m.month - 1 };
}
