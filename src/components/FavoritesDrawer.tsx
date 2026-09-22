import React from 'react';
import { X, Heart, Sparkles, Trash2, ArrowRight } from 'lucide-react';
import { PromptItem } from '../types';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favoritePrompts: PromptItem[];
  onOpenPrompt: (p: PromptItem) => void;
  onRemoveFavorite: (id: string) => void;
}

export default function FavoritesDrawer({
  isOpen,
  onClose,
  favoritePrompts,
  onOpenPrompt,
  onRemoveFavorite,
}: FavoritesDrawerProps) {
  if (!isOpen) return null;

  return (
    <div
      id="favorites-modal"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h3 className="font-extrabold text-base text-white">Your Saved Prompts</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {favoritePrompts.length}
            </span>
          </div>
          <button
            id="btn-close-favorites"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {favoritePrompts.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
              <Heart className="w-10 h-10 text-slate-600" />
              <p className="text-sm font-semibold text-slate-300">No saved prompts yet</p>
              <p className="text-xs text-slate-500 max-w-xs">
                Click the heart icon on any prompt card to save it here for instant access anytime.
              </p>
            </div>
          ) : (
            favoritePrompts.map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-cyan-500/40 transition flex items-center gap-3 group"
              >
                <img
                  src={p.previewImageUrl}
                  alt={p.title}
                  className="w-14 h-14 rounded-lg object-cover shrink-0 cursor-pointer"
                  onClick={() => {
                    onOpenPrompt(p);
                    onClose();
                  }}
                />
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => {
                    onOpenPrompt(p);
                    onClose();
                  }}
                >
                  <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-cyan-400">
                    {p.title}
                  </h4>
                  <span className="text-[10px] text-cyan-400 font-mono">{p.platform}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      onOpenPrompt(p);
                      onClose();
                    }}
                    className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white"
                    title="Open"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onRemoveFavorite(p.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
