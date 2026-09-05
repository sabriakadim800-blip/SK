/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { MediaCard } from './components/MediaCard';
import { WatchModal } from './components/WatchModal';
import { TranslatorDashboard } from './components/TranslatorDashboard';
import { AdManagerModal } from './components/AdManagerModal';
import { AdBanner } from './components/AdBanner';
import { AdminLoginModal } from './components/AdminLoginModal';
import { INITIAL_MEDIA_ITEMS, INITIAL_EPISODES, INITIAL_AD_SLOTS } from './data/initialData';
import { MediaItem, Episode, AdSlotConfig } from './types';
import { Film, ShieldCheck, Heart, Sparkles, Filter, Bookmark, AlertCircle, Crown, Lock, LogOut, Settings } from 'lucide-react';

export default function App() {
  // Persistence via localStorage with fallback to initial sample data
  const [mediaList, setMediaList] = useState<MediaItem[]>(() => {
    try {
      const saved = localStorage.getItem('cinemahub_media');
      return saved ? JSON.parse(saved) : INITIAL_MEDIA_ITEMS;
    } catch {
      return INITIAL_MEDIA_ITEMS;
    }
  });

  const [episodesList, setEpisodesList] = useState<Episode[]>(() => {
    try {
      const saved = localStorage.getItem('cinemahub_episodes');
      return saved ? JSON.parse(saved) : INITIAL_EPISODES;
    } catch {
      return INITIAL_EPISODES;
    }
  });

  const [adSlots, setAdSlots] = useState<AdSlotConfig[]>(() => {
    try {
      const saved = localStorage.getItem('cinemahub_ads');
      return saved ? JSON.parse(saved) : INITIAL_AD_SLOTS;
    } catch {
      return INITIAL_AD_SLOTS;
    }
  });

  const [savedMediaIds, setSavedMediaIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cinemahub_saved');
      return saved ? JSON.parse(saved) : ['media-indian-1'];
    } catch {
      return ['media-indian-1'];
    }
  });

  const [reportsList, setReportsList] = useState<{ episodeTitle: string; serverName: string; time: string }[]>(() => {
    try {
      const saved = localStorage.getItem('cinemahub_reports');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Admin / Translator Authentication State
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem('cinemahub_is_admin') === 'true';
    } catch {
      return false;
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('cinemahub_media', JSON.stringify(mediaList));
  }, [mediaList]);

  useEffect(() => {
    localStorage.setItem('cinemahub_episodes', JSON.stringify(episodesList));
  }, [episodesList]);

  useEffect(() => {
    localStorage.setItem('cinemahub_ads', JSON.stringify(adSlots));
  }, [adSlots]);

  useEffect(() => {
    localStorage.setItem('cinemahub_saved', JSON.stringify(savedMediaIds));
  }, [savedMediaIds]);

  useEffect(() => {
    localStorage.setItem('cinemahub_reports', JSON.stringify(reportsList));
  }, [reportsList]);

  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    try {
      localStorage.setItem('cinemahub_is_admin', 'true');
    } catch {}
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    try {
      localStorage.setItem('cinemahub_is_admin', 'false');
    } catch {}
  };

  // UI state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeView, setActiveView] = useState<'home' | 'watchlist' | 'detail'>('home');

  // Modal states
  const [watchingMedia, setWatchingMedia] = useState<MediaItem | null>(null);
  const [initialEpisodeId, setInitialEpisodeId] = useState<string | undefined>(undefined);
  const [isTranslatorDashboardOpen, setIsTranslatorDashboardOpen] = useState(false);
  const [isAdManagerOpen, setIsAdManagerOpen] = useState(false);

  // Bookmark toggle
  const handleToggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedMediaIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Watch action
  const handleWatch = (media: MediaItem, epId?: string) => {
    setWatchingMedia(media);
    setInitialEpisodeId(epId);
  };

  // Report broken server
  const handleReportBrokenServer = (episodeTitle: string, serverName: string) => {
    const newReport = {
      episodeTitle,
      serverName,
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };
    setReportsList((prev) => [newReport, ...prev]);
  };

  // Filtered media items
  const filteredMedia = useMemo(() => {
    return mediaList.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'movie' && item.type !== 'movie') return false;
        if (selectedCategory !== 'movie' && item.category !== selectedCategory) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchOriginal = item.originalTitle?.toLowerCase().includes(q) || false;
        const matchTranslator = item.translatorName.toLowerCase().includes(q);
        const matchTag = item.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchOriginal && !matchTranslator && !matchTag) {
          return false;
        }
      }

      // View filter
      if (activeView === 'watchlist') {
        return savedMediaIds.includes(item.id);
      }

      return true;
    });
  }, [mediaList, selectedCategory, searchQuery, activeView, savedMediaIds]);

  // Featured Hero Item
  const featuredItem = useMemo(() => {
    return mediaList.find((m) => m.featured) || mediaList[0];
  }, [mediaList]);

  // Ad Slot Lookups
  const topBannerAd = adSlots.find((s) => s.placement === 'top_banner');
  const playerBottomAd = adSlots.find((s) => s.placement === 'player_bottom');
  const telegramBarAd = adSlots.find((s) => s.placement === 'telegram_bar');
  const episodesInlineAd = adSlots.find((s) => s.placement === 'episodes_inline');

  // Episodes for active watching media
  const currentMediaEpisodes = useMemo(() => {
    if (!watchingMedia) return [];
    return episodesList.filter((e) => e.mediaId === watchingMedia.id);
  }, [watchingMedia, episodesList]);

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-100 flex flex-col selection:bg-rose-600 selection:text-white">
      {/* Top Admin Notice Ribbon when Translator Mode is Active */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-amber-500/20 border-b border-amber-500/30 px-4 sm:px-6 py-2 text-xs flex flex-wrap items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <Crown className="w-4 h-4 text-amber-400 shrink-0" />
            <span>وضع المترجم نشط: أنت الآن تتحكم بالمسلسلات والسيرفرات والإعلانات.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTranslatorDashboardOpen(true)}
              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold transition-colors"
            >
              لوحة التحكم
            </button>
            <button
              onClick={() => setIsAdManagerOpen(true)}
              className="px-2.5 py-1 bg-amber-600/80 hover:bg-amber-500 text-white rounded-lg font-bold transition-colors"
            >
              أماكن الإعلانات
            </button>
            <button
              onClick={handleAdminLogout}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors border border-slate-700 flex items-center gap-1"
              title="معاينة التطبيق كما يراه المشاهدون بالضبط"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>معاينة كـ مشاهد</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Header */}
      <Header
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setActiveView('home');
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        savedCount={savedMediaIds.length}
        onOpenTranslatorDashboard={() => setIsTranslatorDashboardOpen(true)}
        onOpenAdManager={() => setIsAdManagerOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
        isAdmin={isAdmin}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleAdminLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        
        {/* TOP AD BANNER (Configurable & Clean) */}
        {topBannerAd && topBannerAd.enabled && (
          <AdBanner
            slot={topBannerAd}
            onOpenAdManager={() => setIsAdManagerOpen(true)}
          />
        )}

        {/* HERO SPOTLIGHT (Shown only on Home view when not searching) */}
        {activeView === 'home' && !searchQuery && featuredItem && (
          <HeroBanner
            item={featuredItem}
            isSaved={savedMediaIds.includes(featuredItem.id)}
            onToggleSave={handleToggleSave}
            onWatch={(m) => handleWatch(m)}
          />
        )}

        {/* TELEGRAM SPONSORSHIP / VIP BAR */}
        {telegramBarAd && telegramBarAd.enabled && (
          <AdBanner
            slot={telegramBarAd}
            onOpenAdManager={() => setIsAdManagerOpen(true)}
          />
        )}

        {/* Section Header & View Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              {activeView === 'watchlist' ? (
                <>
                  <Bookmark className="w-5 h-5 text-rose-500" />
                  <span>قائمتي المفضلة ({savedMediaIds.length})</span>
                </>
              ) : searchQuery ? (
                <>
                  <span>نتائج البحث عن: "{searchQuery}"</span>
                  <span className="text-xs bg-rose-600/20 text-rose-400 px-2 py-0.5 rounded-full font-bold">
                    {filteredMedia.length} نتيجة
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-rose-500" />
                  <span>
                    {selectedCategory === 'all'
                      ? 'أحدث المسلسلات والأفلام المترجمة'
                      : selectedCategory === 'indian'
                      ? 'مسلسلات هندية حصرية مترجمة'
                      : selectedCategory === 'korean'
                      ? 'مسلسلات كورية K-Drama'
                      : selectedCategory === 'turkish'
                      ? 'مسلسلات تركية مدبلجة ومترجمة'
                      : selectedCategory === 'movie'
                      ? 'أفلام مترجمة كاملة'
                      : 'أنمي مترجم'}
                  </span>
                </>
              )}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              جميع الحلقات مزودة بسيرفرات ومشغلات بديلة سريعة بدون تقطيع
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">ترجمة حصرية</span>
            <span>•</span>
            <span className="text-emerald-400 flex items-center gap-1 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              سيرفرات آمنة
            </span>
          </div>
        </div>

        {/* Media Grid */}
        {filteredMedia.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-8">
            <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">لم يتم العثور على أي أعمال مطابقة</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              جرب البحث بكلمات أخرى أو تصفح الأقسام من الشريط العلوي.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setActiveView('home');
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors"
            >
              عرض جميع الأعمال
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {filteredMedia.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                isSaved={savedMediaIds.includes(item.id)}
                onToggleSave={handleToggleSave}
                onSelect={(selected) => handleWatch(selected)}
              />
            ))}
          </div>
        )}

        {/* INLINE EPISODES AD BANNER */}
        {episodesInlineAd && episodesInlineAd.enabled && (
          <div className="my-2">
            <AdBanner
              slot={episodesInlineAd}
              onOpenAdManager={() => setIsAdManagerOpen(true)}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-8 px-4 sm:px-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-rose-500" />
            <span className="font-bold text-slate-300">سينما هاب - منصة المسلسلات والمشغلات</span>
            <span>•</span>
            <span>ترجمة وإشراف: صبري كاديم</span>
          </div>

          <div className="flex items-center gap-4">
            {isAdmin ? (
              <>
                <button
                  onClick={() => setIsTranslatorDashboardOpen(true)}
                  className="text-rose-400 hover:text-rose-300 font-bold transition-colors"
                >
                  لوحة تحكم المترجم
                </button>
                <span>•</span>
                <button
                  onClick={() => setIsAdManagerOpen(true)}
                  className="text-amber-400 hover:text-amber-300 font-bold transition-colors"
                >
                  إدارة الإعلانات
                </button>
                <span>•</span>
                <button
                  onClick={handleAdminLogout}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  خروج لوضع المشاهد
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>دخول المترجم والمشرف</span>
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* WATCH MODAL (Universal Multi-Server Player) */}
      {watchingMedia && (
        <WatchModal
          media={watchingMedia}
          episodes={currentMediaEpisodes}
          initialEpisodeId={initialEpisodeId}
          onClose={() => setWatchingMedia(null)}
          adSlotUnderPlayer={playerBottomAd}
          onOpenAdManager={() => setIsAdManagerOpen(true)}
          onReportServer={handleReportBrokenServer}
        />
      )}

      {/* TRANSLATOR DASHBOARD MODAL */}
      {isTranslatorDashboardOpen && (
        <TranslatorDashboard
          mediaList={mediaList}
          episodesList={episodesList}
          onAddMedia={(newItem) => setMediaList((prev) => [newItem, ...prev])}
          onUpdateMedia={(updated) =>
            setMediaList((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))
          }
          onDeleteMedia={(id) => {
            setMediaList((prev) => prev.filter((m) => m.id !== id));
            setEpisodesList((prev) => prev.filter((e) => e.mediaId !== id));
          }}
          onAddEpisode={(newEp) => setEpisodesList((prev) => [...prev, newEp])}
          onUpdateEpisode={(updatedEp) =>
            setEpisodesList((prev) => prev.map((e) => (e.id === updatedEp.id ? updatedEp : e)))
          }
          onDeleteEpisode={(id) => setEpisodesList((prev) => prev.filter((e) => e.id !== id))}
          onClose={() => setIsTranslatorDashboardOpen(false)}
          reportsList={reportsList}
          onClearReports={() => setReportsList([])}
          onImportBackup={(newMedia, newEpisodes) => {
            setMediaList(newMedia);
            setEpisodesList(newEpisodes);
          }}
        />
      )}

      {/* AD MANAGER MODAL */}
      {isAdManagerOpen && (
        <AdManagerModal
          adSlots={adSlots}
          onUpdateAdSlots={(updated) => setAdSlots(updated)}
          onClose={() => setIsAdManagerOpen(false)}
        />
      )}

      {/* ADMIN LOGIN MODAL */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleAdminLoginSuccess}
      />
    </div>
  );
}
