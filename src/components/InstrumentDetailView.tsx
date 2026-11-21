import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Download,
  FileMusic,
  Heart,
  Play,
  ShieldCheck,
  Sparkles,
  Target,
  Volume2,
} from 'lucide-react';
import { InstrumentData, InstrumentNote, LearnSubTab, UserRole } from '../types/karawi';
import { karawiAudio } from '../utils/audioEngine';
import { InstrumentIllustration } from './InstrumentVisuals';

interface InstrumentDetailViewProps {
  instrument: InstrumentData;
  isFavorite: boolean;
  isOfflineSaved: boolean;
  userRole: UserRole;
  onBack: () => void;
  onToggleFavorite: () => void;
  onToggleOffline: () => void;
  onOpenLearnModule: (subTab: LearnSubTab) => void;
  onUpdateValidation?: (status: InstrumentData['validationStatus'], note: string) => void;
}

type DetailTab = 'ringkasan' | 'sejarah' | 'bagian-teknik' | 'nada';

export const InstrumentDetailView: React.FC<InstrumentDetailViewProps> = ({
  instrument,
  isFavorite,
  isOfflineSaved,
  userRole,
  onBack,
  onToggleFavorite,
  onToggleOffline,
  onOpenLearnModule,
  onUpdateValidation,
}) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('ringkasan');
  const [playingNoteId, setPlayingNoteId] = useState<string | null>(null);
  const [valStatus, setValStatus] = useState<InstrumentData['validationStatus']>(instrument.validationStatus);
  const [valNote, setValNote] = useState(instrument.validatorNote || '');
  const [valSavedFeedback, setValSavedFeedback] = useState(false);

  const handlePlayNote = (note: InstrumentNote) => {
    karawiAudio.playNote(note, instrument.soundProfile);
    setPlayingNoteId(note.id);
    window.setTimeout(() => setPlayingNoteId((curr) => (curr === note.id ? null : curr)), 320);
  };

  const handleSaveValidation = () => {
    if (!onUpdateValidation) return;
    onUpdateValidation(valStatus, valNote);
    setValSavedFeedback(true);
    window.setTimeout(() => setValSavedFeedback(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header strip */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#FFFBF3] border border-[#DFCCA8] text-sm font-medium text-[#2B1810] hover:bg-[#EFE2CA] transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke 8 Instrumen</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleOffline}
            className={`min-h-[44px] px-3.5 py-2 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
              isOfflineSaved
                ? 'bg-[#5B0E14] text-[#FBF4E6] border-[#5B0E14]'
                : 'bg-[#FFFBF3] text-[#553B2E] border-[#DFCCA8] hover:bg-[#EFE2CA]'
            }`}
            title="Simpan untuk mode offline"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">{isOfflineSaved ? 'Tersimpan Offline' : 'Simpan Offline'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleFavorite}
            className={`min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl border inline-flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors ${
              isFavorite
                ? 'bg-[#F5E1E3] text-[#5B0E14] border-[#5B0E14]/40'
                : 'bg-[#FFFBF3] text-[#553B2E] border-[#DFCCA8] hover:bg-[#EFE2CA]'
            }`}
            aria-label={isFavorite ? 'Hapus dari favorit' : 'Simpan ke favorit'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#5B0E14] text-[#5B0E14]' : ''}`} />
            <span className="hidden sm:inline">{isFavorite ? 'Difavoritkan' : 'Favorit'}</span>
          </button>
        </div>
      </div>

      {/* Hero visual + Quick launch */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-5 bg-[#FFFBF3] border border-[#DFCCA8] rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <InstrumentIllustration instrumentId={instrument.id} className="w-full max-w-[280px] h-40" />
          <div className="mt-4 flex items-center gap-2 text-xs text-[#7B6052]">
            <span>{instrument.category}</span>
            <span aria-hidden="true">·</span>
            <span>{instrument.notes.length} Nada / Bunyi</span>
            <span aria-hidden="true">·</span>
            <span
              className={
                instrument.validationStatus === 'Tervalidasi'
                  ? 'text-emerald-800 font-semibold'
                  : 'text-[#9C6D1E] font-semibold'
              }
            >
              {instrument.validationStatus}
            </span>
          </div>
        </div>

        <div className="lg:col-span-7 bg-[#FFFBF3] border border-[#DFCCA8] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-[#9C6D1E] mb-1">Instrumen Karawitan Jambi</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#5B0E14] mb-2">{instrument.name}</h1>
            <p className="text-sm font-medium text-[#2B1810] mb-3">{instrument.tagline}</p>
            <p className="text-sm text-[#553B2E] leading-relaxed">{instrument.description}</p>
          </div>

          <div className="mt-6 pt-5 border-t border-[#EFE2CA] grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              type="button"
              onClick={() => onOpenLearnModule('simulasi')}
              className="min-h-[44px] px-3 py-2.5 rounded-xl bg-[#5B0E14] text-[#FBF4E6] text-xs font-semibold hover:bg-[#76161E] transition-colors flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              Simulasi
            </button>
            <button
              type="button"
              onClick={() => onOpenLearnModule('partitur')}
              className="min-h-[44px] px-3 py-2.5 rounded-xl bg-[#EFE2CA] text-[#2B1810] text-xs font-semibold hover:bg-[#DFCCA8] transition-colors flex items-center justify-center gap-1.5"
            >
              <FileMusic className="w-3.5 h-3.5" />
              Partitur
            </button>
            <button
              type="button"
              onClick={() => onOpenLearnModule('latihan')}
              className="min-h-[44px] px-3 py-2.5 rounded-xl bg-[#EFE2CA] text-[#2B1810] text-xs font-semibold hover:bg-[#DFCCA8] transition-colors flex items-center justify-center gap-1.5"
            >
              <Target className="w-3.5 h-3.5" />
              Latihan
            </button>
            <button
              type="button"
              onClick={() => onOpenLearnModule('kuis')}
              className="min-h-[44px] px-3 py-2.5 rounded-xl bg-[#EFE2CA] text-[#2B1810] text-xs font-semibold hover:bg-[#DFCCA8] transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Kuis Alat
            </button>
          </div>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#EFE2CA] rounded-xl overflow-x-auto">
        {(
          [
            { id: 'ringkasan', label: 'Ciri Khas & Fungsi' },
            { id: 'sejarah', label: 'Sejarah & Budaya' },
            { id: 'bagian-teknik', label: 'Bagian & Teknik Dasar' },
            { id: 'nada', label: `Daftar Nada (${instrument.notes.length})` },
          ] as { id: DetailTab; label: string }[]
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`min-h-[40px] px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-colors ${
              activeTab === tab.id
                ? 'bg-[#5B0E14] text-[#FBF4E6]'
                : 'text-[#553B2E] hover:text-[#2B1810]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-[#FFFBF3] border border-[#DFCCA8] rounded-2xl p-5 sm:p-6">
        {activeTab === 'ringkasan' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#5B0E14]">Fungsi dalam Pertunjukan</h3>
              <p className="text-sm text-[#553B2E] leading-relaxed">{instrument.culturalFunction}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#5B0E14]">Karakteristik Suara</h3>
              <p className="text-sm text-[#553B2E] leading-relaxed">{instrument.soundCharacteristics}</p>
            </div>
            {instrument.validatorNote && (
              <div className="md:col-span-2 pt-4 border-t border-[#EFE2CA] flex items-start gap-2.5 text-xs text-[#63483A]">
                <ShieldCheck className="w-4 h-4 text-[#9C6D1E] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#2B1810]">Catatan Validasi Narasumber: </span>
                  {instrument.validatorNote}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'sejarah' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#5B0E14]">
              <BookOpen className="w-5 h-5" />
              <h3 className="text-lg font-bold">Sejarah & Asal-Usul {instrument.name}</h3>
            </div>
            <p className="text-sm sm:text-base text-[#553B2E] leading-relaxed">{instrument.history}</p>
            <div className="pt-4 border-t border-[#EFE2CA]">
              <h4 className="text-sm font-bold text-[#2B1810] mb-1.5">Peran Sosial & Budaya Jambi</h4>
              <p className="text-sm text-[#553B2E] leading-relaxed">{instrument.culturalFunction}</p>
            </div>
          </div>
        )}

        {activeTab === 'bagian-teknik' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-base font-bold text-[#5B0E14] mb-3">Bagian-Bagian Alat Musik</h3>
              <div className="divide-y divide-[#EFE2CA]">
                {instrument.parts.map((part, idx) => (
                  <div key={idx} className="py-3 first:pt-0 last:pb-0">
                    <div className="text-sm font-semibold text-[#2B1810]">{part.name}</div>
                    <p className="text-xs text-[#63483A] mt-0.5 leading-relaxed">{part.function}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#5B0E14] mb-3">Teknik Dasar Permainan</h3>
              <ol className="space-y-3">
                {instrument.basicTechniques.map((tech, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[#553B2E] leading-relaxed">
                    <span className="w-6 h-6 rounded-full bg-[#EFE2CA] text-[#5B0E14] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{tech}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {activeTab === 'nada' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-[#5B0E14]">Daftar Nada & Contoh Suara</h3>
                <p className="text-xs text-[#63483A]">Ketuk setiap kartu nada untuk mendengarkan karakter suara {instrument.name}.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  instrument.notes.forEach((n, idx) => {
                    window.setTimeout(() => handlePlayNote(n), idx * 420);
                  });
                }}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-[#5B0E14] text-[#FBF4E6] text-xs font-semibold hover:bg-[#76161E] inline-flex items-center gap-1.5"
              >
                <Volume2 className="w-4 h-4" />
                Putar Semua Nada
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {instrument.notes.map((note) => {
                const isPlaying = playingNoteId === note.id;
                return (
                  <button
                    key={note.id}
                    type="button"
                    onClick={() => handlePlayNote(note)}
                    className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3.5 ${
                      isPlaying
                        ? 'bg-[#5B0E14] text-[#FBF4E6] border-[#5B0E14] scale-[0.99]'
                        : 'bg-[#F7EFE1] text-[#2B1810] border-[#DFCCA8] hover:border-[#C69032]'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-full font-mono font-bold text-base flex items-center justify-center shrink-0 ${
                        isPlaying ? 'bg-[#DFB054] text-[#38070B]' : 'bg-[#FFFBF3] text-[#5B0E14] border border-[#DFCCA8]'
                      }`}
                    >
                      {note.label}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold truncate">{note.name}</div>
                      <div className={`text-xs truncate ${isPlaying ? 'text-[#EFE2CA]' : 'text-[#63483A]'}`}>
                        {note.description}
                      </div>
                      <div className={`text-[11px] font-mono mt-0.5 ${isPlaying ? 'text-[#F0CB7D]' : 'text-[#9C6D1E]'}`}>
                        {Math.round(note.frequency)} Hz · Tombol [{note.keyHint}]
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Inline Validator Panel if logged in as Dosen / Praktisi Karawitan */}
      {userRole === 'validator' && onUpdateValidation && (
        <div className="bg-[#FFFBF3] border border-[#C69032] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[#5B0E14]">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-base font-bold">Panel Validasi Dosen / Praktisi Karawitan</h3>
            </div>
            {valSavedFeedback && (
              <span className="text-xs font-semibold text-emerald-800 inline-flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Tersimpan
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#553B2E] mb-1">Status Validasi</label>
              <select
                value={valStatus}
                onChange={(e) => setValStatus(e.target.value as InstrumentData['validationStatus'])}
                className="w-full min-h-[42px] px-3 rounded-xl bg-[#F7EFE1] border border-[#DFCCA8] text-sm text-[#2B1810]"
              >
                <option value="Tervalidasi">Tervalidasi</option>
                <option value="Menunggu Validasi">Menunggu Validasi</option>
                <option value="Perlu Revisi">Perlu Revisi</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#553B2E] mb-1">Catatan Akademik / Budaya</label>
              <input
                type="text"
                value={valNote}
                onChange={(e) => setValNote(e.target.value)}
                placeholder="Tambahkan catatan validasi susunan nada atau sejarah..."
                className="w-full min-h-[42px] px-3 rounded-xl bg-[#F7EFE1] border border-[#DFCCA8] text-sm text-[#2B1810]"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleSaveValidation}
            className="min-h-[42px] px-5 py-2 rounded-xl bg-[#5B0E14] text-[#FBF4E6] text-xs font-semibold hover:bg-[#76161E]"
          >
            Simpan Status Validasi
          </button>
        </div>
      )}
    </div>
  );
};
