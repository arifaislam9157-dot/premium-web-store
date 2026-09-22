import React from 'react';
import {
  Sparkles,
  Flame,
  Heart,
  Camera,
  Cpu,
  FileText,
  UserCheck,
  Code,
  Tag,
  Folder,
} from 'lucide-react';
import { Category } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  promptsCountByCategory: Record<string, number>;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  promptsCountByCategory,
}: CategoryFilterProps) {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'sparkles':
        return <Sparkles className="w-3.5 h-3.5" />;
      case 'flame':
        return <Flame className="w-3.5 h-3.5" />;
      case 'heart':
        return <Heart className="w-3.5 h-3.5" />;
      case 'camera':
        return <Camera className="w-3.5 h-3.5" />;
      case 'cpu':
        return <Cpu className="w-3.5 h-3.5" />;
      case 'filetext':
        return <FileText className="w-3.5 h-3.5" />;
      case 'usercheck':
        return <UserCheck className="w-3.5 h-3.5" />;
      case 'code':
        return <Code className="w-3.5 h-3.5" />;
      default:
        return <Folder className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <Tag className="w-3.5 h-3.5 text-cyan-400" />
          <span>Browse Trending Categories</span>
        </div>
        <span className="text-[11px] text-slate-500">
          {categories.length} Categories Available
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = promptsCountByCategory[cat.id] ?? 0;

          return (
            <button
              key={cat.id}
              id={`cat-filter-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold border-cyan-400 shadow-lg shadow-cyan-500/25'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <span className={isSelected ? 'text-slate-950' : 'text-cyan-400'}>
                {getCategoryIcon(cat.iconName)}
              </span>
              <span>{cat.name}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isSelected
                      ? 'bg-slate-950/30 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
