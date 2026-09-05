import React from 'react';
import { Star, Play, Bookmark, Check, Film, Tv } from 'lucide-react';
import { MediaItem } from '../types';

interface MediaCardProps {
  item: MediaItem;
  isSaved: boolean;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onSelect: (item: MediaItem) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  item,
  isSaved,
  onToggleSave,
  onSelect,
}) => {
  return (
    <div
      id={`media-card-${item.id}`}
      onClick={() => onSelect(item)}
      className="group relative flex flex-col bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-rose-500/50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-rose-950/20 hover:-translate-y-1"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950">
        <img
          src={item.posterUrl}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // fallback
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
          {/* Category / Type Badge */}
          <span className="bg-slate-950/80 backdrop-blur-md text-slate-200 border border-slate-800 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            {item.type === 'series' ? <Tv className="w-3 h-3 text-rose-400" /> : <Film className="w-3 h-3 text-blue-400" />}
            {item.categoryNameArabic}
          </span>

          {/* Bookmark Button */}
          <button
            id={`bookmark-btn-${item.id}`}
            onClick={(e) => onToggleSave(item.id, e)}
            className={`pointer-events-auto p-2 rounded-full backdrop-blur-md border transition-all ${
              isSaved
                ? 'bg-rose-600 text-white border-rose-500'
                : 'bg-slate-950/70 text-slate-300 border-slate-800 hover:text-white hover:bg-slate-900'
            }`}
            title={isSaved ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
          >
            {isSaved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Center Play Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/50 scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-6 h-6 fill-current translate-x-0.5" />
          </div>
        </div>

        {/* Bottom Info on Image */}
        <div className="absolute bottom-2 inset-x-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 bg-amber-500/20 backdrop-blur-md text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/30 font-bold">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{item.rating.toFixed(1)}</span>
          </div>

          <span className="bg-slate-900/90 backdrop-blur-md text-slate-300 px-2 py-0.5 rounded-md text-[11px] font-medium border border-slate-800">
            {item.type === 'series' ? `${item.episodesCount} حلقة` : 'فيلم'}
          </span>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-100 line-clamp-1 group-hover:text-rose-400 transition-colors">
            {item.title}
          </h3>
          {item.originalTitle && (
            <p className="text-[11px] text-slate-500 line-clamp-1 font-sans">{item.originalTitle}</p>
          )}
        </div>

        {/* Translator Credit Badge */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
          <span className="text-rose-400 font-semibold truncate max-w-[150px]">
            {item.translatorName}
          </span>
          <span className="text-slate-500">{item.releaseYear}</span>
        </div>
      </div>
    </div>
  );
};
