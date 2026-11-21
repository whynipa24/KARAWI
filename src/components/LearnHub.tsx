import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Award,
  Bookmark,
  BookOpen,
  CheckCircle2,
  Download,
  FileMusic,
  Headphones,
  Lightbulb,
  Pause,
  Play,
  Repeat,
  RotateCcw,
  Search,
  Sparkles,
  Square,
  Target,
  Volume2,
  XCircle,
} from 'lucide-react';
import {
  AppSettings,
  CulturalArticle,
  DifficultyLevel,
  InstrumentData,
  InstrumentId,
  InstrumentNote,
  LearnSubTab,
  MusicScore,
  PlayingPattern,
  QuizQuestion,
  QuizResultRecord,
} from '../types/karawi';
import { karawiAudio } from '../utils/audioEngine';
import { InteractiveInstrumentStage } from './InstrumentVisuals';
import { SheetMusicRenderer } from './SheetMusicRenderer';

interface LearnHubProps {
  activeSubTab: LearnSubTab;
  onChangeSubTab: (tab: LearnSubTab) => void;
  selectedInstrumentId: InstrumentId;
  onSelectInstrument: (id: InstrumentId) => void;
  instruments: InstrumentData[];
  scores: MusicScore[];
  patterns: PlayingPattern[];
  quizQuestions: QuizQuestion[];
  articles: CulturalArticle[];
  bookmarkedScoreIds: string[];
  offlineIds: string[];
  settings: AppSettings;
  onUpdateSettings: (patch: Partial<AppSettings>) => void;
  onToggleBookmarkScore: (scoreId: string) => void;
  onToggleOffline: (id: string) => void;
  onRecordActivity: (
    module: 'Simulasi' | 'Partitur' | 'Pola Permainan' | 'Latihan Mandiri' | 'Kuis' | 'Perpustakaan',
    title: string,
    instrumentId?: InstrumentId
  ) => void;
  onSaveQuizResult: (record: QuizResultRecord) => void;
  onOpenInstrumentDetail: (id: InstrumentId) => void;
}

const SUB_TABS: { id: LearnSubTab; label: string }[] = [
  { id: 'simulasi', label: 'Simulasi' },
  { id: 'partitur', label: 'Partitur & Audio' },
  { id: 'latihan', label: 'Latihan Mandiri' },
  { id: 'kuis', label: 'Kuis & Evaluasi' },
  { id: 'perpustakaan', label: 'Perpustakaan' },
];

export const LearnHub: React.FC<LearnHubProps> = ({
  activeSubTab,
  onChangeSubTab,
  selectedInstrumentId,
  onSelectInstrument,
  instruments,
  scores,
  patterns,
  quizQuestions,
  articles,
  bookmarkedScoreIds,
  offlineIds,
  settings,
  onUpdateSettings,
  onToggleBookmarkScore,
  onToggleOffline,
  onRecordActivity,
  onSaveQuizResult,
  onOpenInstrumentDetail,
}) => {
  const currentInstrument = useMemo(
    () => instruments.find((i) => i.id === selectedInstrumentId) || instruments[0],
    [instruments, selectedInstrumentId]
  );

  return (
    <div className="space-y-5">
      {/* Module Sub-Navigation */}
      <div className="flex items-center gap-1 p-1 bg-[#EFE2CA] rounded-xl overflow-x-auto">
        {SUB_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChangeSubTab(tab.id)}
            className={`min-h-[40px] px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-colors ${
              activeSubTab === tab.id
                ? 'bg-[#5B0E14] text-[#FBF4E6]'
                : 'text-[#553B2E] hover:text-[#2B1810]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grouped Instrument Selector: Kalinong (4 Jenis), Gendang (2 Jenis), Gong, Tetawak */}
      {activeSubTab !== 'perpustakaan' && (() => {
        const kalinongInstruments = instruments.filter((i) => i.category === 'Kalinong');
        const gendangInstruments = instruments.filter((i) => i.category === 'Gendang');
        const metalInstruments = instruments.filter((i) => i.category === 'Perkusi Logam');
        const isKalinongSelected = currentInstrument.category === 'Kalinong';
        const isGendangSelected = currentInstrument.category === 'Gendang';

        return (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => {
                  if (!isKalinongSelected && kalinongInstruments[0]) {
                    onSelectInstrument(kalinongInstruments[0].id);
                  }
                }}
                className={`min-h-[40px] px-4 py-2 rounded-xl border text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  isKalinongSelected
                    ? 'bg-[#5B0E14] text-[#FBF4E6] border-[#5B0E14]'
                    : 'bg-[#FFFBF3] text-[#553B2E] border-[#DFCCA8] hover:border-[#C69032]'
                }`}
              >
                Kalinong ({kalinongInstruments.length} Jenis)
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!isGendangSelected && gendangInstruments[0]) {
                    onSelectInstrument(gendangInstruments[0].id);
                  }
                }}
                className={`min-h-[40px] px-4 py-2 rounded-xl border text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  isGendangSelected
                    ? 'bg-[#5B0E14] text-[#FBF4E6] border-[#5B0E14]'
                    : 'bg-[#FFFBF3] text-[#553B2E] border-[#DFCCA8] hover:border-[#C69032]'
                }`}
              >
                Gendang ({gendangInstruments.length} Jenis)
              </button>

              {metalInstruments.map((inst) => {
                const selected = inst.id === currentInstrument.id;
                return (
                  <button
                    key={inst.id}
                    type="button"
                    onClick={() => onSelectInstrument(inst.id)}
                    className={`min-h-[40px] px-3.5 py-2 rounded-xl border text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                      selected
                        ? 'bg-[#5B0E14] text-[#FBF4E6] border-[#5B0E14]'
                        : 'bg-[#FFFBF3] text-[#553B2E] border-[#DFCCA8] hover:border-[#C69032]'
                    }`}
                  >
                    {inst.shortName}
                  </button>
                );
              })}
            </div>

            {isKalinongSelected && (
              <div className="flex items-center gap-2 overflow-x-auto p-2 rounded-xl bg-[#EFE2CA]/70 border border-[#DFCCA8]">
                <span className="text-[11px] font-semibold text-[#5B0E14] px-2 whitespace-nowrap shrink-0">
                  Jenis Kalinong:
                </span>
                {kalinongInstruments.map((kInst) => {
                  const selected = kInst.id === currentInstrument.id;
                  return (
                    <button
                      key={kInst.id}
                      type="button"
                      onClick={() => onSelectInstrument(kInst.id)}
                      className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                        selected
                          ? 'bg-[#5B0E14] text-[#F5D78E] shadow-sm'
                          : 'bg-[#FFFBF3] text-[#553B2E] border border-[#DFCCA8] hover:border-[#C69032]'
                      }`}
                    >
                      {kInst.shortName}
                    </button>
                  );
                })}
              </div>
            )}

            {isGendangSelected && (
              <div className="flex items-center gap-2 overflow-x-auto p-2 rounded-xl bg-[#EFE2CA]/70 border border-[#DFCCA8]">
                <span className="text-[11px] font-semibold text-[#5B0E14] px-2 whitespace-nowrap shrink-0">
                  Jenis Gendang:
                </span>
                {gendangInstruments.map((gInst) => {
                  const selected = gInst.id === currentInstrument.id;
                  return (
                    <button
                      key={gInst.id}
                      type="button"
                      onClick={() => onSelectInstrument(gInst.id)}
                      className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                        selected
                          ? 'bg-[#5B0E14] text-[#F5D78E] shadow-sm'
                          : 'bg-[#FFFBF3] text-[#553B2E] border border-[#DFCCA8] hover:border-[#C69032]'
                      }`}
                    >
                      {gInst.shortName}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

      {/* Active Learning Module */}
      {activeSubTab === 'simulasi' && (
        <SimulationModule
          instrument={currentInstrument}
          settings={settings}
          onUpdateSettings={onUpdateSettings}
          onRecordActivity={onRecordActivity}
        />
      )}

      {activeSubTab === 'partitur' && (
        <ScoreModule
          instrument={currentInstrument}
          scores={scores}
          bookmarkedScoreIds={bookmarkedScoreIds}
          offlineIds={offlineIds}
          metronomeEnabled={settings.metronomeEnabled}
          onToggleBookmarkScore={onToggleBookmarkScore}
          onToggleOffline={onToggleOffline}
          onRecordActivity={onRecordActivity}
        />
      )}

      {activeSubTab === 'pola' && (
        <PatternModule
          instrument={currentInstrument}
          patterns={patterns}
          onRecordActivity={onRecordActivity}
        />
      )}

      {activeSubTab === 'latihan' && (
        <PracticeModule
          instrument={currentInstrument}
          onRecordActivity={onRecordActivity}
        />
      )}

      {activeSubTab === 'kuis' && (
        <QuizModule
          selectedInstrument={currentInstrument}
          instruments={instruments}
          quizQuestions={quizQuestions}
          onSaveQuizResult={onSaveQuizResult}
          onRecordActivity={onRecordActivity}
        />
      )}

      {activeSubTab === 'perpustakaan' && (
        <LibraryModule
          instruments={instruments}
          scores={scores}
          articles={articles}
          onSelectScore={(instId) => {
            onSelectInstrument(instId);
            onChangeSubTab('partitur');
          }}
          onRecordActivity={onRecordActivity}
        />
      )}
    </div>
  );
};

/* ============================================================================
   1. SIMULASI ALAT MUSIK
   ============================================================================ */
const SimulationModule: React.FC<{
  instrument: InstrumentData;
  settings: AppSettings;
  onUpdateSettings: (patch: Partial<AppSettings>) => void;
  onRecordActivity: LearnHubProps['onRecordActivity'];
}> = ({ instrument, settings, onUpdateSettings, onRecordActivity }) => {
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [recentNotes, setRecentNotes] = useState<string[]>([]);
  const [mode, setMode] = useState<'bebas' | 'panduan'>('bebas');
  const [guideStep, setGuideStep] = useState(0);
  const [guideCompleted, setGuideCompleted] = useState(0);
  const [metronomeOn, setMetronomeOn] = useState(false);
  const [bpm, setBpm] = useState(84);
  const [beatTick, setBeatTick] = useState(0);

  // Build a tailored 6-step guided sequence from the instrument's notes
  const guidedSequence = useMemo(() => {
    const n = instrument.notes;
    if (n.length >= 4) return [n[0], n[1], n[2], n[3], n[2], n[0]];
    if (n.length === 3) return [n[0], n[1], n[0], n[2], n[1], n[0]];
    return [n[0], n[0]];
  }, [instrument]);

  useEffect(() => {
    setGuideStep(0);
    setRecentNotes([]);
    setMetronomeOn(false);
  }, [instrument.id]);

  // Metronome interval
  useEffect(() => {
    if (!metronomeOn) return;
    let tick = 0;
    const ms = Math.round(60000 / bpm);
    const id = window.setInterval(() => {
      const isAccent = tick % 4 === 0;
      karawiAudio.playMetronomeClick(isAccent);
      setBeatTick((tick % 4) + 1);
      tick++;
    }, ms);
    return () => window.clearInterval(id);
  }, [metronomeOn, bpm]);

  const handleTriggerNote = (note: InstrumentNote) => {
    karawiAudio.playNote(note, instrument.soundProfile);
    setActiveNoteId(note.id);
    setRecentNotes((prev) => [note.label, ...prev].slice(0, 12));
    window.setTimeout(() => setActiveNoteId((curr) => (curr === note.id ? null : curr)), 240);

    if (mode === 'panduan') {
      const expected = guidedSequence[guideStep];
      if (expected && note.id === expected.id) {
        if (guideStep + 1 >= guidedSequence.length) {
          setGuideStep(0);
          setGuideCompleted((c) => c + 1);
          onRecordActivity('Simulasi', `Menyelesaikan panduan ${instrument.name}`, instrument.id);
        } else {
          setGuideStep((s) => s + 1);
        }
      }
    }
  };

  // Keyboard support
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const key = e.key.toUpperCase();
      const matched = instrument.notes.find((n) => n.keyHint.toUpperCase() === key);
      if (matched) {
        handleTriggerNote(matched);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const guidedNote = mode === 'panduan' ? guidedSequence[guideStep] : null;

  return (
    <div className="space-y-5">
      <div className="bg-[#FFFBF3] border border-[#DFCCA8] rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#5B0E14]">Simulasi {instrument.name}</h2>
            <p className="text-xs text-[#63483A]">{instrument.roleSummary}</p>
          </div>
          <div className="flex items-center gap-1 p-1 bg-[#EFE2CA] rounded-xl">
            <button
              type="button"
              onClick={() => setMode('bebas')}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                mode === 'bebas' ? 'bg-[#5B0E14] text-[#FBF4E6]' : 'text-[#553B2E]'
              }`}
            >
              Mode Bebas
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('panduan');
                setGuideStep(0);
              }}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                mode === 'panduan' ? 'bg-[#5B0E14] text-[#FBF4E6]' : 'text-[#553B2E]'
              }`}
            >
              Panduan Urutan
            </button>
          </div>
        </div>

        {/* Guided Sequence Bar */}
        {mode === 'panduan' && (
          <div className="p-3.5 rounded-xl bg-[#F7EFE1] border border-[#DFCCA8] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-[#5B0E14]">Urutan Panduan:</span>
              {guidedSequence.map((n, idx) => (
                <span
                  key={`${n.id}-${idx}`}
                  className={`w-8 h-8 rounded-lg font-mono text-xs font-bold flex items-center justify-center transition-all ${
                    idx === guideStep
                      ? 'bg-[#5B0E14] text-[#F5D78E] ring-2 ring-[#C69032] scale-105'
                      : idx < guideStep
                      ? 'bg-[#C69032] text-[#FFFBF3]'
                      : 'bg-[#FFFBF3] text-[#7B6052] border border-[#DFCCA8]'
                  }`}
                >
                  {n.label}
                </span>
              ))}
            </div>
            <div className="text-xs font-medium text-[#553B2E] tabular-nums">
              Selesai: <span className="font-bold text-[#5B0E14]">{guideCompleted}×</span>
            </div>
          </div>
        )}

        {/* Interactive Visual Stage */}
        <InteractiveInstrumentStage
          instrument={instrument}
          activeNoteId={activeNoteId}
          guidedNoteId={guidedNote?.id || null}
          showKeyHints={settings.showKeyHints}
          onTriggerNote={handleTriggerNote}
        />

        {/* Audio & Metronome Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 rounded-xl bg-[#F7EFE1] border border-[#DFCCA8] space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#2B1810]">
              <span className="inline-flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-[#5B0E14]" /> Volume Audio
              </span>
              <span className="font-mono tabular-nums">{Math.round(settings.masterVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(settings.masterVolume * 100)}
              onChange={(e) => {
                const v = Number(e.target.value) / 100;
                karawiAudio.setVolume(v);
                onUpdateSettings({ masterVolume: v });
              }}
              className="w-full accent-[#5B0E14]"
              aria-label="Pengaturan volume simulasi"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-[#F7EFE1] border border-[#DFCCA8] space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#2B1810]">
              <span>Tempo Metronom</span>
              <span className="font-mono tabular-nums">{bpm} BPM</span>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setMetronomeOn((m) => !m);
                  if (metronomeOn) setBeatTick(0);
                }}
                className={`min-h-[36px] px-3 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                  metronomeOn ? 'bg-[#5B0E14] text-[#FBF4E6]' : 'bg-[#FFFBF3] text-[#5B0E14] border border-[#DFCCA8]'
                }`}
              >
                {metronomeOn ? `Ketukan ${beatTick || 1}` : 'Aktifkan'}
              </button>
              <input
                type="range"
                min={50}
                max={140}
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-full accent-[#5B0E14]"
                aria-label="Kecepatan metronom BPM"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F7EFE1] border border-[#DFCCA8] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-semibold text-[#2B1810] mb-1.5">
              <span>Riwayat Nada Dimainkan</span>
              {recentNotes.length > 0 && (
                <button
                  type="button"
                  onClick={() => setRecentNotes([])}
                  className="text-[11px] text-[#5B0E14] hover:underline"
                >
                  Bersihkan
                </button>
              )}
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto min-h-[28px]">
              {recentNotes.length === 0 ? (
                <span className="text-xs text-[#7B6052]">Ketuk instrumen di atas...</span>
              ) : (
                recentNotes.map((lbl, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-0.5 rounded font-mono text-xs font-bold shrink-0 ${
                      idx === 0 ? 'bg-[#5B0E14] text-[#F5D78E]' : 'bg-[#FFFBF3] text-[#553B2E] border border-[#DFCCA8]'
                    }`}
                  >
                    {lbl}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   2. PEMBELAJARAN PARTITUR & AUDIO SINKRON
   ============================================================================ */
const ScoreModule: React.FC<{
  instrument: InstrumentData;
  scores: MusicScore[];
  bookmarkedScoreIds: string[];
  offlineIds: string[];
  metronomeEnabled: boolean;
  onToggleBookmarkScore: (scoreId: string) => void;
  onToggleOffline: (id: string) => void;
  onRecordActivity: LearnHubProps['onRecordActivity'];
}> = ({
  instrument,
  scores,
  bookmarkedScoreIds,
  offlineIds,
  metronomeEnabled,
  onToggleBookmarkScore,
  onToggleOffline,
  onRecordActivity,
}) => {
  const [difficultyFilter, setDifficultyFilter] = useState<'Semua' | DifficultyLevel>('Semua');
  const instrumentScores = useMemo(() => {
    return scores.filter(
      (s) =>
        s.instrumentId === instrument.id &&
        (difficultyFilter === 'Semua' || s.difficulty === difficultyFilter)
    );
  }, [scores, instrument.id, difficultyFilter]);

  const [selectedScoreId, setSelectedScoreId] = useState<string>('');
  const activeScore =
    instrumentScores.find((s) => s.id === selectedScoreId) || instrumentScores[0] || null;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIdx, setCurrentIdx] = useState<number>(-1);
  const [bpm, setBpm] = useState<number>(activeScore?.defaultBpm || 80);
  const [loopSection, setLoopSection] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentIdx(-1);
    if (activeScore) setBpm(activeScore.defaultBpm);
  }, [activeScore?.id]);

  useEffect(() => {
    if (!isPlaying || !activeScore) {
      if (timerRef.current) window.clearInterval(timerRef.current);
      return;
    }

    const startRange = loopSection && activeScore.loopRange ? activeScore.loopRange[0] : 0;
    const endRange =
      loopSection && activeScore.loopRange
        ? activeScore.loopRange[1]
        : activeScore.notes.length - 1;

    let idx = currentIdx >= startRange && currentIdx <= endRange ? currentIdx : startRange;

    const playStep = () => {
      const ev = activeScore.notes[idx];
      setCurrentIdx(idx);
      if (metronomeEnabled) {
        karawiAudio.playMetronomeClick(ev.beat === 1);
      }
      if (ev.noteId !== 'rest') {
        const noteObj = instrument.notes.find((n) => n.id === ev.noteId);
        if (noteObj) karawiAudio.playNote(noteObj, instrument.soundProfile);
      }
      idx++;
      if (idx > endRange) {
        if (loopSection) {
          idx = startRange;
        } else {
          setIsPlaying(false);
          setCurrentIdx(-1);
          if (timerRef.current) window.clearInterval(timerRef.current);
        }
      }
    };

    playStep();
    const intervalMs = Math.round(60000 / bpm);
    timerRef.current = window.setInterval(playStep, intervalMs);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [isPlaying, bpm, loopSection, activeScore, instrument, metronomeEnabled]);

  const handleTogglePlay = () => {
    if (!activeScore) return;
    if (!isPlaying) {
      onRecordActivity('Partitur', `Mempelajari partitur ${activeScore.title}`, instrument.id);
    }
    setIsPlaying((p) => !p);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentIdx(-1);
  };

  return (
    <div className="space-y-5">
      {/* Difficulty filter & score picker */}
      <div className="bg-[#FFFBF3] border border-[#DFCCA8] rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#5B0E14]">Partitur {instrument.name}</h2>
            <p className="text-xs text-[#63483A]">Notasi angka tersinkronisasi dengan audio dan penanda ketukan.</p>
          </div>
          <div className="flex items-center gap-1 p-1 bg-[#EFE2CA] rounded-xl">
            {(['Semua', 'Dasar', 'Menengah', 'Lanjutan'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setDifficultyFilter(lvl)}
                className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  difficultyFilter === lvl ? 'bg-[#5B0E14] text-[#FBF4E6]' : 'text-[#553B2E]'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {instrumentScores.length === 0 ? (
          <p className="text-sm text-[#7B6052] py-6 text-center">
            Belum ada partitur untuk tingkat kesulitan ini pada {instrument.name}. Pilih tingkat "Semua" untuk melihat partitur tersedia.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {instrumentScores.map((sc) => {
              const selected = activeScore?.id === sc.id;
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => setSelectedScoreId(sc.id)}
                  className={`p-3.5 rounded-xl border text-left transition-colors ${
                    selected
                      ? 'bg-[#5B0E14] text-[#FBF4E6] border-[#5B0E14]'
                      : 'bg-[#F7EFE1] text-[#2B1810] border-[#DFCCA8] hover:border-[#C69032]'
                  }`}
                >
                  <div className="text-sm font-bold">{sc.title}</div>
                  <div className={`text-xs mt-1 ${selected ? 'text-[#F0CB7D]' : 'text-[#63483A]'}`}>
                    {sc.difficulty} · Birama {sc.timeSignature} · {sc.defaultBpm} BPM
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Synchronized Score Stage */}
      {activeScore && (
        <div className="bg-[#FFFBF3] border border-[#DFCCA8] rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-[#2B1810]">{activeScore.title}</h3>
              <p className="text-xs text-[#63483A] mt-0.5">
                {activeScore.regionOrigin} · Tingkat {activeScore.difficulty} · Birama {activeScore.timeSignature}
              </p>
              <p className="text-sm text-[#553B2E] mt-2">{activeScore.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleBookmarkScore(activeScore.id)}
                className={`min-h-[40px] px-3 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 ${
                  bookmarkedScoreIds.includes(activeScore.id)
                    ? 'bg-[#F5E1E3] text-[#5B0E14] border-[#5B0E14]/40'
                    : 'bg-[#F7EFE1] text-[#553B2E] border-[#DFCCA8]'
                }`}
              >
                <Bookmark
                  className={`w-4 h-4 ${
                    bookmarkedScoreIds.includes(activeScore.id) ? 'fill-[#5B0E14]' : ''
                  }`}
                />
                Bookmark
              </button>
              <button
                type="button"
                onClick={() => onToggleOffline(`score:${activeScore.id}`)}
                className={`min-h-[40px] px-3 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 ${
                  offlineIds.includes(`score:${activeScore.id}`)
                    ? 'bg-[#5B0E14] text-[#FBF4E6] border-[#5B0E14]'
                    : 'bg-[#F7EFE1] text-[#553B2E] border-[#DFCCA8]'
                }`}
              >
                <Download className="w-4 h-4" />
                Offline
              </button>
            </div>
          </div>

          {/* Classical 5-Line Musical Staff Sheet Music Renderer */}
          <SheetMusicRenderer
            score={activeScore}
            instrument={instrument}
            bpm={bpm}
            currentIdx={currentIdx}
            loopSection={loopSection}
            onSelectNote={(idx, ev) => {
              setCurrentIdx(idx);
              if (ev.noteId !== 'rest') {
                const n = instrument.notes.find((x) => x.id === ev.noteId);
                if (n) karawiAudio.playNote(n, instrument.soundProfile);
              }
            }}
          />

          {/* Playback Transport Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="min-h-[46px] px-5 py-2.5 rounded-xl bg-[#5B0E14] text-[#FBF4E6] text-sm font-semibold hover:bg-[#76161E] inline-flex items-center gap-2 shadow-sm"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Jeda' : 'Putar Partitur'}
              </button>
              <button
                type="button"
                onClick={handleStop}
                className="min-h-[46px] min-w-[46px] rounded-xl bg-[#EFE2CA] text-[#2B1810] hover:bg-[#DFCCA8] flex items-center justify-center"
                aria-label="Hentikan pemutaran"
              >
                <Square className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setLoopSection((l) => !l)}
                className={`min-h-[46px] px-3.5 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
                  loopSection
                    ? 'bg-[#C69032] text-[#FFFBF3] border-[#C69032]'
                    : 'bg-[#F7EFE1] text-[#553B2E] border-[#DFCCA8]'
                }`}
              >
                <Repeat className="w-4 h-4" />
                Ulang Bagian
              </button>
            </div>

            <div className="flex items-center gap-3 min-w-[200px] flex-1 max-w-xs">
              <span className="text-xs font-semibold text-[#553B2E] whitespace-nowrap">Tempo:</span>
              <input
                type="range"
                min={50}
                max={140}
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-full accent-[#5B0E14]"
                aria-label="Atur tempo partitur BPM"
              />
              <span className="font-mono text-xs font-bold text-[#5B0E14] tabular-nums w-14 text-right">
                {bpm} BPM
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
   3. POLA PERMAINAN & DEMONSTRASI VISUAL
   ============================================================================ */
const PatternModule: React.FC<{
  instrument: InstrumentData;
  patterns: PlayingPattern[];
  onRecordActivity: LearnHubProps['onRecordActivity'];
}> = ({ instrument, patterns, onRecordActivity }) => {
  const [level, setLevel] = useState<DifficultyLevel>('Dasar');
  const [playingPatternId, setPlayingPatternId] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(-1);
  const intervalRef = useRef<number | null>(null);

  const instrumentPatterns = useMemo(
    () => patterns.filter((p) => p.instrumentId === instrument.id),
    [patterns, instrument.id]
  );

  const filteredPatterns = useMemo(() => {
    const exact = instrumentPatterns.filter((p) => p.level === level);
    return exact.length > 0 ? exact : instrumentPatterns;
  }, [instrumentPatterns, level]);

  const stopPattern = () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    setPlayingPatternId(null);
    setActiveStep(-1);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [instrument.id, level]);

  const togglePlayPattern = (pat: PlayingPattern) => {
    if (playingPatternId === pat.id) {
      stopPattern();
      return;
    }
    stopPattern();
    setPlayingPatternId(pat.id);
    onRecordActivity('Pola Permainan', `Mempelajari ${pat.title}`, instrument.id);

    let step = 0;
    const playStep = () => {
      const item = pat.sequence[step];
      setActiveStep(step);
      if (item.noteId !== 'rest') {
        const note = instrument.notes.find((n) => n.id === item.noteId);
        if (note) karawiAudio.playNote(note, instrument.soundProfile, item.accent ? 1.15 : 0.85);
      }
      step = (step + 1) % pat.sequence.length;
    };

    playStep();
    intervalRef.current = window.setInterval(playStep, Math.round(60000 / pat.bpm));
  };

  return (
    <div className="space-y-5">
      <div className="bg-[#FFFBF3] border border-[#DFCCA8] rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#5B0E14]">Pola Permainan {instrument.name}</h2>
          <p className="text-xs text-[#63483A]">Pelajari pola dasar hingga lanjutan lengkap dengan panduan tangan dan demonstrasi audio.</p>
        </div>
        <div className="flex items-center gap-1 p-1 bg-[#EFE2CA] rounded-xl">
          {(['Dasar', 'Menengah', 'Lanjutan'] as DifficultyLevel[]).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => {
                stopPattern();
                setLevel(lvl);
              }}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                level === lvl ? 'bg-[#5B0E14] text-[#FBF4E6]' : 'text-[#553B2E]'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredPatterns.map((pat) => {
          const isThisPlaying = playingPatternId === pat.id;
          return (
            <div key={pat.id} className="bg-[#FFFBF3] border border-[#DFCCA8] rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-[#9C6D1E]">
                    Tingkat {pat.level} · Tempo {pat.bpm} BPM
                  </div>
                  <h3 className="text-lg font-bold text-[#2B1810] mt-0.5">{pat.title}</h3>
                  <p className="text-sm text-[#553B2E] mt-1">{pat.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => togglePlayPattern(pat)}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-[#5B0E14] text-[#FBF4E6] text-xs font-semibold hover:bg-[#76161E] inline-flex items-center gap-2 shrink-0"
                >
                  {isThisPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isThisPlaying ? 'Hentikan Demo' : 'Putar Demonstrasi'}
                </button>
              </div>

              {/* Interactive visual beat & hand demonstrator */}
              <div className="p-4 rounded-xl bg-[#F7EFE1] border border-[#DFCCA8]">
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {pat.sequence.map((sq, idx) => {
                    const active = isThisPlaying && activeStep === idx;
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          active
                            ? 'bg-[#5B0E14] text-[#F5D78E] border-[#C69032] scale-105 shadow-md'
                            : 'bg-[#FFFBF3] text-[#2B1810] border-[#DFCCA8]'
                        }`}
                      >
                        <div className="text-[10px] font-mono opacity-75">Ketuk {idx + 1}</div>
                        <div className="font-mono text-lg font-bold my-0.5">{sq.label}</div>
                        <div className={`text-[10px] font-semibold ${active ? 'text-[#F0CB7D]' : 'text-[#7B6052]'}`}>
                          {sq.hand}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-[#63483A] mt-3">{pat.demoCaption}</p>
              </div>

              {/* Technique Tips */}
              <div className="p-3.5 rounded-xl bg-[#FFF6DE] border border-[#DFCCA8] flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-[#9C6D1E] shrink-0 mt-0.5" />
                <div className="text-xs text-[#553B2E] space-y-1">
                  <div className="font-bold text-[#2B1810]">Tips Teknik Permainan:</div>
                  {pat.techniqueTips.map((tip, i) => (
                    <div key={i}>• {tip}</div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ============================================================================
   4. LATIHAN MANDIRI (4 MODE INTERAKTIF DENGAN INSTRUMEN REALISTIS)
   ============================================================================ */
const PracticeModule: React.FC<{
  instrument: InstrumentData;
  onRecordActivity: LearnHubProps['onRecordActivity'];
}> = ({ instrument, onRecordActivity }) => {
  const [drillType, setDrillType] = useState<'nada' | 'partitur' | 'ketukan' | 'pola'>('nada');
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  // 1. Pengenalan Nada (Ear Training on real instrument)
  const [targetNote, setTargetNote] = useState<InstrumentNote>(instrument.notes[0]);
  const [earFeedback, setEarFeedback] = useState<{ text: string; ok: boolean } | null>(null);
  const [revealHintId, setRevealHintId] = useState<string | null>(null);
  const [earScore, setEarScore] = useState({ correct: 0, total: 0 });

  // 2 & 4. Membaca Partitur (5-line staff) & Mengingat Pola (Simon-Says on real instrument)
  const [seqTarget, setSeqTarget] = useState<InstrumentNote[]>([]);
  const [seqInput, setSeqInput] = useState<string[]>([]);
  const [seqFeedback, setSeqFeedback] = useState<{ text: string; ok: boolean } | null>(null);
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);
  const [demoFlashId, setDemoFlashId] = useState<string | null>(null);
  const [seqCompletedCount, setSeqCompletedCount] = useState(0);

  // 3. Latihan Ketukan (Rhythm Tap on real instrument)
  const [rhythmActive, setRhythmActive] = useState(false);
  const [rhythmBeat, setRhythmBeat] = useState(0);
  const [rhythmHits, setRhythmHits] = useState<number[]>([]);
  const [rhythmFeedback, setRhythmFeedback] = useState('Tekan Mulai Metronom lalu ketuk langsung pada gambar instrumen sesuai ketukan 80 BPM.');
  const lastBeatTimeRef = useRef<number>(0);

  const flashNote = (noteId: string, ms = 260) => {
    setActiveNoteId(noteId);
    window.setTimeout(() => setActiveNoteId((curr) => (curr === noteId ? null : curr)), ms);
  };

  const pickNewEarNote = (inst: InstrumentData) => {
    const next = inst.notes[Math.floor(Math.random() * inst.notes.length)];
    setTargetNote(next);
    setEarFeedback(null);
    setRevealHintId(null);
    karawiAudio.playNote(next, inst.soundProfile);
  };

  const playSequenceDemo = (arr: InstrumentNote[], inst: InstrumentData) => {
    setIsDemoPlaying(true);
    setSeqInput([]);
    arr.forEach((n, idx) => {
      window.setTimeout(() => {
        karawiAudio.playNote(n, inst.soundProfile);
        setDemoFlashId(n.id);
        window.setTimeout(() => setDemoFlashId((curr) => (curr === n.id ? null : curr)), 360);
      }, idx * 540);
    });
    window.setTimeout(() => {
      setIsDemoPlaying(false);
      setDemoFlashId(null);
    }, arr.length * 540 + 180);
  };

  const buildNewSequence = (inst: InstrumentData, autoPlayVisual: boolean) => {
    const len = 4;
    const arr: InstrumentNote[] = [];
    for (let i = 0; i < len; i++) {
      arr.push(inst.notes[Math.floor(Math.random() * inst.notes.length)]);
    }
    setSeqTarget(arr);
    setSeqInput([]);
    setSeqFeedback(null);
    if (autoPlayVisual) {
      playSequenceDemo(arr, inst);
    }
  };

  useEffect(() => {
    setTargetNote(instrument.notes[0]);
    setEarFeedback(null);
    setRevealHintId(null);
    buildNewSequence(instrument, false);
    setRhythmActive(false);
    setRhythmBeat(0);
    setRhythmHits([]);
  }, [instrument.id]);

  // Rhythm metronome
  useEffect(() => {
    if (!rhythmActive) return;
    const ms = 750; // 80 BPM
    let beat = 1;
    lastBeatTimeRef.current = performance.now();
    setRhythmBeat(1);
    karawiAudio.playMetronomeClick(true);
    const id = window.setInterval(() => {
      beat = (beat % 4) + 1;
      lastBeatTimeRef.current = performance.now();
      setRhythmBeat(beat);
      karawiAudio.playMetronomeClick(beat === 1);
    }, ms);
    return () => window.clearInterval(id);
  }, [rhythmActive]);

  const handleEarInstrumentTap = (note: InstrumentNote) => {
    karawiAudio.playNote(note, instrument.soundProfile);
    flashNote(note.id);

    const isRight = note.id === targetNote.id;
    setEarScore((s) => ({
      correct: s.correct + (isRight ? 1 : 0),
      total: s.total + 1,
    }));

    if (isRight) {
      setRevealHintId(null);
      setEarFeedback({ text: `Benar! Anda mengetuk ${targetNote.name} dengan tepat.`, ok: true });
      onRecordActivity('Latihan Mandiri', `Pengenalan nada ${instrument.name}`, instrument.id);
    } else {
      setRevealHintId(targetNote.id);
      setEarFeedback({
        text: `Belum tepat (Anda mengetuk ${note.name}). Posisi bunyi soal (${targetNote.name}) kini disorot emas pada gambar alat musik.`,
        ok: false,
      });
    }
  };

  const handleSeqInstrumentTap = (note: InstrumentNote) => {
    if (isDemoPlaying) return;
    karawiAudio.playNote(note, instrument.soundProfile);
    flashNote(note.id);
    if (seqTarget.length === 0) return;

    const nextInput = [...seqInput, note.id];
    const idx = nextInput.length - 1;

    if (seqTarget[idx].id !== note.id) {
      setSeqFeedback({
        text: `Belum tepat pada nada ke-${idx + 1} (seharusnya ${seqTarget[idx].label}). Silakan ulangi dari nada pertama!`,
        ok: false,
      });
      setSeqInput([]);
      return;
    }

    setSeqInput(nextInput);
    setSeqFeedback(null);

    if (nextInput.length === seqTarget.length) {
      setSeqCompletedCount((c) => c + 1);
      setSeqFeedback({
        text: 'Sempurna! Seluruh rangkaian nada berhasil dimainkan dengan benar pada instrumen.',
        ok: true,
      });
      onRecordActivity(
        'Latihan Mandiri',
        `${drillType === 'partitur' ? 'Membaca partitur' : 'Mengingat pola'} ${instrument.name}`,
        instrument.id
      );
      setSeqInput([]);
    }
  };

  const handleRhythmInstrumentTap = (note: InstrumentNote) => {
    karawiAudio.playNote(note, instrument.soundProfile);
    flashNote(note.id);
    if (!rhythmActive) return;

    const elapsed = performance.now() - lastBeatTimeRef.current;
    const dist = Math.min(elapsed, Math.abs(750 - elapsed));
    const accuracy = Math.max(0, Math.round(100 - (dist / 375) * 100));
    setRhythmHits((h) => [...h.slice(-7), accuracy]);
    if (dist <= 115) setRhythmFeedback(`Tepat pada ketukan! Akurasi ${accuracy}%`);
    else if (elapsed < 375) setRhythmFeedback(`Sedikit terlambat (${accuracy}%)`);
    else setRhythmFeedback(`Sedikit terlalu cepat (${accuracy}%)`);
  };

  // Helper: map note to 5-line mini staff step for Membaca Partitur
  const getMiniStaffStep = (note: InstrumentNote) => {
    const map: Record<string, number> = {
      '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, i: 7,
      D: 1, T: 5, P: 6, B: 1, Ti: 5, Te: 6, G: 1, g: 2, R: 6, W: 2, w: 4,
    };
    return note.label in map ? map[note.label] : Math.min(7, instrument.notes.indexOf(note));
  };

  return (
    <div className="space-y-5">
      <div className="bg-[#FFFBF3] border border-[#DFCCA8] rounded-2xl p-5 space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#5B0E14]">Latihan Mandiri {instrument.name}</h2>
          <p className="text-xs text-[#63483A]">
            Berlatih langsung mengetuk instrumen {instrument.name} asli untuk mengasah pendengaran nada, baca partitur, ketukan, dan ingatan pola.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(
            [
              { id: 'nada', label: 'Pengenalan Nada' },
              { id: 'partitur', label: 'Membaca Partitur' },
              { id: 'ketukan', label: 'Latihan Ketukan' },
              { id: 'pola', label: 'Mengingat Pola' },
            ] as const
          ).map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => {
                setDrillType(d.id);
                setRhythmActive(false);
                setRevealHintId(null);
                if (d.id === 'partitur' || d.id === 'pola') {
                  buildNewSequence(instrument, d.id === 'pola');
                }
              }}
              className={`min-h-[42px] px-3 py-2 rounded-xl border text-xs font-semibold transition-colors ${
                drillType === d.id
                  ? 'bg-[#5B0E14] text-[#FBF4E6] border-[#5B0E14]'
                  : 'bg-[#F7EFE1] text-[#553B2E] border-[#DFCCA8] hover:border-[#C69032]'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#FFFBF3] border border-[#DFCCA8] rounded-2xl p-5 sm:p-6 space-y-5">
        {/* 1. PENGENALAN NADA — langsung pada gambar instrumen asli */}
        {drillType === 'nada' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-[#9C6D1E] tabular-nums">
                  Skor Latihan: {earScore.correct} / {earScore.total} Benar
                </div>
                <h3 className="text-lg font-bold text-[#2B1810]">
                  Dengarkan bunyi soal, lalu ketuk posisi nadanya langsung pada {instrument.name}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => karawiAudio.playNote(targetNote, instrument.soundProfile)}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-[#5B0E14] text-[#FBF4E6] text-xs font-semibold inline-flex items-center gap-2 hover:bg-[#76161E]"
                >
                  <Headphones className="w-4 h-4" />
                  Putar Bunyi Soal
                </button>
                <button
                  type="button"
                  onClick={() => pickNewEarNote(instrument)}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-[#EFE2CA] text-[#2B1810] text-xs font-semibold inline-flex items-center gap-2 hover:bg-[#DFCCA8]"
                >
                  <RotateCcw className="w-4 h-4" />
                  Soal Baru
                </button>
              </div>
            </div>

            {earFeedback && (
              <div
                className={`p-3.5 rounded-xl border text-xs sm:text-sm font-semibold ${
                  earFeedback.ok
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-[#FFF6DE] border-[#DFCCA8] text-[#5B0E14]'
                }`}
              >
                {earFeedback.text}
              </div>
            )}

            <InteractiveInstrumentStage
              instrument={instrument}
              activeNoteId={activeNoteId}
              guidedNoteId={revealHintId}
              showKeyHints={true}
              onTriggerNote={handleEarInstrumentTap}
            />
          </div>
        )}

        {/* 2. MEMBACA PARTITUR — 5-line paranada asli + ketuk instrumen asli */}
        {drillType === 'partitur' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-[#9C6D1E] tabular-nums">
                  Selesai Dimainkan: {seqCompletedCount}×
                </div>
                <h3 className="text-lg font-bold text-[#2B1810]">
                  Baca not balok pada paranada, lalu ketuk {instrument.name} secara berurutan
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isDemoPlaying}
                  onClick={() => playSequenceDemo(seqTarget, instrument)}
                  className="min-h-[42px] px-4 py-2 rounded-xl bg-[#EFE2CA] text-[#2B1810] text-xs font-semibold hover:bg-[#DFCCA8] inline-flex items-center gap-1.5"
                >
                  <Volume2 className="w-4 h-4" />
                  Dengar Contoh
                </button>
                <button
                  type="button"
                  onClick={() => buildNewSequence(instrument, false)}
                  className="min-h-[42px] px-4 py-2 rounded-xl bg-[#5B0E14] text-[#FBF4E6] text-xs font-semibold hover:bg-[#76161E] inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Partitur Baru
                </button>
              </div>
            </div>

            {/* Real 5-line Mini Musical Staff for Sight Reading */}
            <div className="rounded-2xl bg-[#FFFEFA] border border-[#DFCCA8] p-4 max-w-2xl mx-auto">
              <svg viewBox="0 0 520 116" className="w-full h-auto select-none" aria-label="Paranada latihan membaca partitur">
                {[0, 1, 2, 3, 4].map((l) => (
                  <line key={l} x1="20" y1={28 + l * 10} x2="500" y2={28 + l * 10} stroke="#2B1810" strokeWidth="1" />
                ))}
                <line x1="20" y1="28" x2="20" y2="68" stroke="#1E1410" strokeWidth="2.2" />
                <line x1="500" y1="28" x2="500" y2="68" stroke="#1E1410" strokeWidth="2.4" />
                <line x1="495" y1="28" x2="495" y2="68" stroke="#1E1410" strokeWidth="1" />
                <text x="26" y="61" fontSize="38" fill="#1E1410" fontFamily="Georgia, serif">𝄞</text>
                <text x="64" y="45" fontSize="15" fontWeight="700" fill="#1E1410" fontFamily="Georgia, serif">4</text>
                <text x="64" y="63" fontSize="15" fontWeight="700" fill="#1E1410" fontFamily="Georgia, serif">4</text>

                {seqTarget.map((n, i) => {
                  const cx = 135 + i * 95;
                  const step = getMiniStaffStep(n);
                  const cy = 68 - step * 5;
                  const isDone = i < seqInput.length;
                  const isNext = i === seqInput.length;
                  const stemUp = step <= 3;
                  const fill = isDone ? '#15803D' : isNext ? '#5B0E14' : '#1E1410';

                  return (
                    <g key={i}>
                      {isNext && (
                        <rect x={cx - 22} y="16" width="44" height="66" rx="6" fill="#DFB054" opacity="0.35" stroke="#C69032" strokeWidth="1.2" />
                      )}
                      {step === 0 && <line x1={cx - 10} y1={cy} x2={cx + 10} y2={cy} stroke={fill} strokeWidth="1" />}
                      <line
                        x1={stemUp ? cx + 5.5 : cx - 5.5}
                        y1={cy}
                        x2={stemUp ? cx + 5.5 : cx - 5.5}
                        y2={stemUp ? cy - 24 : cy + 24}
                        stroke={fill}
                        strokeWidth="1.4"
                      />
                      <ellipse cx={cx} cy={cy} rx="6" ry="4.4" transform={`rotate(-20 ${cx} ${cy})`} fill={fill} />
                      <text x={cx} y="96" fontSize="13" fontWeight="700" textAnchor="middle" fill={fill} fontFamily="JetBrains Mono, monospace">
                        {n.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {seqFeedback && (
              <div
                className={`p-3.5 rounded-xl border text-xs sm:text-sm font-semibold ${
                  seqFeedback.ok
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-[#FFF6DE] border-[#DFCCA8] text-[#5B0E14]'
                }`}
              >
                {seqFeedback.text}
              </div>
            )}

            <InteractiveInstrumentStage
              instrument={instrument}
              activeNoteId={demoFlashId || activeNoteId}
              guidedNoteId={null}
              showKeyHints={true}
              onTriggerNote={handleSeqInstrumentTap}
            />
          </div>
        )}

        {/* 3. LATIHAN KETUKAN — langsung ketuk pada gambar instrumen asli */}
        {drillType === 'ketukan' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-[#2B1810]">Latihan Ketepatan Ketukan (80 BPM)</h3>
                <p className="text-xs text-[#63483A]">{rhythmFeedback}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setRhythmActive((r) => !r);
                  setRhythmBeat(0);
                  setRhythmHits([]);
                }}
                className="min-h-[44px] px-5 py-2 rounded-xl bg-[#5B0E14] text-[#FBF4E6] text-xs font-semibold hover:bg-[#76161E]"
              >
                {rhythmActive ? 'Hentikan Metronom' : 'Mulai Metronom'}
              </button>
            </div>

            {/* 4-beat visual pulse bar */}
            <div className="flex items-center justify-center gap-3 py-2">
              {[1, 2, 3, 4].map((b) => (
                <div
                  key={b}
                  className={`w-12 h-12 rounded-xl border-2 font-mono font-bold text-base flex items-center justify-center transition-all ${
                    rhythmActive && rhythmBeat === b
                      ? 'bg-[#5B0E14] text-[#F5D78E] border-[#C69032] scale-110 shadow-md'
                      : 'bg-[#F7EFE1] text-[#7B6052] border-[#DFCCA8]'
                  }`}
                >
                  {b}
                </div>
              ))}
              {rhythmHits.length > 0 && (
                <div className="ml-3 text-xs font-mono text-[#553B2E] tabular-nums">
                  Akurasi:{' '}
                  <span className="font-bold text-sm text-[#5B0E14]">
                    {Math.round(rhythmHits.reduce((a, b) => a + b, 0) / rhythmHits.length)}%
                  </span>
                </div>
              )}
            </div>

            <InteractiveInstrumentStage
              instrument={instrument}
              activeNoteId={activeNoteId}
              guidedNoteId={null}
              showKeyHints={true}
              onTriggerNote={handleRhythmInstrumentTap}
            />
          </div>
        )}

        {/* 4. MENGINGAT POLA — Simon-Says visual & audio pada gambar instrumen asli */}
        {drillType === 'pola' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-[#9C6D1E] tabular-nums">
                  {isDemoPlaying
                    ? 'Perhatikan posisi yang menyala pada alat musik...'
                    : `Giliran Anda (${seqInput.length}/${seqTarget.length} nada) · Selesai ${seqCompletedCount}×`}
                </div>
                <h3 className="text-lg font-bold text-[#2B1810]">
                  Perhatikan & dengarkan pola pada {instrument.name}, lalu ulangi urutannya
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isDemoPlaying}
                  onClick={() => playSequenceDemo(seqTarget, instrument)}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-[#5B0E14] text-[#FBF4E6] text-xs font-semibold hover:bg-[#76161E] disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  <Volume2 className="w-4 h-4" />
                  Putar Ulang Pola
                </button>
                <button
                  type="button"
                  disabled={isDemoPlaying}
                  onClick={() => buildNewSequence(instrument, true)}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-[#EFE2CA] text-[#2B1810] text-xs font-semibold hover:bg-[#DFCCA8] disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Pola Baru
                </button>
              </div>
            </div>

            {/* Step progress indicators */}
            <div className="flex items-center justify-center gap-2">
              {seqTarget.map((_, i) => (
                <div
                  key={i}
                  className={`h-2.5 w-12 rounded-full transition-colors ${
                    i < seqInput.length ? 'bg-[#5B0E14]' : 'bg-[#EFE2CA]'
                  }`}
                />
              ))}
            </div>

            {seqFeedback && (
              <div
                className={`p-3.5 rounded-xl border text-xs sm:text-sm font-semibold ${
                  seqFeedback.ok
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-[#FFF6DE] border-[#DFCCA8] text-[#5B0E14]'
                }`}
              >
                {seqFeedback.text}
              </div>
            )}

            <InteractiveInstrumentStage
              instrument={instrument}
              activeNoteId={demoFlashId || activeNoteId}
              guidedNoteId={demoFlashId}
              showKeyHints={true}
              onTriggerNote={handleSeqInstrumentTap}
            />
          </div>
        )}
      </div>
    </div>
  );
};

/* ============================================================================
   5. KUIS & EVALUASI
   ============================================================================ */
const QuizModule: React.FC<{
  selectedInstrument: InstrumentData;
  instruments: InstrumentData[];
  quizQuestions: QuizQuestion[];
  onSaveQuizResult: (record: QuizResultRecord) => void;
  onRecordActivity: LearnHubProps['onRecordActivity'];
}> = ({ selectedInstrument, instruments, quizQuestions, onSaveQuizResult, onRecordActivity }) => {
  const [started, setStarted] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  const activeQuestions = useMemo(() => {
    const filtered = quizQuestions.filter((q) => q.instrumentId === selectedInstrument.id);
    return filtered.length > 0 ? filtered : quizQuestions.slice(0, 3);
  }, [quizQuestions, selectedInstrument.id]);

  // Reset quiz whenever user switches the selected instrument
  useEffect(() => {
    setStarted(false);
    setQIdx(0);
    setAnswers([]);
    setSelectedOption(null);
    setFinished(false);
  }, [selectedInstrument.id]);

  const currentQ = activeQuestions[qIdx];

  const playQuestionAudio = (q: QuizQuestion) => {
    if (!q.audioCue) return;
    const inst = instruments.find((i) => i.id === q.audioCue!.instrumentId);
    if (!inst) return;
    const ms = Math.round(60000 / (q.audioCue.bpm || 84));
    q.audioCue.noteIds.forEach((nid, idx) => {
      const n = inst.notes.find((x) => x.id === nid);
      if (n) {
        window.setTimeout(() => karawiAudio.playNote(n, inst.soundProfile), idx * ms);
      }
    });
  };

  const handleStart = () => {
    setStarted(true);
    setQIdx(0);
    setAnswers([]);
    setSelectedOption(null);
    setFinished(false);
    startTimeRef.current = Date.now();
  };

  const handleNext = () => {
    if (selectedOption === null) return;
    const nextAnswers = [...answers, selectedOption];
    setAnswers(nextAnswers);
    setSelectedOption(null);

    if (qIdx + 1 >= activeQuestions.length) {
      const correctCount = nextAnswers.reduce(
        (acc, ans, idx) => acc + (ans === activeQuestions[idx].correctIndex ? 1 : 0),
        0
      );
      const score = Math.round((correctCount / activeQuestions.length) * 100);
      const scopeName = selectedInstrument.name;

      onSaveQuizResult({
        id: `eval-${Date.now()}`,
        date: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        scope: scopeName,
        score,
        correctCount,
        totalQuestions: activeQuestions.length,
        durationSec: Math.max(10, Math.round((Date.now() - startTimeRef.current) / 1000)),
      });
      onRecordActivity('Kuis', `Evaluasi ${scopeName} (Skor ${score})`, selectedInstrument.id);
      setFinished(true);
    } else {
      setQIdx((i) => i + 1);
    }
  };

  if (!started) {
    return (
      <div className="bg-[#FFFBF3] border border-[#DFCCA8] rounded-2xl p-6 max-w-2xl mx-auto space-y-5">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#5B0E14] text-[#F5D78E] flex items-center justify-center">
            <Award className="w-7 h-7" />
          </div>
          <div className="text-xs font-semibold text-[#9C6D1E]">
            Evaluasi Instrumen Terpilih · {activeQuestions.length} Soal
          </div>
          <h2 className="text-2xl font-bold text-[#5B0E14]">Kuis {selectedInstrument.name}</h2>
          <p className="text-sm text-[#553B2E]">
            Soal kuis disesuaikan otomatis dengan alat musik yang sedang Anda pilih atau pelajari ({selectedInstrument.name}). Ganti instrumen di bar atas untuk menguji alat musik lainnya.
          </p>
        </div>

        <button
          type="button"
          onClick={handleStart}
          className="w-full min-h-[48px] rounded-xl bg-[#5B0E14] text-[#FBF4E6] font-semibold text-sm hover:bg-[#76161E] transition-colors"
        >
          Mulai Kuis {selectedInstrument.name}
        </button>
      </div>
    );
  }

  if (finished) {
    const correctCount = answers.reduce(
      (acc, ans, idx) => acc + (ans === activeQuestions[idx].correctIndex ? 1 : 0),
      0
    );
    const score = Math.round((correctCount / activeQuestions.length) * 100);

    return (
      <div className="space-y-5 max-w-3xl mx-auto">
        <div className="bg-[#FFFBF3] border border-[#DFCCA8] rounded-2xl p-6 text-center space-y-3">
          <div className="text-xs font-semibold text-[#9C6D1E]">Hasil Evaluasi Tersimpan</div>
          <div className="text-5xl font-bold font-mono text-[#5B0E14] tabular-nums">{score}</div>
          <p className="text-sm text-[#553B2E]">
            Anda menjawab benar <span className="font-bold text-[#2B1810]">{correctCount}</span> dari{' '}
            <span className="font-bold text-[#2B1810]">{activeQuestions.length}</span> soal.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              type="button"
              onClick={handleStart}
              className="min-h-[44px] px-5 py-2 rounded-xl bg-[#5B0E14] text-[#FBF4E6] text-sm font-semibold hover:bg-[#76161E]"
            >
              Ulangi Kuis
            </button>
            <button
              type="button"
              onClick={() => setStarted(false)}
              className="min-h-[44px] px-5 py-2 rounded-xl bg-[#EFE2CA] text-[#2B1810] text-sm font-semibold hover:bg-[#DFCCA8]"
            >
              Ganti Cakupan
            </button>
          </div>
        </div>

        {/* Pembahasan Jawaban */}
        <div className="bg-[#FFFBF3] border border-[#DFCCA8] rounded-2xl p-5 sm:p-6 space-y-4">
          <h3 className="text-base font-bold text-[#5B0E14]">Pembahasan Jawaban</h3>
          <div className="divide-y divide-[#EFE2CA]">
            {activeQuestions.map((q, idx) => {
              const userAns = answers[idx];
              const isRight = userAns === q.correctIndex;
              return (
                <div key={q.id} className="py-4 first:pt-0 last:pb-0 space-y-1.5">
                  <div className="flex items-start gap-2">
                    {isRight ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                    )}
                    <div className="text-sm font-semibold text-[#2B1810]">
                      {idx + 1}. {q.question}
                    </div>
                  </div>
                  <div className="pl-6 text-xs space-y-1">
                    <div className="text-[#553B2E]">
                      Jawaban Anda:{' '}
                      <span className={isRight ? 'font-bold text-emerald-800' : 'font-bold text-red-800'}>
                        {q.options[userAns]}
                      </span>
                    </div>
                    {!isRight && (
                      <div className="text-emerald-800 font-semibold">
                        Kunci Jawaban: {q.options[q.correctIndex]}
                      </div>
                    )}
                    <p className="text-[#63483A] leading-relaxed">{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFBF3] border border-[#DFCCA8] rounded-2xl p-5 sm:p-6 max-w-2xl mx-auto space-y-5">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-[#553B2E]">
          <span>
            Soal {qIdx + 1} / {activeQuestions.length}
          </span>
          <span className="text-[#9C6D1E]">{currentQ.category}</span>
        </div>
        <div className="h-2 rounded-full bg-[#EFE2CA] overflow-hidden">
          <div
            className="h-full bg-[#5B0E14] transition-all duration-300"
            style={{ width: `${((qIdx + 1) / activeQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      <h3 className="text-lg font-bold text-[#2B1810] leading-snug">{currentQ.question}</h3>

      {currentQ.audioCue && (
        <button
          type="button"
          onClick={() => playQuestionAudio(currentQ)}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-[#EFE2CA] text-[#5B0E14] text-xs font-semibold hover:bg-[#DFCCA8] inline-flex items-center gap-2"
        >
          <Volume2 className="w-4 h-4" />
          Putar Audio Cuplikan Soal
        </button>
      )}

      {currentQ.notationCue && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#F7EFE1] border border-[#DFCCA8]">
          {currentQ.notationCue.map((sym, i) => (
            <span
              key={i}
              className="w-11 h-11 rounded-lg bg-[#FFFBF3] border border-[#DFCCA8] font-mono text-lg font-bold text-[#5B0E14] flex items-center justify-center"
            >
              {sym}
            </span>
          ))}
        </div>
      )}

      <div className="space-y-2.5">
        {currentQ.options.map((opt, idx) => {
          const isPicked = selectedOption === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedOption(idx)}
              className={`w-full min-h-[48px] p-3.5 rounded-xl border text-left text-sm font-medium transition-colors flex items-center gap-3 ${
                isPicked
                  ? 'bg-[#5B0E14] text-[#FBF4E6] border-[#5B0E14]'
                  : 'bg-[#F7EFE1] text-[#2B1810] border-[#DFCCA8] hover:border-[#C69032]'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full border text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
                  isPicked ? 'bg-[#DFB054] text-[#38070B] border-[#DFB054]' : 'border-[#7B6052]/50'
                }`}
              >
                {String.fromCharCode(65 + idx)}
              </span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={selectedOption === null}
        onClick={handleNext}
        className="w-full min-h-[48px] rounded-xl bg-[#5B0E14] text-[#FBF4E6] font-semibold text-sm hover:bg-[#76161E] disabled:opacity-40 transition-colors"
      >
        {qIdx + 1 >= activeQuestions.length ? 'Selesaikan & Lihat Hasil' : 'Selanjutnya →'}
      </button>
    </div>
  );
};

/* ============================================================================
   6. PERPUSTAKAAN BUDAYA & GLOSARIUM
   ============================================================================ */
const LibraryModule: React.FC<{
  instruments: InstrumentData[];
  scores: MusicScore[];
  articles: CulturalArticle[];
  onSelectScore: (instrumentId: InstrumentId) => void;
  onRecordActivity: LearnHubProps['onRecordActivity'];
}> = ({ instruments, scores, articles, onSelectScore, onRecordActivity }) => {
  const [libTab, setLibTab] = useState<'artikel' | 'partitur'>('artikel');
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [scoreQuery, setScoreQuery] = useState('');

  const selectedArticle = articles.find((a) => a.id === activeArticleId) || null;
  const filteredScores = scores.filter((sc) => {
    const inst = instruments.find((i) => i.id === sc.instrumentId);
    const q = scoreQuery.trim().toLowerCase();
    return (
      !q ||
      sc.title.toLowerCase().includes(q) ||
      (inst?.name.toLowerCase().includes(q) ?? false) ||
      sc.difficulty.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      <div className="bg-[#FFFBF3] border border-[#DFCCA8] rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#5B0E14]">Perpustakaan Karawitan Jambi</h2>
          <p className="text-xs text-[#63483A]">Kumpulan materi budaya Karawitan Jambi dan daftar lengkap partitur 8 instrumen.</p>
        </div>
        <div className="flex items-center gap-1 p-1 bg-[#EFE2CA] rounded-xl">
          {(
            [
              { id: 'artikel', label: 'Materi Budaya' },
              { id: 'partitur', label: `Daftar Partitur (${scores.length})` },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setLibTab(t.id);
                setActiveArticleId(null);
              }}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                libTab === t.id ? 'bg-[#5B0E14] text-[#FBF4E6]' : 'text-[#553B2E]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {libTab === 'artikel' && !selectedArticle && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.map((art) => (
            <button
              key={art.id}
              type="button"
              onClick={() => {
                setActiveArticleId(art.id);
                onRecordActivity('Perpustakaan', `Membaca ${art.title}`);
              }}
              className="bg-[#FFFBF3] border border-[#DFCCA8] hover:border-[#C69032] rounded-2xl p-5 text-left transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="text-xs text-[#9C6D1E] font-semibold">
                  {art.category} · {art.readTime}
                </div>
                <h3 className="text-base font-bold text-[#2B1810] mt-1">{art.title}</h3>
                <p className="text-xs text-[#553B2E] mt-2 leading-relaxed">{art.summary}</p>
              </div>
              <div className="mt-4 text-xs font-semibold text-[#5B0E14] inline-flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" /> Baca Selengkapnya
              </div>
            </button>
          ))}
        </div>
      )}

      {libTab === 'artikel' && selectedArticle && (
        <div className="bg-[#FFFBF3] border border-[#DFCCA8] rounded-2xl p-5 sm:p-7 space-y-5">
          <button
            type="button"
            onClick={() => setActiveArticleId(null)}
            className="text-xs font-semibold text-[#5B0E14] hover:underline"
          >
            ← Kembali ke Materi Budaya
          </button>
          <div>
            <div className="text-xs text-[#9C6D1E] font-semibold">
              {selectedArticle.category} · {selectedArticle.readTime}
            </div>
            <h3 className="text-2xl font-bold text-[#5B0E14] mt-1">{selectedArticle.title}</h3>
          </div>
          <div className="space-y-3.5 text-sm sm:text-base text-[#2B1810] leading-relaxed">
            {selectedArticle.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="p-4 rounded-xl bg-[#F7EFE1] border border-[#DFCCA8] space-y-1.5">
            <div className="text-xs font-bold text-[#5B0E14]">Poin Penting:</div>
            {selectedArticle.keyTakeaways.map((kt, i) => (
              <div key={i} className="text-xs text-[#553B2E]">
                • {kt}
              </div>
            ))}
          </div>
        </div>
      )}

      {libTab === 'partitur' && (
        <div className="bg-[#FFFBF3] border border-[#DFCCA8] rounded-2xl p-5 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-[#7B6052] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={scoreQuery}
              onChange={(e) => setScoreQuery(e.target.value)}
              placeholder="Cari judul partitur atau nama instrumen..."
              className="w-full min-h-[44px] pl-10 pr-4 rounded-xl bg-[#F7EFE1] border border-[#DFCCA8] text-sm text-[#2B1810] focus:outline-none focus:border-[#5B0E14]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredScores.map((sc) => {
              const inst = instruments.find((i) => i.id === sc.instrumentId);
              return (
                <div
                  key={sc.id}
                  className="p-4 rounded-xl bg-[#F7EFE1] border border-[#DFCCA8] flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold text-[#9C6D1E]">
                      {inst?.name || sc.instrumentId} · {sc.difficulty}
                    </div>
                    <div className="text-sm font-bold text-[#2B1810] truncate mt-0.5">{sc.title}</div>
                    <div className="text-xs text-[#63483A] mt-0.5">
                      Birama {sc.timeSignature} · {sc.defaultBpm} BPM
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectScore(sc.instrumentId)}
                    className="min-h-[40px] px-3.5 rounded-xl bg-[#5B0E14] text-[#FBF4E6] text-xs font-semibold hover:bg-[#76161E] inline-flex items-center gap-1.5 shrink-0"
                  >
                    <FileMusic className="w-3.5 h-3.5" />
                    Buka Partitur
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
