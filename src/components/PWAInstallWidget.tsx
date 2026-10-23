import React, { useState, useEffect } from 'react';
import { X, Download, Share2, PlusSquare, Smartphone, Monitor, Sparkles, CheckCircle2 } from 'lucide-react';

interface PWAInstallWidgetProps {
  isInstallable: boolean;
  isIOS: boolean;
  isInstalled: boolean;
  onInstall: () => Promise<'accepted' | 'dismissed' | 'manual'>;
  onDismiss: (hours?: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallWidget: React.FC<PWAInstallWidgetProps> = ({
  isInstallable,
  isIOS,
  isInstalled,
  onInstall,
  onDismiss,
  isOpen,
  onClose,
}) => {
  const [showIOSManualGuide, setShowIOSManualGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleMaybeLater();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen || isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSManualGuide(true);
      return;
    }

    if (isInstallable) {
      setIsInstalling(true);
      const result = await onInstall();
      setIsInstalling(false);
      if (result === 'accepted') {
        setInstallSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else if (result === 'dismissed') {
        onDismiss(24);
        onClose();
      }
    } else {
      // Fallback for browsers that don't emit beforeinstallprompt
      setShowIOSManualGuide(true);
    }
  };

  const handleMaybeLater = () => {
    onDismiss(24); // Don't show again for 24 hours
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-install-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in transition-all"
      style={{
        paddingTop: 'calc(1rem + env(safe-area-inset-top, 0px))',
        paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <div
        className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border-2 sm:border-4 border-amber-400 rounded-3xl p-5 sm:p-7 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col gap-4 text-slate-100 max-h-[calc(100dvh-32px)] overflow-y-auto select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button (×) */}
        <button
          onClick={handleMaybeLater}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-400"
          aria-label="Tutup dialog instalasi"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Confirmation state */}
        {installSuccess ? (
          <div className="py-8 flex flex-col items-center justify-center text-center gap-3 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-pixel text-emerald-300">BERHASIL TERINSTAL!</h3>
            <p className="text-xs font-silkscreen text-slate-300">
              Pixel Adventure siap dimainkan langsung dari home screen perangkatmu!
            </p>
          </div>
        ) : showIOSManualGuide ? (
          /* iOS Safari / Manual Installation Guide */
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-400 flex items-center justify-center text-amber-400 shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 id="pwa-install-title" className="text-base sm:text-lg font-pixel text-amber-300">
                  CARA INSTAL PWA
                </h3>
                <p className="text-[11px] font-silkscreen text-slate-400">
                  {isIOS ? 'Untuk iPhone / iPad (Safari)' : 'Petunjuk Browser Manual'}
                </p>
              </div>
            </div>

            {/* Step by Step instructions */}
            <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-4 flex flex-col gap-3 font-silkscreen text-xs text-slate-200">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-pixel text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <p className="flex-1">
                  Tekan ikon <strong className="text-amber-300 inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded bg-slate-800"><Share2 className="w-3.5 h-3.5" /> Share</strong> pada toolbar browser Safari (bagian bawah layar).
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-pixel text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <p className="flex-1">
                  Gulir ke bawah dan pilih opsi <strong className="text-amber-300 inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded bg-slate-800"><PlusSquare className="w-3.5 h-3.5" /> Add to Home Screen</strong>.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-pixel text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <p className="flex-1">
                  Tekan tombol <strong className="text-amber-300">Add</strong> di sudut kanan atas untuk menyelesaikan instalasi.
                </p>
              </div>
            </div>

            {/* Done button */}
            <button
              onClick={() => {
                setShowIOSManualGuide(false);
                onClose();
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-pixel text-xs sm:text-sm font-bold shadow-lg transition"
            >
              MENGERTI, TERIMA KASIH!
            </button>
          </div>
        ) : (
          /* Standard Professional PWA Install Card */
          <>
            {/* Header: App Icon + Titles */}
            <div className="flex items-center gap-4">
              {/* App Icon */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900 border-2 sm:border-3 border-amber-400 p-2 shadow-xl flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  src="/icon.svg"
                  alt="Pixel Adventure Icon"
                  className="w-full h-full object-contain pixel-art drop-shadow"
                />
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-amber-300 animate-spin" />
              </div>

              {/* Title & Badge */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-pixel px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    OFFLINE READY
                  </span>
                  <span className="text-[9px] font-pixel px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                    60 FPS
                  </span>
                </div>
                <h3 id="pwa-install-title" className="text-lg sm:text-xl font-pixel text-amber-300 drop-shadow-[0_2px_0_#78350f]">
                  Install Game App
                </h3>
                <span className="text-[11px] font-pixel text-slate-300 opacity-90">
                  Pixel Adventure: The Game
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs font-silkscreen text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
              Install game ini di perangkatmu untuk akses lebih cepat, layar penuh tanpa bilah browser, dan pengalaman bermain yang lebih nyaman serta lancar.
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-pixel text-slate-400">
              <div className="flex items-center gap-1.5 bg-slate-800/40 px-2.5 py-1.5 rounded-xl border border-slate-700/50">
                <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                <span>Full Screen</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/40 px-2.5 py-1.5 rounded-xl border border-slate-700/50">
                <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                <span>Low Latency</span>
              </div>
            </div>

            {/* Action Buttons: Install Now & Maybe Later */}
            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={handleInstallClick}
                disabled={isInstalling}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 border-b-4 border-green-800 active:border-b-0 active:translate-y-1 text-white font-pixel text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl transition disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isInstalling ? 'MEMPROSES...' : 'INSTALL NOW'}</span>
              </button>

              <button
                onClick={handleMaybeLater}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 font-pixel text-[11px] flex items-center justify-center transition active:scale-95"
              >
                <span>MAYBE LATER</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
