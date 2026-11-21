import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  BarChart3,
  Bell,
  BookOpen,
  ChevronRight,
  FileMusic,
  Home,
  Library,
  Music,
  Play,
  Search,
  Sparkles,
  Target,
  User,
} from 'lucide-react';
import {
  AppNotification,
  AppSettings,
  InstrumentCategory,
  InstrumentData,
  InstrumentId,
  LearningHistoryItem,
  LearnSubTab,
  MainTab,
  QuizQuestion,
  QuizResultRecord,
  UserProfile,
} from './types/karawi';
import { INITIAL_INSTRUMENTS } from './data/instrumentsData';
import {
  CULTURAL_ARTICLES,
  INITIAL_PATTERNS,
  INITIAL_QUIZ_QUESTIONS,
  INITIAL_SCORES,
} from './data/learningData';
import { karawiAudio } from './utils/audioEngine';
import { InstrumentIllustration, KarawiEmblem } from './components/InstrumentVisuals';
import { AuthOnboarding } from './components/AuthOnboarding';
import { InstrumentDetailView } from './components/InstrumentDetailView';
import { LearnHub } from './components/LearnHub';
import { ProgressView } from './components/ProgressView';
import { ProfileView } from './components/ProfileView';

const STORAGE_KEY = 'karawi_jambi_state_v1';

interface PersistedState {
  profile: UserProfile | null;
  instruments: InstrumentData[];
  quizQuestions: QuizQuestion[];
  visitedInstruments: InstrumentId[];
  favoriteInstrumentIds: InstrumentId[];
  bookmarkedScoreIds: string[];
  offlineIds: string[];
  history: LearningHistoryItem[];
  quizResults: QuizResultRecord[];
  notifications: AppNotification[];
  settings: AppSettings;
}

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Selamat Datang di KARAWI',
    message: 'Jelajahi 8 instrumen tradisional Karawitan Jambi, mulai dari Kalinong Hias hingga Tetawak.',
    time: 'Hari ini',
    read: false,
    type: 'materi',
  },
  {
    id: 'notif-2',
    title: 'Target Latihan Harian',
    message: 'Luangkan 15–20 menit hari ini untuk melatih ketepatan ketukan dan membaca partitur sinkron.',
    time: 'Pengingat',
    read: false,
    type: 'pengingat',
  },
];

const DEFAULT_SETTINGS: AppSettings = {
  masterVolume: 0.8,
  metronomeEnabled: true,
  showKeyHints: true,
  reminderEnabled: true,
  reminderTime: '19:00',
};

function loadInitialState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      return {
        profile: parsed.profile ?? null,
        instruments: parsed.instruments?.length === 8 ? parsed.instruments : INITIAL_INSTRUMENTS,
        quizQuestions: parsed.quizQuestions?.length ? parsed.quizQuestions : INITIAL_QUIZ_QUESTIONS,
        visitedInstruments: parsed.visitedInstruments ?? ['kalinong-hias', 'kalinong-melodi'],
        favoriteInstrumentIds: parsed.favoriteInstrumentIds ?? ['kalinong-hias'],
        bookmarkedScoreIds: parsed.bookmarkedScoreIds ?? ['score-km-1'],
        offlineIds: parsed.offlineIds ?? ['kalinong-hias'],
        history: parsed.history ?? [
          {
            id: 'h-init-1',
            timestamp: 'Baru saja',
            module: 'Detail Instrumen',
            title: 'Mengenal Kalinong Hias',
            instrumentId: 'kalinong-hias',
          },
        ],
        quizResults: parsed.quizResults ?? [],
        notifications: parsed.notifications?.length ? parsed.notifications : DEFAULT_NOTIFICATIONS,
        settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
      };
    }
  } catch {
    // Fallback to defaults
  }

  return {
    profile: {
      name: 'Satria Raziq Hamizan',
      email: 'satria.karawi@unja.ac.id',
      institution: 'Pembelajar Karawitan Jambi',
      role: 'mahasiswa',
      dailyTargetMinutes: 20,
      todayMinutes: 12,
      weeklyGoalModules: 6,
      streakDays: 4,
    },
    instruments: INITIAL_INSTRUMENTS,
    quizQuestions: INITIAL_QUIZ_QUESTIONS,
    visitedInstruments: ['kalinong-hias', 'kalinong-melodi'],
    favoriteInstrumentIds: ['kalinong-hias'],
    bookmarkedScoreIds: ['score-km-1'],
    offlineIds: ['kalinong-hias'],
    history: [
      {
        id: 'h-init-1',
        timestamp: 'Baru saja',
        module: 'Detail Instrumen',
        title: 'Mengenal Kalinong Hias',
        instrumentId: 'kalinong-hias',
      },
    ],
    quizResults: [],
    notifications: DEFAULT_NOTIFICATIONS,
    settings: DEFAULT_SETTINGS,
  };
}

export default function App() {
  const [state, setState] = useState<PersistedState>(() => loadInitialState());
  const [showOnboarding, setShowOnboarding] = useState<'splash' | 'onboarding' | 'auth' | null>(null);

  const [activeTab, setActiveTab] = useState<MainTab>('beranda');
  const [learnSubTab, setLearnSubTab] = useState<LearnSubTab>('simulasi');
  const [selectedInstrumentId, setSelectedInstrumentId] = useState<InstrumentId>('kalinong-hias');
  const [detailInstrumentId, setDetailInstrumentId] = useState<InstrumentId | null>(null);

  // Search & category filter
  const [homeSearch, setHomeSearch] = useState('');
  const [instrumentSearch, setInstrumentSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'Semua' | InstrumentCategory>('Semua');

  useEffect(() => {
    karawiAudio.setVolume(state.settings.masterVolume);
  }, [state.settings.masterVolume]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  const recordActivity = (
    module: LearningHistoryItem['module'],
    title: string,
    instrumentId?: InstrumentId
  ) => {
    const nowLabel = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    setState((prev) => {
      const nextVisited =
        instrumentId && !prev.visitedInstruments.includes(instrumentId)
          ? [...prev.visitedInstruments, instrumentId]
          : prev.visitedInstruments;

      const nextProfile = prev.profile
        ? { ...prev.profile, todayMinutes: Math.min(180, prev.profile.todayMinutes + 2) }
        : prev.profile;

      return {
        ...prev,
        profile: nextProfile,
        visitedInstruments: nextVisited,
        history: [
          {
            id: `hist-${Date.now()}`,
            timestamp: nowLabel,
            module,
            title,
            instrumentId,
          },
          ...prev.history.slice(0, 29),
        ],
      };
    });
  };

  const openInstrumentDetail = (id: InstrumentId) => {
    const inst = state.instruments.find((i) => i.id === id);
    setSelectedInstrumentId(id);
    setDetailInstrumentId(id);
    setActiveTab('alat-musik');
    if (inst) {
      recordActivity('Detail Instrumen', `Mempelajari ${inst.name}`, id);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openLearnModule = (subTab: LearnSubTab, instId?: InstrumentId) => {
    if (instId) setSelectedInstrumentId(instId);
    setLearnSubTab(subTab);
    setDetailInstrumentId(null);
    setActiveTab('belajar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredInstruments = useMemo(() => {
    return state.instruments.filter((inst) => {
      const matchCat = categoryFilter === 'Semua' || inst.category === categoryFilter;
      const q = instrumentSearch.trim().toLowerCase();
      const matchSearch =
        !q ||
        inst.name.toLowerCase().includes(q) ||
        inst.roleSummary.toLowerCase().includes(q) ||
        inst.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [state.instruments, categoryFilter, instrumentSearch]);

  const unreadNotifCount = state.notifications.filter((n) => !n.read).length;

  // Render Splash / Onboarding / Auth if logged out or explicitly triggered
  if (!state.profile || showOnboarding) {
    return (
      <AuthOnboarding
        initialStage={showOnboarding || 'auth'}
        onCompleteAuth={(newProfile) => {
          setState((prev) => ({ ...prev, profile: newProfile }));
          setShowOnboarding(null);
          setActiveTab('beranda');
        }}
      />
    );
  }

  const profile = state.profile;
  const activeDetailInstrument = detailInstrumentId
    ? state.instruments.find((i) => i.id === detailInstrumentId) || null
    : null;

  const progressPct = Math.round((state.visitedInstruments.length / state.instruments.length) * 100);
  const lastHistory = state.history[0];

  const NAV_ITEMS: { id: MainTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'alat-musik', label: 'Alat Musik', icon: Music },
    { id: 'belajar', label: 'Belajar', icon: BookOpen },
    { id: 'progres', label: 'Progres', icon: BarChart3 },
    { id: 'profil', label: 'Profil', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#F7EFE1] text-[#2B1810] pb-24 lg:pb-10">
      {/* Desktop Top Bar (Strict 3-Zone Contract: Wordmark — 5 Nav Links — 1 Primary Action) */}
      <header className="sticky top-0 z-30 bg-[#4A0B10]/95 backdrop-blur-md border-b border-[#DFB054]/30 text-[#FBF4E6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 lg:h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('beranda');
              setDetailInstrumentId(null);
            }}
            className="flex items-center gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#F0CB7D]"
          >
            <KarawiEmblem size="sm" />
            <span className="font-serif-display text-lg font-bold tracking-wider text-[#F5D78E]">
              KARAWI
            </span>
          </button>

          {/* Zone 2: 5 Clean Single-Line Nav Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#EFE2CA]/85">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setDetailInstrumentId(null);
                }}
                className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                  activeTab === item.id
                    ? 'border-[#DFB054] text-[#F5D78E] font-semibold'
                    : 'border-transparent hover:text-[#FFFBF3]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => openLearnModule('simulasi', selectedInstrumentId)}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-[#DFB054] text-[#38070B] text-xs font-bold hover:bg-[#F0CB7D] transition-colors whitespace-nowrap shrink-0"
            >
              Mulai Simulasi
            </button>
          </div>
        </div>
      </header>

      {/* Main Responsive Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-7">
        {/* ==================== BERANDA ==================== */}
        {activeTab === 'beranda' && (
          <div className="space-y-7">
            {/* Greeting & Inline Cari Instrumen */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-[#9C6D1E]">
                  Selamat datang kembali · {profile.institution}
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#5B0E14] mt-0.5">
                  Halo, {profile.name.split(' ')[0]}
                </h1>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[#7B6052] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={homeSearch}
                  onChange={(e) => setHomeSearch(e.target.value)}
                  placeholder="Cari instrumen Karawitan..."
                  className="w-full min-h-[44px] pl-10 pr-4 rounded-xl bg-[#FFFBF3] border border-[#DFCCA8] text-sm text-[#2B1810] focus:outline-none focus:border-[#5B0E14]"
                />
                {homeSearch.trim() && (
                  <div className="absolute left-0 right-0 top-[48px] z-20 bg-[#FFFBF3] border border-[#DFCCA8] rounded-xl shadow-lg overflow-hidden">
                    {state.instruments
                      .filter(
                        (i) =>
                          i.name.toLowerCase().includes(homeSearch.toLowerCase()) ||
                          i.category.toLowerCase().includes(homeSearch.toLowerCase())
                      )
                      .map((inst) => (
                        <button
                          key={inst.id}
                          type="button"
                          onClick={() => {
                            setHomeSearch('');
                            openInstrumentDetail(inst.id);
                          }}
                          className="w-full px-3.5 py-2.5 text-left hover:bg-[#F7EFE1] flex items-center justify-between text-xs border-b border-[#EFE2CA] last:border-b-0"
                        >
                          <span className="font-bold text-[#5B0E14]">{inst.name}</span>
                          <span className="text-[#7B6052]">{inst.category}</span>
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Hero Cultural Banner + Progress Snapshot */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              <div className="lg:col-span-8 jambi-pattern-bg rounded-3xl p-6 sm:p-8 text-[#FBF4E6] flex flex-col justify-between shadow-md">
                <div className="max-w-xl space-y-3">
                  <p className="text-xs font-semibold tracking-wide text-[#F0CB7D]">
                    Platform Digital Karawitan Jambi
                  </p>
                  <h2 className="text-2xl sm:text-4xl font-bold leading-tight text-balance">
                    Belajar Karawitan Jambi Lebih Mudah dan Interaktif
                  </h2>
                  <p className="text-sm text-[#EFE2CA]/85 leading-relaxed">
                    Kuasai delapan instrumen tradisional Jambi melalui simulasi audio, partitur sinkron, pola permainan bertingkat, latihan mandiri, dan evaluasi budaya.
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => openLearnModule('simulasi', 'kalinong-hias')}
                    className="min-h-[46px] px-5 py-2.5 rounded-xl bg-[#DFB054] text-[#38070B] text-sm font-bold hover:bg-[#F0CB7D] transition-colors inline-flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Coba Simulasi Sekarang
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowOnboarding('onboarding')}
                    className="min-h-[46px] px-4 py-2.5 rounded-xl border border-[#DFB054]/45 text-[#FBF4E6] text-xs font-semibold hover:bg-white/10 transition-colors"
                  >
                    Panduan Aplikasi
                  </button>
                </div>
              </div>

              {/* Right Resume & Daily Progress Card */}
              <div className="lg:col-span-4 bg-[#FFFBF3] border border-[#DFCCA8] rounded-3xl p-6 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#9C6D1E]">
                    <span>Ringkasan Progres</span>
                    <span className="font-mono text-[#5B0E14] tabular-nums">{progressPct}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-[#EFE2CA] overflow-hidden">
                    <div
                      className="h-full bg-[#5B0E14] rounded-full transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <p className="text-xs text-[#63483A]">
                    <span className="font-bold text-[#2B1810] tabular-nums">
                      {state.visitedInstruments.length} dari 8
                    </span>{' '}
                    instrumen telah dijelajahi · Target hari ini{' '}
                    <span className="font-mono font-bold text-[#5B0E14] tabular-nums">
                      {profile.todayMinutes}/{profile.dailyTargetMinutes}m
                    </span>
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EFE2CA] space-y-2.5">
                  <div className="text-xs font-semibold text-[#63483A]">Lanjutkan Pembelajaran Terakhir</div>
                  <div className="text-sm font-bold text-[#2B1810]">
                    {lastHistory ? lastHistory.title : 'Mengenal Kalinong Hias'}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (lastHistory?.instrumentId) {
                        openInstrumentDetail(lastHistory.instrumentId);
                      } else {
                        openInstrumentDetail('kalinong-hias');
                      }
                    }}
                    className="w-full min-h-[42px] px-4 rounded-xl bg-[#EFE2CA] text-[#5B0E14] text-xs font-bold hover:bg-[#DFCCA8] transition-colors flex items-center justify-between"
                  >
                    <span>Lanjutkan Belajar</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* 5 Core Learning Modules Grid */}
            <section className="space-y-3.5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#5B0E14]">Modul Pembelajaran Utama</h2>
                <button
                  type="button"
                  onClick={() => openLearnModule('simulasi')}
                  className="text-xs font-semibold text-[#5B0E14] hover:underline"
                >
                  Buka Semua Modul →
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  {
                    label: 'Simulasi Alat',
                    sub: 'Mainkan 8 instrumen',
                    icon: Play,
                    action: () => openLearnModule('simulasi'),
                  },
                  {
                    label: 'Belajar Partitur',
                    sub: 'Notasi & contoh audio',
                    icon: FileMusic,
                    action: () => openLearnModule('partitur'),
                  },
                  {
                    label: 'Latihan Mandiri',
                    sub: 'Nada, ketukan & pola',
                    icon: Target,
                    action: () => openLearnModule('latihan'),
                  },
                  {
                    label: 'Kuis & Evaluasi',
                    sub: 'Sesuai alat dipilih',
                    icon: Award,
                    action: () => openLearnModule('kuis'),
                  },
                  {
                    label: 'Materi Budaya',
                    sub: 'Budaya & daftar partitur',
                    icon: Library,
                    action: () => openLearnModule('perpustakaan'),
                  },
                ].map((mod) => {
                  const Icon = mod.icon;
                  return (
                    <button
                      key={mod.label}
                      type="button"
                      onClick={mod.action}
                      className="bg-[#FFFBF3] border border-[#DFCCA8] hover:border-[#C69032] rounded-2xl p-4 text-left transition-colors flex flex-col justify-between min-h-[116px]"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#F5E1E3] text-[#5B0E14] flex items-center justify-center mb-3">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#2B1810]">{mod.label}</div>
                        <div className="text-[11px] text-[#63483A] mt-0.5">{mod.sub}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* ==================== ALAT MUSIK (CATALOG & DETAIL) ==================== */}
        {activeTab === 'alat-musik' && !activeDetailInstrument && (
          <div className="space-y-5">
            <div className="bg-[#FFFBF3] border border-[#DFCCA8] rounded-2xl p-5 space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-[#5B0E14]">Pilih Alat Musik Karawitan Jambi</h1>
                <p className="text-xs sm:text-sm text-[#63483A] mt-0.5">
                  Setiap instrumen memiliki halaman pembelajaran, susunan nada, simulasi, dan pola permainan tersendiri.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#7B6052] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={instrumentSearch}
                    onChange={(e) => setInstrumentSearch(e.target.value)}
                    placeholder="Cari instrumen (mis. Kalinong, Gong, Gendang, Tetawak)..."
                    className="w-full min-h-[44px] pl-10 pr-4 rounded-xl bg-[#F7EFE1] border border-[#DFCCA8] text-sm text-[#2B1810] focus:outline-none focus:border-[#5B0E14]"
                  />
                </div>
                <div className="flex items-center gap-1 p-1 bg-[#EFE2CA] rounded-xl overflow-x-auto">
                  {(['Semua', 'Kalinong', 'Perkusi Logam', 'Gendang'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                        categoryFilter === cat ? 'bg-[#5B0E14] text-[#FBF4E6]' : 'text-[#553B2E]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredInstruments.map((inst) => (
                <button
                  key={inst.id}
                  type="button"
                  onClick={() => openInstrumentDetail(inst.id)}
                  className="group bg-[#FFFBF3] border border-[#DFCCA8] hover:border-[#5B0E14] rounded-2xl p-4 text-left transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="rounded-xl bg-[#F7EFE1] p-3 mb-3.5">
                      <InstrumentIllustration
                        instrumentId={inst.id}
                        className="w-full h-28 group-hover:scale-[1.03] transition-transform"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#7B6052]">
                      <span className="font-semibold text-[#9C6D1E]">{inst.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{inst.notes.length} Nada</span>
                    </div>
                    <h2 className="text-lg font-bold text-[#5B0E14] mt-1">{inst.name}</h2>
                    <p className="text-xs text-[#553B2E] mt-1 leading-relaxed">{inst.roleSummary}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#EFE2CA] flex items-center justify-between text-xs font-semibold text-[#5B0E14]">
                    <span>Buka Pembelajaran</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'alat-musik' && activeDetailInstrument && (
          <InstrumentDetailView
            instrument={activeDetailInstrument}
            isFavorite={state.favoriteInstrumentIds.includes(activeDetailInstrument.id)}
            isOfflineSaved={state.offlineIds.includes(activeDetailInstrument.id)}
            userRole={profile.role}
            onBack={() => setDetailInstrumentId(null)}
            onToggleFavorite={() =>
              setState((prev) => ({
                ...prev,
                favoriteInstrumentIds: prev.favoriteInstrumentIds.includes(activeDetailInstrument.id)
                  ? prev.favoriteInstrumentIds.filter((id) => id !== activeDetailInstrument.id)
                  : [...prev.favoriteInstrumentIds, activeDetailInstrument.id],
              }))
            }
            onToggleOffline={() =>
              setState((prev) => ({
                ...prev,
                offlineIds: prev.offlineIds.includes(activeDetailInstrument.id)
                  ? prev.offlineIds.filter((id) => id !== activeDetailInstrument.id)
                  : [...prev.offlineIds, activeDetailInstrument.id],
              }))
            }
            onOpenLearnModule={(subTab) => openLearnModule(subTab, activeDetailInstrument.id)}
            onUpdateValidation={(status, note) =>
              setState((prev) => ({
                ...prev,
                instruments: prev.instruments.map((inst) =>
                  inst.id === activeDetailInstrument.id
                    ? { ...inst, validationStatus: status, validatorNote: note }
                    : inst
                ),
              }))
            }
          />
        )}

        {/* ==================== BELAJAR HUB ==================== */}
        {activeTab === 'belajar' && (
          <LearnHub
            activeSubTab={learnSubTab}
            onChangeSubTab={setLearnSubTab}
            selectedInstrumentId={selectedInstrumentId}
            onSelectInstrument={setSelectedInstrumentId}
            instruments={state.instruments}
            scores={INITIAL_SCORES}
            patterns={INITIAL_PATTERNS}
            quizQuestions={state.quizQuestions}
            articles={CULTURAL_ARTICLES}
            bookmarkedScoreIds={state.bookmarkedScoreIds}
            offlineIds={state.offlineIds}
            settings={state.settings}
            onUpdateSettings={(patch) =>
              setState((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }))
            }
            onToggleBookmarkScore={(scoreId) =>
              setState((prev) => ({
                ...prev,
                bookmarkedScoreIds: prev.bookmarkedScoreIds.includes(scoreId)
                  ? prev.bookmarkedScoreIds.filter((id) => id !== scoreId)
                  : [...prev.bookmarkedScoreIds, scoreId],
              }))
            }
            onToggleOffline={(id) =>
              setState((prev) => ({
                ...prev,
                offlineIds: prev.offlineIds.includes(id)
                  ? prev.offlineIds.filter((x) => x !== id)
                  : [...prev.offlineIds, id],
              }))
            }
            onRecordActivity={recordActivity}
            onSaveQuizResult={(record: QuizResultRecord) =>
              setState((prev) => ({
                ...prev,
                quizResults: [record, ...prev.quizResults],
              }))
            }
            onOpenInstrumentDetail={openInstrumentDetail}
          />
        )}

        {/* ==================== PROGRES ==================== */}
        {activeTab === 'progres' && (
          <ProgressView
            profile={profile}
            instruments={state.instruments}
            scores={INITIAL_SCORES}
            visitedInstruments={state.visitedInstruments}
            favoriteInstrumentIds={state.favoriteInstrumentIds}
            bookmarkedScoreIds={state.bookmarkedScoreIds}
            history={state.history}
            quizResults={state.quizResults}
            onUpdateTargetMinutes={(minutes) =>
              setState((prev) => ({
                ...prev,
                profile: prev.profile ? { ...prev.profile, dailyTargetMinutes: minutes } : prev.profile,
              }))
            }
            onOpenInstrumentDetail={openInstrumentDetail}
            onOpenLearnScore={(instId) => openLearnModule('partitur', instId)}
            onOpenLearnTab={(tab) => openLearnModule(tab)}
          />
        )}

        {/* ==================== PROFIL, ADMIN & VALIDATOR ==================== */}
        {activeTab === 'profil' && (
          <ProfileView
            profile={profile}
            settings={state.settings}
            instruments={state.instruments}
            scores={INITIAL_SCORES}
            quizQuestions={state.quizQuestions}
            offlineIds={state.offlineIds}
            notifications={state.notifications}
            onUpdateProfile={(patch) =>
              setState((prev) => ({
                ...prev,
                profile: prev.profile ? { ...prev.profile, ...patch } : prev.profile,
              }))
            }
            onUpdateSettings={(patch) =>
              setState((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }))
            }
            onMarkAllNotificationsRead={() =>
              setState((prev) => ({
                ...prev,
                notifications: prev.notifications.map((n) => ({ ...n, read: true })),
              }))
            }
            onRemoveOffline={(id) =>
              setState((prev) => ({
                ...prev,
                offlineIds: prev.offlineIds.filter((x) => x !== id),
              }))
            }
            onAddQuizQuestion={(q) =>
              setState((prev) => ({
                ...prev,
                quizQuestions: [q, ...prev.quizQuestions],
              }))
            }
            onDeleteQuizQuestion={(id) =>
              setState((prev) => ({
                ...prev,
                quizQuestions: prev.quizQuestions.filter((q) => q.id !== id),
              }))
            }
            onUpdateInstrumentValidation={(id, status, note) =>
              setState((prev) => ({
                ...prev,
                instruments: prev.instruments.map((inst) =>
                  inst.id === id ? { ...inst, validationStatus: status, validatorNote: note } : inst
                ),
              }))
            }
            onLogout={() => {
              setState((prev) => ({ ...prev, profile: null }));
              setShowOnboarding('splash');
            }}
            onOpenInstrumentDetail={openInstrumentDetail}
          />
        )}
      </main>

      {/* Mobile Fixed 5-Tab Bottom Navigation Bar (Matches Maroon & Jambi Gold Identity) */}
      <nav
        aria-label="Navigasi Utama"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#38070B]/95 backdrop-blur-md border-t border-[#DFB054]/30 pb-safe"
      >
        <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setDetailInstrumentId(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`min-h-[48px] flex flex-col items-center justify-center gap-0.5 transition-colors ${
                  isActive ? 'text-[#F0CB7D]' : 'text-[#EFE2CA]/70 hover:text-[#FFFBF3]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
                <span className="text-[10px] font-semibold tracking-tight whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
