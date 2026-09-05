export type MediaType = 'series' | 'movie';
export type MediaCategory = 'indian' | 'korean' | 'turkish' | 'foreign' | 'anime';

export interface StreamServer {
  id: string;
  name: string; // e.g., "سيرفر 1 - Ok.ru (فائق السرعة)"
  url: string; // Embed link or direct stream
  type: 'embed' | 'direct' | 'drive';
  quality?: string; // e.g. "1080p", "720p", "FHD"
  notes?: string;
}

export interface Episode {
  id: string;
  mediaId: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  duration?: string;
  thumbnail?: string;
  servers: StreamServer[];
  downloadUrl?: string; // رابط التحميل المباشر أو الربحي
  viewsCount?: number;
}

export interface MediaItem {
  id: string;
  title: string; // الاسم بالعربي
  originalTitle?: string;
  type: MediaType;
  category: MediaCategory;
  categoryNameArabic: string;
  posterUrl: string;
  backdropUrl: string;
  story: string;
  releaseYear: number;
  rating: number; // 0 - 10
  translatorName: string; // اسم المترجم
  status: 'مكتمل' | 'مستمر' | 'قريباً';
  seasonsCount: number;
  episodesCount: number;
  featured?: boolean;
  tags: string[];
}

export interface AdSlotConfig {
  id: string;
  placement: 'top_banner' | 'player_bottom' | 'episodes_inline' | 'telegram_bar';
  title: string;
  description: string;
  enabled: boolean;
  type: 'image_link' | 'custom_html' | 'notice_box';
  imageUrl?: string;
  linkUrl?: string;
  htmlContent?: string;
  titleText?: string;
  subText?: string;
}

export interface WatchHistoryItem {
  mediaId: string;
  episodeId: string;
  seasonNumber: number;
  episodeNumber: number;
  watchedAt: number;
}
