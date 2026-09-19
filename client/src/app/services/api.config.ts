/**
 * Centralized API configuration for dual-mode execution (Localhost & Render).
 * 
 * - In local development (localhost / 127.0.0.1): Uses http://localhost:3000
 * - On Render / Cloud production: Uses relative path '/api/...' if hosted together,
 *   or an optional remote backend URL if hosted separately.
 */

export function getApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  // 1. Check for manual runtime override (useful for debugging or decoupled hosting)
  const runtimeOverride = localStorage.getItem('PORTFOLIO_API_URL');
  if (runtimeOverride) {
    return runtimeOverride.replace(/\/$/, '');
  }

  // 2. Local development detection
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }

  // 3. Cloud / Render production
  // When deployed as a unified Web Service on Render or behind a reverse proxy,
  // relative URLs ('') route directly to the same host with zero CORS overhead.
  return '';
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
