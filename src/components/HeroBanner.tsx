import React from 'react';
import { Play, Bookmark, Check, Star, ShieldCheck, Sparkles } from 'lucide-react';
import { MediaItem } from '../types';

interface HeroBannerProps {
  item: MediaItem;
  isSaved: boolean;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onWatch: (item: MediaItem) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  item,
  isSaved,
  onToggleSave,
  onWatch,
}) => {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl bg-slate-950 mb-8">
      {/* Background Image with Cinematic Vignette */}
      <div className="relative h-[380px] sm:h-[450px] w-full">
        <img
          src={item.backdropUrl}
          alt={item.title}
          className="w-full h-full object-cover object-center filter brightness-90"
        />
        {/* Multidirectional Gradients for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 max-w-3xl">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2.5 mb-3">
          <span className="bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-rose-600/30">
            <Sparkles className="w-3.5 h-3.5" />
            حلقات حصرية مترجمة
          </span>
          <span className="bg-slate-900/80 backdrop-blur-md text-amber-300 border border-amber-500/30 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {item.rating.toFixed(1)} / 10
          </span>
          <span className="bg-slate-900/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            مشغلات آمنة ضد الحذف
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md">
          {item.title}
        </h1>
        {item.originalTitle && (
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">{item.originalTitle}</p>
        )}

        {/* Translator credit & Year */}
        <div className="flex items-center gap-3 mt-2 text-xs sm:text-sm text-slate-300 font-medium">
          <span className="text-rose-400 font-bold bg-rose-950/60 border border-rose-800/40 px-2 py-0.5 rounded-md">
            {item.translatorName}
          </span>
          <span>•</span>
          <span>{item.categoryNameArabic}</span>
          <span>•</span>
          <span>{item.releaseYear}</span>
          <span>•</span>
          <span>{item.episodesCount} حلقة</span>
        </div>

        {/* Story description */}
        <p className="text-xs sm:text-sm text-slate-300/90 mt-3 line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-2xl">
          {item.story}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-5">
          <button
            id="hero-watch-btn"
            onClick={() => onWatch(item)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-rose-600/40 transition-all hover:scale-105 active:scale-95"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>مشاهدة الحلقات الآن</span>
          </button>

          <button
            id="hero-bookmark-btn"
            onClick={(e) => onToggleSave(item.id, e)}
            className={`px-4 py-3 rounded-xl border font-bold text-sm flex items-center gap-2 backdrop-blur-md transition-all ${
              isSaved
                ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900/80 text-slate-200 border-slate-700 hover:bg-slate-800'
            }`}
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            <span className="hidden sm:inline">{isSaved ? 'في قائمتي' : 'أضف لقائمتي'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
