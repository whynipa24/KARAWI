export type InstrumentId =
  | 'kalinong-hias'
  | 'kalinong-melodi'
  | 'kalinong-jalan'
  | 'kalinong-penegas'
  | 'gong'
  | 'gendang-melayu'
  | 'gendang-sike'
  | 'tetawak';

export type InstrumentCategory = 'Kalinong' | 'Perkusi Logam' | 'Gendang';

export type SoundProfile =
  | 'kalinong-high'
  | 'kalinong-mid'
  | 'kalinong-low'
  | 'gong-deep'
  | 'tetawak-mid'
  | 'gendang-melayu'
  | 'gendang-sike';

export type DifficultyLevel = 'Dasar' | 'Menengah' | 'Lanjutan';

export type UserRole = 'pengunjung' | 'mahasiswa' | 'admin' | 'validator';

export type MainTab = 'beranda' | 'alat-musik' | 'belajar' | 'progres' | 'profil';

export type LearnSubTab =
  | 'simulasi'
  | 'partitur'
  | 'pola'
  | 'latihan'
  | 'kuis'
  | 'perpustakaan';

export interface InstrumentNote {
  id: string;
  label: string;        // e.g. "1", "2", "3", "Dung", "Tak", "G"
  name: string;         // e.g. "Nada Do (1)", "Pukulan Dung"
  frequency: number;    // Hz for synthesis
  keyHint: string;      // keyboard shortcut
  toneType?: 'kettle' | 'gong-boss' | 'gong-rim' | 'drum-low' | 'drum-high' | 'drum-slap';
  description: string;
}

export interface InstrumentPart {
  name: string;
  function: string;
}

export interface InstrumentData {
  id: InstrumentId;
  name: string;
  shortName: string;
  category: InstrumentCategory;
  roleSummary: string;
  tagline: string;
  description: string;
  history: string;
  culturalFunction: string;
  soundCharacteristics: string;
  parts: InstrumentPart[];
  basicTechniques: string[];
  soundProfile: SoundProfile;
  notes: InstrumentNote[];
  validationStatus: 'Tervalidasi' | 'Menunggu Validasi' | 'Perlu Revisi';
  validatorNote?: string;
}

export interface ScoreNoteEvent {
  noteId: string;       // matches InstrumentNote.id or 'rest'
  display: string;      // e.g. "1", "3", ".", "D", "T"
  lyricOrCue?: string;  // optional technique cue
  beat: number;         // 1-4 beat position in measure
  measure: number;
}

export interface MusicScore {
  id: string;
  instrumentId: InstrumentId;
  title: string;
  regionOrigin: string;
  difficulty: DifficultyLevel;
  defaultBpm: number;
  timeSignature: string;
  description: string;
  notes: ScoreNoteEvent[];
  loopRange?: [number, number]; // start index, end index
}

export interface PlayingPattern {
  id: string;
  instrumentId: InstrumentId;
  title: string;
  level: DifficultyLevel;
  bpm: number;
  description: string;
  techniqueTips: string[];
  sequence: {
    noteId: string;
    label: string;
    hand: 'Kanan' | 'Kiri' | 'Keduanya' | 'Diam';
    accent?: boolean;
  }[];
  demoCaption: string;
}

export type QuizCategory =
  | 'Pilihan Ganda'
  | 'Tebak Alat'
  | 'Tebak Suara'
  | 'Identifikasi Nada'
  | 'Identifikasi Notasi'
  | 'Evaluasi Ketukan';

export interface QuizQuestion {
  id: string;
  instrumentId?: InstrumentId;
  category: QuizCategory;
  question: string;
  audioCue?: {
    instrumentId: InstrumentId;
    noteIds: string[];
    bpm?: number;
  };
  notationCue?: string[];
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizResultRecord {
  id: string;
  date: string;
  scope: string; // e.g. "Semua Instrumen" or specific instrument name
  score: number; // 0-100
  correctCount: number;
  totalQuestions: number;
  durationSec: number;
}

export interface LearningHistoryItem {
  id: string;
  timestamp: string;
  module: 'Detail Instrumen' | 'Simulasi' | 'Partitur' | 'Pola Permainan' | 'Latihan Mandiri' | 'Kuis' | 'Perpustakaan';
  title: string;
  instrumentId?: InstrumentId;
  targetId?: string;
}

export interface CulturalArticle {
  id: string;
  category: 'Sejarah' | 'Dokumentasi' | 'Teknik & Pertunjukan' | 'Pelestarian';
  title: string;
  readTime: string;
  summary: string;
  paragraphs: string[];
  keyTakeaways: string[];
  relatedInstrumentIds: InstrumentId[];
}

export interface GlossaryItem {
  term: string;
  category: string;
  definition: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'pengingat' | 'materi' | 'evaluasi';
}

export interface UserProfile {
  name: string;
  email: string;
  institution: string;
  role: UserRole;
  dailyTargetMinutes: number;
  todayMinutes: number;
  weeklyGoalModules: number;
  streakDays: number;
}

export interface AppSettings {
  masterVolume: number;
  metronomeEnabled: boolean;
  showKeyHints: boolean;
  reminderEnabled: boolean;
  reminderTime: string;
}
