import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  CheckCircle,
  ExternalLink,
  X,
  ArrowRight,
  ShieldCheck,
  Star,
  BookOpen,
  Users,
  Award,
} from 'lucide-react';
import { CourseInfo } from '../types';

interface CourseSectionProps {
  course?: CourseInfo;
  onOpenDetailsModal?: () => void;
}

export default function CourseSection({ course }: CourseSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);

  if (!course || course.enabled === false) return null;

  const title = course.title || 'কমপ্লিট AI প্রম্পট ইঞ্জিনিয়ারিং ও ওয়েবসাইট মেকিং কোর্স';
  const subtitle =
    course.subtitle ||
    'AI দিয়ে আকর্ষণীয় ওয়েবসাইট, ভাইরাল প্রম্পট এবং ফ্রিল্যান্সিং কাজ শেখার সম্পূর্ণ প্র্যাক্টিক্যাল গাইডলাইন।';
  const price = course.price || '৯৯৯ টাকা';
  const url = course.url || 'https://t.me/premiumwebstore';
  const badge = course.badge || '🔥 নতুন ব্যাচ শুরু';

  const defaultFeatures = course.features || [
    'রেডি ওয়েবসাইট কোড ও প্রম্পট দিয়ে নিজের সাইট তৈরি',
    'Bing, Midjourney ও ChatGPT দিয়ে ফটো ও কনটেন্ট জেনারেশন',
    'ফ্রিল্যান্সিং ও অনলাইন আর্নিং মেথডলজি',
    'লাইফটাইম VIP সাপোর্ট গ্রুপ ও রিসোর্স এক্সেস',
  ];

  return (
    <>
      <section className="relative my-8 rounded-3xl overflow-hidden border border-violet-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/80 p-6 sm:p-8 shadow-2xl">
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 text-xs font-bold shadow-sm">
              <GraduationCap className="w-4 h-4 text-violet-400" />
              <span>{badge}</span>
            </div>

            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug">
              {title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {subtitle}
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {defaultFeatures.slice(0, 4).map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & CTA Card */}
          <div className="lg:w-72 shrink-0 p-5 rounded-2xl bg-slate-900/90 border border-violet-500/30 backdrop-blur-md flex flex-col justify-between space-y-4 shadow-xl">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-violet-300 uppercase tracking-wider">
                কোর্স ফি
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white flex items-baseline gap-2">
                <span>{price}</span>
                <span className="text-xs text-slate-400 line-through font-normal">২০০০ টাকা</span>
              </div>
              <p className="text-[10px] text-emerald-400 font-medium">
                ★ ৫০% বিশেষ ছাড় সীমিত সময়ের জন্য
              </p>
            </div>

            <div className="space-y-2">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm text-center transition shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2"
              >
                <span>কোর্সে ভর্তি হন</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition border border-slate-700 flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-violet-400" />
                <span>বিস্তারিত মডিউল দেখুন</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Course Detail Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-slate-900 border border-violet-500/40 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-300 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-white">কোর্স কারিকুলাম ও বিবরণ</h4>
                  <p className="text-xs text-slate-400">স্টেপ-বাই-স্টেপ মাস্টারক্লাস</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <h5 className="font-bold text-white text-base">এই কোর্সে যা যা শিখবেন:</h5>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-violet-400 text-xs">মডিউল ১: AI প্রম্পট ইঞ্জিনিয়ারিং মাস্টারক্লাস</span>
                  <p className="text-xs text-slate-400">
                    Bing Image Creator, Midjourney, ও ChatGPT দিয়ে ভাইরাল 3D Wings, কাপল আর্ট, ও প্রফেশনাল পোর্ট্রেট তৈরি।
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-blue-400 text-xs">মডিউল ২: রেডি ওয়েবসাইট কোড ও ডেপ্লয়মেন্ট</span>
                  <p className="text-xs text-slate-400">
                    HTML, CSS, Tailwind এবং রেডি জাভাস্ক্রিপ্ট টুল সাইট তৈরি ও ফ্রি হোস্টিংয়ে লাইভ করা।
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-emerald-400 text-xs">মডিউল ৩: মনিটাইজেশন ও আর্নিং স্ট্র্যাটেজি</span>
                  <p className="text-xs text-slate-400">
                    Adsterra, Monetag এবং ডিজিটাল কনটেন্ট বিক্রি করে ঘরে বসে ইনকামের কমপ্লিট রোডম্যাপ।
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-violet-950/40 border border-violet-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">অফার মূল্য:</span>
                  <div className="text-xl font-extrabold text-white">{price}</div>
                </div>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-violet-600/30"
                >
                  <span>এখনই ইনরোল করুন</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
