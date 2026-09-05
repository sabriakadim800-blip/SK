import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit,
  Server,
  Download,
  ShieldCheck,
  FileJson,
  Upload,
  Film,
  Tv,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Save,
  AlertCircle,
  HelpCircle,
  BookOpen,
  ExternalLink,
  Sparkles,
  Search
} from 'lucide-react';
import { MediaItem, Episode, StreamServer, MediaCategory } from '../types';

interface TranslatorDashboardProps {
  mediaList: MediaItem[];
  episodesList: Episode[];
  onAddMedia: (item: MediaItem) => void;
  onUpdateMedia: (item: MediaItem) => void;
  onDeleteMedia: (id: string) => void;
  onAddEpisode: (episode: Episode) => void;
  onUpdateEpisode: (episode: Episode) => void;
  onDeleteEpisode: (id: string) => void;
  onClose: () => void;
  reportsList?: { episodeTitle: string; serverName: string; time: string }[];
  onClearReports?: () => void;
  onImportBackup?: (media: MediaItem[], episodes: Episode[]) => void;
}

export const TranslatorDashboard: React.FC<TranslatorDashboardProps> = ({
  mediaList,
  episodesList,
  onAddMedia,
  onUpdateMedia,
  onDeleteMedia,
  onAddEpisode,
  onUpdateEpisode,
  onDeleteEpisode,
  onClose,
  reportsList = [],
  onClearReports,
  onImportBackup,
}) => {
  const [activeTab, setActiveTab] = useState<'episodes' | 'media' | 'reports' | 'backup' | 'guide'>('episodes');

  // Selected media to view/add episodes for
  const [selectedMediaId, setSelectedMediaId] = useState<string>(mediaList[0]?.id || '');
  const [mediaSearchFilter, setMediaSearchFilter] = useState('');

  // Delete confirmation modal state (replaces window.confirm)
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'media' | 'episode';
    id: string;
    title: string;
    extraInfo?: string;
  } | null>(null);

  // Form states for adding/editing Media
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaFormData, setMediaFormData] = useState<Partial<MediaItem>>({
    title: '',
    originalTitle: '',
    type: 'series',
    category: 'indian',
    categoryNameArabic: 'مسلسلات هندية',
    posterUrl: '',
    backdropUrl: '',
    story: '',
    releaseYear: new Date().getFullYear(),
    rating: 8.5,
    translatorName: 'صبري كاديم',
    status: 'مستمر',
    seasonsCount: 1,
    episodesCount: 1,
    tags: ['مترجم', 'حصري'],
  });

  // Form states for adding/editing Episode
  const [isEpisodeModalOpen, setIsEpisodeModalOpen] = useState(false);
  const [editingEpisodeId, setEditingEpisodeId] = useState<string | null>(null);
  const [episodeFormError, setEpisodeFormError] = useState<string | null>(null);
  const [episodeFormData, setEpisodeFormData] = useState({
    mediaId: selectedMediaId,
    seasonNumber: 1,
    episodeNumber: 1,
    title: 'الحلقة 1',
    duration: '45 دقيقة',
    downloadUrl: '',
    servers: [
      {
        id: 'srv-1',
        name: 'سيرفر 1 - Ok.ru (سريع)',
        url: '',
        type: 'embed' as const,
        quality: '1080p',
      },
      {
        id: 'srv-2',
        name: 'سيرفر 2 - Streamwish (متعدد الجودات)',
        url: '',
        type: 'embed' as const,
        quality: '720p',
      },
      {
        id: 'srv-3',
        name: 'سيرفر 3 - Google Drive / احتياطي',
        url: '',
        type: 'direct' as const,
        quality: 'HD',
      }
    ],
  });

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Filter episodes for selected media
  const mediaEpisodes = episodesList.filter((e) => e.mediaId === selectedMediaId);

  // Handle saving Media
  const handleSaveMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaFormData.title) return;

    const newMedia: MediaItem = {
      id: mediaFormData.id || `media-${Date.now()}`,
      title: mediaFormData.title || '',
      originalTitle: mediaFormData.originalTitle || '',
      type: mediaFormData.type || 'series',
      category: mediaFormData.category || 'indian',
      categoryNameArabic:
        mediaFormData.category === 'indian'
          ? 'مسلسلات هندية'
          : mediaFormData.category === 'korean'
          ? 'مسلسلات كورية'
          : mediaFormData.category === 'turkish'
          ? 'مسلسلات تركية'
          : mediaFormData.category === 'anime'
          ? 'أنمي'
          : 'أفلام مترجمة',
      posterUrl:
        mediaFormData.posterUrl ||
        'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
      backdropUrl:
        mediaFormData.backdropUrl ||
        'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1400&q=80',
      story: mediaFormData.story || 'نبذة عن المسلسل أو الفيلم المترجم.',
      releaseYear: Number(mediaFormData.releaseYear) || 2024,
      rating: Number(mediaFormData.rating) || 8.5,
      translatorName: mediaFormData.translatorName || 'صبري كاديم',
      status: (mediaFormData.status as any) || 'مستمر',
      seasonsCount: Number(mediaFormData.seasonsCount) || 1,
      episodesCount: Number(mediaFormData.episodesCount) || 1,
      tags: mediaFormData.tags || ['مترجم'],
    };

    if (mediaFormData.id) {
      onUpdateMedia(newMedia);
      showNotification('تم تحديث بيانات العمل بنجاح!');
    } else {
      onAddMedia(newMedia);
      setSelectedMediaId(newMedia.id);
      showNotification('تمت إضافة العمل الجديد بنجاح!');
    }

    setIsMediaModalOpen(false);
  };

  // Open Episode Modal for adding new
  const handleOpenNewEpisode = () => {
    const nextEpNumber = mediaEpisodes.length + 1;
    setEditingEpisodeId(null);
    setEpisodeFormError(null);
    setEpisodeFormData({
      mediaId: selectedMediaId,
      seasonNumber: 1,
      episodeNumber: nextEpNumber,
      title: `الحلقة ${nextEpNumber}`,
      duration: '45 دقيقة',
      downloadUrl: '',
      servers: [
        {
          id: `srv-${Date.now()}-1`,
          name: 'سيرفر 1 - Ok.ru (فائق السرعة)',
          url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
          type: 'embed',
          quality: '1080p',
        },
        {
          id: `srv-${Date.now()}-2`,
          name: 'سيرفر 2 - Streamwish (متعدد الجودات)',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          type: 'direct',
          quality: '720p',
        },
        {
          id: `srv-${Date.now()}-3`,
          name: 'سيرفر 3 - Google Drive / احتياطي',
          url: '',
          type: 'embed',
          quality: 'HD',
        }
      ],
    });
    setIsEpisodeModalOpen(true);
  };

  // Open Episode Modal for editing existing episode
  const handleEditEpisode = (ep: Episode) => {
    setEditingEpisodeId(ep.id);
    setEpisodeFormError(null);
    setEpisodeFormData({
      mediaId: ep.mediaId,
      seasonNumber: ep.seasonNumber,
      episodeNumber: ep.episodeNumber,
      title: ep.title,
      duration: ep.duration || '45 دقيقة',
      downloadUrl: ep.downloadUrl || '',
      servers: ep.servers.length > 0 ? ep.servers : [
        { id: 'srv-1', name: 'سيرفر 1', url: '', type: 'embed' }
      ],
    });
    setIsEpisodeModalOpen(true);
  };

  // Handle saving Episode
  const handleSaveEpisode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!episodeFormData.title) return;

    // Filter out servers with empty URLs
    const validServers = episodeFormData.servers.filter((s) => s.url.trim() !== '');
    if (validServers.length === 0) {
      setEpisodeFormError('يرجى إدخال رابط سيرفر واحد على الأقل للتشغيل (رابط مشغل Ok.ru أو Streamwish أو فيديو مباشر).');
      return;
    }

    const episodeToSave: Episode = {
      id: editingEpisodeId || `ep-${Date.now()}`,
      mediaId: selectedMediaId,
      seasonNumber: Number(episodeFormData.seasonNumber) || 1,
      episodeNumber: Number(episodeFormData.episodeNumber) || 1,
      title: episodeFormData.title,
      duration: episodeFormData.duration,
      servers: validServers,
      downloadUrl: episodeFormData.downloadUrl,
      viewsCount: 1,
    };

    if (editingEpisodeId) {
      onUpdateEpisode(episodeToSave);
      showNotification('تم تحديث سيرفرات الحلقة بنجاح!');
    } else {
      onAddEpisode(episodeToSave);
      showNotification('تم نشر الحلقة والسيرفرات بنجاح!');
    }

    setIsEpisodeModalOpen(false);
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const backupData = {
      media: mediaList,
      episodes: episodesList,
      exportedAt: new Date().toISOString(),
      appName: 'CinemaHub',
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `cinemahub-backup-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification('تم تحميل ملف النسخة الاحتياطية بنجاح على جهازك!');
  };

  // Import JSON Backup
  const handleImportBackupFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed.media) && Array.isArray(parsed.episodes)) {
          if (onImportBackup) {
            onImportBackup(parsed.media, parsed.episodes);
            showNotification(`تم استيراد ${parsed.media.length} عملاً و ${parsed.episodes.length} حلقة بنجاح!`);
          } else {
            // Direct state update if prop not passed
            parsed.media.forEach((m: MediaItem) => onAddMedia(m));
            parsed.episodes.forEach((ep: Episode) => onAddEpisode(ep));
            showNotification('تم استيراد البيانات بنجاح!');
          }
        } else {
          showNotification('ملف غير صالح. يجب أن يحتوي على قوائم الأعمال والحلقات.');
        }
      } catch (err) {
        showNotification('حدث خطأ أثناء قراءة ملف النسخة الاحتياطية.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const filteredMediaList = mediaList.filter((m) =>
    m.title.toLowerCase().includes(mediaSearchFilter.toLowerCase()) ||
    m.translatorName.toLowerCase().includes(mediaSearchFilter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col overflow-y-auto">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-600/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>لوحة تحكم المترجم وإدارة السيرفرات</span>
              <span className="text-[10px] bg-rose-600/30 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full font-bold">
                محمية ضد الحذف
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              أضف مسلسلاتك وحلقاتك واستبدل أي رابط متعطل في ثوانٍ دون الحاجة لإعادة رفع الفيديو
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          title="إغلاق لوحة التحكم"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className="bg-emerald-600 text-white text-xs font-bold py-2.5 px-4 text-center flex items-center justify-center gap-2 shadow-md animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('episodes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'episodes'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>إدارة الحلقات والسيرفرات</span>
            <span className="bg-slate-950/60 px-1.5 py-0.5 rounded text-[10px]">
              {episodesList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'media'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>المسلسلات والأفلام</span>
            <span className="bg-slate-950/60 px-1.5 py-0.5 rounded text-[10px]">
              {mediaList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'reports'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>بلاغات الروابط المعطلة</span>
            {reportsList.length > 0 && (
              <span className="bg-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded text-[10px]">
                {reportsList.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'backup'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileJson className="w-4 h-4 text-emerald-400" />
            <span>النسخ الاحتياطي والاستيراد</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'guide'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span>دليل الحماية من البلاغات</span>
          </button>
        </div>

        {/* TAB 1: EPISODES & SERVERS MANAGEMENT */}
        {activeTab === 'episodes' && (
          <div className="flex flex-col gap-6">
            {/* Media Selector Bar */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1 w-full md:w-auto">
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  اختر المسلسل أو الفيلم لإدارة حلقاته وسيرفراته:
                </label>
                <div className="flex items-center gap-3">
                  <select
                    id="select-media-for-episodes"
                    value={selectedMediaId}
                    onChange={(e) => setSelectedMediaId(e.target.value)}
                    className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-rose-500 focus:outline-none"
                  >
                    {mediaList.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.title} ({m.categoryNameArabic} - {m.translatorName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                <button
                  id="add-episode-btn"
                  onClick={handleOpenNewEpisode}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة حلقة جديدة وسيرفراتها</span>
                </button>
              </div>
            </div>

            {/* List of episodes for current media */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>حلقات العمل الحالي:</span>
                  <span className="text-rose-400 font-bold">
                    {mediaList.find((m) => m.id === selectedMediaId)?.title}
                  </span>
                </h3>
                <span className="text-xs text-slate-400">{mediaEpisodes.length} حلقة</span>
              </div>

              {mediaEpisodes.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
                  <p className="text-sm text-slate-400 font-semibold mb-3">
                    لم تتم إضافة أي حلقات لهذا المسلسل حتى الآن.
                  </p>
                  <button
                    onClick={handleOpenNewEpisode}
                    className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-500 transition-colors"
                  >
                    أضف الحلقة 1 الآن
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-800/80">
                  {mediaEpisodes.map((ep) => (
                    <div
                      key={ep.id}
                      className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group hover:bg-slate-800/30 px-3 rounded-xl transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="bg-rose-600/20 text-rose-400 text-xs font-black px-2 py-0.5 rounded border border-rose-500/30">
                            حلقة {ep.episodeNumber}
                          </span>
                          <h4 className="text-sm font-bold text-white">{ep.title}</h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400">
                          <span>السيرفرات النشطة:</span>
                          {ep.servers.map((s) => (
                            <span
                              key={s.id}
                              className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-300 font-medium"
                            >
                              {s.name} ({s.quality || 'HD'})
                            </span>
                          ))}
                          {ep.downloadUrl && (
                            <span className="text-emerald-400 text-[10px] flex items-center gap-1 font-semibold">
                              <Download className="w-3 h-3" /> رابط تحميل متاح
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => handleEditEpisode(ep)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          title="تعديل أو استبدال روابط السيرفرات"
                        >
                          <Edit className="w-3.5 h-3.5 text-rose-400" />
                          <span>تعديل السيرفرات</span>
                        </button>

                        <button
                          onClick={() =>
                            setDeleteTarget({
                              type: 'episode',
                              id: ep.id,
                              title: ep.title,
                              extraInfo: `حلقة رقم ${ep.episodeNumber} من هذا المسلسل.`,
                            })
                          }
                          className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-200 transition-colors"
                          title="حذف الحلقة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MEDIA (SERIES / MOVIES) MANAGEMENT */}
        {activeTab === 'media' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative max-w-sm w-full">
                <Search className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={mediaSearchFilter}
                  onChange={(e) => setMediaSearchFilter(e.target.value)}
                  placeholder="ابحث بين أعمالك..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <button
                id="add-new-media-btn"
                onClick={() => {
                  setMediaFormData({
                    title: '',
                    originalTitle: '',
                    type: 'series',
                    category: 'indian',
                    categoryNameArabic: 'مسلسلات هندية',
                    posterUrl: '',
                    backdropUrl: '',
                    story: '',
                    releaseYear: new Date().getFullYear(),
                    rating: 8.5,
                    translatorName: 'صبري كاديم',
                    status: 'مستمر',
                    seasonsCount: 1,
                    episodesCount: 1,
                    tags: ['مترجم'],
                  });
                  setIsMediaModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة مسلسل أو فيلم جديد</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMediaList.map((m) => (
                <div
                  key={m.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex gap-3.5 shadow-md hover:border-slate-700 transition-colors"
                >
                  <img
                    src={m.posterUrl}
                    alt={m.title}
                    className="w-20 h-28 object-cover rounded-xl shrink-0 bg-slate-950"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] bg-slate-800 text-rose-400 font-bold px-1.5 py-0.5 rounded">
                          {m.categoryNameArabic}
                        </span>
                        <span className="text-xs text-amber-400 font-bold font-mono">⭐ {m.rating}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1 line-clamp-1">{m.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-1 font-sans">{m.originalTitle}</p>
                      <p className="text-[11px] text-slate-500 mt-1">{m.translatorName}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                      <button
                        onClick={() => {
                          setMediaFormData(m);
                          setIsMediaModalOpen(true);
                        }}
                        className="text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>تعديل</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedMediaId(m.id);
                          setActiveTab('episodes');
                        }}
                        className="text-slate-300 hover:text-white flex items-center gap-1 font-semibold"
                      >
                        <Layers className="w-3.5 h-3.5 text-amber-400" />
                        <span>الحلقات ({episodesList.filter((e) => e.mediaId === m.id).length})</span>
                      </button>

                      <button
                        onClick={() =>
                          setDeleteTarget({
                            type: 'media',
                            id: m.id,
                            title: m.title,
                            extraInfo: `سيتم حذف المسلسل "${m.title}" مع جميع الحلقات (${
                              episodesList.filter((e) => e.mediaId === m.id).length
                            } حلقة) والسيرفرات التابعة له نهائياً.`,
                          })
                        }
                        className="text-red-400 hover:text-red-300 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>حذف</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: REPORTS FROM USERS */}
        {activeTab === 'reports' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>تنبيهات وبلاغات السيرفرات المعطلة</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  عندما يبلغ أحد المشاهدين عن توقف سيرفر (بسبب حذف الرابط من موقعه الأصلي)، يظهر هنا فوراً لتغييره بضغطة زر.
                </p>
              </div>

              {reportsList.length > 0 && onClearReports && (
                <button
                  onClick={onClearReports}
                  className="px-3 py-1.5 bg-slate-800 text-xs text-slate-300 hover:text-white rounded-lg transition-colors"
                >
                  مسح البلاغات
                </button>
              )}
            </div>

            {reportsList.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                <CheckCircle2 className="w-10 h-10 text-emerald-500/50 mx-auto mb-2" />
                <p className="text-slate-300 font-semibold text-sm">ممتاز! جميع السيرفرات تعمل بشكل سليم</p>
                <p className="text-slate-500 mt-1">لا توجد أي بلاغات من المشاهدين حالياً.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {reportsList.map((rep, index) => (
                  <div key={index} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-amber-300">
                        سيرفر معطل في: {rep.episodeTitle}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        السيرفر المعطل: <span className="text-white font-semibold">{rep.serverName}</span> • وقت البلاغ: {rep.time}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('episodes');
                      }}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      تغيير الرابط الآن
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: BACKUP & RESTORE (IMPORT & EXPORT) */}
        {activeTab === 'backup' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* EXPORT BOX */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Download className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">تصدير وتحميل نسخة احتياطية</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  احفظ جميع مسلسلاتك، الحلقات، وروابط السيرفرات في ملف JSON على جهازك لحمايتها من الضياع ونقلها لأي جهاز آخر.
                </p>
              </div>
              <button
                onClick={handleExportBackup}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all mt-auto"
              >
                <Download className="w-4 h-4" />
                <span>تحميل النسخة الاحتياطية (JSON)</span>
              </button>
            </div>

            {/* IMPORT BOX */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-rose-600/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">استيراد قاعدة بيانات محفوظة</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  هل قمت بتصدير نسخة سابقة أو تريد نقل المحتوى من جهاز آخر؟ اختر ملف JSON لاستعادة مسلسلاتك وحلقاتك فوراً.
                </p>
              </div>
              <label className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 cursor-pointer transition-all mt-auto">
                <Upload className="w-4 h-4 text-rose-400" />
                <span>اختر ملف النسخة للاستيراد (.json)</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportBackupFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {/* TAB 5: ANTI-TAKEDOWN & MONETIZATION GUIDE */}
        {activeTab === 'guide' && (
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 max-w-4xl mx-auto text-right">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">دليل حماية تطبيقك من البلاغات والإغلاق</h3>
                <p className="text-xs text-slate-400">كيف تستمر في نشر ترجماتك بأمان تام وتحقيق أعلى أرباح</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <h4 className="text-sm font-bold text-rose-400 mb-1 flex items-center gap-1.5">
                  <Server className="w-4 h-4" />
                  <span>1. استراتيجية السيرفرات المتعددة:</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  ارفع كل حلقة مترجمة على موقعين مختلفين (مثلاً سيرفر Ok.ru وسيرفر Streamwish). إذا حذف أحدهما بسبب بلاغ حقوق طبع، يبقى السيرفر الآخر يعمل للمشاهد تلقائياً.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <h4 className="text-sm font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>2. زر إبلاغ المشاهدين:</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  يوجد زر أسفل مشغل كل حلقة يمكن للمشاهد الضغط عليه في حال توقف أي سيرفر. ستجد البلاغ في تبويب "بلاغات الروابط المعطلة" وتستبدل الرابط في 10 ثوانٍ.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <h4 className="text-sm font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                  <Download className="w-4 h-4" />
                  <span>3. ربح روابط التحميل المختصرة:</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  في خانة "رابط تحميل الحلقة"، ضع رابطاً من موقع اختصار روابط مثل Shrinkearn أو Adfoc لتحقيق أرباح لكل شخص يقرر تحميل الحلقة بدلاً من مشاهدتها أونلاين.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <h4 className="text-sm font-bold text-blue-400 mb-1 flex items-center gap-1.5">
                  <FileJson className="w-4 h-4" />
                  <span>4. حفظ النسخ الاحتياطية دورياً:</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  بعد إضافة حلقات ومسلسلات جديدة، حمّل نسخة احتياطية من تبويب "النسخ الاحتياطي" لضمان عدم ضياع أي رابط أو حلقة قمت بإضافتها.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* CONFIRMATION MODAL (DELETE CONFIRMATION - ZERO WINDOW.CONFIRM) */}
      {deleteTarget && (
        <div className="fixed inset-0 z-70 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl text-right">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">
              هل أنت متأكد من حذف "{deleteTarget.title}"؟
            </h3>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              {deleteTarget.extraInfo || 'هذا الإجراء نهائي وسيتم حذف العنصر من التطبيق.'}
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold transition-colors"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  if (deleteTarget.type === 'media') {
                    onDeleteMedia(deleteTarget.id);
                    showNotification(`تم حذف "${deleteTarget.title}" بنجاح.`);
                  } else {
                    onDeleteEpisode(deleteTarget.id);
                    showNotification(`تم حذف "${deleteTarget.title}" بنجاح.`);
                  }
                  setDeleteTarget(null);
                }}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-all"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT EPISODE */}
      {isEpisodeModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-rose-500" />
                <span>{editingEpisodeId ? 'تعديل سيرفرات الحلقة' : 'إضافة حلقة جديدة'}</span>
              </h3>
              <button
                onClick={() => setIsEpisodeModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {episodeFormError && (
              <div className="mb-4 bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs p-3 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{episodeFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEpisode} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">رقم الموسم</label>
                  <input
                    type="number"
                    min="1"
                    value={episodeFormData.seasonNumber}
                    onChange={(e) => setEpisodeFormData({ ...episodeFormData, seasonNumber: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-rose-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">رقم الحلقة</label>
                  <input
                    type="number"
                    min="1"
                    value={episodeFormData.episodeNumber}
                    onChange={(e) => setEpisodeFormData({ ...episodeFormData, episodeNumber: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-rose-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">مدة الحلقة</label>
                  <input
                    type="text"
                    value={episodeFormData.duration}
                    onChange={(e) => setEpisodeFormData({ ...episodeFormData, duration: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-rose-500 focus:outline-none"
                    placeholder="45 دقيقة"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">عنوان الحلقة</label>
                <input
                  type="text"
                  value={episodeFormData.title}
                  onChange={(e) => setEpisodeFormData({ ...episodeFormData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-rose-500 focus:outline-none"
                  placeholder="مثال: الحلقة 1 - البداية مترجمة"
                  required
                />
              </div>

              {/* SERVERS LIST */}
              <div className="border-t border-slate-800 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-rose-400">
                    روابط السيرفرات البديلة (ضع روابط المشغلات المضمنة أو الروابط المباشرة):
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setEpisodeFormData({
                        ...episodeFormData,
                        servers: [
                          ...episodeFormData.servers,
                          {
                            id: `srv-${Date.now()}`,
                            name: `سيرفر ${episodeFormData.servers.length + 1}`,
                            url: '',
                            type: 'embed',
                            quality: 'HD',
                          }
                        ]
                      });
                    }}
                    className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                  >
                    <Plus className="w-3 h-3" />
                    <span>إضافة سيرفر إضافي</span>
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {episodeFormData.servers.map((srv, idx) => (
                    <div key={srv.id} className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={srv.name}
                          onChange={(e) => {
                            const newServers = [...episodeFormData.servers];
                            newServers[idx].name = e.target.value;
                            setEpisodeFormData({ ...episodeFormData, servers: newServers });
                          }}
                          className="bg-slate-900 border border-slate-700 text-xs font-bold text-white px-2 py-1 rounded w-60"
                          placeholder="اسم السيرفر"
                        />

                        <select
                          value={srv.type}
                          onChange={(e) => {
                            const newServers = [...episodeFormData.servers];
                            newServers[idx].type = e.target.value as any;
                            setEpisodeFormData({ ...episodeFormData, servers: newServers });
                          }}
                          className="bg-slate-900 border border-slate-700 text-[11px] text-slate-300 px-2 py-1 rounded"
                        >
                          <option value="embed">مشغل مضمن (Embed Iframe)</option>
                          <option value="direct">رابط فيديو مباشر (MP4 / HLS)</option>
                        </select>
                      </div>

                      <input
                        type="url"
                        value={srv.url}
                        onChange={(e) => {
                          const newServers = [...episodeFormData.servers];
                          newServers[idx].url = e.target.value;
                          setEpisodeFormData({ ...episodeFormData, servers: newServers });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:border-rose-500 focus:outline-none"
                        placeholder="https://ok.ru/videoembed/... أو https://streamwish.to/e/..."
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct / Monetized Download Link */}
              <div className="border-t border-slate-800 pt-3">
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  رابط تحميل الحلقة (اختياري - يمكنك وضع رابط مباشر أو رابط مختصر للربح):
                </label>
                <input
                  type="url"
                  value={episodeFormData.downloadUrl}
                  onChange={(e) => setEpisodeFormData({ ...episodeFormData, downloadUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-rose-500 focus:outline-none"
                  placeholder="https://example.com/download/..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEpisodeModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-600/30 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ ونشر الحلقة</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT MEDIA */}
      {isMediaModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Film className="w-4 h-4 text-rose-500" />
                <span>{mediaFormData.id ? 'تعديل بيانات العمل' : 'إضافة مسلسل أو فيلم جديد'}</span>
              </h3>
              <button
                onClick={() => setIsMediaModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMedia} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">اسم العمل بالعربي</label>
                <input
                  type="text"
                  value={mediaFormData.title}
                  onChange={(e) => setMediaFormData({ ...mediaFormData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-rose-500 focus:outline-none"
                  placeholder="مثال: حب ورياح القدر"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">النوع</label>
                  <select
                    value={mediaFormData.type}
                    onChange={(e) => setMediaFormData({ ...mediaFormData, type: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-rose-500 focus:outline-none"
                  >
                    <option value="series">مسلسل</option>
                    <option value="movie">فيلم</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">التصنيف</label>
                  <select
                    value={mediaFormData.category}
                    onChange={(e) => setMediaFormData({ ...mediaFormData, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-rose-500 focus:outline-none"
                  >
                    <option value="indian">مسلسلات هندية</option>
                    <option value="korean">مسلسلات كورية</option>
                    <option value="turkish">مسلسلات تركية</option>
                    <option value="foreign">أفلام مترجمة</option>
                    <option value="anime">أنمي</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">اسم المترجم / الفريق</label>
                <input
                  type="text"
                  value={mediaFormData.translatorName}
                  onChange={(e) => setMediaFormData({ ...mediaFormData, translatorName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-rose-500 focus:outline-none"
                  placeholder="صبري كاديم"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">رابط البوستر (صورة عمودية)</label>
                  <input
                    type="url"
                    value={mediaFormData.posterUrl}
                    onChange={(e) => setMediaFormData({ ...mediaFormData, posterUrl: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-rose-500 focus:outline-none"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">سنة الإنتاج</label>
                  <input
                    type="number"
                    value={mediaFormData.releaseYear}
                    onChange={(e) => setMediaFormData({ ...mediaFormData, releaseYear: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">قصة العمل</label>
                <textarea
                  rows={3}
                  value={mediaFormData.story}
                  onChange={(e) => setMediaFormData({ ...mediaFormData, story: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-rose-500 focus:outline-none"
                  placeholder="اكتب نبذة مختصرة عن القصة..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsMediaModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-600/30 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ العمل</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
