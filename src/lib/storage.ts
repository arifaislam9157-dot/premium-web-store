import { StoreData, PromptItem } from '../types';
import { INITIAL_STORE_DATA } from '../data/initialData';
import { syncStoreToGitHub } from './githubSync';

const LOCAL_STORAGE_KEY = 'premium_web_store_data_v2';
const LEGACY_STORAGE_KEY = 'premium_web_store_data_v1';
const LEGACY_BACKUP_KEY = 'premium_web_store_permanent_backup_v1';
const ADMIN_AUTH_KEY = 'premium_web_store_admin_token';
const SAVED_FAVORITES_KEY = 'premium_web_store_favorites';

// GitHub Raw URL for universal multi-device live sync (no server required)
const GITHUB_RAW_DATA_URL =
  'https://raw.githubusercontent.com/arifaislam9157-dot/premium-web-store/main/data/store.json';

/**
 * Safely parse JSON from localStorage cache
 */
function getStoredLocalData(): StoreData | null {
  try {
    // Clean up legacy backup keys that caused deleted prompts to resurrect
    if (localStorage.getItem(LEGACY_BACKUP_KEY)) {
      localStorage.removeItem(LEGACY_BACKUP_KEY);
    }

    const raw = localStorage.getItem(LOCAL_STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (raw) {
      const data: StoreData = JSON.parse(raw);
      if (data && Array.isArray(data.prompts) && Array.isArray(data.categories)) {
        return data;
      }
    }
  } catch (e) {
    console.warn('[Storage] Error reading local store:', e);
  }
  return null;
}

/**
 * Fetch live data from server or GitHub raw endpoint.
 * Works seamlessly on Cloudflare Workers / Pages, Render, and any mobile/desktop browser.
 */
async function fetchRemoteData(): Promise<StoreData | null> {
  // 1. Try local server proxy endpoint (for dev / Render)
  try {
    const res = await fetch('/api/data', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.prompts)) {
        return data;
      }
    }
  } catch {
    // /api/data not available on static hosts like Cloudflare workers.dev
  }

  // 2. Fetch directly from GitHub raw data (Universal single source of truth)
  try {
    // Add cache-busting timestamp query to bypass CDN caching
    const url = `${GITHUB_RAW_DATA_URL}?t=${Date.now()}`;
    const ghRes = await fetch(url, {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
    });

    if (ghRes.ok) {
      const ghData = (await ghRes.json()) as StoreData;
      if (ghData && Array.isArray(ghData.prompts) && Array.isArray(ghData.categories)) {
        return ghData;
      }
    }
  } catch (err) {
    console.warn('[Storage] Live GitHub data fetch failed (device might be offline):', err);
  }

  return null;
}

/**
 * Universal Store Data Fetcher:
 * - Fetches the live data from GitHub / server so ANY browser or mobile phone gets real-time updates.
 * - Respects deletions permanently (never restores deleted items from stale caches).
 * - Caches locally for instant offline loading.
 */
export async function fetchStoreData(): Promise<StoreData> {
  const localData = getStoredLocalData();
  const remoteData = await fetchRemoteData();

  if (remoteData) {
    // Determine if local browser has an un-pushed newer edit made in this exact session
    let useLocal = false;
    if (localData && localData.lastUpdated && remoteData.lastUpdated) {
      const localTime = new Date(localData.lastUpdated).getTime();
      const remoteTime = new Date(remoteData.lastUpdated).getTime();
      // If local data was updated more than 2 seconds after remote (and within the last 10 minutes)
      if (localTime > remoteTime + 2000 && Date.now() - localTime < 10 * 60 * 1000) {
        useLocal = true;
      }
    }

    if (useLocal && localData) {
      // Background push local changes to GitHub to bring remote in sync
      syncStoreToGitHub(localData, 'fix: auto-sync local draft to GitHub').catch(() => {});
      return localData;
    }

    // Remote data is authoritative: update local cache
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(remoteData));
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      localStorage.removeItem(LEGACY_BACKUP_KEY);
    } catch (e) {
      console.warn('[Storage] Local cache write error:', e);
    }

    return remoteData;
  }

  // Fallback: If network is offline, use cached local data
  if (localData) {
    return localData;
  }

  // Ultimate fallback: built-in initial data
  return INITIAL_STORE_DATA;
}

/**
 * Persist store data everywhere:
 * 1. Immediate save to localStorage (with updated timestamp)
 * 2. Attempt save to server disk (/api/data if running Node.js)
 * 3. Clean up legacy keys so deleted items never resurrect
 */
export async function persistStoreData(data: StoreData): Promise<boolean> {
  const updatedData: StoreData = {
    ...data,
    lastUpdated: new Date().toISOString(),
  };

  // 1. Cache to localStorage
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    localStorage.removeItem(LEGACY_BACKUP_KEY);
  } catch (e) {
    console.warn('[Storage] LocalStorage error:', e);
  }

  // 2. Persist to server disk if /api/data is running
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });
    return res.ok;
  } catch {
    // Static host (Cloudflare Workers/Pages), client sync handles GitHub directly
    return true;
  }
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      const result = await res.json();
      if (result.success && result.token) {
        sessionStorage.setItem(ADMIN_AUTH_KEY, result.token);
        return true;
      }
    }
  } catch (err) {
    console.warn('[Auth] Server login network issue, checking master fallback:', err);
  }

  // Master fallback password check
  if (password === 'Aa123456@#&') {
    sessionStorage.setItem(ADMIN_AUTH_KEY, 'auth_master_' + Date.now());
    return true;
  }

  return false;
}

export async function changeAdminPassword(
  oldPassword: string,
  newPassword: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error changing password' };
  }
}

export function isAdminAuthenticated(): boolean {
  return !!sessionStorage.getItem(ADMIN_AUTH_KEY);
}

export function logoutAdmin(): void {
  sessionStorage.removeItem(ADMIN_AUTH_KEY);
}

export function getFavorites(): string[] {
  try {
    const raw = localStorage.getItem(SAVED_FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(promptId: string): string[] {
  try {
    const current = getFavorites();
    const exists = current.includes(promptId);
    const updated = exists ? current.filter((id) => id !== promptId) : [...current, promptId];
    localStorage.setItem(SAVED_FAVORITES_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function triggerDownloadJSON(data: any, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function logAnalytics(action: 'view' | 'copy' | 'like', promptId: string) {
  try {
    await fetch(`/api/analytics/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ promptId }),
    });
  } catch {
    // silent fail
  }
}
