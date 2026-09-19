import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'portfolio-theme';

  theme = signal<Theme>(this.getInitialTheme());

  constructor() {
    // Apply theme on every change
    effect(() => {
      const t = this.theme();
      document.documentElement.setAttribute('data-theme', t);
      try { localStorage.setItem(this.STORAGE_KEY, t); } catch {}
    });
  }

  toggle() {
    this.theme.set(this.theme() === 'light' ? 'dark' : 'light');
  }

  isDark() {
    return this.theme() === 'dark';
  }

  private getInitialTheme(): Theme {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    // Check OS preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }
}
