'use client';

import { useEffect, useRef, useState } from 'react';
import { LuCheck, LuChevronDown, LuPalette } from 'react-icons/lu';
import {
  DASH_THEMES,
  setDashTheme,
  useDashTheme
} from 'components/Dashboard/theme/dashTheme';

const ThemePicker = () => {
  const theme = useDashTheme();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const current = DASH_THEMES.find((item) => item.key === theme) ?? DASH_THEMES[0];

  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Dashboard theme: ${current.label}`}
        className="flex h-9 items-center gap-2 rounded-lg border border-dash-line bg-dash-surface px-2.5 text-sm font-medium text-dash-ink transition-colors hover:bg-dash-sunken"
      >
        <LuPalette className="hidden size-4 text-dash-muted sm:block" />
        <span
          className="size-3.5 rounded-full ring-2 ring-dash-surface"
          style={{ backgroundColor: current.swatch }}
        />
        <span className="hidden sm:inline">{current.label}</span>
        <LuChevronDown className="size-3.5 text-dash-faint" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-dash-line bg-dash-surface p-1.5 shadow-lg"
        >
          <p className="px-2.5 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-dash-faint">
            Theme
          </p>
          {DASH_THEMES.map((item) => (
            <button
              key={item.key}
              type="button"
              role="menuitemradio"
              aria-checked={item.key === theme}
              onClick={() => {
                setDashTheme(item.key);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-dash-sunken"
            >
              <span
                className="size-6 shrink-0 rounded-full border border-black/10"
                style={{ backgroundColor: item.swatch }}
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-dash-ink">
                  {item.label}
                </span>
                <span className="block text-xs text-dash-muted">{item.note}</span>
              </span>
              {item.key === theme && (
                <LuCheck className="size-4 text-dash-accent-text" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemePicker;
