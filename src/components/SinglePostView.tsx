import React, { useState } from 'react';
import {
  ArrowLeft,
  Copy,
  Check,
  Download,
  Share2,
  ExternalLink,
  Eye,
  Calendar,
  Flame,
  Sparkles,
  Heart,
  SlidersHorizontal,
  Edit,
} from 'lucide-react';
import { PromptItem, AdSlot } from '../types';
import AdRenderer from './AdRenderer';

interface SinglePostViewProps {
  prompt: PromptItem;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onCopyPrompt: (text: string, prompt: PromptItem) => void;
  underCodeAdSlot?: AdSlot;
  bingUrl: string;
  chatgptUrl: string;
  relatedPrompts: PromptItem[];
  onSelectRelated: (prompt: PromptItem) => void;
  showToast: (msg: string, type: 'success' | 'info' | 'error') => void;
  onEditPrompt?: (prompt: PromptItem) => void;
}

export default function SinglePostView({
  prompt,
  onBack,
  isFavorite,
  onToggleFavorite,
  onCopyPrompt,
  underCodeAdSlot,
  bingUrl,
  chatgptUrl,
  relatedPrompts,
  onSelectRelated,
  showToast,
  onEditPrompt,
}: SinglePostViewProps) {
  const [copied, setCopied] = useState(false);
  // Variable values
  const [variableValues, setVariableValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    prompt.variables?.forEach((v) => {
      init[v.key] = v.defaultValue || '';
    });
    return init;
  });

  // Calculate live prompt text with replaced variables
  const currentPromptText = React.useMemo(() => {
    let text = prompt.promptText;
    if (prompt.variables && prompt.variables.length > 0) {
      prompt.variables.forEach((v) => {
        const val = variableValues[v.key] || v.defaultValue || '';
        text = text.replaceAll(`{${v.key}}`, val);
      });
    }
    return text;
  }, [prompt.promptText, prompt.variables, variableValues]);

  // Handle Copy
  const handleCopy = () => {
    navigator.clipboard.writeText(currentPromptText);
    setCopied(true);
    onCopyPrompt(currentPromptText, prompt);
    setTimeout(() => setCopied(false), 2200);
  };

  // Handle Download file
  const handleDownload = () => {
    const isCode = prompt.platform === 'Web Scripts' || prompt.category === 'web-codes';
    const extension = isCode ? 'html' : 'txt';
    const mimeType = isCode ? 'text/html' : 'text/plain';
    const blob = new Blob([currentPromptText], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${prompt.id}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${prompt.id}.${extension}`, 'success');
  };

  // Handle Share
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/#post-${prompt.id}`;
    if (navigator.share) {
      navigator
        .share({
          title: prompt.title,
          text: `Check out ${prompt.title} on Premium Web store!`,
          url: shareUrl,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      showToast('Post link copied to clipboard!', 'info');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 px-4 space-y-6 animate-fadeIn">
      {/* Breadcrumbs & Navigation */}
      <div className="flex items-center justify-between gap-4 text-xs text-slate-400">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Prompts</span>
        </button>

        <div className="flex items-center gap-2">
          {onEditPrompt && (
            <button
              type="button"
              onClick={() => onEditPrompt(prompt)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/30 text-xs font-bold transition shadow-sm"
              title="Edit this post (সংশোধন করুন)"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Post (সংশোধন)</span>
            </button>
          )}

          <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20 text-[11px]">
            {prompt.platform}
          </span>
          {prompt.badge && (
            <span className="px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-400 font-semibold border border-pink-500/20 text-[11px]">
              🔥 {prompt.badge}
            </span>
          )}
        </div>
      </div>

      {/* Post Title */}
      <div className="space-y-3">
        <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
          {prompt.title}
        </h1>

        {/* Meta Bar */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pb-2 border-b border-slate-800/80">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{prompt.createdAt || '2026-09-20'}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>{prompt.views.toLocaleString()} Views</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Copy className="w-3.5 h-3.5 text-slate-500" />
            <span>{prompt.copies.toLocaleString()} Copies</span>
          </span>
          <button
            onClick={() => onToggleFavorite(prompt.id)}
            className={`inline-flex items-center gap-1.5 ml-auto font-medium transition ${
              isFavorite ? 'text-rose-400' : 'text-slate-400 hover:text-rose-400'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
            <span>{isFavorite ? 'Saved in Favorites' : 'Save to Favorites'}</span>
          </button>
        </div>
      </div>

      {/* Thumbnail Banner */}
      {prompt.thumbnailUrl && (
        <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl max-h-[380px] flex items-center justify-center">
          <img
            src={prompt.thumbnailUrl}
            alt={prompt.title}
            className="w-full h-full max-h-[380px] object-cover"
          />
        </div>
      )}

      {/* Description */}
      {prompt.description && (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {prompt.description}
        </div>
      )}

      {/* Dynamic Variables Customizer (if present) */}
      {prompt.variables && prompt.variables.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Customize Prompt Variables (নিজের নাম বা টপিক বসান):</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {prompt.variables.map((v) => (
              <div key={v.key} className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">
                  {v.label} <code className="text-cyan-400">({`{${v.key}}`})</code>
                </label>
                <input
                  type="text"
                  value={variableValues[v.key] || ''}
                  onChange={(e) =>
                    setVariableValues((prev) => ({ ...prev, [v.key]: e.target.value }))
                  }
                  placeholder={v.defaultValue || 'Enter your text...'}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-400 text-xs text-white outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== PREMIUM CODE BOX v3 - COLORFUL NEON GLASS EDITION ===== */}
      <div className="neon-code-box">
        <div className="neon-glow-blob blob-1"></div>
        <div className="neon-glow-blob blob-2"></div>

        <div className="neon-header">
          <div className="neon-tag">
            <span className="neon-dots">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
            </span>
            <span className="neon-label">✦ {prompt.platform === 'Web Scripts' ? 'CODE SNIPPET' : 'AI PROMPT'}</span>
          </div>

          <div className="neon-actions">
            <button
              onClick={handleCopy}
              className={`neon-btn ${copied ? 'copied' : ''}`}
              title="Copy Code"
              type="button"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span className="neon-text">{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="neon-btn"
              title="Download Code/Prompt"
              type="button"
            >
              <Download className="w-3 h-3" />
              <span className="neon-text">Download</span>
            </button>

            <button
              onClick={handleShare}
              className="neon-btn"
              title="Share Code"
              type="button"
            >
              <Share2 className="w-3 h-3" />
              <span className="neon-text">Share</span>
            </button>
          </div>
        </div>

        <div className="neon-content">
          <pre>{currentPromptText}</pre>
        </div>
      </div>

      {/* One-Click Generator Launchers */}
      <div className="flex flex-wrap items-center gap-3">
        {prompt.platform.includes('Bing') && (
          <a
            href={bingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition"
          >
            <span>Open in Microsoft Bing Image Creator</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        {prompt.platform.includes('ChatGPT') && (
          <a
            href={chatgptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition"
          >
            <span>Open in OpenAI ChatGPT</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        <button
          onClick={handleCopy}
          className="py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied to Clipboard!' : 'Copy Prompt / Code'}</span>
        </button>

        {onEditPrompt && (
          <button
            type="button"
            onClick={() => onEditPrompt(prompt)}
            className="py-3 px-5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-bold text-xs flex items-center justify-center gap-2 border border-cyan-500/40 transition shadow-sm"
            title="Edit this post in Admin Panel (সংশোধন করুন)"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Post (সংশোধন)</span>
          </button>
        )}
      </div>

      {/* Under Code Ad Gadget (Adsterra / Monetag / CPMBid) */}
      {underCodeAdSlot && underCodeAdSlot.enabled && (
        <div className="pt-2">
          <AdRenderer adSlot={underCodeAdSlot} />
        </div>
      )}

      {/* Tags */}
      {prompt.tags && prompt.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs text-slate-500">Tags:</span>
          {prompt.tags.map((t) => (
            <span
              key={t}
              className="px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-xs"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* Related Prompts / More From Community */}
      {relatedPrompts.length > 0 && (
        <div className="pt-8 border-t border-slate-800/80 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-pink-500" />
            <span>More From Community</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedPrompts.map((rp) => (
              <div
                key={rp.id}
                onClick={() => onSelectRelated(rp)}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition flex flex-col gap-2 group"
              >
                {rp.thumbnailUrl && (
                  <div className="w-full h-28 rounded-lg overflow-hidden bg-slate-950">
                    <img
                      src={rp.thumbnailUrl}
                      alt={rp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                )}
                <h4 className="font-bold text-xs text-white line-clamp-2">{rp.title}</h4>
                <span className="text-[11px] text-cyan-400 mt-auto font-medium">View Code ➔</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
