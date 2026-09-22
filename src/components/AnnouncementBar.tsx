import React, { useState } from 'react';
import { Sparkles, X, ArrowRight } from 'lucide-react';

interface AnnouncementBarProps {
  enabled: boolean;
  text: string;
  linkText?: string;
  linkUrl?: string;
}

export default function AnnouncementBar({
  enabled,
  text,
  linkText,
  linkUrl,
}: AnnouncementBarProps) {
  const [dismissed, setDismissed] = useState(false);

  if (!enabled || dismissed || !text) return null;

  return (
    <aside
      id="announcement-bar"
      aria-label="Announcement"
      className="w-full bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 border-b border-cyan-500/20 py-2 px-4 text-xs"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex-1 flex items-center justify-center gap-2 text-center text-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 hidden sm:inline" />
          <span className="font-medium text-[11px] sm:text-xs">{text}</span>
          {linkText && linkUrl && (
            <a
              href={linkUrl}
              className="inline-flex items-center gap-1 font-bold text-cyan-400 hover:text-cyan-300 underline underline-offset-2 ml-1"
            >
              <span>{linkText}</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          )}
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-white p-1 rounded transition shrink-0"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
