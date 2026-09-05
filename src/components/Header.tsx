import React from 'react';
import {
  Film,
  Search,
  Bookmark,
  PlusCircle,
  DollarSign,
  Sparkles,
  Tv,
  Clapperboard,
  X,
  Lock,
  Crown,
  Eye,
  LogOut,
  Sliders
} from 'lucide-react';

interface HeaderProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  savedCount: number;
  onOpenTranslatorDashboard: () => void;
  onOpenAdManager: () => void;
  activeView: 'home' | 'watchlist' | 'detail';
  setActiveView: (v: 'home' | 'watchlist' | 'detail') => void;
  isAdmin: boolean;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  savedCount,
  onOpenTranslatorDashboard,
  onOpenAdManager,
  activeView,
  setActiveView,
  isAdmin,
  onOpenLogin,
  onLogout,
}) => {
  const categories: { id: string; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'الرئيسية', icon: <Film className="w-4 h-4" /> },
    { id: 'indian', label: 'مسلسلات هندية', icon: <Tv className="w-4 h-4 text-amber-400" /> },
    { id: 'korean', label: 'مسلسلات كورية', icon: <Tv className="w-4 h-4 text-rose-400" /> },
    { id: 'turkish', label: 'مسلسلات تركية', icon: <Tv className="w-4 h-4 text-emerald-400" /> },
    { id: 'movie', label: 'أفلام مترجمة', icon: <Clapperboard className="w-4 h-4 text-blue-400" /> },
    { id: 'anime', label: 'أنمي', icon: <Sparkles className="w-4 h-4 text-purple-400" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0b0e14]/95 backdrop-blur-md border-b border-slate-800/80 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navbar Row */}
        <div className="flex items-center justify-between h-18 gap-3 sm:gap-6">
          
          {/* Brand Logo */}
          <div 
            onClick={() => { setActiveView('home'); onSelectCategory('all'); }}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
            id="app-logo-btn"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-600/30 group-hover:scale-105 transition-all">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white group-hover:text-rose-400 transition-colors">
                  سينما<span className="text-rose-500">هاب</span>
                </span>
                {isAdmin ? (
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-400" />
                    المترجم
                  </span>
                ) : (
                  <span className="bg-slate-800 text-slate-400 text-[10px] font-medium px-1.5 py-0.5 rounded hidden sm:inline-block">
                    مشاهدة
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">مشغلات بديلة وسريعة بدون تقطيع</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md relative">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="header-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ابحث عن مسلسل، فيلم، أو مترجم..."
                className="w-full bg-slate-900/90 border border-slate-800 rounded-full pr-9 pl-9 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  id="clear-search-btn"
                  onClick={() => onSearchChange('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  title="مسح البحث"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Watchlist */}
            <button
              id="watchlist-toggle-btn"
              onClick={() => setActiveView(activeView === 'watchlist' ? 'home' : 'watchlist')}
              className={`relative p-2.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                activeView === 'watchlist'
                  ? 'bg-rose-600/20 text-rose-400 border-rose-500/50'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
              title="قائمتي المفضلة"
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden md:inline text-xs font-semibold">المفضلة</span>
              {savedCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>

            {/* IF TRANSLATOR / ADMIN MODE */}
            {isAdmin ? (
              <>
                {/* Ad Manager (Monetization) */}
                <button
                  id="ad-manager-btn"
                  onClick={onOpenAdManager}
                  className="p-2 sm:px-3 sm:py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 text-xs font-bold transition-all"
                  title="إدارة الإعلانات والأرباح"
                >
                  <DollarSign className="w-4 h-4" />
                  <span className="hidden lg:inline">الإعلانات</span>
                </button>

                {/* Translator Dashboard */}
                <button
                  id="translator-dashboard-btn"
                  onClick={onOpenTranslatorDashboard}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 text-white flex items-center gap-1.5 text-xs font-bold transition-all shadow-lg shadow-rose-600/30"
                  title="لوحة تحكم المسلسلات والحلقات"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">لوحة التحكم</span>
                </button>

                {/* Switch to Viewer Preview / Logout */}
                <button
                  onClick={onLogout}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                  title="الخروج إلى وضع المشاهد (لتجربة ما يراه المتابعون)"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              /* IF VIEWER MODE: Discrete Translator Login button */
              <button
                id="translator-login-btn"
                onClick={onOpenLogin}
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 flex items-center gap-1.5 text-xs font-semibold transition-all shadow-sm"
                title="بوابة دخول المترجم / المشرف"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">دخول المترجم</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center gap-1.5 py-2.5 overflow-x-auto no-scrollbar border-t border-slate-800/40 text-xs">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id && activeView === 'home';
            return (
              <button
                key={cat.id}
                id={`cat-btn-${cat.id}`}
                onClick={() => {
                  setActiveView('home');
                  onSelectCategory(cat.id);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-white text-slate-950 font-bold shadow-md shadow-white/10'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800/60'
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
