import React, { useState } from 'react';
import { Megaphone, ExternalLink, X, Settings2, Sparkles } from 'lucide-react';
import { AdSlotConfig } from '../types';

interface AdBannerProps {
  slot: AdSlotConfig | undefined;
  onOpenAdManager?: () => void;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ slot, onOpenAdManager, className = '' }) => {
  const [dismissed, setDismissed] = useState(false);

  if (!slot || !slot.enabled || dismissed) {
    return null;
  }

  // Telegram / Notice bar style
  if (slot.type === 'notice_box') {
    return (
      <div 
        id={`ad-slot-${slot.id}`}
        className={`relative overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/30 p-3.5 sm:p-4 text-amber-200 shadow-md ${className}`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                  إعلان / رعاية
                </span>
                <h4 className="text-sm font-bold text-white">{slot.titleText || slot.title}</h4>
              </div>
              {slot.subText && (
                <p className="text-xs text-amber-200/80 mt-0.5 max-w-2xl">{slot.subText}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {slot.linkUrl && (
              <a
                id={`ad-link-${slot.id}`}
                href={slot.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm shadow-amber-500/30"
              >
                <span>زيارة الرابط</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            
            {onOpenAdManager && (
              <button
                onClick={onOpenAdManager}
                className="p-1.5 text-slate-400 hover:text-amber-300 transition-colors"
                title="تعديل هذا الإعلان أو استبداله بكود شبكتك الإعلانية"
              >
                <Settings2 className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => setDismissed(true)}
              className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors"
              title="إغلاق الإعلان"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Image + Link Banner (e.g. 728x90 style or responsive)
  return (
    <div 
      id={`ad-slot-${slot.id}`}
      className={`relative rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-lg group ${className}`}
    >
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950/80 border-b border-slate-800 text-[10px] text-slate-400">
        <span className="flex items-center gap-1 font-semibold text-slate-300">
          <Sparkles className="w-3 h-3 text-rose-400" />
          مساحة إعلانية مخصصة للربح (Ad Placement)
        </span>
        <div className="flex items-center gap-2">
          {onOpenAdManager && (
            <button
              onClick={onOpenAdManager}
              className="text-amber-400 hover:underline flex items-center gap-1"
            >
              <Settings2 className="w-3 h-3" />
              <span>تغيير كود الإعلان</span>
            </button>
          )}
          <button
            onClick={() => setDismissed(true)}
            className="text-slate-500 hover:text-white"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      <a
        id={`ad-link-img-${slot.id}`}
        href={slot.linkUrl || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative overflow-hidden"
      >
        {slot.imageUrl && (
          <div className="w-full h-24 sm:h-28 relative">
            <img
              src={slot.imageUrl}
              alt="إعلان"
              className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500 opacity-80 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent flex items-end p-3 sm:p-4">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-rose-300 transition-colors">
                  {slot.titleText || slot.title}
                </h4>
                {slot.subText && (
                  <p className="text-xs text-slate-300 mt-0.5">{slot.subText}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </a>
    </div>
  );
};
