import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Save,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  FolderPlus,
  Tv,
  Settings,
  Sparkles,
  FileCode,
  Check,
  X,
  ExternalLink,
  Code,
  Layers,
  Database,
  Sliders,
  Clock,
  CheckCheck,
} from 'lucide-react';
import {
  StoreData,
  PromptItem,
  Category,
  AdSlot,
  StoreSettings,
  PlatformType,
  BadgeType,
  AdNetwork,
  AdPlacement,
} from '../types';
import {
  verifyAdminPassword,
  changeAdminPassword,
  isAdminAuthenticated,
  logoutAdmin,
  triggerDownloadJSON,
  persistStoreData,
} from '../lib/storage';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  storeData: StoreData;
  onUpdateStoreData: (newData: StoreData) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  initialEditPrompt?: PromptItem | null;
  onClearInitialEditPrompt?: () => void;
}

type AdminTab = 'dashboard' | 'prompts' | 'categories' | 'ads' | 'backup' | 'settings';

export default function AdminPanel({
  isOpen,
  onClose,
  storeData,
  onUpdateStoreData,
  showToast,
  initialEditPrompt,
  onClearInitialEditPrompt,
}: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isAdminAuthenticated());
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Prompts management state
  const [isAddingPrompt, setIsAddingPrompt] = useState(false);
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const [promptSearch, setPromptSearch] = useState('');

  // Prompt Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState(storeData.categories[1]?.id || 'bing-3d-wings');
  const [formPlatform, setFormPlatform] = useState<PlatformType>('Bing Image Creator');
  const [formBadge, setFormBadge] = useState<BadgeType | 'None'>('Trending');
  const [formTags, setFormTags] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPromptText, setFormPromptText] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formDirectUrl, setFormDirectUrl] = useState('https://www.bing.com/images/create');
  const [formVariablesStr, setFormVariablesStr] = useState('NAME:Your Name:Arif');

  // Categories management state
  const [newCatName, setNewCatName] = useState('');
  const [newCatId, setNewCatId] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Sparkles');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');

  // Password change state
  const [oldPasswordInput, setOldPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordChangeMessage, setPasswordChangeMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Backup file upload state
  const [restoreFileError, setRestoreFileError] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Ad Management State & Local Drafts
  const [adSlotDrafts, setAdSlotDrafts] = useState<Record<string, {
    name: string;
    placement: AdPlacement;
    network: AdNetwork;
    enabled: boolean;
    code: string;
    dimensions?: string;
    notes?: string;
  }>>({});
  const [slotSavedStatus, setSlotSavedStatus] = useState<Record<string, { time: string; message: string }>>({});
  const [savingSlotId, setSavingSlotId] = useState<string | null>(null);
  const [isSavingAllAds, setIsSavingAllAds] = useState(false);
  const [lastAllAdsSavedTime, setLastAllAdsSavedTime] = useState<string | null>(null);

  // New Ad Slot Form State
  const [isAddingNewSlot, setIsAddingNewSlot] = useState(false);
  const [newSlotName, setNewSlotName] = useState('');
  const [newSlotPlacement, setNewSlotPlacement] = useState<AdPlacement>('header_banner');
  const [newSlotNetwork, setNewSlotNetwork] = useState<AdNetwork>('Monetag');
  const [newSlotDimensions, setNewSlotDimensions] = useState('Responsive');
  const [newSlotCode, setNewSlotCode] = useState('');
  const [newSlotNotes, setNewSlotNotes] = useState('');
  const [newSlotEnabled, setNewSlotEnabled] = useState(true);
  const [isSavingNewSlot, setIsSavingNewSlot] = useState(false);
  const [newSlotSaveMessage, setNewSlotSaveMessage] = useState<string | null>(null);

  // Manual Force Sync All
  const handleManualSync = async () => {
    setIsSyncing(true);
    const success = await persistStoreData(storeData);
    setIsSyncing(false);
    if (success) {
      showToast('সব প্রম্পট এবং সেটিংস সার্ভার ও ব্রাউজারে সফলভাবে সিঙ্ক ও সেভ হয়েছে!', 'success');
    } else {
      showToast('ব্রাউজারে সেভ হয়েছে, সার্ভারে কানেক্ট করার চেষ্টা করা হয়েছে।', 'info');
    }
  };

  // React to initialEditPrompt
  React.useEffect(() => {
    if (initialEditPrompt && isOpen) {
      handleStartEditPrompt(initialEditPrompt);
      if (onClearInitialEditPrompt) {
        onClearInitialEditPrompt();
      }
    }
  }, [initialEditPrompt, isOpen]);

  if (!isOpen) return null;

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const valid = await verifyAdminPassword(passwordInput);
    if (valid) {
      setIsAuthenticated(true);
      showToast('Admin access granted! Welcome.', 'success');
    } else {
      setLoginError('Invalid password. Please enter the correct master password.');
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
    setPasswordInput('');
    showToast('Admin logged out successfully', 'info');
  };

  // Quick reset form
  const resetPromptForm = () => {
    setFormTitle('');
    setFormCategory(storeData.categories[1]?.id || 'bing-3d-wings');
    setFormPlatform('Bing Image Creator');
    setFormBadge('Trending');
    setFormTags('3D Wings, Neon, Bing');
    setFormDescription('');
    setFormPromptText('');
    setFormImageUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80');
    setFormDirectUrl('https://www.bing.com/images/create');
    setFormVariablesStr('NAME:Your Name:Arif');
    setIsAddingPrompt(false);
    setEditingPromptId(null);
  };

  // Open Edit Form
  const handleStartEditPrompt = (prompt: PromptItem) => {
    setEditingPromptId(prompt.id);
    setIsAddingPrompt(true);
    setActiveTab('prompts');
    setFormTitle(prompt.title);
    setFormCategory(prompt.category);
    setFormPlatform(prompt.platform);
    setFormBadge(prompt.badge || 'None');
    setFormTags(prompt.tags.join(', '));
    setFormDescription(prompt.description || '');
    setFormPromptText(prompt.promptText);
    setFormImageUrl(prompt.previewImageUrl || prompt.thumbnailUrl || '');
    setFormDirectUrl(prompt.directActionUrl || 'https://www.bing.com/images/create');

    if (prompt.variables && prompt.variables.length > 0) {
      const vStr = prompt.variables
        .map((v) => `${v.key}:${v.label}:${v.defaultValue}`)
        .join('; ');
      setFormVariablesStr(vStr);
    } else {
      setFormVariablesStr('');
    }

    // Scroll smoothly to edit form
    setTimeout(() => {
      const el = document.getElementById('prompt-edit-form-box');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  };

  // Save Prompt (Add or Update)
  const handleSavePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formPromptText.trim()) {
      showToast('Please provide a title and prompt text', 'error');
      return;
    }

    // Parse variables from string (format: KEY:Label:Default; KEY2:Label2:Default)
    const variables: any[] = [];
    if (formVariablesStr.trim()) {
      const parts = formVariablesStr.split(';');
      parts.forEach((p) => {
        const segs = p.split(':').map((s) => s.trim());
        if (segs[0]) {
          variables.push({
            key: segs[0].toUpperCase(),
            label: segs[1] || segs[0],
            defaultValue: segs[2] || '',
            placeholder: `Enter ${segs[1] || segs[0]}`,
          });
        }
      });
    }

    const tagsArray = formTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const safeImage =
      formImageUrl.trim() ||
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';

    let updatedPrompts: PromptItem[];

    if (editingPromptId) {
      // Update existing in-place without losing stats or ID
      updatedPrompts = storeData.prompts.map((p) => {
        if (p.id === editingPromptId) {
          return {
            ...p,
            title: formTitle.trim(),
            category: formCategory,
            platform: formPlatform,
            badge: formBadge === 'None' ? undefined : formBadge,
            tags: tagsArray.length > 0 ? tagsArray : ['AI', 'Prompt'],
            description: formDescription.trim(),
            promptText: formPromptText.trim(),
            previewImageUrl: safeImage,
            thumbnailUrl: safeImage,
            directActionUrl: formDirectUrl.trim(),
            variables,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      showToast('Prompt updated successfully! আপনার সংশোধন সেভ হয়েছে।', 'success');
    } else {
      // Add new
      const newPrompt: PromptItem = {
        id: `p-${Date.now()}`,
        title: formTitle.trim(),
        category: formCategory,
        platform: formPlatform,
        badge: formBadge === 'None' ? undefined : formBadge,
        tags: tagsArray.length > 0 ? tagsArray : ['AI', 'Prompt'],
        description: formDescription.trim(),
        promptText: formPromptText.trim(),
        previewImageUrl: safeImage,
        thumbnailUrl: safeImage,
        directActionUrl: formDirectUrl.trim(),
        variables,
        views: 1,
        copies: 0,
        likes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      updatedPrompts = [newPrompt, ...storeData.prompts];
      showToast('New prompt added to store!', 'success');
    }

    const newData: StoreData = {
      ...storeData,
      prompts: updatedPrompts,
      lastUpdated: new Date().toISOString(),
    };

    onUpdateStoreData(newData);
    await persistStoreData(newData);
    resetPromptForm();
  };

  // Category Edit Handlers
  const handleStartEditCategory = (cat: Category) => {
    setEditingCatId(cat.id);
    setEditingCatName(cat.name);
  };

  const handleSaveEditCategory = async (catId: string) => {
    if (!editingCatName.trim()) return;
    const updatedCats = storeData.categories.map((c) =>
      c.id === catId ? { ...c, name: editingCatName.trim() } : c
    );
    const newData: StoreData = {
      ...storeData,
      categories: updatedCats,
      lastUpdated: new Date().toISOString(),
    };
    onUpdateStoreData(newData);
    await persistStoreData(newData);
    setEditingCatId(null);
    setEditingCatName('');
    showToast('Category updated successfully!', 'success');
  };

  // Change Admin Password Handler
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeMessage(null);
    if (!oldPasswordInput || !newPasswordInput) {
      setPasswordChangeMessage({ text: 'Please fill all password fields', type: 'error' });
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordChangeMessage({ text: 'New passwords do not match!', type: 'error' });
      return;
    }
    if (newPasswordInput.length < 6) {
      setPasswordChangeMessage({ text: 'New password must be at least 6 characters long', type: 'error' });
      return;
    }

    setIsChangingPassword(true);
    const res = await changeAdminPassword(oldPasswordInput, newPasswordInput);
    setIsChangingPassword(false);
    if (res.success) {
      setPasswordChangeMessage({ text: 'Master admin password changed successfully!', type: 'success' });
      setOldPasswordInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
      showToast('Admin password updated successfully!', 'success');
    } else {
      setPasswordChangeMessage({ text: res.error || 'Failed to change password', type: 'error' });
    }
  };

  // Delete Prompt
  const handleDeletePrompt = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this prompt from the store?')) {
      return;
    }
    const updated = storeData.prompts.filter((p) => p.id !== id);
    const newData: StoreData = {
      ...storeData,
      prompts: updated,
      lastUpdated: new Date().toISOString(),
    };
    onUpdateStoreData(newData);
    await persistStoreData(newData);
    showToast('Prompt deleted successfully', 'info');
  };

  // Categories Handlers
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const id = (newCatId.trim() || newCatName.toLowerCase().replace(/\s+/g, '-')).replace(/[^a-z0-9-]/g, '');
    if (storeData.categories.some((c) => c.id === id)) {
      showToast('Category with this ID already exists', 'error');
      return;
    }

    const newCat: Category = {
      id,
      name: newCatName.trim(),
      iconName: newCatIcon,
    };

    const newData: StoreData = {
      ...storeData,
      categories: [...storeData.categories, newCat],
      lastUpdated: new Date().toISOString(),
    };

    onUpdateStoreData(newData);
    await persistStoreData(newData);
    setNewCatName('');
    setNewCatId('');
    showToast(`Category "${newCat.name}" created!`, 'success');
  };

  const handleDeleteCategory = async (catId: string) => {
    if (catId === 'all') {
      showToast('Cannot delete "All" category', 'error');
      return;
    }
    if (!window.confirm(`Delete category "${catId}"? Prompts in this category will remain.`)) {
      return;
    }
    const updatedCats = storeData.categories.filter((c) => c.id !== catId);
    const newData = { ...storeData, categories: updatedCats };
    onUpdateStoreData(newData);
    await persistStoreData(newData);
    showToast('Category deleted', 'info');
  };

  // Ad Management Draft & Save Helpers
  const getSlotDraft = (slot: AdSlot) => {
    return (
      adSlotDrafts[slot.id] || {
        name: slot.name,
        placement: slot.placement,
        network: slot.network,
        enabled: slot.enabled,
        code: slot.code,
        dimensions: slot.dimensions || 'Responsive',
        notes: slot.notes || '',
      }
    );
  };

  const updateSlotDraft = (
    slot: AdSlot,
    updates: Partial<{
      name: string;
      placement: AdPlacement;
      network: AdNetwork;
      enabled: boolean;
      code: string;
      dimensions?: string;
      notes?: string;
    }>
  ) => {
    const current = getSlotDraft(slot);
    setAdSlotDrafts((prev) => ({
      ...prev,
      [slot.id]: { ...current, ...updates },
    }));
  };

  const isSlotDirty = (slot: AdSlot) => {
    const draft = adSlotDrafts[slot.id];
    if (!draft) return false;
    return (
      draft.code !== slot.code ||
      draft.network !== slot.network ||
      draft.enabled !== slot.enabled ||
      draft.dimensions !== (slot.dimensions || 'Responsive') ||
      draft.name !== slot.name ||
      draft.placement !== slot.placement
    );
  };

  // Save a specific single ad slot
  const handleSaveSlot = async (slot: AdSlot) => {
    setSavingSlotId(slot.id);
    const draft = getSlotDraft(slot);
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const updatedSlots = storeData.adSlots.map((s) => {
      if (s.id === slot.id) {
        return {
          ...s,
          ...draft,
          lastUpdated: new Date().toISOString(),
        };
      }
      return s;
    });

    const newData: StoreData = {
      ...storeData,
      adSlots: updatedSlots,
      lastUpdated: new Date().toISOString(),
    };

    onUpdateStoreData(newData);
    await persistStoreData(newData);

    setSavingSlotId(null);
    setSlotSavedStatus((prev) => ({
      ...prev,
      [slot.id]: {
        time: nowStr,
        message: `সফলভাবে সেভ হয়েছে! (Saved & Synced at ${nowStr})`,
      },
    }));

    showToast(`✅ "${draft.name}" অ্যাড স্লট সফলভাবে সেভ হয়েছে!`, 'success');
  };

  // Save all ad slots at once
  const handleSaveAllAdSlots = async () => {
    setIsSavingAllAds(true);
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const updatedSlots = storeData.adSlots.map((s) => {
      const draft = adSlotDrafts[s.id];
      if (draft) {
        return {
          ...s,
          ...draft,
          lastUpdated: new Date().toISOString(),
        };
      }
      return s;
    });

    const newData: StoreData = {
      ...storeData,
      adSlots: updatedSlots,
      lastUpdated: new Date().toISOString(),
    };

    onUpdateStoreData(newData);
    await persistStoreData(newData);

    setIsSavingAllAds(false);
    setLastAllAdsSavedTime(nowStr);

    const newStatuses: Record<string, { time: string; message: string }> = {};
    updatedSlots.forEach((s) => {
      newStatuses[s.id] = {
        time: nowStr,
        message: `সফলভাবে সেভ হয়েছে! (${nowStr})`,
      };
    });
    setSlotSavedStatus(newStatuses);

    showToast(`✅ সবগুলো অ্যাড স্লট সফলভাবে সেভ ও সিঙ্ক হয়েছে! (${nowStr})`, 'success');
  };

  // Add new ad slot
  const handleAddNewAdSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlotName.trim()) {
      showToast('দয়া করে অ্যাড স্লটের নাম লিখুন', 'error');
      return;
    }
    if (!newSlotCode.trim()) {
      showToast('দয়া করে অ্যাড স্ক্রিপ্ট বা ব্যানার কোড দিন', 'error');
      return;
    }

    setIsSavingNewSlot(true);
    const newId = `slot-custom-${Date.now()}`;
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const newSlot: AdSlot = {
      id: newId,
      name: newSlotName.trim(),
      placement: newSlotPlacement,
      network: newSlotNetwork,
      enabled: newSlotEnabled,
      code: newSlotCode.trim(),
      dimensions: newSlotDimensions.trim() || 'Responsive',
      notes: newSlotNotes.trim() || 'Custom Added Slot',
      lastUpdated: new Date().toISOString(),
    };

    const updatedSlots = [newSlot, ...storeData.adSlots];
    const newData: StoreData = {
      ...storeData,
      adSlots: updatedSlots,
      lastUpdated: new Date().toISOString(),
    };

    onUpdateStoreData(newData);
    await persistStoreData(newData);

    setIsSavingNewSlot(false);
    setNewSlotName('');
    setNewSlotCode('');
    setNewSlotNotes('');
    setIsAddingNewSlot(false);

    setSlotSavedStatus((prev) => ({
      ...prev,
      [newId]: {
        time: nowStr,
        message: `সফলভাবে তৈরি ও সেভ হয়েছে! (${nowStr})`,
      },
    }));
    setNewSlotSaveMessage(`✅ "${newSlot.name}" নতুন অ্যাড স্লট সফলভাবে তৈরি ও সেভ হয়েছে! (${nowStr})`);

    showToast(`✅ "${newSlot.name}" নতুন অ্যাড স্লট সফলভাবে তৈরি ও ডাটাবেজে সেভ হয়েছে!`, 'success');
  };

  // Delete an ad slot
  const handleDeleteAdSlot = async (slotId: string, slotName: string) => {
    if (!window.confirm(`আপনি কি নিশ্চিত যে "${slotName}" অ্যাড স্লটটি মুছে ফেলতে চান?`)) {
      return;
    }

    const updatedSlots = storeData.adSlots.filter((s) => s.id !== slotId);
    const newData: StoreData = {
      ...storeData,
      adSlots: updatedSlots,
      lastUpdated: new Date().toISOString(),
    };

    onUpdateStoreData(newData);
    await persistStoreData(newData);
    showToast(`অ্যাড স্লট "${slotName}" মুছে ফেলা হয়েছে`, 'info');
  };

  // Update Ad Slot
  const handleUpdateAdSlot = async (slotId: string, updates: Partial<AdSlot>) => {
    const updatedSlots = storeData.adSlots.map((slot) => {
      if (slot.id === slotId) {
        return { ...slot, ...updates };
      }
      return slot;
    });

    const newData: StoreData = {
      ...storeData,
      adSlots: updatedSlots,
      lastUpdated: new Date().toISOString(),
    };

    onUpdateStoreData(newData);
    await persistStoreData(newData);
    showToast('Ad configuration updated & saved!', 'success');
  };

  // Update Settings
  const handleUpdateSettings = async (updates: Partial<StoreSettings>) => {
    const newData: StoreData = {
      ...storeData,
      settings: { ...storeData.settings, ...updates },
      lastUpdated: new Date().toISOString(),
    };
    onUpdateStoreData(newData);
    await persistStoreData(newData);
    showToast('Store settings saved successfully!', 'success');
  };

  // Download Backup
  const handleDownloadBackup = () => {
    const filename = `premium-web-store-backup-${new Date().toISOString().slice(0, 10)}.json`;
    triggerDownloadJSON(storeData, filename);
    showToast('Full JSON backup downloaded to your device!', 'success');
  };

  // Restore from File
  const handleRestoreFromFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (!parsed || !Array.isArray(parsed.prompts)) {
          setRestoreFileError('Invalid backup file. Must contain a valid prompts array.');
          return;
        }

        setRestoreFileError('');
        onUpdateStoreData(parsed);
        await persistStoreData(parsed);
        showToast('Backup restored successfully! All items & settings recovered.', 'success');
      } catch (err: any) {
        setRestoreFileError('Failed to parse JSON backup file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  // Force Save to Server Disk
  const handleForceSave = async () => {
    const success = await persistStoreData(storeData);
    if (success) {
      showToast('All changes saved to persistent server storage (data/store.json)!', 'success');
    } else {
      showToast('Saved to browser storage! Server sync pending.', 'info');
    }
  };

  // Filter prompts in admin table
  const filteredPrompts = storeData.prompts.filter((p) => {
    const q = promptSearch.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.platform.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div
      id="admin-portal-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in"
    >
      <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Admin Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                <span>Premium Web store Admin</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono">
                  Master Control
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Manage Prompts, Ad Networks (Adsterra, Monetag, CPMBid, HilltopAds, Clickadu) & Backups
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Auto-Saved & Protected</span>
            </div>

            {isAuthenticated && (
              <button
                id="btn-admin-sync-now"
                onClick={handleManualSync}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition"
                title="Force sync all prompts and settings to server & browser"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync All'}</span>
              </button>
            )}

            {isAuthenticated && (
              <button
                id="btn-admin-logout"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              id="btn-close-admin-panel"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Not Authenticated: Password Prompt */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto my-auto">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-500/10">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-white">Enter Master Admin Password</h3>
              <p className="text-xs text-slate-400">
                Authorized management portal for Premium Web store.
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div className="relative">
                <input
                  id="admin-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter admin password..."
                  required
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {loginError && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                id="btn-admin-submit-login"
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition"
              >
                Access Admin Portal
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Dashboard & Tools */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Nav Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto px-5 py-2.5 bg-slate-950/70 border-b border-slate-800 text-xs font-semibold scrollbar-none">
              <button
                id="tab-admin-dashboard"
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition ${
                  activeTab === 'dashboard'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              <button
                id="tab-admin-prompts"
                onClick={() => setActiveTab('prompts')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition ${
                  activeTab === 'prompts'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Prompts ({storeData.prompts.length})</span>
              </button>

              <button
                id="tab-admin-categories"
                onClick={() => setActiveTab('categories')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition ${
                  activeTab === 'categories'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>Categories ({storeData.categories.length})</span>
              </button>

              <button
                id="tab-admin-ads"
                onClick={() => setActiveTab('ads')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition ${
                  activeTab === 'ads'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Ads Management</span>
              </button>

              <button
                id="tab-admin-backup"
                onClick={() => setActiveTab('backup')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition ${
                  activeTab === 'backup'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Backup & Storage</span>
              </button>

              <button
                id="tab-admin-settings"
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition ${
                  activeTab === 'settings'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Store Settings</span>
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6">
              {/* TAB 1: DASHBOARD OVERVIEW */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Top Stats Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-xs text-slate-400">Total Prompts</span>
                      <p className="text-2xl font-extrabold text-cyan-400 font-mono">
                        {storeData.prompts.length}
                      </p>
                      <span className="text-[10px] text-slate-500">Live in catalog</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-xs text-slate-400">Categories</span>
                      <p className="text-2xl font-extrabold text-amber-400 font-mono">
                        {storeData.categories.length}
                      </p>
                      <span className="text-[10px] text-slate-500">Active groupings</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-xs text-slate-400">Total Copies</span>
                      <p className="text-2xl font-extrabold text-emerald-400 font-mono">
                        {storeData.prompts.reduce((acc, p) => acc + p.copies, 0).toLocaleString()}
                      </p>
                      <span className="text-[10px] text-slate-500">Prompts copied</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-xs text-slate-400">Active Ad Slots</span>
                      <p className="text-2xl font-extrabold text-violet-400 font-mono">
                        {storeData.adSlots.filter((a) => a.enabled).length} / {storeData.adSlots.length}
                      </p>
                      <span className="text-[10px] text-slate-500">Adsterra / Monetag / CPMBid</span>
                    </div>
                  </div>

                  {/* Quick Action Shortcuts */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <h3 className="font-bold text-sm text-white">Quick Admin Shortcuts</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        onClick={() => {
                          resetPromptForm();
                          setIsAddingPrompt(true);
                          setActiveTab('prompts');
                        }}
                        className="p-3.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-left transition space-y-1"
                      >
                        <div className="flex items-center gap-2 font-bold text-xs">
                          <Plus className="w-4 h-4" />
                          <span>Add New Prompt</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Add new Bing 3D Wings or ChatGPT prompt
                        </p>
                      </button>

                      <button
                        onClick={() => setActiveTab('ads')}
                        className="p-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-left transition space-y-1"
                      >
                        <div className="flex items-center gap-2 font-bold text-xs">
                          <Tv className="w-4 h-4" />
                          <span>Setup Ad Networks</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Paste Adsterra, Monetag, CPMBid, HilltopAds tags
                        </p>
                      </button>

                      <button
                        onClick={handleDownloadBackup}
                        className="p-3.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-left transition space-y-1"
                      >
                        <div className="flex items-center gap-2 font-bold text-xs">
                          <Download className="w-4 h-4" />
                          <span>Download Safe Backup</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Export complete JSON backup to your computer
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Storage Persistence Status */}
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-slate-200">
                          Dual Persistent Storage Active
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Saved both to disk (`data/store.json`) and browser localStorage. Items will never disappear on reload.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleForceSave}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
                    >
                      Force Save Now
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: PROMPTS MANAGER */}
              {activeTab === 'prompts' && (
                <div className="space-y-5">
                  {/* Top Bar: Add New & Search */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="relative w-full sm:w-80">
                      <input
                        type="text"
                        placeholder="Filter prompts by name or tag..."
                        value={promptSearch}
                        onChange={(e) => setPromptSearch(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500"
                      />
                    </div>

                    <button
                      id="btn-add-prompt-modal-open"
                      onClick={() => {
                        resetPromptForm();
                        setIsAddingPrompt(true);
                      }}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Prompt / Item</span>
                    </button>
                  </div>

                  {/* Add / Edit Form Modal inside */}
                  {isAddingPrompt && (
                    <div
                      id="prompt-edit-form-box"
                      className={`p-5 rounded-2xl bg-slate-950 border ${
                        editingPromptId
                          ? 'border-2 border-cyan-400 shadow-2xl shadow-cyan-500/10'
                          : 'border-slate-800'
                      } space-y-4`}
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div>
                          <h4 className="font-extrabold text-sm sm:text-base text-cyan-300 flex items-center gap-2">
                            <Edit className="w-4 h-4 text-cyan-400" />
                            <span>{editingPromptId ? '✏️ Edit Prompt / সংশোধন করুন' : '✨ Create New Prompt / Asset'}</span>
                          </h4>
                          {editingPromptId && (
                            <p className="text-[11px] text-amber-300 mt-1">
                              💡 <strong>ভুল হলে ডিলিট করার কোনো প্রয়োজন নেই!</strong> এখানে যেকোনো ভুল তথ্য সংশোধন করে নিচে <strong>"Update Prompt (পরিবর্তন সেভ করুন)"</strong> বাটনে ক্লিক করলেই সাথে সাথে আপডেট হয়ে যাবে।
                            </p>
                          )}
                        </div>
                        <button
                          onClick={resetPromptForm}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                        >
                          Cancel
                        </button>
                      </div>

                      <form onSubmit={handleSavePrompt} className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="font-semibold text-slate-300">Prompt Title *</label>
                            <input
                              type="text"
                              value={formTitle}
                              onChange={(e) => setFormTitle(e.target.value)}
                              placeholder="e.g., 3D Boy Sitting on Angel Wings with Neon Name"
                              required
                              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-semibold text-slate-300">Category</label>
                            <select
                              value={formCategory}
                              onChange={(e) => setFormCategory(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                            >
                              {storeData.categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="font-semibold text-slate-300">Target AI Platform</label>
                            <select
                              value={formPlatform}
                              onChange={(e) => setFormPlatform(e.target.value as PlatformType)}
                              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                            >
                              <option value="Bing Image Creator">Bing Image Creator (DALL-E 3)</option>
                              <option value="ChatGPT">ChatGPT</option>
                              <option value="Midjourney">Midjourney</option>
                              <option value="Gemini">Gemini</option>
                              <option value="Web Script">Web Script / Source Code</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="font-semibold text-slate-300">Badge</label>
                            <select
                              value={formBadge}
                              onChange={(e) => setFormBadge(e.target.value as any)}
                              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                            >
                              <option value="Trending">Trending (Amber)</option>
                              <option value="Hot">Hot (Rose)</option>
                              <option value="Pro">Pro (Violet)</option>
                              <option value="Free">Free (Emerald)</option>
                              <option value="Popular">Popular (Cyan)</option>
                              <option value="New">New</option>
                              <option value="None">No Badge</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="font-semibold text-slate-300">Tags (comma separated)</label>
                            <input
                              type="text"
                              value={formTags}
                              onChange={(e) => setFormTags(e.target.value)}
                              placeholder="3D Wings, Neon, DP, Bing"
                              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-slate-300">Preview Image URL *</label>
                          <input
                            type="url"
                            value={formImageUrl}
                            onChange={(e) => setFormImageUrl(e.target.value)}
                            placeholder="https://images.unsplash.com/photo-..."
                            required
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-slate-300">Short Description</label>
                          <input
                            type="text"
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                            placeholder="Brief info about the prompt style or output"
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-slate-300 flex items-center justify-between">
                            <span>Full Prompt Text * (Use {'{NAME}'} for dynamic replacement)</span>
                            <span className="text-[10px] text-cyan-400 font-mono">
                              Users can customize {'{NAME}'} before copying!
                            </span>
                          </label>
                          <textarea
                            value={formPromptText}
                            onChange={(e) => setFormPromptText(e.target.value)}
                            rows={5}
                            required
                            placeholder="Create a 3D realistic illustration of a 20-year-old boy sitting on white angel wings with {NAME} written on the wall..."
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-slate-300">
                            Customizable Variables (Format: KEY:Label:DefaultValue; KEY2:Label2:Default)
                          </label>
                          <input
                            type="text"
                            value={formVariablesStr}
                            onChange={(e) => setFormVariablesStr(e.target.value)}
                            placeholder="NAME:Your Name:Arif; AGE:Your Age:20"
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                          />
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={resetPromptForm}
                            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                          >
                            Cancel
                          </button>
                          <button
                            id="btn-save-prompt-submit"
                            type="submit"
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold flex items-center gap-2 shadow-lg shadow-cyan-500/20 text-xs transition"
                          >
                            <Save className="w-4 h-4" />
                            <span>{editingPromptId ? '💾 Update Prompt (পরিবর্তন সেভ করুন)' : '💾 Save to Store (স্টোরে সেভ করুন)'}</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Prompts Table */}
                  <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 font-semibold">
                          <tr>
                            <th className="p-3">Preview</th>
                            <th className="p-3">Title & Platform</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Stats</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80">
                          {filteredPrompts.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-900/60 transition">
                              <td className="p-3">
                                <img
                                  src={p.previewImageUrl}
                                  alt={p.title}
                                  className="w-12 h-12 rounded-lg object-cover bg-slate-900"
                                />
                              </td>
                              <td className="p-3 max-w-xs">
                                <p className="font-bold text-slate-200 line-clamp-1">{p.title}</p>
                                <span className="text-[10px] text-cyan-400 font-mono">
                                  {p.platform}
                                </span>
                              </td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                                  {p.category}
                                </span>
                              </td>
                              <td className="p-3 text-[11px] font-mono text-slate-400">
                                <div>👁️ {p.views.toLocaleString()}</div>
                                <div className="text-cyan-400">📋 {p.copies.toLocaleString()}</div>
                              </td>
                              <td className="p-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleStartEditPrompt(p)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-bold border border-cyan-500/40 text-xs transition shadow-sm"
                                    title="Edit this prompt without deleting"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                    <span>Edit (এডিট)</span>
                                  </button>
                                  <button
                                    onClick={() => handleDeletePrompt(p.id)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs border border-rose-500/30 transition"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CATEGORIES MANAGER */}
              {activeTab === 'categories' && (
                <div className="space-y-6">
                  {/* Add Category Box */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      <FolderPlus className="w-4 h-4 text-cyan-400" />
                      <span>Add New Store Category</span>
                    </h4>

                    <form onSubmit={handleAddCategory} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <input
                        type="text"
                        placeholder="Category Name (e.g. Ramadan Prompts)"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        required
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />

                      <input
                        type="text"
                        placeholder="Slug ID (e.g. ramadan-prompts)"
                        value={newCatId}
                        onChange={(e) => setNewCatId(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />

                      <select
                        value={newCatIcon}
                        onChange={(e) => setNewCatIcon(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      >
                        <option value="Sparkles">Sparkles</option>
                        <option value="Flame">Flame (Trending)</option>
                        <option value="Heart">Heart (Couple)</option>
                        <option value="Camera">Camera (Portrait)</option>
                        <option value="Cpu">Cpu (Cyberpunk)</option>
                        <option value="FileText">FileText (Writing)</option>
                        <option value="UserCheck">UserCheck (Avatars)</option>
                        <option value="Code">Code (Web Scripts)</option>
                      </select>

                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Create Category</span>
                      </button>
                    </form>
                  </div>

                  {/* Categories List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {storeData.categories.map((cat) => {
                      const count = storeData.prompts.filter((p) => p.category === cat.id).length;
                      return (
                        <div
                          key={cat.id}
                          className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2"
                        >
                          {editingCatId === cat.id ? (
                            <div className="flex items-center gap-1.5 w-full">
                              <input
                                type="text"
                                value={editingCatName}
                                onChange={(e) => setEditingCatName(e.target.value)}
                                className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-cyan-400 text-xs text-white outline-none"
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveEditCategory(cat.id)}
                                className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                                title="Save Name"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingCatId(null)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                                title="Cancel"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <div>
                                <p className="font-bold text-xs text-white">{cat.name}</p>
                                <p className="text-[10px] text-slate-400 font-mono">ID: {cat.id}</p>
                                <span className="text-[10px] text-cyan-400 font-mono">
                                  {count} prompts assigned
                                </span>
                              </div>
                              {cat.id !== 'all' && (
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleStartEditCategory(cat)}
                                    className="p-1.5 rounded-lg text-cyan-400 hover:text-white bg-slate-900 hover:bg-cyan-600/30 transition"
                                    title="Edit Category Name"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteCategory(cat.id)}
                                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 bg-slate-900 hover:bg-rose-500/10 transition"
                                    title="Delete Category"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: ADS MANAGEMENT (Adsterra, Monetag, CPMBid, HilltopAds, Clickadu, Custom) */}
              {activeTab === 'ads' && (
                <div className="space-y-6">
                  {/* Top Header & Master Save Bar */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/50 via-slate-900 to-blue-950/50 border border-cyan-500/30 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                          <Tv className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                            <span>Ad Networks & Monetization (বিজ্ঞাপন ও অ্যাড নিয়ন্ত্রণ)</span>
                          </h3>
                          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                            Adsterra, Monetag, CPMBid, HilltopAds, Clickadu বা যেকোনো কাস্টম ব্যানার কোড যুক্ত ও সেভ করুন।
                          </p>
                        </div>
                      </div>

                      {/* Header Actions: Add New Slot & Save All Ads */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => setIsAddingNewSlot(!isAddingNewSlot)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                            isAddingNewSlot
                              ? 'bg-slate-800 text-slate-300 border border-slate-700'
                              : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                          }`}
                        >
                          {isAddingNewSlot ? (
                            <>
                              <X className="w-3.5 h-3.5" />
                              <span>Cancel (বাতিল)</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>➕ Add New Ad Slot (নতুন অ্যাড যোগ করুন)</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          id="btn-save-all-ads"
                          onClick={handleSaveAllAdSlots}
                          disabled={isSavingAllAds}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition disabled:opacity-50"
                        >
                          {isSavingAllAds ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Saving All Ads... (সেভ হচ্ছে...)</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-3.5 h-3.5" />
                              <span>💾 Save All Ads (সবগুলো অ্যাড সেভ করুন)</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Stats & Last Saved Info */}
                    <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px]">
                          Total Slots: <strong className="text-white">{storeData.adSlots.length}</strong>
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          Active: {storeData.adSlots.filter((s) => s.enabled).length}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[11px]">
                          Disabled: {storeData.adSlots.filter((s) => !s.enabled).length}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Last Saved: </span>
                        <span className="font-mono text-cyan-300 font-semibold">
                          {lastAllAdsSavedTime || storeData.lastUpdated?.slice(11, 19) || 'Just now'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* FORM: ADD NEW AD SLOT (নতুন অ্যাড স্লট যোগ করার ফর্ম) */}
                  {isAddingNewSlot && (
                    <div className="p-5 rounded-2xl bg-slate-950 border-2 border-emerald-500/40 space-y-4 shadow-xl animate-fade-in">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                            <Plus className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-white">
                              Add New Ad Slot & Script (নতুন অ্যাড স্লট যোগ করুন)
                            </h4>
                            <p className="text-[11px] text-slate-400">
                              এখানে আপনার নতুন কোনো অ্যাড কোড, পপআন্ডার বা ব্যানার কোড যুক্ত করে সেভ করুন।
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setIsAddingNewSlot(false)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleAddNewAdSlot} className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {/* Slot Name */}
                          <div className="space-y-1">
                            <label className="font-semibold text-slate-300">
                              Ad Slot Name (অ্যাড স্লটের নাম) <span className="text-rose-400">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Monetag Native Banner or Popunder"
                              value={newSlotName}
                              onChange={(e) => setNewSlotName(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                            />
                          </div>

                          {/* Target Network */}
                          <div className="space-y-1">
                            <label className="font-semibold text-slate-300">Ad Network</label>
                            <select
                              value={newSlotNetwork}
                              onChange={(e) => setNewSlotNetwork(e.target.value as AdNetwork)}
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                            >
                              <option value="Monetag">Monetag</option>
                              <option value="Adsterra">Adsterra</option>
                              <option value="CPMBid">CPMBid</option>
                              <option value="HilltopAds">HilltopAds</option>
                              <option value="Clickadu">Clickadu</option>
                              <option value="Custom">Custom HTML / Script</option>
                            </select>
                          </div>

                          {/* Placement */}
                          <div className="space-y-1">
                            <label className="font-semibold text-slate-300">Placement Position</label>
                            <select
                              value={newSlotPlacement}
                              onChange={(e) => setNewSlotPlacement(e.target.value as AdPlacement)}
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                            >
                              <option value="header_banner">Header Banner (উপরে)</option>
                              <option value="in_feed_native">In-Feed Native Grid (কার্ডের মাঝে)</option>
                              <option value="under_prompt_modal">Under Code Snippet (সিঙ্গেল পেজে)</option>
                              <option value="sticky_footer">Sticky Floating Bottom (নিচে ভাসমান)</option>
                              <option value="direct_link_popunder">Direct Link / Popunder</option>
                              <option value="sidebar_banner">Sidebar Banner</option>
                            </select>
                          </div>

                          {/* Dimensions */}
                          <div className="space-y-1">
                            <label className="font-semibold text-slate-300">Dimensions / Size</label>
                            <input
                              type="text"
                              placeholder="e.g. Responsive, 728x90, 300x250"
                              value={newSlotDimensions}
                              onChange={(e) => setNewSlotDimensions(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                            />
                          </div>

                          {/* Notes */}
                          <div className="space-y-1">
                            <label className="font-semibold text-slate-300">Admin Notes (অপশনাল)</label>
                            <input
                              type="text"
                              placeholder="e.g. Monetag zone id 284836"
                              value={newSlotNotes}
                              onChange={(e) => setNewSlotNotes(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                            />
                          </div>

                          {/* Initial Status */}
                          <div className="space-y-1 flex flex-col justify-end">
                            <label className="font-semibold text-slate-300 mb-1">Status</label>
                            <button
                              type="button"
                              onClick={() => setNewSlotEnabled(!newSlotEnabled)}
                              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between border transition ${
                                newSlotEnabled
                                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                                  : 'bg-slate-900 border-slate-700 text-slate-400'
                              }`}
                            >
                              <span>{newSlotEnabled ? 'Active (চালু থাকবে)' : 'Disabled (বন্ধ থাকবে)'}</span>
                              <div
                                className={`w-3.5 h-3.5 rounded-full ${
                                  newSlotEnabled ? 'bg-emerald-400' : 'bg-slate-600'
                                }`}
                              />
                            </button>
                          </div>
                        </div>

                        {/* Code Textarea */}
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-300 flex items-center justify-between">
                            <span>
                              Ad Script / HTML / Banner Code (কোড বা স্ক্রিপ্ট পেস্ট করুন): <span className="text-rose-400">*</span>
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              &lt;script&gt;, &lt;iframe&gt;, &lt;a&gt;&lt;img&gt; or Direct Link URL
                            </span>
                          </label>
                          <textarea
                            rows={4}
                            required
                            value={newSlotCode}
                            onChange={(e) => setNewSlotCode(e.target.value)}
                            placeholder="<!-- Paste your Monetag / Adsterra script here -->&#10;<script>...</script>"
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setIsAddingNewSlot(false)}
                            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSavingNewSlot}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition disabled:opacity-50"
                          >
                            {isSavingNewSlot ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>Saving... (সেভ হচ্ছে...)</span>
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4" />
                                <span>💾 Save & Add Ad Slot (অ্যাড স্লট সেভ ও যোগ করুন)</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Confirmation Banner for Newly Added Slot */}
                  {newSlotSaveMessage && (
                    <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="font-bold">{newSlotSaveMessage}</span>
                      </div>
                      <button
                        onClick={() => setNewSlotSaveMessage(null)}
                        className="text-emerald-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* LIST OF AD SLOTS */}
                  <div className="space-y-5">
                    {storeData.adSlots.map((slot) => {
                      const draft = getSlotDraft(slot);
                      const dirty = isSlotDirty(slot);
                      const savedInfo = slotSavedStatus[slot.id];
                      const isCurrentlySaving = savingSlotId === slot.id;

                      return (
                        <div
                          key={slot.id}
                          className={`p-5 rounded-2xl bg-slate-950 border transition-all space-y-4 ${
                            dirty
                              ? 'border-amber-500/60 shadow-lg shadow-amber-500/5'
                              : savedInfo
                              ? 'border-emerald-500/50'
                              : 'border-slate-800'
                          }`}
                        >
                          {/* Slot Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="font-bold text-sm text-white">{draft.name}</h4>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                                  {draft.dimensions || 'Responsive'}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono border border-cyan-500/20">
                                  {draft.placement}
                                </span>

                                {/* Dirty / Saved State Badges */}
                                {dirty ? (
                                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center gap-1 animate-pulse">
                                    <AlertCircle className="w-3 h-3" />
                                    <span>⚠️ Unsaved Changes (সেভ করুন)</span>
                                  </span>
                                ) : savedInfo ? (
                                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                                    <CheckCheck className="w-3 h-3 text-emerald-400" />
                                    <span>Saved ({savedInfo.time})</span>
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 text-[10px] font-mono border border-slate-800 flex items-center gap-1">
                                    <Check className="w-3 h-3 text-slate-400" />
                                    <span>Database Synced</span>
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400">{draft.notes || slot.notes}</p>
                            </div>

                            {/* Active/Disabled Toggle Switch */}
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-semibold text-slate-300">
                                {draft.enabled ? (
                                  <span className="text-emerald-400 flex items-center gap-1">
                                    <Check className="w-3.5 h-3.5" /> Active (চালু)
                                  </span>
                                ) : (
                                  <span className="text-slate-500">Disabled (বন্ধ)</span>
                                )}
                              </span>
                              <button
                                type="button"
                                id={`toggle-ad-${slot.id}`}
                                onClick={() => updateSlotDraft(slot, { enabled: !draft.enabled })}
                                className={`w-12 h-6 rounded-full transition-colors p-1 ${
                                  draft.enabled ? 'bg-cyan-500' : 'bg-slate-800'
                                }`}
                                title="Click to toggle Active/Disabled"
                              >
                                <div
                                  className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                                    draft.enabled ? 'translate-x-6' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                            </div>
                          </div>

                          {/* Saved Status Notification Box (inside the card) */}
                          {savedInfo && (
                            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between animate-fade-in">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span className="font-semibold">
                                  {savedInfo.message || `অ্যাড স্লট "${draft.name}" সফলভাবে সেভ হয়েছে!`}
                                </span>
                              </div>
                              <span className="text-[10px] font-mono text-emerald-400/80">
                                {savedInfo.time}
                              </span>
                            </div>
                          )}

                          {/* Unsaved Prompt Warning */}
                          {dirty && !savedInfo && (
                            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                              <span>
                                আপনি এই স্লটে পরিবর্তন করেছেন। পরিবর্তন নিশ্চিত করতে নিচের <strong>"💾 Save Ad Slot"</strong> বাটনে ক্লিক করুন।
                              </span>
                            </div>
                          )}

                          {/* Network Selector & Settings */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-300">
                                Target Ad Network:
                              </label>
                              <select
                                value={draft.network}
                                onChange={(e) =>
                                  updateSlotDraft(slot, { network: e.target.value as AdNetwork })
                                }
                                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                              >
                                <option value="Monetag">Monetag</option>
                                <option value="Adsterra">Adsterra</option>
                                <option value="CPMBid">CPMBid</option>
                                <option value="HilltopAds">HilltopAds</option>
                                <option value="Clickadu">Clickadu</option>
                                <option value="Custom">Custom HTML / Script</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-300">
                                Slot Display Name:
                              </label>
                              <input
                                type="text"
                                value={draft.name}
                                onChange={(e) => updateSlotDraft(slot, { name: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-300">
                                Dimensions / Size:
                              </label>
                              <input
                                type="text"
                                value={draft.dimensions || ''}
                                placeholder="Responsive or 728x90"
                                onChange={(e) =>
                                  updateSlotDraft(slot, { dimensions: e.target.value })
                                }
                                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                              />
                            </div>
                          </div>

                          {/* Ad Script Code Area */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                                <Code className="w-3.5 h-3.5 text-cyan-400" />
                                <span>Ad Script / HTML / Banner Code:</span>
                              </label>
                              {draft.code && (
                                <button
                                  type="button"
                                  onClick={() => updateSlotDraft(slot, { code: '' })}
                                  className="text-[10px] text-rose-400 hover:text-rose-300 hover:underline"
                                >
                                  ক্লিয়ার কোড (Clear)
                                </button>
                              )}
                            </div>
                            <textarea
                              rows={5}
                              value={draft.code}
                              onChange={(e) => updateSlotDraft(slot, { code: e.target.value })}
                              placeholder="Paste your ad script, iframe, banner code, or direct link URL here..."
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-cyan-500 leading-relaxed"
                            />
                            <p className="text-[10px] text-slate-500 font-mono">
                              Monetag, Adsterra, বা CPMBid কোড পেস্ট করার পর নিচে সেভ বাটনে ক্লিক করবেন।
                            </p>
                          </div>

                          {/* Quick Live Preview Box for Admin */}
                          {draft.code && (
                            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
                              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                                Live Slot Preview:
                              </span>
                              <div
                                dangerouslySetInnerHTML={{ __html: draft.code }}
                                className="overflow-x-auto flex justify-center py-2"
                              />
                            </div>
                          )}

                          {/* ACTION BUTTONS: SAVE BUTTON, REVERT, DELETE */}
                          <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                              {slot.id.startsWith('slot-custom-') && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteAdSlot(slot.id, draft.name)}
                                  className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs border border-rose-500/30 flex items-center gap-1.5 transition"
                                  title="Delete this custom slot"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete Slot</span>
                                </button>
                              )}

                              {dirty && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAdSlotDrafts((prev) => {
                                      const next = { ...prev };
                                      delete next[slot.id];
                                      return next;
                                    });
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                                >
                                  Revert (পূর্বাবস্থায় ফিরুন)
                                </button>
                              )}
                            </div>

                            {/* PROMINENT SAVE BUTTON FOR THIS AD SLOT */}
                            <button
                              type="button"
                              id={`btn-save-slot-${slot.id}`}
                              onClick={() => handleSaveSlot(slot)}
                              disabled={isCurrentlySaving}
                              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition disabled:opacity-50 ${
                                savedInfo && !dirty
                                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                                  : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/25'
                              }`}
                            >
                              {isCurrentlySaving ? (
                                <>
                                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                                  <span>Saving Slot... (সেভ হচ্ছে...)</span>
                                </>
                              ) : savedInfo && !dirty ? (
                                <>
                                  <CheckCheck className="w-4 h-4 text-slate-950" />
                                  <span>✅ Saved Successfully! (সেভ হয়েছে)</span>
                                </>
                              ) : (
                                <>
                                  <Save className="w-4 h-4 text-slate-950" />
                                  <span>💾 Save Ad Slot (এই স্লটটি সেভ করুন)</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* BOTTOM MASTER SAVE ALL ADS BAR */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-0.5 text-center sm:text-left">
                      <p className="font-bold text-xs text-white">সবগুলো অ্যাড স্লটের পরিবর্তন একসাথে সেভ করতে চান?</p>
                      <p className="text-[11px] text-slate-400">
                        ক্লিক করলে সমস্ত অ্যাড স্লট সার্ভার ডিস্ক এবং ব্রাউজার মেমোরিতে সরাসরি সেভ হবে।
                      </p>
                    </div>

                    <button
                      type="button"
                      id="btn-bottom-save-all-ads"
                      onClick={handleSaveAllAdSlots}
                      disabled={isSavingAllAds}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition disabled:opacity-50"
                    >
                      {isSavingAllAds ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Saving All...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>💾 Save All Ad Settings (সবগুলো অ্যাড সেভ করুন)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 5: BACKUP & DURABLE STORAGE */}
              {activeTab === 'backup' && (
                <div className="space-y-6">
                  {/* Main Backup Overview Card */}
                  <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Database className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm sm:text-base text-white">
                          Strong Backup & Zero Data Loss Guarantee
                        </h3>
                        <p className="text-xs text-slate-400">
                          Your entire store catalog, categories, ad codes, and settings can be backed up and restored anytime.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      {/* Download Backup */}
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between">
                        <div className="space-y-1">
                          <h4 className="font-bold text-xs text-slate-200 flex items-center gap-2">
                            <Download className="w-4 h-4 text-cyan-400" />
                            <span>1. Download Full JSON Backup</span>
                          </h4>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            Generates a complete standalone `.json` file containing all {storeData.prompts.length} prompts, {storeData.categories.length} categories, ad scripts, and settings. Keep this safely on your phone or PC.
                          </p>
                        </div>
                        <button
                          id="btn-admin-download-backup"
                          onClick={handleDownloadBackup}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition"
                        >
                          <Download className="w-4 h-4" />
                          <span>Export Backup File (.json)</span>
                        </button>
                      </div>

                      {/* Restore from Backup */}
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between">
                        <div className="space-y-1">
                          <h4 className="font-bold text-xs text-slate-200 flex items-center gap-2">
                            <Upload className="w-4 h-4 text-emerald-400" />
                            <span>2. Restore Store from Backup</span>
                          </h4>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            Upload your previously exported `.json` file to instantly restore everything back into the database.
                          </p>
                        </div>

                        <div>
                          <label
                            htmlFor="restore-file-input"
                            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition"
                          >
                            <Upload className="w-4 h-4 text-emerald-400" />
                            <span>Select Backup File to Restore</span>
                          </label>
                          <input
                            id="restore-file-input"
                            type="file"
                            accept=".json"
                            onChange={handleRestoreFromFile}
                            className="hidden"
                          />
                        </div>
                      </div>
                    </div>

                    {restoreFileError && (
                      <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{restoreFileError}</span>
                      </div>
                    )}
                  </div>

                  {/* Manual Server Disk Save */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs text-white">Manual Disk Sync (server.ts)</h4>
                      <p className="text-[11px] text-slate-400">
                        Last saved to persistent disk: <span className="font-mono text-cyan-400">{storeData.lastUpdated || 'Just now'}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={handleForceSave}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save to Server Disk</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: STORE SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-5 max-w-2xl">
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                    <h4 className="font-bold text-sm text-white">General Store Information</h4>

                    <div className="space-y-3 text-xs">
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-300">Store Name</label>
                        <input
                          type="text"
                          value={storeData.settings.siteName}
                          onChange={(e) => handleUpdateSettings({ siteName: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-slate-300">Tagline / Subtitle</label>
                        <input
                          type="text"
                          value={storeData.settings.tagline}
                          onChange={(e) => handleUpdateSettings({ tagline: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-slate-300">Announcement Bar Text</label>
                        <textarea
                          rows={2}
                          value={storeData.settings.announcementBar.text}
                          onChange={(e) =>
                            handleUpdateSettings({
                              announcementBar: {
                                ...storeData.settings.announcementBar,
                                text: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-300">Telegram Channel Link</label>
                          <input
                            type="text"
                            value={storeData.settings.telegramChannel || ''}
                            onChange={(e) =>
                              handleUpdateSettings({ telegramChannel: e.target.value })
                            }
                            placeholder="https://t.me/yourchannel"
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-slate-300">Contact Email</label>
                          <input
                            type="email"
                            value={storeData.settings.contactEmail || ''}
                            onChange={(e) =>
                              handleUpdateSettings({ contactEmail: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-slate-300">Footer Text</label>
                        <input
                          type="text"
                          value={storeData.settings.footerText}
                          onChange={(e) => handleUpdateSettings({ footerText: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Master Admin Password Management */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">Master Admin Password (গোপন পাসওয়ার্ড)</h4>
                        <p className="text-[11px] text-slate-400">
                          এখানে আপনার মাস্টার এডমিন পাসওয়ার্ড পরিবর্তন করতে পারেন। এটি সম্পূর্ণ প্রাইভেট—কোনো সাধারণ ইউজার বা ভিজিটর কখনোই এই পাসওয়ার্ড দেখতে পাবে না।
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleChangePasswordSubmit} className="space-y-3 text-xs">
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-300">Current Password (বর্তমান পাসওয়ার্ড)</label>
                        <input
                          type="password"
                          value={oldPasswordInput}
                          onChange={(e) => setOldPasswordInput(e.target.value)}
                          placeholder="Enter current password..."
                          required
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-300">New Password (নতুন পাসওয়ার্ড)</label>
                          <input
                            type="password"
                            value={newPasswordInput}
                            onChange={(e) => setNewPasswordInput(e.target.value)}
                            placeholder="At least 6 characters..."
                            required
                            minLength={6}
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-slate-300">Confirm New Password (পুনরায় লিখুন)</label>
                          <input
                            type="password"
                            value={confirmPasswordInput}
                            onChange={(e) => setConfirmPasswordInput(e.target.value)}
                            placeholder="Confirm new password..."
                            required
                            minLength={6}
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500"
                          />
                        </div>
                      </div>

                      {passwordChangeMessage && (
                        <div
                          className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                            passwordChangeMessage.type === 'success'
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                          }`}
                        >
                          {passwordChangeMessage.type === 'success' ? (
                            <CheckCircle className="w-4 h-4 shrink-0" />
                          ) : (
                            <AlertCircle className="w-4 h-4 shrink-0" />
                          )}
                          <span>{passwordChangeMessage.text}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isChangingPassword}
                        className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-violet-600/20"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{isChangingPassword ? 'Updating Password...' : 'Update Admin Password (পাসওয়ার্ড সংরক্ষণ)'}</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
