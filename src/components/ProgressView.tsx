import React, { useState } from 'react';
import {
  Award,
  Bookmark,
  Clock,
  Flame,
  Heart,
  History,
  Target,
  TrendingUp,
} from 'lucide-react';
import {
  InstrumentData,
  InstrumentId,
  LearningHistoryItem,
  LearnSubTab,
  MusicScore,
  QuizResultRecord,
  UserProfile,
} from '../types/karawi';

interface ProgressViewProps {
  profile: UserProfile;
  instruments: InstrumentData[];
  scores: MusicScore[];
  visitedInstruments: InstrumentId[];
  favoriteInstrumentIds: InstrumentId[];
  bookmarkedScoreIds: string[];
  history: LearningHistoryItem[];
  quizResults: QuizResultRecord[];
  onUpdateTargetMinutes: (minutes: number) => void;
  onOpenInstrumentDetail: (id: InstrumentId) => void;
  onOpenLearnScore: (instrumentId: InstrumentId) => void;
  onOpenLearnTab: (tab: LearnSubTab) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  profile,
  instruments,
  scores,
  visitedInstruments,
  favoriteInstrumentIds,
  bookmarkedScoreIds,
  history,
  quizResults,
  onUpdateTargetMinutes,
  onOpenInstrumentDetail,
  onOpenLearnScore,
  onOpenLearnTab,
}) => {
  const [sectionTab, setSectionTab] = useState<'ringkasan' | 'riwayat'>('ringkasan');

  const avgQuizScore =
    quizResults.length > 0
      ? Math.round(quizResults.reduce((acc, r) => acc + r.score, 0) / quizResults.length)
      : 0;

  const instrumentMasteryPct = Math.round((visitedInstruments.length / instruments.length) * 100);
  const overallProgress = Math.min(
    100,
    Math.round(instrumentMasteryPct * 0.55 + Math.min(100, history.length * 8) * 0.25 + avgQuizScore * 0.2)
  );
  const dailyPct = Math.min(100, Math.round((profile.todayMinutes / Math.max(5, profile.dailyTargetMinutes)) * 100));

  return (
    <div className="space-y-6">
      {/* Top Progress Header */}
      <div className="jambi-pattern-bg rounded-2xl p-6 text-[#FBF4E6] grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        <div className="md:col-span-7 space-y-2">
          <div className="text-xs font-semibold text-[#F0CB7D]">Statistik Pembelajaran Karawitan</div>
          <h1 className="text-2xl sm:text-3xl font-bold">Progres Belajar Anda</h1>
          <p className="text-sm text-[#EFE2CA]/85">
            Pantau penguasaan 8 instrumen tradisional Jambi, hasil evaluasi kuis, dan konsistensi target harian.
          </p>
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span>Penguasaan Keseluruhan</span>
              <span className="font-mono font-bold text-[#F5D78E] tabular-nums">{overallProgress}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-[#38070B] overflow-hidden">
              <div
                className="h-full bg-[#DFB054] rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-5 grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-[#38070B]/65 border border-[#DFB054]/30">
            <div className="flex items-center gap-1.5 text-xs text-[#F0CB7D]">
              <Flame className="w-4 h-4" /> Konsistensi
            </div>
            <div className="text-2xl font-bold font-mono mt-1 tabular-nums">{profile.streakDays} Hari</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#38070B]/65 border border-[#DFB054]/30">
            <div className="flex items-center gap-1.5 text-xs text-[#F0CB7D]">
              <Award className="w-4 h-4" /> Rata-rata Kuis
            </div>
            <div className="text-2xl font-bold font-mono mt-1 tabular-nums">
              {quizResults.length > 0 ? `${avgQuizScore}` : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#EFE2CA] rounded-xl overflow-x-auto">
        {(
          [
            { id: 'ringkasan', label: 'Progres & Target' },
            { id: 'riwayat', label: `Riwayat Belajar & Evaluasi (${history.length + quizResults.length})` },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSectionTab(t.id)}
            className={`min-h-[40px] px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-colors ${
              sectionTab === t.id ? 'bg-[#5B0E14] text-[#FBF4E6]' : 'text-[#553B2E]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {sectionTab === 'ringkasan' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* 8 Instruments Progress */}
          <div className="lg:col-span-7 bg-[#FFFBF3] border border-[#DFCCA8] rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#5B0E14] inline-flex items-center gap-2">
                <TrendingUp className="w-5 h-5" /> Progres 8 Instrumen
              </h2>
              <span className="text-xs font-mono text-[#63483A] tabular-nums">
                {visitedInstruments.length} / {instruments.length} dipelajari
              </span>
            </div>

            <div className="space-y-3">
              {instruments.map((inst) => {
                const visited = visitedInstruments.includes(inst.id);
                const actCount = history.filter((h) => h.instrumentId === inst.id).length;
                const pct = Math.min(100, (visited ? 40 : 0) + actCount * 20);
                return (
                  <button
                    key={inst.id}
                    type="button"
                    onClick={() => onOpenInstrumentDetail(inst.id)}
                    className="w-full text-left p-3 rounded-xl bg-[#F7EFE1] border border-[#DFCCA8] hover:border-[#C69032] transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-[#2B1810] mb-1.5">
                      <span>{inst.name}</span>
                      <span className="font-mono text-[#5B0E14] tabular-nums">{pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#EFE2CA] overflow-hidden">
                      <div
                        className="h-full bg-[#5B0E14] rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Daily Target & Recent Evaluation */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-[#FFFBF3] border border-[#DFCCA8] rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-[#5B0E14]">
                <Target className="w-5 h-5" />
                <h2 className="text-base font-bold">Target Belajar Harian</h2>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold font-mono text-[#2B1810] tabular-nums">
                  {profile.todayMinutes}{' '}
                  <span className="text-xs font-sans font-normal text-[#63483A]">
                    / {profile.dailyTargetMinutes} menit hari ini
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-[#9C6D1E] tabular-nums">{dailyPct}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-[#EFE2CA] overflow-hidden">
                <div className="h-full bg-[#C69032] rounded-full" style={{ width: `${dailyPct}%` }} />
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-[#553B2E] mb-2">
                  Ubah Target Harian (menit)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[15, 20, 30, 45].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => onUpdateTargetMinutes(m)}
                      className={`min-h-[38px] rounded-xl text-xs font-mono font-semibold border transition-colors ${
                        profile.dailyTargetMinutes === m
                          ? 'bg-[#5B0E14] text-[#FBF4E6] border-[#5B0E14]'
                          : 'bg-[#F7EFE1] text-[#553B2E] border-[#DFCCA8]'
                      }`}
                    >
                      {m}m
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#FFFBF3] border border-[#DFCCA8] rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#5B0E14]">Evaluasi Terbaru</h2>
                <button
                  type="button"
                  onClick={() => onOpenLearnTab('kuis')}
                  className="text-xs font-semibold text-[#5B0E14] hover:underline"
                >
                  Kerjakan Kuis →
                </button>
              </div>
              {quizResults.length === 0 ? (
                <p className="text-xs text-[#7B6052]">
                  Belum ada riwayat evaluasi. Mulai kuis untuk melihat perkembangan skor Anda.
                </p>
              ) : (
                <div className="divide-y divide-[#EFE2CA]">
                  {quizResults.slice(0, 3).map((qr) => (
                    <div key={qr.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-[#2B1810]">{qr.scope}</div>
                        <div className="text-[11px] text-[#7B6052]">{qr.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-base text-[#5B0E14] tabular-nums">{qr.score}</div>
                        <div className="text-[11px] text-[#63483A] tabular-nums">
                          {qr.correctCount}/{qr.totalQuestions} benar
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {sectionTab === 'riwayat' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-[#FFFBF3] border border-[#DFCCA8] rounded-2xl p-5 space-y-4">
            <h2 className="text-base font-bold text-[#5B0E14] inline-flex items-center gap-2">
              <History className="w-4 h-4" /> Riwayat Aktivitas Belajar
            </h2>
            {history.length === 0 ? (
              <p className="text-xs text-[#7B6052]">Belum ada aktivitas tercatat.</p>
            ) : (
              <div className="divide-y divide-[#EFE2CA]">
                {history.slice(0, 12).map((item) => (
                  <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold text-[#9C6D1E]">{item.module}</div>
                      <div className="text-sm font-medium text-[#2B1810]">{item.title}</div>
                    </div>
                    <span className="text-[11px] text-[#7B6052] whitespace-nowrap inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#FFFBF3] border border-[#DFCCA8] rounded-2xl p-5 space-y-4">
            <h2 className="text-base font-bold text-[#5B0E14] inline-flex items-center gap-2">
              <Award className="w-4 h-4" /> Riwayat Hasil Evaluasi
            </h2>
            {quizResults.length === 0 ? (
              <p className="text-xs text-[#7B6052]">Belum ada hasil evaluasi tersimpan.</p>
            ) : (
              <div className="divide-y divide-[#EFE2CA]">
                {quizResults.map((qr) => (
                  <div key={qr.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-[#2B1810]">{qr.scope}</div>
                      <div className="text-xs text-[#7B6052]">
                        {qr.date} · Durasi {qr.durationSec} detik
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-lg font-bold text-[#5B0E14] tabular-nums">{qr.score}</div>
                      <div className="text-[11px] text-[#63483A] tabular-nums">
                        {qr.correctCount}/{qr.totalQuestions} benar
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
