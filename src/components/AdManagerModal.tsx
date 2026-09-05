import React, { useState } from 'react';
import {
  X,
  DollarSign,
  CheckCircle2,
  ToggleLeft,
  ToggleRight,
  HelpCircle,
  ExternalLink,
  Sparkles,
  Link2,
  Save,
  Megaphone,
  Coins,
  ShieldCheck
} from 'lucide-react';
import { AdSlotConfig } from '../types';

interface AdManagerModalProps {
  adSlots: AdSlotConfig[];
  onUpdateAdSlots: (slots: AdSlotConfig[]) => void;
  onClose: () => void;
}

export const AdManagerModal: React.FC<AdManagerModalProps> = ({
  adSlots,
  onUpdateAdSlots,
  onClose,
}) => {
  const [localSlots, setLocalSlots] = useState<AdSlotConfig[]>(adSlots);
  const [activeTab, setActiveTab] = useState<'slots' | 'guide'>('slots');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggle = (id: string) => {
    setLocalSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleChange = (id: string, field: keyof AdSlotConfig, value: any) => {
    setLocalSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSave = () => {
    onUpdateAdSlots(localSlots);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>إدارة أماكن الإعلانات والربح المادي</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                جاهز لتحقيق الدخل
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              تحكم في ظهور الإعلانات، الروابط الربحية، وشريط رعاية قناة تيليجرام
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Success banner */}
      {savedSuccess && (
        <div className="bg-emerald-600 text-white text-xs font-bold py-2.5 px-4 text-center flex items-center justify-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>تم حفظ وتطبيق إعدادات الإعلانات بنجاح في التطبيق!</span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('slots')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'slots'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>أماكن الإعلانات في التطبيق (Ad Placements)</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'guide'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>دليل واستراتيجية تحقيق الأرباح للمترجم</span>
          </button>
        </div>

        {/* TAB 1: CONFIGURE SLOTS */}
        {activeTab === 'slots' && (
          <div className="flex flex-col gap-5">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
              <p className="text-xs text-slate-300">
                يمكنك تفعيل أو إيقاف أي مساحة إعلانية، وتعديل النص أو رابط الإعلان الخاص بك مباشرة.
              </p>
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التعديلات</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {localSlots.map((slot) => (
                <div
                  key={slot.id}
                  className={`bg-slate-900/80 border rounded-2xl p-5 transition-all ${
                    slot.enabled ? 'border-amber-500/40 shadow-lg shadow-amber-950/20' : 'border-slate-800/80 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{slot.title}</span>
                        {slot.enabled ? (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                            نشط ويعمل
                          </span>
                        ) : (
                          <span className="text-[10px] bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-bold">
                            معطل
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">{slot.description}</p>
                    </div>

                    <button
                      onClick={() => handleToggle(slot.id)}
                      className="p-1 text-slate-400 hover:text-white transition-colors"
                      title={slot.enabled ? 'إيقاف هذا الإعلان' : 'تفعيل هذا الإعلان'}
                    >
                      {slot.enabled ? (
                        <ToggleRight className="w-8 h-8 text-amber-400" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-slate-600" />
                      )}
                    </button>
                  </div>

                  {/* Form fields for this slot */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        عنوان الإعلان الرئيسي
                      </label>
                      <input
                        type="text"
                        value={slot.titleText || ''}
                        onChange={(e) => handleChange(slot.id, 'titleText', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                        placeholder="نص الإعلان..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        رابط التوجيه (الهدف عند الضغط)
                      </label>
                      <input
                        type="url"
                        value={slot.linkUrl || ''}
                        onChange={(e) => handleChange(slot.id, 'linkUrl', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                        placeholder="https://t.me/... أو رابط إعلانك"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        الوصف الفرعي للإعلان
                      </label>
                      <input
                        type="text"
                        value={slot.subText || ''}
                        onChange={(e) => handleChange(slot.id, 'subText', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                        placeholder="اكتب تفاصيل إضافية تحفز الزائر على الضغط..."
                      />
                    </div>

                    {slot.type === 'image_link' && (
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          رابط صورة البانر (Image URL)
                        </label>
                        <input
                          type="url"
                          value={slot.imageUrl || ''}
                          onChange={(e) => handleChange(slot.id, 'imageUrl', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                          placeholder="https://..."
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>حفظ وتطبيق التغييرات</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: MONETIZATION GUIDE */}
        {activeTab === 'guide' && (
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 leading-relaxed">
            <div>
              <h3 className="text-base font-bold text-amber-400 mb-2">
                دليل الربح من تطبيقك المترجم (أسرار المواقع الشهيرة):
              </h3>
              <p className="text-xs text-slate-300">
                بما أن المحتوى غير مرخص، فإن شبكة Google AdSense لن تقبله. لكن هذه 4 طرق مجربة ومربحة جداً يعتمد عليها آلاف المترجمين:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm mb-1.5">
                  <Coins className="w-4 h-4" />
                  <h4>1. أرباح سيرفرات المشاهدة (PPD)</h4>
                </div>
                <p className="text-xs text-slate-400">
                  عند رفع فيديوهاتك على مواقع مثل <strong>Streamwish</strong> و <strong>FileLions</strong>، يدفعون لك بين 10$ إلى 40$ لكل 1000 مشاهدة عبر مشغلهم المضمّن تلقائياً دون أي مجهود إضافي.
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-1.5">
                  <Megaphone className="w-4 h-4" />
                  <h4>2. شبكات Adsterra و PropellerAds</h4>
                </div>
                <p className="text-xs text-slate-400">
                  شبكات إعلانية عالمية تقبل منصات المسلسلات فوراً، تدفع لك بالدولار على كل زائر ونقرة في البانرات المجهزة في هذا التطبيق.
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-1.5">
                  <Link2 className="w-4 h-4" />
                  <h4>3. تقصير روابط التحميل المباشرة</h4>
                </div>
                <p className="text-xs text-slate-400">
                  زر "تحميل الحلقة" لكل حلقة يمكنك وضع رابط مختصر فيه، حيث ينتظر المشاهد 5 ثوانٍ قبل التنزيل وتربح أنت عن كل عملية تحميل.
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm mb-1.5">
                  <Sparkles className="w-4 h-4" />
                  <h4>4. اشتراكات VIP وقناة تيليجرام</h4>
                </div>
                <p className="text-xs text-slate-400">
                  استخدم شريط الرعاية العلوي لتوجيه المشاهدين لقناتك على تيليجرام، وتوفير اشتراك شهري رمزي لمن يريد مشاهدة الحلقات بدون إعلانات.
                </p>
              </div>
            </div>

            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-3 text-xs text-amber-200">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
              <span>
                <strong>نصيحة أمان:</strong> احتفظ دائماً بنسخة احتياطية من روابطك باستخدام زر التصدير (JSON) في لوحة المترجم، حتى لا يضيع تعبك ومجهودك أبداً.
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
