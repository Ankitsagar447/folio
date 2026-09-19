/**
 * Centralized API configuration for dual-mode execution (Localhost & Render/Netlify).
 *
 * - In local development (localhost / 127.0.0.1): Uses http://localhost:3000
 * - In production (Netlify / Cloud): Uses https://folio-6x1g.onrender.com
 */

export const RENDER_BACKEND_URL = 'https://folio-6x1g.onrender.com';

export function getApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    return RENDER_BACKEND_URL;
  }

  // 1. Check for manual runtime override (via localStorage if needed)
  const runtimeOverride = localStorage.getItem('PORTFOLIO_API_URL');
  if (runtimeOverride) {
    return runtimeOverride.replace(/\/$/, '');
  }

  // 2. Local development detection
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }

  // 3. If running on Render itself (same domain)
  if (window.location.origin === RENDER_BACKEND_URL) {
    return '';
  }

  // 4. Live production on Netlify or custom domain
  return RENDER_BACKEND_URL;
}

/**
 * Resolves a given API endpoint path based on current environment.
 * @param path e.g. '/api/memories' or '/api/auth/login'
 */
export function getApiUrl(path: string): string {
  const base = getApiBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return base ? `${base}${cleanPath}` : cleanPath;
}
