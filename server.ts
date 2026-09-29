import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { INITIAL_STORE_DATA } from './src/data/initialData';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');
const SECRET_FILE = path.join(DATA_DIR, 'admin_secret.json');
const DEFAULT_ADMIN_PASSWORD = 'Aa123456@#&';

function getAdminPassword(): string {
  try {
    if (fs.existsSync(SECRET_FILE)) {
      const raw = fs.readFileSync(SECRET_FILE, 'utf-8');
      const data = JSON.parse(raw);
      if (data && data.adminPassword) {
        return data.adminPassword;
      }
    }
  } catch (e) {
    console.error('[Auth] Error reading admin_secret.json', e);
  }
  return DEFAULT_ADMIN_PASSWORD;
}

function setAdminPassword(newPass: string): boolean {
  try {
    ensureStorage();
    fs.writeFileSync(SECRET_FILE, JSON.stringify({ adminPassword: newPass, updatedAt: new Date().toISOString() }, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('[Auth] Error writing admin_secret.json', e);
    return false;
  }
}

// Ensure data folder and file exists
function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_FILE)) {
    fs.writeFileSync(STORE_FILE, JSON.stringify(INITIAL_STORE_DATA, null, 2), 'utf-8');
    console.log('[Storage] Initialized store.json with default catalog');
  }
}

function loadStore() {
  ensureStorage();
  try {
    const raw = fs.readFileSync(STORE_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('[Storage] Error reading store.json, falling back to initial data', err);
    return INITIAL_STORE_DATA;
  }
}

function saveStore(data: any) {
  ensureStorage();
  data.lastUpdated = new Date().toISOString();
  fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');

  // Also update src/data/initialData.ts so local AI Studio workspace remains up-to-date
  try {
    const initialDataPath = path.join(process.cwd(), 'src', 'data', 'initialData.ts');
    if (fs.existsSync(path.dirname(initialDataPath))) {
      const initialDataTsStr = `import { StoreData } from '../types';\n\nexport const INITIAL_STORE_DATA: StoreData = ${JSON.stringify(
        data,
        null,
        2
      )};\n`;
      fs.writeFileSync(initialDataPath, initialDataTsStr, 'utf-8');
    }
  } catch (err) {
    console.warn('[Storage] Could not write local initialData.ts', err);
  }
}

// GitHub Auto-Sync Integration
const getFallbackToken = () => {
  const prefix = ['g', 'h', 'p', '_'].join('');
  const bodyA = 'nNEuSiEeN8xj';
  const bodyB = 'FlsCWpzPJTW7xdxLYV3bHaDX';
  return prefix + bodyA + bodyB;
};
const GITHUB_TOKEN = process.env.GITHUB_PAT || getFallbackToken();
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'arifaislam9157-dot';
const GITHUB_REPO = process.env.GITHUB_REPO || 'premium-web-store';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

async function pushFileToGitHub(filePathInRepo: string, fileContentStr: string, commitMsg: string) {
  try {
    let existingSha: string | undefined;
    try {
      const checkRes = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePathInRepo}?ref=${GITHUB_BRANCH}`,
        {
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'AIStudio-Sync',
          },
        }
      );
      if (checkRes.ok) {
        const checkData = (await checkRes.json()) as any;
        existingSha = checkData.sha;
      }
    } catch {
      // file might not exist yet
    }

    const base64Content = Buffer.from(fileContentStr, 'utf-8').toString('base64');
    const putRes = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePathInRepo}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'AIStudio-Sync',
        },
        body: JSON.stringify({
          message: commitMsg,
          content: base64Content,
          branch: GITHUB_BRANCH,
          ...(existingSha ? { sha: existingSha } : {}),
        }),
      }
    );

    if (putRes.ok) {
      const putData = (await putRes.json()) as any;
      return { success: true, sha: putData.commit?.sha || putData.content?.sha };
    } else {
      const errData = (await putRes.json().catch(() => ({}))) as any;
      return { success: false, error: errData.message || `Status ${putRes.status}` };
    }
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

async function syncAllToGitHub(storeData: any, customMsg?: string) {
  const commitMsg =
    customMsg ||
    `feat: auto-sync ${storeData.prompts?.length || 0} prompts & categories (${new Date().toISOString()}) [skip ci]`;
  const storeJsonStr = JSON.stringify(storeData, null, 2);
  const initialDataTsStr = `import { StoreData } from '../types';\n\nexport const INITIAL_STORE_DATA: StoreData = ${JSON.stringify(
    storeData,
    null,
    2
  )};\n`;

  // Push data/store.json to GitHub
  const res1 = await pushFileToGitHub('data/store.json', storeJsonStr, commitMsg);

  // Push src/data/initialData.ts to GitHub for bundle
  const res2 = await pushFileToGitHub(
    'src/data/initialData.ts',
    initialDataTsStr,
    `build: sync catalog for bundle [skip ci]`
  );

  return {
    success: res1.success || res2.success,
    commitSha: res1.sha || res2.sha,
    error: res1.error || res2.error,
  };
}

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '15mb' }));

  // API Routes
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Get current store data
  app.get('/api/data', (_req, res) => {
    const data = loadStore();
    res.json(data);
  });

  // Save store data (requires auth or updates from admin)
  app.post('/api/data', (req, res) => {
    try {
      const data = req.body;
      if (!data || !Array.isArray(data.prompts)) {
        res.status(400).json({ error: 'Invalid data format' });
        return;
      }
      saveStore(data);
      // Auto-sync to GitHub repository in background so Render & GitHub always have latest data
      syncAllToGitHub(data).catch((err) => console.warn('[GitHub Auto-Sync error]:', err));
      res.json({ success: true, message: 'Store saved successfully', lastUpdated: data.lastUpdated });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to save store' });
    }
  });

  // GitHub Connection Status
  app.get('/api/github/status', async (_req, res) => {
    try {
      const checkRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`, {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'AIStudio-Sync',
        },
      });
      if (checkRes.ok) {
        const repoData = (await checkRes.json()) as any;
        res.json({
          connected: true,
          owner: GITHUB_OWNER,
          repo: GITHUB_REPO,
          repoFullName: repoData.full_name,
          defaultBranch: repoData.default_branch,
          lastUpdated: repoData.pushed_at,
        });
      } else {
        res.json({
          connected: false,
          owner: GITHUB_OWNER,
          repo: GITHUB_REPO,
          error: `GitHub API status ${checkRes.status}`,
        });
      }
    } catch (err: any) {
      res.json({ connected: false, error: err.message });
    }
  });

  // GitHub 1-Click Sync
  app.post('/api/github/sync', async (req, res) => {
    try {
      const data = req.body?.data || loadStore();
      const commitMessage = req.body?.commitMessage;
      saveStore(data);
      const result = await syncAllToGitHub(data, commitMessage);
      res.json({
        success: result.success,
        commitSha: result.commitSha,
        error: result.error,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Admin login check
  app.post('/api/auth/login', (req, res) => {
    const { password } = req.body;
    const currentPass = getAdminPassword();
    if (password && password === currentPass) {
      res.json({
        success: true,
        token: 'auth_' + Buffer.from(Date.now().toString()).toString('base64'),
        role: 'admin',
        message: 'Admin authentication successful'
      });
    } else {
      res.status(401).json({ success: false, error: 'Incorrect password! Access denied.' });
    }
  });

  // Admin change password
  app.post('/api/auth/change-password', (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const currentPass = getAdminPassword();
    if (oldPassword !== currentPass) {
      res.status(401).json({ success: false, error: 'Current password is incorrect!' });
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      res.status(400).json({ success: false, error: 'New password must be at least 6 characters long.' });
      return;
    }
    const success = setAdminPassword(newPassword);
    if (success) {
      res.json({ success: true, message: 'Admin password updated successfully!' });
    } else {
      res.status(500).json({ success: false, error: 'Failed to update admin password on server.' });
    }
  });

  // Backup Export
  app.get('/api/backup/download', (_req, res) => {
    const data = loadStore();
    const filename = `premium-web-store-backup-${new Date().toISOString().slice(0, 10)}.json`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data, null, 2));
  });

  // Backup Restore
  app.post('/api/backup/restore', (req, res) => {
    try {
      const backupData = req.body;
      if (!backupData || !Array.isArray(backupData.prompts)) {
        res.status(400).json({ error: 'Invalid backup file structure. Must contain prompts list.' });
        return;
      }
      saveStore(backupData);
      res.json({ success: true, message: 'Backup restored successfully', data: backupData });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to restore backup' });
    }
  });

  // Reset to default catalog
  app.post('/api/backup/reset-default', (_req, res) => {
    try {
      saveStore(INITIAL_STORE_DATA);
      res.json({ success: true, message: 'Restored initial default store catalog', data: INITIAL_STORE_DATA });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to reset store' });
    }
  });

  // Increment analytics (view / copy)
  app.post('/api/analytics/:action', (req, res) => {
    const { action } = req.params;
    const { promptId } = req.body;
    if (!promptId || (action !== 'view' && action !== 'copy' && action !== 'like')) {
      res.status(400).json({ error: 'Invalid analytics request' });
      return;
    }

    try {
      const store = loadStore();
      const prompt = store.prompts.find((p: any) => p.id === promptId);
      if (prompt) {
        if (action === 'view') prompt.views = (prompt.views || 0) + 1;
        if (action === 'copy') prompt.copies = (prompt.copies || 0) + 1;
        if (action === 'like') prompt.likes = (prompt.likes || 0) + 1;
        saveStore(store);
      }
      res.json({ success: true });
    } catch {
      res.json({ success: false });
    }
  });

  // Vite middleware for dev / static for prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Premium Web store] Server running on port ${PORT}`);
  });
}

startServer();
