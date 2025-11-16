export type RestaurantTheme = {
  // main brand colors
  primary: string; // main brand color (ex: header bg)
  secondary: string; // supporting brand color
  tertiary: string; // accent (ex: chip / highlight)
  quaternary: string; // soft accent (chips / subtle backgrounds)

  // UI roles
  buttonBg: string; // primary button
  secondaryBtnBg: string; // secondary / outline bg
  headerBg: string; // header background
  headerText: string; // header text
  primaryBg: string; // app background
  secondaryBg: string; // card background
  tertiaryBg: string; // subtle background / sections

  borderColor: string;

  // text roles
  textPrimary: string; // text on dark bg
  textSecondary: string; // main text
  textTertiary: string; // subtle text

  // icons
  icon: string; // main icon color
  mutedIcon: string; // input / placeholder icons (#9CA3AF)

  // semantic backgrounds
  successBg: string; // light green
  errorBg: string; // light red
  infoBg: string; // light blue
  alertBg: string; // light purple

  // overlay / backdrop
  backdrop: string;
};

export type ThemeVariant = 'BLUE' | 'GREEN' | 'BROWN' | 'PURPLE' | 'SUNSET';

//
// 🌊 Blue theme (current default)
//
export const blueTheme: RestaurantTheme = {
  // brand
  primary: '#2E3A47',
  secondary: '#2A4759',
  tertiary: '#506D82',
  quaternary: '#A0C4DC',

  // UI roles
  buttonBg: '#2A4759',
  secondaryBtnBg: '#E5E7EB',
  headerBg: '#2A4759',
  headerText: '#FFFFFF',
  primaryBg: '#F3F4F6',
  secondaryBg: '#FFFFFF',
  tertiaryBg: '#F8FAFC',

  borderColor: '#E5E7EB',

  // text
  textPrimary: '#FFFFFF',
  textSecondary: '#111827',
  textTertiary: '#374151',

  // icons
  icon: '#506D82',
  mutedIcon: '#9CA3AF',

  // semantic backgrounds
  successBg: '#D1FAE5', // bg-green-100
  errorBg: '#FEE2E2', // bg-red-100
  infoBg: '#DBEAFE', // bg-blue-100
  alertBg: '#EDE9FE', // bg-purple-100

  // overlay
  backdrop: 'rgba(0,0,0,0.40)',
};

//
// 🌿 Green theme (emerald / teal vibe)
//
export const greenTheme: RestaurantTheme = {
  primary: '#064E3B', // deep emerald
  secondary: '#047857', // emerald-700
  tertiary: '#10B981', // emerald-500
  quaternary: '#A7F3D0', // emerald-200

  buttonBg: '#047857',
  secondaryBtnBg: '#D1FAE5',
  headerBg: '#065F46',
  headerText: '#FFFFFF',
  primaryBg: '#F3F4F6',
  secondaryBg: '#FFFFFF',
  tertiaryBg: '#F8FAFC',

  borderColor: '#E5E7EB',

  textPrimary: '#FFFFFF',
  textSecondary: '#111827',
  textTertiary: '#374151',

  icon: '#047857',
  mutedIcon: '#9CA3AF',

  successBg: '#D1FAE5',
  errorBg: '#FEE2E2',
  infoBg: '#DBEAFE',
  alertBg: '#EDE9FE',

  backdrop: 'rgba(0,0,0,0.35)',
};

//
// ☕ Brown theme (refined mocha / café palette)
//
export const brownTheme: RestaurantTheme = {
  primary: '#3F2A20', // rich espresso
  secondary: '#8B5E3C', // mocha
  tertiary: '#D6A676', // caramel / sand
  quaternary: '#F5E9DD', // latte foam / cream

  buttonBg: '#8B5E3C',
  secondaryBtnBg: '#F5E9DD',
  headerBg: '#3F2A20',
  headerText: '#FFFFFF',
  primaryBg: '#F3F4F6',
  secondaryBg: '#FFFFFF',
  tertiaryBg: '#F8FAFC',

  borderColor: '#E5E7EB',

  textPrimary: '#FFFFFF',
  textSecondary: '#1F2933',
  textTertiary: '#4B5563',

  icon: '#8B5E3C',
  mutedIcon: '#9CA3AF',

  successBg: '#D1FAE5',
  errorBg: '#FEE2E2',
  infoBg: '#DBEAFE',
  alertBg: '#EDE9FE',

  backdrop: 'rgba(0,0,0,0.35)',
};

//
// 💜 Purple theme (grape / lavender, modern & calm)
//
export const purpleTheme: RestaurantTheme = {
  primary: '#312E81', // indigo-900
  secondary: '#4C1D95', // violet-900
  tertiary: '#8B5CF6', // violet-500
  quaternary: '#EDE9FE', // violet-100

  buttonBg: '#4C1D95',
  secondaryBtnBg: '#EDE9FE',
  headerBg: '#312E81',
  headerText: '#FFFFFF',
  primaryBg: '#F3F4F6',
  secondaryBg: '#FFFFFF',
  tertiaryBg: '#F8FAFC',

  borderColor: '#E5E7EB',

  textPrimary: '#FFFFFF',
  textSecondary: '#111827',
  textTertiary: '#4B5563',

  icon: '#8B5CF6',
  mutedIcon: '#9CA3AF',

  successBg: '#D1FAE5',
  errorBg: '#FEE2E2',
  infoBg: '#DBEAFE',
  alertBg: '#EDE9FE',

  backdrop: 'rgba(0,0,0,0.40)',
};

//
// 🌅 Sunset theme (warm orange / coral, energetic but soft)
//
export const sunsetTheme: RestaurantTheme = {
  primary: '#7C2D12', // deep burnt orange
  secondary: '#C2410C', // orange-700
  tertiary: '#F97316', // orange-500
  quaternary: '#FFE4D5', // soft peachy background

  buttonBg: '#C2410C',
  secondaryBtnBg: '#FFE4D5',
  headerBg: '#7C2D12',
  headerText: '#FFFFFF',
  primaryBg: '#FFF7ED', // very soft warm
  secondaryBg: '#FFFFFF',
  tertiaryBg: '#FFF7ED',

  borderColor: '#FED7AA',

  textPrimary: '#FFFFFF',
  textSecondary: '#1F2937',
  textTertiary: '#4B5563',

  icon: '#F97316',
  mutedIcon: '#9CA3AF',

  successBg: '#D1FAE5',
  errorBg: '#FEE2E2',
  infoBg: '#DBEAFE',
  alertBg: '#EDE9FE',

  backdrop: 'rgba(0,0,0,0.35)',
};

export const THEME_PRESETS: Record<ThemeVariant, RestaurantTheme> = {
  BLUE: blueTheme,
  GREEN: greenTheme,
  BROWN: brownTheme,
  PURPLE: purpleTheme,
  SUNSET: sunsetTheme,
};

// Keep defaultTheme as blue for now
export const defaultTheme = blueTheme;
