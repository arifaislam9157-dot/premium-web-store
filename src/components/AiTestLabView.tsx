import React, { useState } from 'react';
import {
  ExternalLink,
  Sparkles,
  Bot,
  Copy,
  Check,
  Play,
  RotateCcw,
} from 'lucide-react';

interface AiTestLabViewProps {
  onBackToHome: () => void;
  showToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export default function AiTestLabView({ onBackToHome, showToast }: AiTestLabViewProps) {
  const [testPrompt, setTestPrompt] = useState(
    'Create a 3D hyper-detailed portrait of a cyberpunk boy with glowing neon wings, volumetric rim lighting, 8k resolution.'
  );
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(testPrompt);
    setCopied(true);
    showToast('Prompt copied to clipboard! Paste it into the AI tool.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const platforms = [
    {
      name: 'ChatGPT',
      url: 'https://chatgpt.com',
      desc: 'OpenAI conversational model for text, scripts, and DALL-E 3 image generation.',
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      name: 'Google Gemini',
      url: 'https://gemini.google.com',
      desc: 'Deep reasoning, multimodal vision, coding, and creative assistant.',
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    },
    {
      name: 'Bing Image Creator',
      url: 'https://www.bing.com/images/create',
      desc: 'Powered by DALL-E 3, perfect for 3D wings avatars, couples, and photorealism.',
      color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    },
    {
      name: 'Claude AI',
      url: 'https://claude.ai',
      desc: 'Anthropic AI for complex writing, coding analysis, and nuanced prompts.',
      color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 text-center space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
          <Bot className="w-3.5 h-3.5" />
          <span>Official AI Execution Platforms</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          AI Test Lab
        </h2>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Test your copied prompts directly on official AI platforms. Copy, tweak, and launch with 1-click.
        </p>
      </div>

      {/* Platform Launch Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
        {platforms.map((plat) => (
          <div
            key={plat.name}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition flex flex-col justify-between gap-4 group"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base">{plat.name}</h3>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${plat.color}`}>
                  Live AI
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{plat.desc}</p>
            </div>

            <a
              href={plat.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-blue-500/20"
            >
              <span>Launch {plat.name}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>

      {/* Prompt Testing Workbench */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-left space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm text-slate-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Interactive Prompt Sandbox
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTestPrompt('')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs font-semibold border border-blue-500/30 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Prompt'}</span>
            </button>
          </div>
        </div>

        <textarea
          value={testPrompt}
          onChange={(e) => setTestPrompt(e.target.value)}
          rows={4}
          placeholder="Paste or write your AI prompt here to test..."
          className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 text-slate-200 text-xs font-mono leading-relaxed outline-none"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Quick Samples:</span>
            <button
              onClick={() =>
                setTestPrompt(
                  'Hyperrealistic 8k portrait of an Asian cyber warrior standing in rainy Tokyo alley with neon cyan reflections.'
                )
              }
              className="underline text-blue-400 hover:text-blue-300"
            >
              Cyberpunk
            </button>
            <span>•</span>
            <button
              onClick={() =>
                setTestPrompt(
                  '3D animated illustration of a cute couple sitting on a wooden bench under a glowing umbrella in evening rain.'
                )
              }
              className="underline text-blue-400 hover:text-blue-300"
            >
              Romantic Rain
            </button>
          </div>

          <button
            onClick={onBackToHome}
            className="text-xs text-cyan-400 hover:underline font-semibold"
          >
            ← Back to Store Home
          </button>
        </div>
      </div>
    </div>
  );
}
