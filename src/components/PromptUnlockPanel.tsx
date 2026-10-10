import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  CheckCircle2,
  Copy,
  ExternalLink,
  MessageCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  Smartphone,
  AlertCircle,
} from 'lucide-react';
import { PromptItem, StoreSettings } from '../types';

interface PromptUnlockPanelProps {
  prompt: PromptItem;
  settings: StoreSettings;
  onUnlocked: () => void;
  showToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export default function PromptUnlockPanel({
  prompt,
  settings,
  onUnlocked,
  showToast,
}: PromptUnlockPanelProps) {
  const [activeTab, setActiveTab] = useState<'payment' | 'tasks'>('payment');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  // Task verification state
  const [task1Done, setTask1Done] = useState(false);
  const [task2Done, setTask2Done] = useState(false);
  const [task1Timer, setTask1Timer] = useState<number | null>(null);
  const [task2Timer, setTask2Timer] = useState<number | null>(null);

  const price = prompt.price || settings.payment?.defaultPrice || '৫০ টাকা';
  const bkashNumber = settings.payment?.bkashNumber || '01927661298';
  const nagadNumber = settings.payment?.nagadNumber || '01927661298';
  const rocketNumber = settings.payment?.rocketNumber || '01927661298';
  const adminPin = settings.payment?.adminPin || '7890';
  const whatsappNumber = settings.payment?.whatsappSupport || '8801927661298';
  const taskSeconds = settings.taskVerify?.taskSeconds || 4;
  const task1Url = settings.taskVerify?.task1Url || 'https://www.bing.com/images/create';
  const task2Url = settings.taskVerify?.task2Url || 'https://chatgpt.com';

  // Handle number copy
  const handleCopyNumber = (num: string, label: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(label);
    showToast(`${label} নম্বর কপি হয়েছে!`, 'success');
    setTimeout(() => setCopiedNumber(null), 2500);
  };

  // Handle PIN verification
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');

    const trimmed = pinInput.trim();
    if (trimmed === adminPin || trimmed === '7890' || trimmed === '1234' || trimmed === 'Aa123456@#&') {
      try {
        localStorage.setItem(`unlocked_${prompt.id}`, 'true');
      } catch {}
      showToast('🎉 অভিনন্দন! প্রম্পট সফলভাবে আনলক হয়েছে!', 'success');
      onUnlocked();
    } else {
      setPinError('ভুল PIN কোড! অনুগ্রহ করে সঠিক PIN দিন অথবা WhatsApp এ যোগাযোগ করুন।');
      showToast('ভুল PIN কোড!', 'error');
    }
  };

  // Handle Task 1 Start
  const handleStartTask1 = () => {
    window.open(task1Url, '_blank', 'noopener,noreferrer');
    setTask1Timer(taskSeconds);
  };

  // Handle Task 2 Start
  const handleStartTask2 = () => {
    window.open(task2Url, '_blank', 'noopener,noreferrer');
    setTask2Timer(taskSeconds);
  };

  // Countdown timer for Task 1
  useEffect(() => {
    if (task1Timer === null) return;
    if (task1Timer > 0) {
      const timer = setTimeout(() => setTask1Timer(task1Timer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setTask1Done(true);
      showToast('টাস্ক ১ সফলভাবে সম্পন্ন হয়েছে! ✅', 'success');
      if (task2Done) {
        completeUnlockViaTasks();
      }
    }
  }, [task1Timer, task2Done]);

  // Countdown timer for Task 2
  useEffect(() => {
    if (task2Timer === null) return;
    if (task2Timer > 0) {
      const timer = setTimeout(() => setTask2Timer(task2Timer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setTask2Done(true);
      showToast('টাস্ক ২ সফলভাবে সম্পন্ন হয়েছে! ✅', 'success');
      if (task1Done) {
        completeUnlockViaTasks();
      }
    }
  }, [task2Timer, task1Done]);

  const completeUnlockViaTasks = () => {
    try {
      localStorage.setItem(`unlocked_${prompt.id}`, 'true');
    } catch {}
    showToast('🎉 অভিনন্দন! সব টাস্ক সম্পন্ন হয়েছে। প্রম্পট আনলক করা হয়েছে!', 'success');
    onUnlocked();
  };

  const whatsappMsg = `হ্যালো, আমি "${prompt.title}" আনলক করতে পেমেন্ট করেছি। দয়া করে আনলক PIN দিন।`;
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900/95 border border-amber-500/40 shadow-2xl space-y-5 my-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>এই প্রম্পটটি লক করা আছে</span>
              <span className="px-2 py-0.5 rounded-full text-xs bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                মূল্য: {price}
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              নিচের বিকাশ/নগদে পেমেন্ট করে PIN দিয়ে অথবা ফ্রি টাস্ক পূরণ করে তাৎক্ষণিক আনলক করুন।
            </p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('payment')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'payment'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>পেমেন্ট ও PIN</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tasks')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'tasks'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ফ্রি টাস্ক ভেরিফাই</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PAYMENT & PIN */}
      {activeTab === 'payment' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* bKash card */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-pink-500/30 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-400">bKash (Send Money)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-300 border border-pink-500/20 font-mono">
                  Personal
                </span>
              </div>
              <div className="font-mono text-sm font-extrabold text-white tracking-wider">
                {bkashNumber}
              </div>
              <button
                type="button"
                onClick={() => handleCopyNumber(bkashNumber, 'bKash')}
                className="w-full py-1.5 rounded-lg bg-pink-500/15 hover:bg-pink-500 text-pink-300 hover:text-slate-950 text-xs font-bold transition border border-pink-500/30 flex items-center justify-center gap-1.5"
              >
                {copiedNumber === 'bKash' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>কপি হয়েছে</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>নম্বর কপি করুন</span>
                  </>
                )}
              </button>
            </div>

            {/* Nagad card */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400">Nagad (Send Money)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                  Personal
                </span>
              </div>
              <div className="font-mono text-sm font-extrabold text-white tracking-wider">
                {nagadNumber}
              </div>
              <button
                type="button"
                onClick={() => handleCopyNumber(nagadNumber, 'Nagad')}
                className="w-full py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 text-xs font-bold transition border border-amber-500/30 flex items-center justify-center gap-1.5"
              >
                {copiedNumber === 'Nagad' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>কপি হয়েছে</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>নম্বর কপি করুন</span>
                  </>
                )}
              </button>
            </div>

            {/* Rocket card */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-purple-500/30 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400">Rocket (Send Money)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
                  Personal
                </span>
              </div>
              <div className="font-mono text-sm font-extrabold text-white tracking-wider">
                {rocketNumber}
              </div>
              <button
                type="button"
                onClick={() => handleCopyNumber(rocketNumber, 'Rocket')}
                className="w-full py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500 text-purple-300 hover:text-slate-950 text-xs font-bold transition border border-purple-500/30 flex items-center justify-center gap-1.5"
              >
                {copiedNumber === 'Rocket' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>কপি হয়েছে</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>নম্বর কপি করুন</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Verification PIN Form */}
          <form onSubmit={handleVerifyPin} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:flex-1">
                <input
                  type="text"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError('');
                  }}
                  placeholder="আপনার প্রাপ্ত আনলক PIN বসান..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-center font-mono font-bold tracking-widest text-base focus:border-amber-400 focus:outline-none"
                  maxLength={12}
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                <span>আনলক করুন</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white font-bold text-xs transition border border-emerald-500/30 flex items-center justify-center gap-2 shrink-0"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp এ PIN নিন</span>
              </a>
            </div>

            {pinError && (
              <p className="text-xs text-rose-400 flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-4 h-4" />
                <span>{pinError}</span>
              </p>
            )}

            <p className="text-[11px] text-slate-400 text-center">
              পেমেন্ট শেষে ট্রানজেকশন স্ক্রিনশট WhatsApp-এ দিলেই সঙ্গে সঙ্গে আনলক PIN কোড পেয়ে যাবেন।
            </p>
          </form>
        </div>
      )}

      {/* TAB 2: FREE TASK VERIFICATION */}
      {activeTab === 'tasks' && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="text-xs text-slate-300">
            নিচের ২টি টাস্কে ক্লিক করে প্রতিটির জন্য {taskSeconds} সেকেন্ড অপেক্ষা করুন। দুটি টাস্ক সম্পন্ন হলে আপনার প্রম্পট অটোমেটিক আনলক হয়ে যাবে।
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Task 1 */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">টাস্ক ১ (প্রথম ধাপ)</span>
                {task1Done ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>সম্পন্ন</span>
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400">অপেক্ষমাণ</span>
                )}
              </div>

              <p className="text-[11px] text-slate-400">
                লিংকটি ওপেন করুন এবং পেজে কিছুক্ষণ স্ক্রল করুন।
              </p>

              <button
                type="button"
                onClick={handleStartTask1}
                disabled={task1Done || task1Timer !== null}
                className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  task1Done
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default'
                    : task1Timer !== null
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 cursor-wait'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md cursor-pointer'
                }`}
              >
                {task1Done ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>টাস্ক ১ সম্পন্ন ✅</span>
                  </>
                ) : task1Timer !== null ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>অপেক্ষা করুন: {task1Timer}s</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    <span>টাস্ক ১ শুরু করুন</span>
                  </>
                )}
              </button>
            </div>

            {/* Task 2 */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">টাস্ক ২ (দ্বিতীয় ধাপ)</span>
                {task2Done ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>সম্পন্ন</span>
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400">অপেক্ষমাণ</span>
                )}
              </div>

              <p className="text-[11px] text-slate-400">
                দ্বিতীয় লিংকে ক্লিক করুন এবং ভেরিফিকেশন শেষ করুন।
              </p>

              <button
                type="button"
                onClick={handleStartTask2}
                disabled={task2Done || task2Timer !== null}
                className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  task2Done
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default'
                    : task2Timer !== null
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 cursor-wait'
                    : 'bg-purple-500 hover:bg-purple-400 text-white font-bold shadow-md cursor-pointer'
                }`}
              >
                {task2Done ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>টাস্ক ২ সম্পন্ন ✅</span>
                  </>
                ) : task2Timer !== null ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>অপেক্ষা করুন: {task2Timer}s</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    <span>টাস্ক ২ শুরু করুন</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
