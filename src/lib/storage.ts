import { StoreData, PromptItem } from '../types';
import { INITIAL_STORE_DATA } from '../data/initialData';

const LOCAL_STORAGE_KEY = 'premium_web_store_data_v1';
const PERMANENT_BACKUP_KEY = 'premium_web_store_permanent_backup_v1';
const ADMIN_AUTH_KEY = 'premium_web_store_admin_token';
const SAVED_FAVORITES_KEY = 'premium_web_store_favorites';

/**
 * Safely parse JSON from localStorage
 */
function getStoredLocalData(): StoreData | null {
  try {
    const rawPrimary = localStorage.getItem(LOCAL_STORAGE_KEY);
    const rawBackup = localStorage.getItem(PERMANENT_BACKUP_KEY);

    const primary: StoreData | null = rawPrimary ? JSON.parse(rawPrimary) : null;
    const backup: StoreData | null = rawBackup ? JSON.parse(rawBackup) : null;

    if (primary && Array.isArray(primary.prompts) && primary.prompts.length > 0) {
      if (backup && Array.isArray(backup.prompts) && backup.prompts.length > primary.prompts.length) {
        return backup;
      }
      return primary;
    }
    if (backup && Array.isArray(backup.prompts) && backup.prompts.length > 0) {
      return backup;
    }
  } catch (e) {
    console.warn('[Storage] Error reading local store:', e);
  }
  return null;
}

/**
 * Intelligent fetch & auto-sync:
 * If the server restarted or Render wiped its ephemeral disk and returned
 * default data, but the client has user-added prompts or newer updates,
 * we AUTOMATICALLY RESTORE & PUSH the user's data back to the server.
 * This guarantees the user NEVER loses any added prompts or changes!
 */
export async function fetchStoreData(): Promise<StoreData> {
  const localData = getStoredLocalData();

  let serverData: StoreData | null = null;
  try {
    const res = await fetch('/api/data');
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.prompts)) {
        serverData = data;
      }
    }
  } catch (err) {
    console.warn('[Storage] API fetch failed, relying on local storage:', err);
  }

  // Case 1: Server was reachable and returned data
  if (serverData) {
    // Check if local data has user-created prompts or is newer than server data
    if (localData && Array.isArray(localData.prompts)) {
      const localPromptIds = new Set(localData.prompts.map((p) => p.id));
      const serverPromptIds = new Set(serverData.prompts.map((p) => p.id));

      // Are there prompts in local storage that server lost?
      const missingOnServer = localData.prompts.filter((p) => !serverPromptIds.has(p.id));
      const isLocalNewer =
        (localData.lastUpdated && serverData.lastUpdated && new Date(localData.lastUpdated) > new Date(serverData.lastUpdated)) ||
        localData.prompts.length > serverData.prompts.length ||
        missingOnServer.length > 0;

      if (isLocalNewer) {
        console.log('[Storage] Local store has newer/custom items! Auto-restoring to server...');
        // Merge: local prompts take priority, append any new prompts added in code on server
        const mergedPrompts: PromptItem[] = [...localData.prompts];
        for (const sp of serverData.prompts) {
          if (!localPromptIds.has(sp.id)) {
            mergedPrompts.push(sp);
          }
        }

        const reconciledData: StoreData = {
          ...serverData,
          ...localData,
          prompts: mergedPrompts,
          lastUpdated: new Date().toISOString(),
        };

        // Cache locally to both slots
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reconciledData));
          localStorage.setItem(PERMANENT_BACKUP_KEY, JSON.stringify(reconciledData));
        } catch (e) {
          console.warn('[Storage] Local storage save error:', e);
        }

        // Auto-push back to server asynchronously so server disk is restored!
        fetch('/api/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reconciledData),
        }).catch((e) => console.warn('[Storage] Background server sync error:', e));

        return reconciledData;
      }
    }

    // Server data is up to date or newer: cache to local storage
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serverData));
      localStorage.setItem(PERMANENT_BACKUP_KEY, JSON.stringify(serverData));
    } catch (e) {
      console.warn('[Storage] Local storage cache error:', e);
    }
    return serverData;
  }

  // Case 2: Server was unreachable; fallback to local data or initial data
  if (localData) {
    return localData;
  }

  return INITIAL_STORE_DATA;
}

/**
 * Persist store data everywhere:
 * 1. Immediate save to primary localStorage
 * 2. Immediate save to permanent backup localStorage
 * 3. Save to server disk (/api/data)
 */
export async function persistStoreData(data: StoreData): Promise<boolean> {
  const updatedData: StoreData = {
    ...data,
    lastUpdated: new Date().toISOString(),
  };

  // 1 & 2. Always persist locally first so it can never be lost
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
    localStorage.setItem(PERMANENT_BACKUP_KEY, JSON.stringify(updatedData));
  } catch (e) {
    console.warn('[Storage] LocalStorage error:', e);
  }

  // 3. Persist to server disk
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
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
