import React, { useState, useEffect, useMemo } from 'react';
import {
  Flame,
  Search,
  ExternalLink,
  Sliders,
  X,
  ArrowUp,
  ArrowRight,
} from 'lucide-react';
import { StoreData, PromptItem, PlatformType } from './types';
import { INITIAL_STORE_DATA } from './data/initialData';
import {
  fetchStoreData,
  getFavorites,
  toggleFavorite as toggleFavStorage,
  logAnalytics,
} from './lib/storage';
import Header from './components/Header';
import AnnouncementBar from './components/AnnouncementBar';
import CategoryFilter from './components/CategoryFilter';
import PromptCard from './components/PromptCard';
import SinglePostView from './components/SinglePostView';
import AiTestLabView from './components/AiTestLabView';
import ImageToolkitView from './components/ImageToolkitView';
import FavoritesDrawer from './components/FavoritesDrawer';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import AdRenderer from './components/AdRenderer';
import Toast, { ToastMessage } from './components/Toast';

const HERO_LINES = [
  '🌐 এক ক্লিকে ওয়েবসাইট রেডি',
  '🖼️ এক ক্লিকে ছবি রেডি',
  '🎬 এক ক্লিকে ভিডিও রেডি',
  '✍️ এক ক্লিকে লেখা রেডি',
];

export default function App() {
  const [storeData, setStoreData] = useState<StoreData>(INITIAL_STORE_DATA);
  const [currentView, setCurrentView] = useState<'home' | 'ai-test-lab' | 'image-toolkit' | 'single-post'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>('All');
  const [activePrompt, setActivePrompt] = useState<PromptItem | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoritesDrawerOpen, setFavoritesDrawerOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [editPromptTarget, setEditPromptTarget] = useState<PromptItem | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [stickyAdDismissed, setStickyAdDismissed] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);

  // Sync URL changes (e.g. /admin, /ai-test-lab, /image-toolkit, /prompt/:id, #admin, etc.)
  const syncRouteFromLocation = (promptsList: PromptItem[] = storeData.prompts) => {
    const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
    const hash = window.location.hash.toLowerCase();

    // 1. /admin or #admin route opens Admin Panel directly
    if (pathname === '/admin' || hash === '#admin') {
      setAdminOpen(true);
      return;
    }

    // 2. /ai-test-lab
    if (pathname === '/ai-test-lab' || hash === '#ai-test-lab') {
      setCurrentView('ai-test-lab');
      setActivePrompt(null);
      setAdminOpen(false);
      return;
    }

    // 3. /image-toolkit
    if (pathname === '/image-toolkit' || hash === '#image-toolkit') {
      setCurrentView('image-toolkit');
      setActivePrompt(null);
      setAdminOpen(false);
      return;
    }

    // 4. /prompt/:id or #prompt-:id
    let promptId: string | null = null;
    if (pathname.startsWith('/prompt/')) {
      promptId = pathname.replace('/prompt/', '');
    } else if (hash.startsWith('#prompt-')) {
      promptId = hash.replace('#prompt-', '');
    }

    if (promptId && promptsList.length > 0) {
      const match = promptsList.find((p) => p.id === promptId);
      if (match) {
        setActivePrompt(match);
        setCurrentView('single-post');
        setAdminOpen(false);
        return;
      }
    }

    // Default root path
    if (pathname === '/' && !hash) {
      setAdminOpen(false);
      if (currentView === 'single-post') {
        setActivePrompt(null);
        setCurrentView('home');
      }
    }
  };

  // Load initial store data & favorites + listen to browser routing
  useEffect(() => {
    async function init() {
      const data = await fetchStoreData();
      setStoreData(data);
      setFavorites(getFavorites());
      const savedTheme = localStorage.getItem('theme_preference');
      if (savedTheme === 'light') {
        setIsLightMode(true);
        document.body.classList.add('light-mode');
      }

      // Check URL route immediately on load with retrieved data
      syncRouteFromLocation(data.prompts);
    }
    init();

    // Listen to browser Back/Forward & hash changes
    const onLocationChange = () => {
      syncRouteFromLocation();
    };
    window.addEventListener('popstate', onLocationChange);
    window.addEventListener('hashchange', onLocationChange);
    return () => {
      window.removeEventListener('popstate', onLocationChange);
      window.removeEventListener('hashchange', onLocationChange);
    };
  }, []);

  // Theme Toggle
  const handleToggleTheme = () => {
    setIsLightMode((prev) => {
      const next = !prev;
      if (next) {
        document.body.classList.add('light-mode');
        localStorage.setItem('theme_preference', 'light');
      } else {
        document.body.classList.remove('light-mode');
        localStorage.setItem('theme_preference', 'dark');
      }
      return next;
    });
  };

  // Cycling Hero Text Animation (like promptbox.store)
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_LINES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Scroll Progress & Scroll to Top button visibility
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = windowHeight > 0 ? (totalScroll / windowHeight) * 100 : 0;
      setScrollProgress(progress);
      setShowScrollTop(totalScroll > 320);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Toggle Favorite
  const handleToggleFavorite = (promptId: string) => {
    const updated = toggleFavStorage(promptId);
    setFavorites(updated);
    const isSaved = updated.includes(promptId);
    showToast(
      isSaved ? 'Saved to your favorites collection! ❤️' : 'Removed from favorites',
      'info'
    );
  };

  // Copy Prompt handler
  const handleCopyPrompt = async (
    promptOrText: string | PromptItem,
    promptItem?: PromptItem
  ) => {
    let textToCopy = '';
    let item: PromptItem | undefined;

    if (typeof promptOrText === 'string') {
      textToCopy = promptOrText;
      item = promptItem;
    } else {
      textToCopy = promptOrText.promptText;
      item = promptOrText;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      showToast('Code / Prompt copied to clipboard! Ready to use.', 'success');
      if (item) {
        logAnalytics('copy', item.id);
        setStoreData((prev) => ({
          ...prev,
          prompts: prev.prompts.map((p) =>
            p.id === item?.id ? { ...p, copies: p.copies + 1 } : p
          ),
        }));
      }
    } catch {
      showToast('Failed to copy. Please copy manually from the text box.', 'error');
    }
  };

  // Open prompt single post view
  const handleOpenDetail = (prompt: PromptItem) => {
    setActivePrompt(prompt);
    setCurrentView('single-post');
    setAdminOpen(false);
    if (window.location.pathname !== `/prompt/${prompt.id}`) {
      window.history.pushState(null, '', `/prompt/${prompt.id}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    logAnalytics('view', prompt.id);
    setStoreData((prev) => ({
      ...prev,
      prompts: prev.prompts.map((p) =>
        p.id === prompt.id ? { ...p, views: p.views + 1 } : p
      ),
    }));
  };

  // Back from single post to home
  const handleBackFromSinglePost = () => {
    setActivePrompt(null);
    setCurrentView('home');
    if (window.location.pathname.startsWith('/prompt/')) {
      window.history.pushState(null, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Share prompt
  const handleSharePrompt = (prompt: PromptItem) => {
    const shareUrl = `${window.location.origin}/prompt/${prompt.id}`;
    if (navigator.share) {
      navigator
        .share({
          title: prompt.title,
          text: `Check out ${prompt.title} on ${storeData.settings.siteName}`,
          url: shareUrl,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      showToast('Link copied to clipboard! Share anywhere.', 'info');
    }
  };

  // Open Admin Panel and push URL /admin
  const handleOpenAdmin = () => {
    setAdminOpen(true);
    const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
    if (pathname !== '/admin') {
      window.history.pushState(null, '', '/admin');
    }
  };

  // Close Admin Panel and revert URL back to / if it was /admin
  const handleCloseAdmin = () => {
    setAdminOpen(false);
    setEditPromptTarget(null);
    const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
    if (pathname === '/admin' || window.location.hash.toLowerCase() === '#admin') {
      window.history.pushState(null, '', '/');
    }
  };

  // Direct Edit Prompt from card or single post view
  const handleEditPrompt = (prompt: PromptItem) => {
    setEditPromptTarget(prompt);
    handleOpenAdmin();
  };

  // Navigation handler from header
  const handleNavigate = (view: 'home' | 'ai-test-lab' | 'image-toolkit') => {
    setCurrentView(view);
    setAdminOpen(false);
    if (view === 'home') {
      setActivePrompt(null);
      window.history.pushState(null, '', '/');
    } else if (view === 'ai-test-lab') {
      window.history.pushState(null, '', '/ai-test-lab');
    } else if (view === 'image-toolkit') {
      window.history.pushState(null, '', '/image-toolkit');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Prompts count by category
  const promptsCountByCategory = useMemo(() => {
    const counts: Record<string, number> = {
      all: storeData.prompts.length,
    };
    storeData.prompts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [storeData.prompts]);

  // Filtered prompts for home grid
  const filteredPrompts = useMemo(() => {
    return storeData.prompts.filter((prompt) => {
      if (selectedCategory !== 'all' && prompt.category !== selectedCategory) {
        return false;
      }
      if (selectedPlatform !== 'All' && prompt.platform !== selectedPlatform) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = prompt.title.toLowerCase().includes(q);
        const matchText = prompt.promptText.toLowerCase().includes(q);
        const matchDesc = prompt.description?.toLowerCase().includes(q);
        const matchTags = prompt.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchText && !matchDesc && !matchTags) {
          return false;
        }
      }
      return true;
    });
  }, [storeData.prompts, selectedCategory, selectedPlatform, searchQuery]);

  // Featured master prompt (e.g. Future girlfriend website ready code)
  const featuredPrompt = useMemo(() => {
    return (
      storeData.prompts.find((p) => p.isFeatured || p.featured) ||
      storeData.prompts[0]
    );
  }, [storeData.prompts]);

  // Favorite prompt items
  const favoritePrompts = useMemo(() => {
    return storeData.prompts.filter((p) => favorites.includes(p.id));
  }, [storeData.prompts, favorites]);

  // Related prompts for active single post
  const relatedPrompts = useMemo(() => {
    if (!activePrompt) return [];
    return storeData.prompts
      .filter((p) => p.id !== activePrompt.id)
      .slice(0, 3);
  }, [storeData.prompts, activePrompt]);

  // Ad Slots lookup
  const headerAdSlot = storeData.adSlots.find((a) => a.placement === 'header_banner');
  const inFeedAdSlot = storeData.adSlots.find((a) => a.placement === 'in_feed_native');
  const underCodeAdSlot = storeData.adSlots.find((a) => a.placement === 'under_prompt_modal');
  const stickyFooterAdSlot = storeData.adSlots.find((a) => a.placement === 'sticky_footer');

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Top Reading Progress Bar (hubuhu like promptbox.store) */}
      <div
        id="readingProgressBar"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Top Announcement Bar */}
      <AnnouncementBar
        enabled={storeData.settings.announcementBar.enabled}
        text={storeData.settings.announcementBar.text}
        linkText={storeData.settings.announcementBar.linkText}
        linkUrl={storeData.settings.announcementBar.linkUrl}
      />

      {/* Modern Sticky Glassmorphism Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedPlatform={selectedPlatform}
        onPlatformChange={setSelectedPlatform}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setFavoritesDrawerOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        currentView={currentView === 'single-post' ? 'home' : currentView}
        onNavigate={handleNavigate}
        isLightMode={isLightMode}
        onToggleTheme={handleToggleTheme}
        telegramLink={storeData.settings.telegramChannel}
        bingUrl={storeData.settings.bingImageCreatorUrl}
        chatgptUrl={storeData.settings.chatgptUrl}
        siteName={storeData.settings.siteName}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Top Header Ad Banner (Adsterra / Monetag 728x90) */}
        {headerAdSlot && headerAdSlot.enabled && (
          <div className="w-full">
            <AdRenderer adSlot={headerAdSlot} />
          </div>
        )}

        {/* VIEW 1: HOME PAGE */}
        {currentView === 'home' && (
          <>
            {/* Always-animated Hero Banner (auto-cycling text like promptbox.store) */}
            <div className="hero-banner">
              <div className="hero-glow" />
              <div className="hero-icons">
                <span className="float-icon i1">🌐</span>
                <span className="float-icon i2">🖼️</span>
                <span className="float-icon i3">⚡</span>
                <span className="float-icon i4">🎬</span>
              </div>

              <div className="h-16 sm:h-20 flex items-center justify-center overflow-hidden">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight transition-all duration-500 transform">
                  {HERO_LINES[heroIndex]}
                </h1>
              </div>

              <p className="hero-subtitle text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mt-2">
                {storeData.settings.tagline || 'সেরা AI প্রম্পট দিয়ে সেকেন্ডে তৈরি করুন আপনার আইডিয়া'}
              </p>

              {/* Quick trending pills */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
                {['প্রেমিকা প্রেডিকশন', 'ক্যাপচা কোড', 'টাইমার বাটন', '3D Wings Boy', 'Golden Wings Girl'].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="px-2.5 py-1 rounded-full bg-slate-900/80 hover:bg-blue-600/20 text-slate-300 hover:text-blue-400 border border-slate-800 transition text-xs"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Featured Master Prompt Banner (Hubuhu like promptbox.store featured-banner) */}
            {featuredPrompt && (
              <div
                className="featured-banner cursor-pointer"
                onClick={() => handleOpenDetail(featuredPrompt)}
              >
                <div className="featured-thumb">
                  <img
                    src={
                      featuredPrompt.thumbnailUrl ||
                      featuredPrompt.previewImageUrl ||
                      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={featuredPrompt.title}
                    loading="lazy"
                  />
                </div>
                <div className="featured-content space-y-3">
                  <span className="category-badge pulse-badge">
                    🔥 Featured Master Prompt
                  </span>
                  <h2 className="text-base sm:text-xl font-bold text-white line-clamp-2">
                    {featuredPrompt.title}
                  </h2>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {featuredPrompt.description || featuredPrompt.promptText}
                  </p>
                  <div>
                    <button
                      type="button"
                      className="btn-gradient"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDetail(featuredPrompt);
                      }}
                    >
                      <span>Explore Prompt</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Category Filter Section */}
            <section id="prompts-section">
              <CategoryFilter
                categories={storeData.categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                promptsCountByCategory={promptsCountByCategory}
              />
            </section>

            {/* Community Prompts Heading (hubuhu like promptbox.store) */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-pink-500" />
                <span>Community Prompts & Ready Codes ({filteredPrompts.length})</span>
              </h2>

              {(selectedCategory !== 'all' || selectedPlatform !== 'All' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedPlatform('All');
                    setSearchQuery('');
                  }}
                  className="text-blue-400 hover:underline text-xs font-semibold"
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* App Grid & Cards (hubuhu promptbox.store app-grid) */}
            {filteredPrompts.length === 0 ? (
              <div className="py-16 text-center space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">No Prompts Found</h3>
                <p className="text-xs text-slate-400">
                  We couldn't find any prompts matching "{searchQuery}".
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedPlatform('All');
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="app-grid">
                {filteredPrompts.map((prompt, index) => {
                  const isFav = favorites.includes(prompt.id);

                  return (
                    <React.Fragment key={prompt.id}>
                      <PromptCard
                        prompt={prompt}
                        isFavorite={isFav}
                        onToggleFavorite={handleToggleFavorite}
                        onOpenDetail={handleOpenDetail}
                        onCopyPrompt={handleCopyPrompt}
                        onShare={handleSharePrompt}
                        onEditPrompt={handleEditPrompt}
                      />

                      {/* Native Ad Card after 2nd item */}
                      {index === 1 && inFeedAdSlot && inFeedAdSlot.enabled && (
                        <div className="col-span-1">
                          <AdRenderer adSlot={inFeedAdSlot} />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* VIEW 2: AI TEST LAB */}
        {currentView === 'ai-test-lab' && (
          <AiTestLabView
            onBackToHome={() => handleNavigate('home')}
            showToast={showToast}
          />
        )}

        {/* VIEW 3: IMAGE TOOLKIT */}
        {currentView === 'image-toolkit' && (
          <ImageToolkitView
            onBackToHome={() => handleNavigate('home')}
            showToast={showToast}
          />
        )}

        {/* VIEW 4: SINGLE POST / PROMPT VIEW (Dedicated Post Page) */}
        {currentView === 'single-post' && activePrompt && (
          <SinglePostView
            prompt={activePrompt}
            onBack={handleBackFromSinglePost}
            isFavorite={favorites.includes(activePrompt.id)}
            onToggleFavorite={handleToggleFavorite}
            onCopyPrompt={(text) => handleCopyPrompt(text, activePrompt)}
            underCodeAdSlot={underCodeAdSlot}
            bingUrl={storeData.settings.bingImageCreatorUrl}
            chatgptUrl={storeData.settings.chatgptUrl}
            relatedPrompts={relatedPrompts}
            onSelectRelated={(p) => handleOpenDetail(p)}
            showToast={showToast}
            onEditPrompt={handleEditPrompt}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        siteName={storeData.settings.siteName}
        tagline={storeData.settings.tagline}
        footerText={storeData.settings.footerText}
        categories={storeData.categories}
        onSelectCategory={(id) => {
          setSelectedCategory(id);
          setCurrentView('home');
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
        onOpenAdmin={handleOpenAdmin}
        telegramLink={storeData.settings.telegramChannel}
        bingUrl={storeData.settings.bingImageCreatorUrl}
        chatgptUrl={storeData.settings.chatgptUrl}
      />

      {/* Floating Sticky Bottom Ad Banner with Close toggle */}
      {stickyFooterAdSlot && stickyFooterAdSlot.enabled && !stickyAdDismissed && (
        <div
          id="sticky-ad-banner"
          className="fixed bottom-0 left-0 right-0 z-40 p-2 bg-slate-950/95 backdrop-blur border-t border-slate-800 shadow-2xl"
        >
          <div className="max-w-4xl mx-auto relative flex items-center justify-center">
            <button
              onClick={() => setStickyAdDismissed(true)}
              className="absolute -top-3 right-0 sm:right-2 p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[10px] shadow"
              title="Close Ad"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="w-full">
              <AdRenderer adSlot={stickyFooterAdSlot} />
            </div>
          </div>
        </div>
      )}

      {/* Scroll to Top Floating Button (hubuhu like promptbox.store #scrollTopBtn) */}
      <button
        id="scrollTopBtn"
        onClick={scrollToTop}
        className={showScrollTop ? 'visible' : ''}
        title="Scroll to Top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      {/* Saved Prompts Drawer */}
      <FavoritesDrawer
        isOpen={favoritesDrawerOpen}
        onClose={() => setFavoritesDrawerOpen(false)}
        favoritePrompts={favoritePrompts}
        onOpenPrompt={handleOpenDetail}
        onRemoveFavorite={handleToggleFavorite}
      />

      {/* Admin Panel */}
      <AdminPanel
        isOpen={adminOpen}
        onClose={handleCloseAdmin}
        storeData={storeData}
        onUpdateStoreData={(newData) => setStoreData(newData)}
        showToast={showToast}
        initialEditPrompt={editPromptTarget}
        onClearInitialEditPrompt={() => setEditPromptTarget(null)}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
