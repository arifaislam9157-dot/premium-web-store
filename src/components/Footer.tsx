import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Send,
  ExternalLink,
  Heart,
  Lock,
} from 'lucide-react';
import { Category } from '../types';

interface FooterProps {
  siteName: string;
  tagline: string;
  footerText: string;
  categories: Category[];
  onSelectCategory: (id: string) => void;
  onOpenAdmin: () => void;
  telegramLink?: string;
  bingUrl: string;
  chatgptUrl: string;
}

export default function Footer({
  siteName,
  tagline,
  footerText,
  categories,
  onSelectCategory,
  onOpenAdmin,
  telegramLink,
  bingUrl,
  chatgptUrl,
}: FooterProps) {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">
                {siteName}
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              {tagline ||
                'The premier marketplace for viral AI photo editing prompts, Bing 3D avatars, ChatGPT frameworks, and digital web resources.'}
            </p>

            {telegramLink && (
              <div className="pt-2">
                <a
                  href={telegramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 font-semibold transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Join Our Telegram Channel</span>
                  <ExternalLink className="w-3 h-3 text-sky-500" />
                </a>
              </div>
            )}
          </div>

          {/* Categories links */}
          <div className="md:col-span-4 space-y-2">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Trending Categories
            </h4>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {categories.slice(0, 8).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="text-left text-slate-400 hover:text-cyan-400 transition truncate text-xs"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* AI Platforms & Admin */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              AI Generation Platforms
            </h4>
            <div className="space-y-1.5">
              <a
                href={bingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 hover:bg-slate-850 text-slate-300 transition"
              >
                <span>Microsoft Bing Image Creator (DALL-E 3)</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>

              <a
                href={chatgptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 hover:bg-slate-850 text-slate-300 transition"
              >
                <span>OpenAI ChatGPT Assistant</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>

              <button
                id="btn-footer-admin-login"
                onClick={onOpenAdmin}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-900/60 hover:bg-cyan-500/10 border border-slate-800 hover:border-cyan-500/30 text-slate-400 hover:text-cyan-400 transition mt-2"
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-semibold">Store Administration Portal</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  Password Protected
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Ad Network Compatibility */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>{footerText}</p>
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-mono">Monetization Ready:</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">Adsterra</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">Monetag</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">CPMBid</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">HilltopAds</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">Clickadu</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
