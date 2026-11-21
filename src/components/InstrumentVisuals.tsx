import React, { useState } from 'react';
import { InstrumentData, InstrumentId, InstrumentNote } from '../types/karawi';

export const INSTRUMENT_IMAGES: Record<InstrumentId, string> = {
  'kalinong-hias': '/src/assets/images/kalinong_hias_1795180184353.jpg',
  'kalinong-melodi': '/src/assets/images/kalinong_melodi_1795180183168.jpg',
  'kalinong-jalan': '/src/assets/images/kalinong_jalan_1795180184010.jpg',
  'kalinong-penegas': '/src/assets/images/kalinong_penegas_1795180184085.jpg',
  gong: '/src/assets/images/gong_jambi_1795180183288.jpg',
  'gendang-melayu': '/src/assets/images/gendang_melayu_1795180184014.jpg',
  'gendang-sike': '/src/assets/images/gendang_sike_1795180183180.jpg',
  tetawak: '/src/assets/images/tetawak_jambi_1795180184058.jpg',
};

interface HotspotCoord {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  size?: 'sm' | 'md' | 'lg';
}

const NOTE_HOTSPOTS: Record<string, HotspotCoord> = {
  // Kalinong Hias (6 kettles in 1 row)
  'kh-1': { x: 17.5, y: 49, size: 'sm' },
  'kh-2': { x: 30.5, y: 49, size: 'sm' },
  'kh-3': { x: 43.5, y: 49, size: 'sm' },
  'kh-5': { x: 56.5, y: 49, size: 'sm' },
  'kh-6': { x: 69.5, y: 49, size: 'sm' },
  'kh-i': { x: 82.5, y: 49, size: 'sm' },

  // Kalinong Melodi (8 kettles in 2 rows of 4)
  'km-1': { x: 21, y: 46, size: 'sm' },
  'km-2': { x: 40, y: 46, size: 'sm' },
  'km-3': { x: 60, y: 46, size: 'sm' },
  'km-4': { x: 79, y: 46, size: 'sm' },
  'km-5': { x: 23, y: 28, size: 'sm' },
  'km-6': { x: 41, y: 28, size: 'sm' },
  'km-7': { x: 59, y: 28, size: 'sm' },
  'km-i': { x: 77, y: 28, size: 'sm' },

  // Kalinong Jalan (5 hanging gongs in 1 row)
  'kj-1': { x: 19, y: 60, size: 'sm' },
  'kj-2': { x: 34.5, y: 60, size: 'sm' },
  'kj-3': { x: 50, y: 60, size: 'sm' },
  'kj-5': { x: 65.5, y: 60, size: 'sm' },
  'kj-6': { x: 81, y: 60, size: 'sm' },

  // Kalinong Penegas (4 large kettles in 1 row)
  'kp-1': { x: 19, y: 41, size: 'md' },
  'kp-3': { x: 39.5, y: 41, size: 'md' },
  'kp-5': { x: 60.5, y: 41, size: 'md' },
  'kp-6': { x: 81, y: 41, size: 'md' },

  // Gong (central boss, upper shoulder, right rim)
  'gg-boss': { x: 50, y: 58, size: 'lg' },
  'gg-soft': { x: 40, y: 47, size: 'md' },
  'gg-rim': { x: 61, y: 58, size: 'md' },

  // Gendang Melayu (left large membrane center, upper edge, right accent head)
  'gm-dung': { x: 26, y: 52, size: 'lg' },
  'gm-tak': { x: 30, y: 26, size: 'md' },
  'gm-pak': { x: 78, y: 52, size: 'md' },

  // Gendang Sike (center membrane Bum, left rim Ting, right rim Tek)
  'gs-bum': { x: 50, y: 34, size: 'lg' },
  'gs-ting': { x: 25, y: 36, size: 'md' },
  'gs-tek': { x: 75, y: 36, size: 'md' },

  // Tetawak (left main gong boss, right high gong boss, rim)
  'tw-boss': { x: 37, y: 60, size: 'lg' },
  'tw-high': { x: 63, y: 60, size: 'lg' },
  'tw-rim': { x: 72, y: 46, size: 'sm' },
};

export const KarawiEmblem: React.FC<{ className?: string; size?: 'sm' | 'md' | 'lg' }> = ({
  className = '',
  size = 'md',
}) => {
  const dims = size === 'sm' ? 'w-9 h-9' : size === 'lg' ? 'w-20 h-20' : 'w-12 h-12';
  return (
    <svg viewBox="0 0 100 100" className={`${dims} ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id="jambiGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5D78E" />
          <stop offset="50%" stopColor="#D49E3D" />
          <stop offset="100%" stopColor="#9B6B1B" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="#3D080C" stroke="url(#jambiGold)" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="40" fill="none" stroke="url(#jambiGold)" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.7" />
      <path
        d="M50 15 C55 24, 62 28, 70 28 C64 34, 62 39, 63 44 L37 44 C38 39, 36 34, 30 28 C38 28, 45 24, 50 15 Z"
        fill="url(#jambiGold)"
      />
      <circle cx="50" cy="32" r="3.5" fill="#4A0B10" />
      <rect x="20" y="56" width="60" height="10" rx="3" fill="#7A3E1D" stroke="url(#jambiGold)" strokeWidth="1.5" />
      <rect x="25" y="66" width="6" height="10" rx="1.5" fill="#632E12" />
      <rect x="69" y="66" width="6" height="10" rx="1.5" fill="#632E12" />
      {[30, 43, 57, 70].map((cx, i) => (
        <g key={i}>
          <ellipse cx={cx} cy="55" rx="6.5" ry="4" fill="url(#jambiGold)" />
          <circle cx={cx} cy="52" r="2.2" fill="#FFF3C8" />
        </g>
      ))}
    </svg>
  );
};

export const InstrumentIllustration: React.FC<{
  instrumentId: InstrumentId;
  className?: string;
}> = ({ instrumentId, className = 'w-full h-28' }) => {
  const [imgError, setImgError] = useState(false);
  const src = INSTRUMENT_IMAGES[instrumentId];

  if (imgError) {
    return (
      <div
        className={`${className} rounded-xl bg-gradient-to-br from-[#EFE2CA] to-[#DFCCA8] flex items-center justify-center text-xs font-semibold text-[#5B0E14] p-2 text-center`}
      >
        {instrumentId.replace('-', ' ')}
      </div>
    );
  }

  return (
    <div className={`${className} rounded-xl overflow-hidden bg-[#F5EAD6]`}>
      <img
        src={src}
        alt={`Alat musik tradisional Jambi ${instrumentId.replace('-', ' ')}`}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

interface InteractiveStageProps {
  instrument: InstrumentData;
  activeNoteId: string | null;
  guidedNoteId?: string | null;
  showKeyHints: boolean;
  onTriggerNote: (note: InstrumentNote) => void;
}

export const InteractiveInstrumentStage: React.FC<InteractiveStageProps> = ({
  instrument,
  activeNoteId,
  guidedNoteId,
  showKeyHints,
  onTriggerNote,
}) => {
  const imgSrc = INSTRUMENT_IMAGES[instrument.id];

  return (
    <div className="space-y-3">
      {/* Photorealistic Interactive Instrument Canvas */}
      <div className="relative mx-auto max-w-3xl rounded-2xl overflow-hidden border-2 border-[#C69032]/70 bg-[#F3E7D1] shadow-lg select-none">
        <div className="relative w-full aspect-video">
          <img
            src={imgSrc}
            alt={`Simulasi interaktif ${instrument.name}`}
            referrerPolicy="no-referrer"
            draggable={false}
            className="w-full h-full object-cover pointer-events-none"
          />

          {/* Subtle top instruction scrim */}
          <div className="pointer-events-none absolute top-0 inset-x-0 bg-gradient-to-b from-[#2B1810]/65 via-[#2B1810]/25 to-transparent px-4 py-2.5 flex items-center justify-between text-[11px] sm:text-xs text-[#FFFBF3]">
            <span className="font-medium">
              Ketuk langsung bagian {instrument.name} pada gambar untuk membunyikan nada
            </span>
            <span className="hidden sm:inline font-mono text-[#F5D78E]">
              {instrument.notes.length} Titik Nada
            </span>
          </div>

          {/* Precision-Aligned Interactive Touch Hotspots over the real instrument */}
          {instrument.notes.map((note, idx) => {
            const coord = NOTE_HOTSPOTS[note.id] || {
              x: 15 + (idx / Math.max(1, instrument.notes.length - 1)) * 70,
              y: 52,
              size: 'sm',
            };
            const isActive = activeNoteId === note.id;
            const isGuided = guidedNoteId === note.id;

            const sizeClasses =
              coord.size === 'lg'
                ? 'w-14 h-14 sm:w-20 sm:h-20'
                : coord.size === 'md'
                ? 'w-12 h-12 sm:w-16 sm:h-16'
                : 'w-10 h-10 sm:w-13 sm:h-13';

            return (
              <button
                key={note.id}
                type="button"
                onPointerDown={() => onTriggerNote(note)}
                style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 ${sizeClasses} rounded-full flex items-center justify-center transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-[#F5D78E] ${
                  isActive ? 'scale-90' : 'hover:scale-110 active:scale-90'
                }`}
                aria-label={`Mainkan ${note.name}`}
                title={`${note.name}${showKeyHints ? ` (Tombol ${note.keyHint})` : ''}`}
              >
                {/* Expanding golden ripple on strike */}
                {isActive && (
                  <span className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#FFF3C4] bg-[#DFB054]/35 animate-gong-ripple" />
                )}

                {/* Guided mode target ring */}
                {isGuided && (
                  <span className="pointer-events-none absolute -inset-1.5 rounded-full border-2 border-[#F5D78E] shadow-[0_0_18px_rgba(245,215,142,0.95)]" />
                )}

                {/* Translucent tactile target marker so real bronze/skin texture shines through */}
                <span
                  className={`w-full h-full rounded-full border-2 flex flex-col items-center justify-center transition-all ${
                    isActive
                      ? 'bg-[#5B0E14]/85 border-[#FFF3C4] text-[#F5D78E] shadow-[0_0_24px_rgba(245,215,142,0.9)]'
                      : isGuided
                      ? 'bg-[#5B0E14]/70 border-[#F5D78E] text-[#FFFBF3]'
                      : 'bg-[#2B1810]/45 hover:bg-[#5B0E14]/70 border-[#F5D78E]/80 text-[#FFFBF3] backdrop-blur-[1px]'
                  }`}
                >
                  <span className="font-mono font-bold text-xs sm:text-sm leading-none">
                    {note.label}
                  </span>
                  {showKeyHints && (
                    <span className="hidden sm:block text-[9px] font-mono text-[#F5D78E]/90 leading-none mt-0.5">
                      {note.keyHint}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick-tap note legend strip below photo for clarity & thumb accessibility */}
      <div className="mx-auto max-w-3xl flex items-center gap-2 overflow-x-auto pb-1">
        {instrument.notes.map((note) => {
          const isActive = activeNoteId === note.id;
          const isGuided = guidedNoteId === note.id;
          return (
            <button
              key={note.id}
              type="button"
              onPointerDown={() => onTriggerNote(note)}
              className={`min-h-[42px] px-3 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap shrink-0 transition-all inline-flex items-center gap-2 ${
                isActive
                  ? 'bg-[#5B0E14] text-[#F5D78E] border-[#C69032] scale-95'
                  : isGuided
                  ? 'bg-[#FFF6DE] text-[#5B0E14] border-[#C69032] ring-1 ring-[#C69032]'
                  : 'bg-[#F7EFE1] text-[#2B1810] border-[#DFCCA8] hover:border-[#C69032]'
              }`}
            >
              <span className="font-mono font-bold">{note.label}</span>
              <span className="text-[11px] opacity-85">{note.name.split(' ')[0]}</span>
              {showKeyHints && (
                <span className="text-[10px] font-mono opacity-65">[{note.keyHint}]</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
