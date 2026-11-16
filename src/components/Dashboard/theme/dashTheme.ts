'use client';

import { useSyncExternalStore } from 'react';

/**
 * The dashboard's accent theme. The colours themselves live in globals.css
 * under .dash-root[data-dash-theme=…]; this only remembers which one is
 * picked, per browser.
 */

export const DASH_THEMES = [
  { key: 'sunflower', label: 'Sunflower', note: 'Brand yellow', swatch: '#FEB907' },
  { key: 'ocean', label: 'Ocean', note: 'Calm blue', swatch: '#2563EB' },
  { key: 'emerald', label: 'Emerald', note: 'Deep green', swatch: '#047857' },
  { key: 'plum', label: 'Plum', note: 'Rich violet', swatch: '#7C3AED' }
] as const;

export type DashThemeKey = (typeof DASH_THEMES)[number]['key'];

const DEFAULT_THEME: DashThemeKey = 'sunflower';
const STORAGE_KEY = 'cf-dashboard-theme';

const isTheme = (value: unknown): value is DashThemeKey =>
  DASH_THEMES.some((theme) => theme.key === value);

// Used when the browser blocks storage, so a pick still lasts the visit.
let memoryTheme: DashThemeKey | null = null;
const listeners = new Set<() => void>();

const readTheme = (): DashThemeKey => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isTheme(stored)) return stored;
  } catch {
    // Storage unavailable: fall through to the in-memory pick.
  }
  return memoryTheme ?? DEFAULT_THEME;
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
};

export const setDashTheme = (theme: DashThemeKey) => {
  memoryTheme = theme;
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Kept in memory only.
  }
  listeners.forEach((listener) => listener());
};

/** The server always renders the default, then the stored pick takes over. */
export const useDashTheme = (): DashThemeKey =>
  useSyncExternalStore(subscribe, readTheme, () => DEFAULT_THEME);
