import React, { useState, useEffect } from 'react';
import {
  X,
  Server,
  Download,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Tv,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Play,
  Share2,
  RefreshCw
} from 'lucide-react';
import { MediaItem, Episode, StreamServer, AdSlotConfig } from '../types';
import { AdBanner } from './AdBanner';

interface WatchModalProps {
  media: MediaItem;
  episodes: Episode[];
  initialEpisodeId?: string;
  onClose: () => void;
  adSlotUnderPlayer?: AdSlotConfig;
  onOpenAdManager?: () => void;
  onReportServer?: (episodeTitle: string, serverName: string) => void;
}

export const WatchModal: React.FC<WatchModalProps> = ({
  media,
  episodes,
  initialEpisodeId,
  onClose,
  adSlotUnderPlayer,
  onOpenAdManager,
  onReportServer,
}) => {
  // Sort episodes by season & episode number
  const sortedEpisodes = [...episodes].sort((a, b) => {
    if (a.seasonNumber !== b.seasonNumber) return a.seasonNumber - b.seasonNumber;
    return a.episodeNumber - b.episodeNumber;
  });

  const [currentEpisode, setCurrentEpisode] = useState<Episode>(() => {
    if (initialEpisodeId) {
      const found = sortedEpisodes.find((e) => e.id === initialEpisodeId);
      if (found) return found;
    }
    return sortedEpisodes[0] || null;
  });

  const [activeServer, setActiveServer] = useState<StreamServer | null>(() => {
    if (currentEpisode && currentEpisode.servers.length > 0) {
      return currentEpisode.servers[0];
    }
    return null;
  });

  const [isCopied, setIsCopied] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [playerKey, setPlayerKey] = useState(0); // to force refresh player if needed

  // When currentEpisode changes, pick the first server
  useEffect(() => {
    if (currentEpisode && currentEpisode.servers.length > 0) {
      setActiveServer(currentEpisode.servers[0]);
      setReportSent(false);
    }
  }, [currentEpisode]);

  const currentIndex = sortedEpisodes.findIndex((e) => e.id === currentEpisode?.id);
  const prevEpisode = currentIndex > 0 ? sortedEpisodes[currentIndex - 1] : null;
  const nextEpisode = currentIndex < sortedEpisodes.length - 1 ? sortedEpisodes[currentIndex + 1] : null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleReport = () => {
    if (onReportServer && activeServer && currentEpisode) {
      onReportServer(currentEpisode.title, activeServer.name);
    }
    setReportSent(true);
    setTimeout(() => setReportSent(false), 4000);
  };

  if (!currentEpisode) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/95 backdrop-blur-xl flex flex-col">
      {/* Top Modal Bar */}
      <div className="sticky top-0 z-20 bg-slate-900/90 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            id="watch-modal-close-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="رجوع للقائمة"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-rose-400 font-bold bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/40">
                {media.type === 'series' ? 'مسلسل' : 'فيلم'}
              </span>
              <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-[200px] sm:max-w-md">
                {media.title}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentEpisode.title} • {media.translatorName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="مشاركة رابط الحلقة"
          >
            {isCopied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isCopied ? 'تم النسخ!' : 'مشاركة'}</span>
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Watch Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 flex flex-col gap-6">
        
        {/* Anti-Takedown Multi-Server Switcher Bar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-rose-400" />
              <span className="text-xs sm:text-sm font-bold text-slate-200">
                اختر سيرفر المشاهدة (إذا تعطل سيرفر أو حُذف، اختر السيرفر البديل فوراً):
              </span>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                onClick={() => setPlayerKey((prev) => prev + 1)}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-800 transition-colors"
                title="إعادة تحميل المشغل"
              >
                <RefreshCw className="w-3 h-3" />
                <span>إعادة تحديث</span>
              </button>

              <button
                onClick={handleReport}
                className={`text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 border transition-colors ${
                  reportSent
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                }`}
                title="إرسال تنبيه للمترجم بأن هذا السيرفر لا يعمل لتغييره"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{reportSent ? 'تم الإبلاغ! سيتم تغييره' : 'إبلاغ عن سيرفر معطل'}</span>
              </button>
            </div>
          </div>

          {/* Servers Pills */}
          <div className="flex items-center gap-2 pt-3 overflow-x-auto no-scrollbar">
            {currentEpisode.servers.map((srv, idx) => {
              const isSelected = activeServer?.id === srv.id;
              return (
                <button
                  key={srv.id}
                  id={`server-btn-${srv.id}`}
                  onClick={() => setActiveServer(srv)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                    isSelected
                      ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/30'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white animate-pulse' : 'bg-emerald-400'}`} />
                  <span>{srv.name}</span>
                  {srv.quality && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-slate-300 font-mono">
                      {srv.quality}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Direct Download Button */}
            {currentEpisode.downloadUrl && (
              <a
                id="episode-download-link"
                href={currentEpisode.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mr-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 whitespace-nowrap"
                title="تحميل الحلقة برابط مباشر / ربحي"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تحميل الحلقة</span>
              </a>
            )}
          </div>
        </div>

        {/* Video Player Display Container */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
          {activeServer ? (
            activeServer.type === 'embed' ? (
              <iframe
                key={`${activeServer.id}-${playerKey}`}
                src={activeServer.url}
                title={currentEpisode.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <video
                key={`${activeServer.id}-${playerKey}`}
                src={activeServer.url}
                controls
                playsInline
                className="w-full h-full object-contain"
              >
                متصفحك لا يدعم مشغل الفيديو المباشر. يرجى تجربة سيرفر التضمين (Embed).
              </video>
            )
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-slate-400">
              <ShieldAlert className="w-12 h-12 text-rose-500 mb-2" />
              <p className="text-base font-bold text-white">لم يتم العثور على سيرفر نشط لهذه الحلقة</p>
              <p className="text-xs text-slate-400 mt-1">
                يمكن للمترجم إضافة وتعديل روابط السيرفرات من لوحة التحكم في أي وقت.
              </p>
            </div>
          )}
        </div>

        {/* Next / Prev Controls & Episode Metadata */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              id="prev-episode-btn"
              disabled={!prevEpisode}
              onClick={() => prevEpisode && setCurrentEpisode(prevEpisode)}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                prevEpisode
                  ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                  : 'bg-slate-900/50 text-slate-600 border-slate-800/50 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
              <span>الحلقة السابقة</span>
            </button>

            <button
              id="next-episode-btn"
              disabled={!nextEpisode}
              onClick={() => nextEpisode && setCurrentEpisode(nextEpisode)}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                nextEpisode
                  ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-600/30'
                  : 'bg-slate-900/50 text-slate-600 border-slate-800/50 cursor-not-allowed'
              }`}
            >
              <span>الحلقة التالية</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center sm:text-left text-xs text-slate-400">
            <span>المترجم: </span>
            <span className="text-rose-400 font-bold">{media.translatorName}</span>
            <span className="mx-2">•</span>
            <span>عدد المشاهدات: </span>
            <span className="text-white font-mono">{currentEpisode.viewsCount || 1024}</span>
          </div>
        </div>

        {/* Ad Slot Right Under Video Player (Crucial for monetization!) */}
        {adSlotUnderPlayer && (
          <AdBanner
            slot={adSlotUnderPlayer}
            onOpenAdManager={onOpenAdManager}
            className="w-full"
          />
        )}

        {/* Episodes Grid (If Series) */}
        {media.type === 'series' && sortedEpisodes.length > 0 && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Tv className="w-5 h-5 text-rose-500" />
                <h3 className="text-base font-bold text-white">قائمة حلقات المسلسل</h3>
                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                  {sortedEpisodes.length} حلقة متوفرة
                </span>
              </div>
              <span className="text-xs text-slate-400 hidden sm:inline">
                اضغط على أي حلقة لبدء تشغيلها فوراً
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {sortedEpisodes.map((ep) => {
                const isActive = ep.id === currentEpisode.id;
                return (
                  <button
                    key={ep.id}
                    id={`episode-card-${ep.id}`}
                    onClick={() => setCurrentEpisode(ep)}
                    className={`relative p-3 rounded-xl text-right flex flex-col justify-between border transition-all ${
                      isActive
                        ? 'bg-rose-600/20 border-rose-500 text-white shadow-lg shadow-rose-950/40 scale-[1.02]'
                        : 'bg-slate-950/70 border-slate-800/80 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-black px-2 py-0.5 rounded ${isActive ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
                        حلقة {ep.episodeNumber}
                      </span>
                      {isActive && <Play className="w-3.5 h-3.5 text-rose-400 fill-current" />}
                    </div>
                    <p className="text-xs font-semibold line-clamp-1 text-slate-200">
                      {ep.title}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                      <span>{ep.duration || '45 دقيقة'}</span>
                      <span className="text-emerald-400">{ep.servers.length} سيرفرات</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Synopsis & Disclaimer Note */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-6 text-xs text-slate-400 leading-relaxed">
          <h4 className="font-bold text-slate-200 text-sm mb-1.5">قصة العمل:</h4>
          <p className="mb-4">{media.story}</p>
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start gap-2.5 text-slate-400">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              <strong>تنويه أمان المحتوى:</strong> هذا التطبيق يعتمد معمارية المشغلات المضمنة (Zero-Hosting Embeds). لا يتم تخزين أي ملف فيديو على خوادم التطبيق، وتُعرض الحلقات عبر سيرفرات خارجية ومستقلة تماماً، مما يحمي التطبيق من أي حظر أو إيقاف.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
