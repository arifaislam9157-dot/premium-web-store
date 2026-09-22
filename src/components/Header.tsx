import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Bookmark,
  ShieldCheck,
  ExternalLink,
  Menu,
  X,
  Send,
  SlidersHorizontal,
  Sun,
  Moon,
  Bot,
  Image as ImageIcon,
  Home,
} from 'lucide-react';
import { PlatformType } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedPlatform: PlatformType;
  onPlatformChange: (p: PlatformType) => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenAdmin: () => void;
  currentView: 'home' | 'ai-test-lab' | 'image-toolkit';
  onNavigate: (view: 'home' | 'ai-test-lab' | 'image-toolkit') => void;
  isLightMode: boolean;
  onToggleTheme: () => void;
  telegramLink?: string;
  bingUrl?: string;
  chatgptUrl?: string;
  siteName: string;
}

const PLATFORMS: PlatformType[] = [
  'All',
  'Web Scripts',
  'Bing Image Creator',
  'Midjourney',
  'ChatGPT',
];

export default function Header({
  searchQuery,
  onSearchChange,
  selectedPlatform,
  onPlatformChange,
  favoritesCount,
  onOpenFavorites,
  onOpenAdmin,
  currentView,
  onNavigate,
  isLightMode,
  onToggleTheme,
  telegramLink,
  bingUrl = 'https://www.bing.com/images/create',
  chatgptUrl = 'https://chatgpt.com',
  siteName = 'Premium Web store',
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 group text-left cursor-pointer border-none bg-transparent p-0"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-blue-400 group-hover:rotate-12 transition transform" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5">
                  {siteName}
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase font-mono">
                    PRO
                  </span>
                </span>
                <span className="text-[11px] text-slate-400 font-medium -mt-1 hidden sm:inline">
                  AI Prompts & Ready Web Codes
                </span>
              </div>
            </button>
          </div>

          {/* Navigation Links: Home, AI Test Lab, Image Toolkit */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => onNavigate('home')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                currentView === 'home'
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            <button
              onClick={() => onNavigate('ai-test-lab')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                currentView === 'ai-test-lab'
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI Test Lab</span>
            </button>

            <button
              onClick={() => onNavigate('image-toolkit')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                currentView === 'image-toolkit'
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Image Toolkit</span>
            </button>
          </nav>

          {/* Search bar in center */}
          <div className="flex-1 max-w-xs lg:max-w-sm hidden xl:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="search-input-desktop"
                type="text"
                placeholder="Search prompts or codes..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
              {searchQuery && (
                <button
                  id="btn-clear-search"
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Theme Toggle Button (Dark / Light) */}
            <button
              id="themeToggleBtn"
              onClick={onToggleTheme}
              className="theme-toggle-btn w-9 h-9 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-blue-500 flex items-center justify-center transition shadow"
              title={isLightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {isLightMode ? (
                <Moon className="w-4 h-4 text-indigo-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* Saved Bookmarks */}
            <button
              id="btn-header-favorites"
              onClick={onOpenFavorites}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition flex items-center gap-1.5"
              title="Saved Prompts"
            >
              <Bookmark className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline text-xs font-medium">Saved</span>
              {favoritesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] min-w-[18px] text-center">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Admin Panel Access Button */}
            <button
              id="btn-header-admin"
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-500/15 via-purple-500/15 to-pink-500/15 hover:from-blue-500/25 hover:to-pink-500/25 border border-blue-500/40 text-blue-400 hover:text-blue-300 text-xs font-semibold transition shadow-sm"
              title="Admin Control Panel"
            >
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">Admin</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white md:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="search-input-mobile"
              type="text"
              placeholder="Search prompts, website code..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            {searchQuery && (
              <button
                id="btn-clear-search-mobile"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Platform tabs quick switcher (shown on Home view) */}
        {currentView === 'home' && (
          <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-none border-t border-slate-900 text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1 pr-2 shrink-0">
              <SlidersHorizontal className="w-3 h-3 text-blue-400" />
              Filter:
            </span>
            {PLATFORMS.map((plat) => {
              const active = selectedPlatform === plat;
              return (
                <button
                  key={plat}
                  id={`btn-platform-${plat.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => onPlatformChange(plat)}
                  className={`px-3 py-1 rounded-lg shrink-0 font-medium transition ${
                    active
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/25'
                      : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                  }`}
                >
                  {plat}
                </button>
              );
            })}
          </div>
        )}

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-800/80 space-y-2 text-xs">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 text-slate-200 text-left font-semibold"
            >
              <Home className="w-4 h-4 text-blue-400" />
              <span>Home (All Prompts & Codes)</span>
            </button>

            <button
              onClick={() => {
                onNavigate('ai-test-lab');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 text-slate-200 text-left font-semibold"
            >
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>AI Test Lab</span>
            </button>

            <button
              onClick={() => {
                onNavigate('image-toolkit');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 text-slate-200 text-left font-semibold"
            >
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              <span>Image Toolkit (Crop & Filter)</span>
            </button>

            {telegramLink && (
              <a
                href={telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold"
              >
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  <span>Join Official Telegram Channel</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
