import React, { useState } from 'react';
import { Lock, KeyRound, CheckCircle2, AlertCircle, X, ShieldCheck, Eye, EyeOff } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPin, setShowPin] = useState(false);
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [changeSuccess, setChangeSuccess] = useState(false);

  if (!isOpen) return null;

  const getStoredPin = () => {
    try {
      return localStorage.getItem('cinemahub_admin_pin') || '1234';
    } catch {
      return '1234';
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = getStoredPin();

    if (pin.trim() === correctPin) {
      setError(null);
      onSuccess();
      onClose();
    } else {
      setError('رمز المرور غير صحيح! الرمز الافتراضي هو 1234.');
    }
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = getStoredPin();

    if (currentPinInput.trim() !== correctPin) {
      setError('الرمز الحالي غير صحيح!');
      return;
    }

    if (newPinInput.trim().length < 4) {
      setError('يجب أن يتكون الرمز الجديد من 4 أرقام أو أحرف على الأقل.');
      return;
    }

    try {
      localStorage.setItem('cinemahub_admin_pin', newPinInput.trim());
      setChangeSuccess(true);
      setError(null);
      setTimeout(() => {
        setIsChangingPin(false);
        setChangeSuccess(false);
        setPin(newPinInput.trim());
      }, 1500);
    } catch {
      setError('تعذر حفظ الرمز الجديد.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-right">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute left-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-600/30">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              {isChangingPin ? 'تغيير رمز مرور المترجم' : 'بوابة المترجم والمشرف'}
            </h3>
            <p className="text-xs text-slate-400">
              {isChangingPin
                ? 'قم بتعيين رمز سري جديد لحماية لوحة التحكم'
                : 'محمية برمز مرور لمنع الزوار والمشاهدين من التعديل'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs p-3 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {changeSuccess && (
          <div className="mb-4 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs p-3 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>تم تغيير رمز المرور بنجاح!</span>
          </div>
        )}

        {!isChangingPin ? (
          /* LOGIN FORM */
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                أدخل رمز المرور السري (PIN):
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="أدخل الرمز هنا (الافتراضي 1234)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:border-rose-500 focus:outline-none tracking-widest pl-10"
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>الرمز الافتراضي هو: <strong className="text-amber-400 font-mono">1234</strong></span>
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>دخول لوحة تحكم المترجم</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setIsChangingPin(true);
                }}
                className="text-slate-400 hover:text-rose-400 text-xs py-1 transition-colors"
              >
                هل تريد تغيير رمز المرور؟
              </button>
            </div>
          </form>
        ) : (
          /* CHANGE PIN FORM */
          <form onSubmit={handleChangePin} className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">الرمز الحالي:</label>
              <input
                type="password"
                value={currentPinInput}
                onChange={(e) => setCurrentPinInput(e.target.value)}
                placeholder="الرمز الحالي (افتراضياً 1234)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-rose-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">الرمز الجديد:</label>
              <input
                type="password"
                value={newPinInput}
                onChange={(e) => setNewPinInput(e.target.value)}
                placeholder="رمز جديد من 4 خانات على الأقل"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-rose-500 focus:outline-none"
                required
              />
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setIsChangingPin(false);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:bg-slate-700"
              >
                رجوع
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30"
              >
                حفظ الرمز الجديد
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
