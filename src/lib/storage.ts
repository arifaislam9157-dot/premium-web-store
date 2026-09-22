import { StoreData } from '../types';
import { INITIAL_STORE_DATA } from '../data/initialData';

const LOCAL_STORAGE_KEY = 'premium_web_store_data_v1';
const ADMIN_AUTH_KEY = 'premium_web_store_admin_token';
const SAVED_FAVORITES_KEY = 'premium_web_store_favorites';

export async function fetchStoreData(): Promise<StoreData> {
  try {
    const res = await fetch('/api/data');
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.prompts) && data.prompts.length > 0) {
        // Cache in local storage for offline resiliency
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
          console.warn('LocalStorage save error:', e);
        }
        return data;
      }
    }
  } catch (err) {
    console.warn('[Storage] API fetch failed, falling back to local storage', err);
  }

  // Fallback to localStorage
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed && Array.isArray(parsed.prompts)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('LocalStorage read error:', e);
  }

  // Final fallback: initial default data
  return INITIAL_STORE_DATA;
}

export async function persistStoreData(data: StoreData): Promise<boolean> {
  // Always update localStorage immediately
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }

  // Persist to server disk
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.ok;
  } catch (err) {
    console.error('[Storage] Server save failed:', err);
    return false;
  }
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const result = await res.json();
    if (result.success && result.token) {
      sessionStorage.setItem(ADMIN_AUTH_KEY, result.token);
      return true;
    }
  } catch {
    // Client fallback check
    if (password === 'Aa123456@#&') {
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'client_auth_valid');
      return true;
    }
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
    const updated = exists ? current.filter(id => id !== promptId) : [...current, promptId];
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
      body: JSON.stringify({ promptId })
    });
  } catch {
    // silent fail
  }
}
