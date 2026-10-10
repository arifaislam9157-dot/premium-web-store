import React from 'react';
import { Star, MessageSquareQuote, ShieldCheck, Users } from 'lucide-react';
import { ReviewItem } from '../types';

interface ReviewsSectionProps {
  reviews?: ReviewItem[];
  buyersCount?: string;
}

const DEFAULT_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    name: 'তানভীর আহমেদ',
    role: 'ডিজিটাল ক্রিয়েটর',
    comment: 'ভাইরাল 3D উইংস আর কাপল প্রম্পটগুলো দিয়ে অসাধারণ রেজাল্ট পেয়েছি! এক ক্লিকে নাম বসিয়ে সুন্দর ছবি বানানো যায়। দারুণ সাইট!',
    rating: 5,
    date: '২ দিন আগে',
  },
  {
    id: 'rev-2',
    name: 'মাহমুদুল হাসান',
    role: 'ফ্রিল্যান্সার',
    comment: 'রেডি ওয়েবসাইট কোডগুলো অসাধারণ। আমার ক্লায়েন্টের ল্যান্ডিং পেজ খুব দ্রুত তৈরি করতে পেরেছি। রেকমেন্ডেড!',
    rating: 5,
    date: '৪ দিন আগে',
  },
  {
    id: 'rev-3',
    name: 'নাদিয়া সুলতানা',
    role: 'ইউটিউবার',
    comment: 'ইউটিউব স্ক্রিপ্ট প্রম্পট আর ইমেজ এডিটিং গাইড অনেক সাহায্য করেছে। ফ্রি আর প্রিমিয়াম দুটো কালেকশনই অসাধারণ।',
    rating: 5,
    date: '১ সপ্তাহ আগে',
  },
];

export default function ReviewsSection({ reviews, buyersCount = '৫০০+ সন্তুষ্ট ক্রেতা' }: ReviewsSectionProps) {
  const list = reviews && reviews.length > 0 ? reviews : DEFAULT_REVIEWS;

  return (
    <section className="my-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ভেরিফাইড ইউজার রিভিউ</span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white">
            ক্রেতা ও ব্যবহারকারীদের মতামত
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            আমাদের AI প্রম্পট ও কোড ব্যবহারকারীদের বাস্তব অভিজ্ঞতা
          </p>
        </div>

        {buyersCount && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold self-start sm:self-auto">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>{buyersCount}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {list.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition flex flex-col justify-between space-y-4 shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: item.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                {item.date && (
                  <span className="text-[10px] text-slate-500 font-mono">{item.date}</span>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{item.comment}"
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/60 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-slate-950 font-black text-xs">
                {item.name.charAt(0)}
              </div>
              <div>
                <h5 className="font-bold text-xs text-white leading-none">{item.name}</h5>
                {item.role && (
                  <span className="text-[10px] text-slate-400">{item.role}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
