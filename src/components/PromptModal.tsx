import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  Heart,
  ExternalLink,
  Sparkles,
  Sliders,
  Send,
  Share2,
  HelpCircle,
  Code,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { PromptItem, AdSlot } from '../types';
import AdRenderer from './AdRenderer';

interface PromptModalProps {
  prompt: PromptItem | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onCopyPrompt: (promptText: string, promptItem: PromptItem) => void;
  underPromptAdSlot?: AdSlot;
  bingUrl: string;
  chatgptUrl: string;
  relatedPrompts: PromptItem[];
  onSelectRelated: (p: PromptItem) => void;
}

export default function PromptModal({
  prompt,
  onClose,
  isFavorite,
  onToggleFavorite,
  onCopyPrompt,
  underPromptAdSlot,
  bingUrl,
  chatgptUrl,
  relatedPrompts,
  onSelectRelated,
}: PromptModalProps) {
  const [copied, setCopied] = useState(false);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [customizedPromptText, setCustomizedPromptText] = useState('');
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  // Initialize variables when prompt opens
  useEffect(() => {
    if (!prompt) return;

    const initialVars: Record<string, string> = {};
    if (prompt.variables && prompt.variables.length > 0) {
      prompt.variables.forEach((v) => {
        initialVars[v.key] = v.defaultValue;
      });
    }
    setVariableValues(initialVars);
    updateCustomizedText(prompt.promptText, initialVars);
    setCopied(false);
  }, [prompt]);

  const updateCustomizedText = (baseText: string, vars: Record<string, string>) => {
    let result = baseText;
    Object.entries(vars).forEach(([key, val]) => {
      // Replace {KEY} or [KEY]
      const regex1 = new RegExp(`\\{${key}\\}`, 'gi');
      const regex2 = new RegExp(`\\[${key}\\]`, 'gi');
      result = result.replace(regex1, val).replace(regex2, val);
    });
    setCustomizedPromptText(result);
  };

  const handleVariableChange = (key: string, value: string) => {
    if (!prompt) return;
    const updated = { ...variableValues, [key]: value };
    setVariableValues(updated);
    updateCustomizedText(prompt.promptText, updated);
  };

  const handleCopy = () => {
    if (!prompt) return;
    onCopyPrompt(customizedPromptText, prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 2000);
  };

  if (!prompt) return null;

  const targetPlatformUrl =
    prompt.platform === 'ChatGPT'
      ? chatgptUrl
      : prompt.directActionUrl || bingUrl;

  return (
    <div
      id="prompt-detail-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 font-mono text-xs font-semibold border border-cyan-500/30">
              {prompt.platform}
            </span>
            {prompt.badge && (
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-xs font-bold font-mono">
                {prompt.badge}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-modal-favorite"
              onClick={() => onToggleFavorite(prompt.id)}
              className={`p-2 rounded-xl border border-slate-700/60 transition ${
                isFavorite
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  : 'bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-rose-400'
              }`}
              title={isFavorite ? 'Remove Favorite' : 'Save Favorite'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            <button
              id="btn-modal-share"
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700/60 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs"
              title="Share Link"
            >
              {copiedShareLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>

            <button
              id="btn-close-modal"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Main Grid: Image + Info */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left: Preview Image */}
            <div className="md:col-span-5 space-y-3">
              <div className="relative rounded-2xl overflow-hidden aspect-square sm:aspect-[4/3] md:aspect-square bg-slate-950 border border-slate-800 shadow-lg">
                <img
                  src={prompt.previewImageUrl}
                  alt={prompt.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur text-[11px] text-slate-300 font-mono">
                  Sample Result Preview
                </div>
              </div>

              {/* Action Link: Open Target AI Generator */}
              <a
                id="btn-open-generator-link"
                href={targetPlatformUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 hover:text-cyan-400 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition"
              >
                <span>Open in {prompt.platform}</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {prompt.tags.map((t, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-400 font-mono"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Title, Variables, Customizer & Prompt Box */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
                  {prompt.title}
                </h2>
                {prompt.description && (
                  <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
                    {prompt.description}
                  </p>
                )}
              </div>

              {/* Variable Customizer (if prompt has variables) */}
              {prompt.variables && prompt.variables.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 space-y-3 shadow-inner">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    <span>Personalize Prompt Variables:</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {prompt.variables.map((v) => (
                      <div key={v.key} className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-300">
                          {v.label}:
                        </label>
                        {v.options && v.options.length > 0 ? (
                          <select
                            value={variableValues[v.key] || v.defaultValue}
                            onChange={(e) => handleVariableChange(v.key, e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                          >
                            {v.options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={variableValues[v.key] || ''}
                            placeholder={v.placeholder || v.defaultValue}
                            onChange={(e) => handleVariableChange(v.key, e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prompt Text Display Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Ready Prompt Text:</span>
                  </span>
                  <span className="text-[11px] text-cyan-400 font-mono">
                    {customizedPromptText.length} characters
                  </span>
                </div>

                <div className="relative p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs sm:text-sm font-mono leading-relaxed whitespace-pre-wrap select-all max-h-56 overflow-y-auto shadow-inner">
                  {customizedPromptText}
                </div>
              </div>

              {/* Big Copy Button */}
              <button
                id="btn-modal-copy-prompt"
                onClick={handleCopy}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-xl ${
                  copied
                    ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/25 hover:scale-[1.01]'
                }`}
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Prompt Copied to Clipboard! ✨</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    <span>Copy Customized Prompt (1-Click)</span>
                  </>
                )}
              </button>

              {/* Quick How to Use Guide */}
              <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-1.5 text-xs text-slate-400">
                <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                  <span>How to create your image/text:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed pl-1 text-slate-400">
                  <li>Customize your name/values above, then click <strong>Copy Customized Prompt</strong>.</li>
                  <li>Click <strong>Open in {prompt.platform}</strong> to visit Bing/ChatGPT in your browser.</li>
                  <li>Paste the copied prompt into the input box and tap <strong>Create / Send</strong>!</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Under-Prompt High-CTR Ad Slot */}
          {underPromptAdSlot && (
            <div className="pt-2 border-t border-slate-800">
              <AdRenderer adSlot={underPromptAdSlot} />
            </div>
          )}

          {/* Related Prompts Grid */}
          {relatedPrompts && relatedPrompts.length > 0 && (
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>More Trending Prompts in this Category:</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {relatedPrompts.slice(0, 3).map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelated(rel)}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition group"
                  >
                    <img
                      src={rel.previewImageUrl}
                      alt={rel.title}
                      className="w-full aspect-[4/3] rounded-lg object-cover group-hover:scale-105 transition duration-300"
                    />
                    <p className="mt-2 text-xs font-semibold text-slate-200 line-clamp-1 group-hover:text-cyan-400">
                      {rel.title}
                    </p>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {rel.platform}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
