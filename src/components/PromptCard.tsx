import React, { useState } from 'react';
import {
  Copy,
  Check,
  Heart,
  Eye,
  ArrowUpRight,
  Sparkles,
  Sliders,
  Share2,
  Edit,
} from 'lucide-react';
import { PromptItem } from '../types';

interface PromptCardProps {
  prompt: PromptItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenDetail: (prompt: PromptItem) => void;
  onCopyPrompt: (prompt: PromptItem) => void;
  onShare: (prompt: PromptItem) => void;
  onEditPrompt?: (prompt: PromptItem) => void;
}

export default function PromptCard({
  prompt,
  isFavorite,
  onToggleFavorite,
  onOpenDetail,
  onCopyPrompt,
  onShare,
  onEditPrompt,
}: PromptCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopyPrompt(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(prompt.id);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare(prompt);
  };

  const imageSrc =
    prompt.thumbnailUrl ||
    prompt.previewImageUrl ||
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';

  return (
    <div
      id={`card-prompt-${prompt.id}`}
      onClick={() => onOpenDetail(prompt)}
      className="app-card cursor-pointer group"
    >
      {/* Card Thumbnail Wrap with hover zoom */}
      <div className="card-thumb-wrap relative">
        <img
          src={imageSrc}
          alt={prompt.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Floating Quick Action Icons */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          <button
            onClick={handleShareClick}
            className="p-1.5 rounded-full bg-slate-950/75 hover:bg-slate-900 text-slate-300 hover:text-white backdrop-blur transition"
            title="Share"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleFavoriteClick}
            className={`p-1.5 rounded-full backdrop-blur transition ${
              isFavorite
                ? 'bg-rose-500 text-white'
                : 'bg-slate-950/75 hover:bg-slate-900 text-slate-300 hover:text-rose-400'
            }`}
            title={isFavorite ? 'Remove from saved' : 'Save'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {prompt.variables && prompt.variables.length > 0 && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-blue-600/90 text-white font-bold text-[10px] flex items-center gap-1 backdrop-blur shadow">
            <Sliders className="w-3 h-3" />
            <span>Customize</span>
          </div>
        )}
      </div>

      {/* Category badge & Platform */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <span className="category-badge">
          {prompt.platform === 'Web Scripts' ? 'Ready Code' : 'AI Prompt'}
        </span>
        <span className="text-[11px] text-slate-400 font-mono">
          {prompt.createdAt || '2026-09-20'}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-bold text-sm sm:text-base text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-2">
        {prompt.title}
      </h3>

      {/* Description Snippet */}
      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed -mt-1">
        {prompt.description || prompt.promptText}
      </p>

      {/* Meta Bar: Views, Copies, View/Open Button */}
      <div className="card-meta-bar">
        <span className="card-stats flex items-center gap-1.5 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            {prompt.views.toLocaleString()}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            {prompt.copies.toLocaleString()}
          </span>
        </span>

        <div className="flex items-center gap-1.5">
          {onEditPrompt && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEditPrompt(prompt);
              }}
              className="p-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 border border-cyan-500/30 text-xs font-bold transition flex items-center gap-1"
              title="Edit this post (সংশোধন করুন)"
            >
              <Edit className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[10px]">Edit</span>
            </button>
          )}

          <button
            onClick={handleCopyClick}
            className={`p-1.5 rounded-lg border text-xs font-semibold transition ${
              copied
                ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Copy Code/Prompt"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => onOpenDetail(prompt)}
            className="card-open-btn cursor-pointer"
          >
            <span>View / Open</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
