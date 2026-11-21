import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Database,
  Download,
  HelpCircle,
  LogOut,
  Plus,
  Settings,
  ShieldCheck,
  Trash2,
  UserCog,
} from 'lucide-react';
import {
  AppNotification,
  AppSettings,
  InstrumentData,
  InstrumentId,
  MusicScore,
  QuizQuestion,
  UserProfile,
  UserRole,
} from '../types/karawi';
import { HELP_FAQS } from '../data/learningData';
import { karawiAudio } from '../utils/audioEngine';
import { KarawiEmblem } from './InstrumentVisuals';

interface ProfileViewProps {
  profile: UserProfile;
  settings: AppSettings;
  instruments: InstrumentData[];
  scores: MusicScore[];
  quizQuestions: QuizQuestion[];
  offlineIds: string[];
  notifications: AppNotification[];
  onUpdateProfile: (patch: Partial<UserProfile>) => void;
  onUpdateSettings: (patch: Partial<AppSettings>) => void;
  onMarkAllNotificationsRead: () => void;
  onRemoveOffline: (id: string) => void;
  onAddQuizQuestion: (q: QuizQuestion) => void;
  onDeleteQuizQuestion: (id: string) => void;
  onUpdateInstrumentValidation: (
    id: InstrumentId,
    status: InstrumentData['validationStatus'],
    note: string
  ) => void;
  onLogout: () => void;
  onOpenInstrumentDetail: (id: InstrumentId) => void;
}

type ProfileSection = 'akun' | 'offline' | 'notifikasi' | 'pengaturan' | 'bantuan' | 'admin' | 'validator';

const ROLE_LABELS: Record<UserRole, string> = {
  mahasiswa: 'Mahasiswa / Pengguna',
  pengunjung: 'Pengunjung',
  admin: 'Admin Sistem',
  validator: 'Dosen / Praktisi Karawitan',
};

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  settings,
  instruments,
  scores,
  quizQuestions,
  offlineIds,
  notifications,
  onUpdateProfile,
  onUpdateSettings,
  onMarkAllNotificationsRead,
  onRemoveOffline,
  onAddQuizQuestion,
  onDeleteQuizQuestion,
  onUpdateInstrumentValidation,
  onLogout,
  onOpenInstrumentDetail,
}) => {
  const [section, setSection] = useState<ProfileSection>('akun');
  const [editName, setEditName] = useState(profile.name);
  const [editInst, setEditInst] = useState(profile.institution);
  const [savedMsg, setSavedMsg] = useState(false);

  // Admin quick-add quiz state
  const [newQText, setNewQText] = useState('');
  const [newQInst, setNewQInst] = useState<InstrumentId>('kalinong-melodi');
  const [newQOptA, setNewQOptA] = useState('');
  const [newQOptB, setNewQOptB] = useState('');
  const [newQOptC, setNewQOptC] = useState('');
  const [newQOptD, setNewQOptD] = useState('');
  const [newQExp, setNewQExp] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name: editName.trim() || profile.name, institution: editInst.trim() || profile.institution });
    setSavedMsg(true);
    window.setTimeout(() => setSavedMsg(false), 2000);
  };

  const handleCreateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQText.trim() || !newQOptA.trim() || !newQOptB.trim()) return;
    onAddQuizQuestion({
      id: `q-custom-${Date.now()}`,
      instrumentId: newQInst,
      category: 'Pilihan Ganda',
      question: newQText.trim(),
      options: [newQOptA.trim(), newQOptB.trim(), newQOptC.trim() || 'Pilihan C', newQOptD.trim() || 'Pilihan D'],
      correctIndex: 0,
      explanation: newQExp.trim() || 'Ditambahkan melalui Panel Admin KARAWI.',
    });
    setNewQText('');
    setNewQOptA('');
    setNewQOptB('');
    setNewQOptC('');
    setNewQOptD('');
    setNewQExp('');
  };

  const navItems: { id: ProfileSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'akun', label: 'Akun & Peran', icon: UserCog },
    ...(profile.role === 'admin' ? [{ id: 'admin' as const, label: 'Panel Admin', icon: Database }] : []),
    ...(profile.role === 'validator'
      ? [{ id: 'validator' as const, label: 'Validasi Materi', icon: ShieldCheck }]
      : []),
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
    { id: 'bantuan', label: 'Pusat Bantuan', icon: HelpCircle },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Hero */}
      <div className="jambi-pattern-bg rounded-2xl p-6 text-[#FBF4E6] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-1.5 rounded-full bg-[#38070B]/70 border border-[#DFB054]/50">
            <KarawiEmblem size="md" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#F0CB7D]">{ROLE_LABELS[profile.role]}</div>
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-xs text-[#EFE2CA]/80">
              {profile.institution} · {profile.email}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="min-h-[42px] px-4 py-2 rounded-xl border border-[#DFB054]/45 text-xs font-semibold text-[#FBF4E6] hover:bg-white/10 inline-flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Keluar Akun
        </button>
      </div>

      {/* Section tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#EFE2CA] rounded-xl overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSection(item.id)}
              className={`min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 transition-colors ${
                section === item.id ? 'bg-[#5B0E14] text-[#FBF4E6]' : 'text-[#553B2E] hover:text-[#2B1810]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* AKUN & PERAN AKTOR */}
      {section === 'akun' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <form onSubmit={handleSaveProfile} className="bg-[#FFFBF3] border border-[#DFCCA8] rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#5B0E14]">Informasi Pengguna</h2>
              {savedMsg && (
                <span className="text-xs font-semibold text-emerald-800 inline-flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Diperbarui
                </span>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#553B2E] mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full min-h-[44px] px-3.5 rounded-xl bg-[#F7EFE1] border border-[#DFCCA8] text-sm text-[#2B1810]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#553B2E] mb-1">Instansi / Sanggar</label>
              <input
                type="text"
                value={editInst}
                onChange={(e) => setEditInst(e.target.value)}
                className="w-full min-h-[44px] px-3.5 rounded-xl bg-[#F7EFE1] border border-[#DFCCA8] text-sm text-[#2B1810]"
              />
            </div>
            <button
              type="submit"
              className="min-h-[44px] px-5 py-2 rounded-xl bg-[#5B0E14] text-[#FBF4E6] text-xs font-semibold hover:bg-[#76161E]"
            >
              Simpan Perubahan Profil
            </button>
          </form>

          <div className="bg-[#FFFBF3] border border-[#DFCCA8] rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <h2 className="text-base font-bold text-[#5B0E14]">Peran Akun Terdaftar</h2>
              <p className="text-xs text-[#63483A]">
                Peran akun ditetapkan saat proses registrasi dan menentukan hak akses Anda di dalam aplikasi KARAWI.
              </p>
              <div className="mt-3 p-4 rounded-xl bg-[#F7EFE1] border border-[#DFCCA8] space-y-1">
                <div className="text-xs text-[#9C6D1E] font-semibold">Peran Aktif</div>
                <div className="text-base font-bold text-[#5B0E14]">{ROLE_LABELS[profile.role]}</div>
                <div className="text-xs text-[#553B2E]">
                  {profile.role === 'mahasiswa' && 'Akses penuh belajar 8 instrumen, simulasi, partitur, latihan, kuis & progres.'}
                  {profile.role === 'pengunjung' && 'Akses menjelajahi informasi umum instrumen dan perpustakaan budaya.'}
                  {profile.role === 'admin' && 'Akses mengelola data instrumen, partitur, dan bank soal evaluasi.'}
                  {profile.role === 'validator' && 'Akses meninjau dan memvalidasi keakuratan materi budaya Karawitan Jambi.'}
                </div>
              </div>
            </div>
            <p className="text-[11px] text-[#7B6052]">
              Untuk menggunakan peran lain, silakan keluar akun lalu masuk atau registrasi dengan peran yang sesuai.
            </p>
          </div>
        </div>
      )}

      {/* PANEL ADMIN */}
      {section === 'admin' && profile.role === 'admin' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#FFFBF3] border border-[#DFCCA8] rounded-2xl p-4">
              <div className="text-xs text-[#63483A]">Total Instrumen</div>
              <div className="text-2xl font-bold font-mono text-[#5B0E14] mt-1 tabular-nums">{instruments.length}</div>
            </div>
            <div className="bg-[#FFFBF3] border border-[#DFCCA8] rounded-2xl p-4">
              <div className="text-xs text-[#63483A]">Total Partitur</div>
              <div className="text-2xl font-bold font-mono text-[#5B0E14] mt-1 tabular-nums">{scores.length}</div>
            </div>
            <div className="bg-[#FFFBF3] border border-[#DFCCA8] rounded-2xl p-4">
              <div className="text-xs text-[#63483A]">Total Soal Evaluasi</div>
              <div className="text-2xl font-bold font-mono text-[#5B0E14] mt-1 tabular-nums">{quizQuestions.length}</div>
            </div>
          </div>

          <form onSubmit={handleCreateQuiz} className="bg-[#FFFBF3] border border-[#DFCCA8] rounded-2xl p-5 space-y-4">
            <h3 className="text-base font-bold text-[#5B0E14] inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Tambah Soal Kuis Evaluasi Baru
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#553B2E] mb-1">Pertanyaan</label>
                <input
                  type="text"
                  value={newQText}
                  onChange={(e) => setNewQText(e.target.value)}
                  placeholder="Tulis pertanyaan evaluasi..."
                  className="w-full min-h-[42px] px-3 rounded-xl bg-[#F7EFE1] border border-[#DFCCA8] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#553B2E] mb-1">Instrumen Terkait</label>
                <select
                  value={newQInst}
                  onChange={(e) => setNewQInst(e.target.value as InstrumentId)}
                  className="w-full min-h-[42px] px-3 rounded-xl bg-[#F7EFE1] border border-[#DFCCA8] text-sm"
                >
                  {instruments.map((i) => (
                    <option key={i.id} value={i.id}>{i.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={newQOptA}
                onChange={(e) => setNewQOptA(e.target.value)}
                placeholder="Pilihan A (Jawaban Benar)"
                className="min-h-[42px] px-3 rounded-xl bg-[#F7EFE1] border border-[#DFCCA8] text-sm"
              />
              <input
                type="text"
                value={newQOptB}
                onChange={(e) => setNewQOptB(e.target.value)}
                placeholder="Pilihan B"
                className="min-h-[42px] px-3 rounded-xl bg-[#F7EFE1] border border-[#DFCCA8] text-sm"
              />
              <input
                type="text"
                value={newQOptC}
                onChange={(e) => setNewQOptC(e.target.value)}
                placeholder="Pilihan C"
                className="min-h-[42px] px-3 rounded-xl bg-[#F7EFE1] border border-[#DFCCA8] text-sm"
              />
              <input
                type="text"
                value={newQOptD}
                onChange={(e) => setNewQOptD(e.target.value)}
                placeholder="Pilihan D"
                className="min-h-[42px] px-3 rounded-xl bg-[#F7EFE1] border border-[#DFCCA8] text-sm"
              />
            </div>
            <input
              type="text"
              value={newQExp}
              onChange={(e) => setNewQExp(e.target.value)}
              placeholder="Pembahasan jawaban..."
              className="w-full min-h-[42px] px-3 rounded-xl bg-[#F7EFE1] border border-[#DFCCA8] text-sm"
            />
            <button
              type="submit"
              className="min-h-[42px] px-5 py-2 rounded-xl bg-[#5B0E14] text-[#FBF4E6] text-xs font-semibold hover:bg-[#76161E]"
            >
              Simpan Soal ke Bank Kuis
            </button>
          </form>

          <div className="bg-[#FFFBF3] border border-[#DFCCA8] rounded-2xl p-5 space-y-3">
            <h3 className="text-base font-bold text-[#5B0E14]">Daftar Bank Soal ({quizQuestions.length})</h3>
            <div className="divide-y divide-[#EFE2CA]">
              {quizQuestions.map((q) => (
                <div key={q.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-[#9C6D1E]">{q.category}</div>
                    <div className="text-sm text-[#2B1810] truncate">{q.question}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteQuizQuestion(q.id)}
                    className="min-h-[38px] min-w-[38px] rounded-lg text-red-700 hover:bg-red-50 flex items-center justify-center shrink-0"
                    aria-label="Hapus soal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PANEL VALIDATOR DOSEN / PRAKTISI */}
      {section === 'validator' && profile.role === 'validator' && (
        <div className="bg-[#FFFBF3] border border-[#DFCCA8] rounded-2xl p-5 sm:p-6 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-[#5B0E14]">Validasi Materi & Keakuratan Budaya (8 Instrumen)</h2>
            <p className="text-xs text-[#63483A]">
              Dosen dan praktisi Karawitan Jambi dapat meninjau serta menetapkan status validasi tiap instrumen.
            </p>
          </div>
          <div className="divide-y divide-[#EFE2CA]">
            {instruments.map((inst) => (
              <div key={inst.id} className="py-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-[#2B1810]">{inst.name}</div>
                  <div className="text-xs text-[#63483A]">
                    Status:{' '}
                    <span
                      className={
                        inst.validationStatus === 'Tervalidasi'
                          ? 'font-bold text-emerald-800'
                          : 'font-bold text-[#9C6D1E]'
                      }
                    >
                      {inst.validationStatus}
                    </span>
                  </div>
                  {inst.validatorNote && (
                    <div className="text-xs text-[#7B6052] mt-0.5">{inst.validatorNote}</div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateInstrumentValidation(
                        inst.id,
                        'Tervalidasi',
                        `Divalidasi oleh ${profile.name} pada ${new Date().toLocaleDateString('id-ID')}.`
                      )
                    }
                    className="min-h-[38px] px-3 rounded-xl bg-[#5B0E14] text-[#FBF4E6] text-xs font-semibold hover:bg-[#76161E]"
                  >
                    Tandai Tervalidasi
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenInstrumentDetail(inst.id)}
                    className="min-h-[38px] px-3 rounded-xl bg-[#EFE2CA] text-[#2B1810] text-xs font-semibold hover:bg-[#DFCCA8]"
                  >
                    Tinjau Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODE OFFLINE */}
      {section === 'offline' && (
        <div className="bg-[#FFFBF3] border border-[#DFCCA8] rounded-2xl p-5 sm:p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#5B0E14]">Materi Tersimpan untuk Mode Offline</h2>
            <p className="text-xs text-[#63483A]">
              Akses materi instrumen dan partitur yang sudah Anda unduh ke penyimpanan lokal perangkat.
            </p>
          </div>
          {offlineIds.length === 0 ? (
            <p className="text-xs text-[#7B6052]">
              Belum ada materi offline. Buka Detail Instrumen atau Partitur lalu tekan tombol "Simpan Offline".
            </p>
          ) : (
            <div className="divide-y divide-[#EFE2CA]">
              {offlineIds.map((oid) => {
                const isScore = oid.startsWith('score:');
                const sc = isScore ? scores.find((s) => `score:${s.id}` === oid) : null;
                const inst = !isScore ? instruments.find((i) => i.id === oid) : null;
                const title = sc ? `Partitur: ${sc.title}` : inst ? `Instrumen: ${inst.name}` : oid;
                return (
                  <div key={oid} className="py-3 flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-[#2B1810]">{title}</div>
                    <button
                      type="button"
                      onClick={() => onRemoveOffline(oid)}
                      className="text-xs font-semibold text-red-700 hover:underline min-h-[36px] px-2"
                    >
                      Hapus
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* NOTIFIKASI */}
      {section === 'notifikasi' && (
        <div className="bg-[#FFFBF3] border border-[#DFCCA8] rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#5B0E14]">Notifikasi & Pengingat Belajar</h2>
            <button
              type="button"
              onClick={onMarkAllNotificationsRead}
              className="text-xs font-semibold text-[#5B0E14] hover:underline"
            >
              Tandai Semua Dibaca
            </button>
          </div>
          <div className="divide-y divide-[#EFE2CA]">
            {notifications.map((n) => (
              <div key={n.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-[#2B1810]">
                    {n.title} {!n.read && <span className="text-xs text-[#9C6D1E] font-semibold">· Baru</span>}
                  </div>
                  <p className="text-xs text-[#553B2E] mt-0.5">{n.message}</p>
                </div>
                <span className="text-[11px] text-[#7B6052] whitespace-nowrap">{n.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PENGATURAN */}
      {section === 'pengaturan' && (
        <div className="bg-[#FFFBF3] border border-[#DFCCA8] rounded-2xl p-5 sm:p-6 space-y-5 max-w-xl">
          <h2 className="text-base font-bold text-[#5B0E14]">Preferensi Aplikasi KARAWI</h2>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#2B1810]">
              <span>Volume Audio Utama</span>
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
            />
          </div>

          <label className="flex items-center justify-between gap-3 py-2 border-t border-[#EFE2CA] cursor-pointer">
            <div>
              <div className="text-sm font-semibold text-[#2B1810]">Bunyi Metronom pada Partitur</div>
              <div className="text-xs text-[#63483A]">Aktifkan klik ketukan saat memutar partitur sinkron.</div>
            </div>
            <input
              type="checkbox"
              checked={settings.metronomeEnabled}
              onChange={(e) => onUpdateSettings({ metronomeEnabled: e.target.checked })}
              className="w-5 h-5 accent-[#5B0E14]"
            />
          </label>

          <label className="flex items-center justify-between gap-3 py-2 border-t border-[#EFE2CA] cursor-pointer">
            <div>
              <div className="text-sm font-semibold text-[#2B1810]">Tampilkan Pintasan Keyboard (A–K)</div>
              <div className="text-xs text-[#63483A]">Memudahkan permainan simulasi di perangkat laptop/desktop.</div>
            </div>
            <input
              type="checkbox"
              checked={settings.showKeyHints}
              onChange={(e) => onUpdateSettings({ showKeyHints: e.target.checked })}
              className="w-5 h-5 accent-[#5B0E14]"
            />
          </label>

          <div className="flex items-center justify-between gap-3 py-2 border-t border-[#EFE2CA]">
            <div>
              <div className="text-sm font-semibold text-[#2B1810]">Jadwal Pengingat Belajar</div>
              <div className="text-xs text-[#63483A]">Waktu rutin latihan Karawitan harian.</div>
            </div>
            <input
              type="time"
              value={settings.reminderTime}
              onChange={(e) => onUpdateSettings({ reminderTime: e.target.value })}
              className="min-h-[40px] px-3 rounded-xl bg-[#F7EFE1] border border-[#DFCCA8] text-sm font-mono"
            />
          </div>
        </div>
      )}

      {/* PUSAT BANTUAN */}
      {section === 'bantuan' && (
        <div className="bg-[#FFFBF3] border border-[#DFCCA8] rounded-2xl p-5 sm:p-6 space-y-4">
          <h2 className="text-base font-bold text-[#5B0E14]">Pusat Bantuan & Panduan Penggunaan</h2>
          <div className="divide-y divide-[#EFE2CA]">
            {HELP_FAQS.map((faq, idx) => (
              <div key={idx} className="py-3.5 first:pt-0 last:pb-0">
                <div className="text-sm font-bold text-[#2B1810]">{faq.q}</div>
                <p className="text-xs text-[#553B2E] mt-1 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
