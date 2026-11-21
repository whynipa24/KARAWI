import React, { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, KeyRound, Mail, Music2, ShieldCheck, Sparkles, User } from 'lucide-react';
import { UserProfile, UserRole } from '../types/karawi';
import { KarawiEmblem } from './InstrumentVisuals';

interface AuthOnboardingProps {
  initialStage: 'splash' | 'onboarding' | 'auth';
  onCompleteAuth: (profile: UserProfile) => void;
}

const ONBOARDING_SLIDES = [
  {
    title: 'Delapan Instrumen Karawitan Jambi',
    subtitle: 'Satu platform terintegrasi untuk mengenal Kalinong Hias, Melodi, Jalan, Penegas, Gong, Gendang Melayu, Gendang Sike, dan Tetawak.',
    icon: Music2,
  },
  {
    title: 'Simulasi Suara & Partitur Sinkron',
    subtitle: 'Sentuh langsung pencon dan membran virtual dengan audio sintesis khas, lengkap dengan penanda partitur bergerak dan pengaturan tempo.',
    icon: BookOpen,
  },
  {
    title: 'Latihan Mandiri, Evaluasi & Budaya',
    subtitle: 'Uji pendengaran nada, ketepatan ketukan, dan pemahaman sejarah Karawitan Jambi secara interaktif.',
    icon: ShieldCheck,
  },
];

const ROLE_PRESETS: { role: UserRole; label: string; desc: string; name: string; institution: string }[] = [
  {
    role: 'mahasiswa',
    label: 'Mahasiswa / Pengguna',
    desc: 'Belajar penuh, simulasi, latihan, kuis, dan pantau progres.',
    name: 'Satria Raziq Hamizan',
    institution: 'Mahasiswa Seni Karawitan Jambi',
  },
  {
    role: 'pengunjung',
    label: 'Pengunjung',
    desc: 'Eksplorasi informasi umum 8 instrumen dan materi budaya.',
    name: 'Tamu Budaya Jambi',
    institution: 'Pengunjung Umum',
  },
  {
    role: 'validator',
    label: 'Dosen / Praktisi Karawitan',
    desc: 'Validasi materi, kebenaran nada, dan informasi budaya.',
    name: 'Dr. H. Ahmad Zulkarnain',
    institution: 'Dosen & Praktisi Karawitan Jambi',
  },
  {
    role: 'admin',
    label: 'Admin Sistem',
    desc: 'Kelola data instrumen, partitur, dan bank soal kuis.',
    name: 'Pengelola KARAWI',
    institution: 'Tim Pengembang KARAWI',
  },
];

function generateOtpCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export const AuthOnboarding: React.FC<AuthOnboardingProps> = ({ initialStage, onCompleteAuth }) => {
  const [stage, setStage] = useState<'splash' | 'onboarding' | 'auth'>(initialStage);
  const [slideIdx, setSlideIdx] = useState(0);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('satria.karawi@unja.ac.id');
  const [institution, setInstitution] = useState('');
  const [password, setPassword] = useState('karawi123');
  const [selectedRole, setSelectedRole] = useState<UserRole>('mahasiswa');
  const [error, setError] = useState('');

  // OTP Verification states (for Registrasi)
  const [otpStep, setOtpStep] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(0);

  useEffect(() => {
    if (otpCountdown <= 0) return;
    const t = window.setInterval(() => {
      setOtpCountdown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => window.clearInterval(t);
  }, [otpCountdown]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Mohon lengkapi email dan kata sandi terlebih dahulu.');
      return;
    }
    setError('');
    const preset = ROLE_PRESETS.find((r) => r.role === selectedRole) || ROLE_PRESETS[0];
    onCompleteAuth({
      name: preset.name,
      email: email.trim(),
      institution: preset.institution,
      role: selectedRole,
      dailyTargetMinutes: 20,
      todayMinutes: 12,
      weeklyGoalModules: 6,
      streakDays: 4,
    });
  };

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !institution.trim() || !email.trim() || !password.trim()) {
      setError('Mohon lengkapi Nama Lengkap, Instansi/Sanggar, Email, dan Kata Sandi.');
      return;
    }
    if (password.trim().length < 6) {
      setError('Kata sandi minimal 6 karakter.');
      return;
    }
    setError('');
    const code = generateOtpCode();
    setGeneratedOtp(code);
    setOtpInput('');
    setOtpCountdown(60);
    setOtpStep(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.trim() !== generatedOtp) {
      setError('Kode OTP tidak sesuai. Periksa kembali 6 digit kode verifikasi Anda.');
      return;
    }
    setError('');
    onCompleteAuth({
      name: name.trim(),
      email: email.trim(),
      institution: institution.trim(),
      role: selectedRole,
      dailyTargetMinutes: 20,
      todayMinutes: 0,
      weeklyGoalModules: 6,
      streakDays: 1,
    });
  };

  const handleQuickEnter = (role: UserRole) => {
    const preset = ROLE_PRESETS.find((r) => r.role === role) || ROLE_PRESETS[0];
    onCompleteAuth({
      name: preset.name,
      email: `${role}@karawi.jambi.id`,
      institution: preset.institution,
      role,
      dailyTargetMinutes: 20,
      todayMinutes: 12,
      weeklyGoalModules: 6,
      streakDays: 4,
    });
  };

  if (stage === 'splash') {
    return (
      <div className="min-h-screen jambi-pattern-bg flex flex-col items-center justify-center p-6 text-[#FBF4E6]">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-[#38070B]/70 border border-[#DFB054]/50 shadow-2xl">
              <KarawiEmblem size="lg" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-wider text-[#F5D78E]">KARAWI</h1>
            <p className="text-sm sm:text-base tracking-wide text-[#F7EFE1]/85">
              Digital Karawitan Jambi Learning Platform
            </p>
          </div>
          <p className="text-sm text-[#EFE2CA]/80 leading-relaxed max-w-sm mx-auto">
            Belajar seni Karawitan Jambi lebih mudah, terstruktur, dan interaktif bersama delapan instrumen tradisional asli.
          </p>
          <div className="pt-4 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setStage('onboarding')}
              className="w-full min-h-[48px] px-6 py-3 rounded-xl bg-[#DFB054] text-[#38070B] font-semibold text-sm hover:bg-[#F0CB7D] transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              Mulai Pengenalan Aplikasi
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setStage('auth')}
              className="w-full min-h-[44px] px-6 py-2.5 rounded-xl border border-[#DFB054]/40 text-[#F7EFE1] font-medium text-sm hover:bg-white/10 transition-colors"
            >
              Masuk / Registrasi Akun
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'onboarding') {
    const slide = ONBOARDING_SLIDES[slideIdx];
    const SlideIcon = slide.icon;
    return (
      <div className="min-h-screen jambi-cream-pattern flex items-center justify-center p-5">
        <div className="max-w-lg w-full bg-[#FFFBF3] border border-[#DFCCA8] rounded-3xl p-6 sm:p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <KarawiEmblem size="sm" />
              <span className="font-serif-display font-bold text-lg text-[#5B0E14]">KARAWI</span>
            </div>
            <button
              type="button"
              onClick={() => setStage('auth')}
              className="text-sm font-medium text-[#7B6052] hover:text-[#5B0E14] min-h-[44px] px-2"
            >
              Lewati
            </button>
          </div>

          <div className="rounded-2xl jambi-pattern-bg p-8 text-center text-[#FBF4E6] mb-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#DFB054]/20 border border-[#DFB054]/50 flex items-center justify-center mb-4">
              <SlideIcon className="w-8 h-8 text-[#F0CB7D]" />
            </div>
            <p className="text-xs text-[#F0CB7D] font-medium mb-1">
              Pengenalan Awal {slideIdx + 1} dari {ONBOARDING_SLIDES.length}
            </p>
            <h2 className="text-2xl font-bold text-[#FFFBF3] text-balance">{slide.title}</h2>
          </div>

          <p className="text-sm sm:text-base text-[#553B2E] leading-relaxed text-center mb-6">
            {slide.subtitle}
          </p>

          <div className="flex items-center justify-center gap-2 mb-6">
            {ONBOARDING_SLIDES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSlideIdx(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${
                  idx === slideIdx ? 'w-8 bg-[#5B0E14]' : 'w-2 bg-[#DFCCA8]'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            {slideIdx > 0 && (
              <button
                type="button"
                onClick={() => setSlideIdx((s) => s - 1)}
                className="min-h-[46px] px-5 py-2.5 rounded-xl border border-[#DFCCA8] text-[#553B2E] font-medium text-sm hover:bg-[#EFE2CA]"
              >
                Kembali
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (slideIdx < ONBOARDING_SLIDES.length - 1) {
                  setSlideIdx((s) => s + 1);
                } else {
                  setStage('auth');
                }
              }}
              className="flex-1 min-h-[46px] px-5 py-2.5 rounded-xl bg-[#5B0E14] text-[#FBF4E6] font-semibold text-sm hover:bg-[#76161E] transition-colors flex items-center justify-center gap-2"
            >
              {slideIdx < ONBOARDING_SLIDES.length - 1 ? 'Selanjutnya' : 'Lanjut ke Login / Registrasi'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen jambi-cream-pattern flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-5 bg-[#FFFBF3] border border-[#DFCCA8] rounded-3xl overflow-hidden shadow-xl">
        {/* Left heritage intro panel (Pengenalan Awal Aplikasi KARAWI) */}
        <div className="lg:col-span-2 jambi-pattern-bg p-6 sm:p-8 text-[#FBF4E6] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <KarawiEmblem size="md" />
              <div>
                <h1 className="text-2xl font-bold text-[#F5D78E] tracking-wide">KARAWI</h1>
                <p className="text-xs text-[#EFE2CA]/80">Digital Karawitan Jambi</p>
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold leading-snug mb-3 text-balance">
              Belajar Karawitan Jambi Lebih Mudah dan Interaktif
            </h2>
            <p className="text-sm text-[#EFE2CA]/85 leading-relaxed">
              Aplikasi pembelajaran seni Karawitan Jambi yang menyediakan pengenalan 8 alat musik tradisional, simulasi instrumen virtual, partitur sinkron audio, latihan mandiri, kuis evaluasi per instrumen, dan perpustakaan budaya.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-[#DFB054]/25 space-y-2.5 text-xs text-[#F0CB7D]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>8 Instrumen: Kalinong (4), Gong, Gendang (2), Tetawak</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Registrasi aman dengan Verifikasi OTP email</span>
            </div>
          </div>
        </div>

        {/* Right Auth Panel */}
        <div className="lg:col-span-3 p-6 sm:p-8">
          <div className="flex items-center gap-1 p-1 bg-[#EFE2CA] rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setOtpStep(false);
                setError('');
              }}
              className={`flex-1 min-h-[42px] text-sm font-semibold rounded-lg transition-colors ${
                authMode === 'login' ? 'bg-[#5B0E14] text-[#FBF4E6]' : 'text-[#553B2E] hover:text-[#2B1810]'
              }`}
            >
              Masuk Akun
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setOtpStep(false);
                setError('');
              }}
              className={`flex-1 min-h-[42px] text-sm font-semibold rounded-lg transition-colors ${
                authMode === 'register' ? 'bg-[#5B0E14] text-[#FBF4E6]' : 'text-[#553B2E] hover:text-[#2B1810]'
              }`}
            >
              Registrasi
            </button>
          </div>

          {/* MASUK AKUN */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#553B2E] mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full min-h-[44px] px-3.5 rounded-xl bg-[#F7EFE1] border border-[#DFCCA8] text-sm text-[#2B1810] focus:outline-none focus:border-[#5B0E14]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#553B2E] mb-1.5">Kata Sandi</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full min-h-[44px] px-3.5 rounded-xl bg-[#F7EFE1] border border-[#DFCCA8] text-sm text-[#2B1810] focus:outline-none focus:border-[#5B0E14]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#553B2E] mb-1.5">Peran Akun</label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLE_PRESETS.map((r) => (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => setSelectedRole(r.role)}
                      className={`p-2.5 rounded-xl border text-left transition-colors ${
                        selectedRole === r.role
                          ? 'border-[#5B0E14] bg-[#F5E1E3]/60 text-[#5B0E14]'
                          : 'border-[#DFCCA8] bg-[#F7EFE1] text-[#553B2E] hover:border-[#C69032]'
                      }`}
                    >
                      <div className="text-xs font-semibold">{r.label}</div>
                      <div className="text-[11px] text-[#7B6052] line-clamp-1 mt-0.5">{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="text-xs font-medium text-red-700">{error}</p>}

              <button
                type="submit"
                className="w-full min-h-[48px] rounded-xl bg-[#5B0E14] text-[#FBF4E6] font-semibold text-sm hover:bg-[#76161E] transition-colors shadow-sm"
              >
                Masuk ke KARAWI
              </button>
            </form>
          )}

          {/* REGISTRASI STEP 1: DATA DIRI */}
          {authMode === 'register' && !otpStep && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#553B2E] mb-1.5">Nama Lengkap</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Satria Raziq Hamizan"
                    className="w-full min-h-[44px] px-3.5 rounded-xl bg-[#F7EFE1] border border-[#DFCCA8] text-sm text-[#2B1810] focus:outline-none focus:border-[#5B0E14]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#553B2E] mb-1.5">Instansi / Sanggar</label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="Universitas / Sanggar Seni"
                    className="w-full min-h-[44px] px-3.5 rounded-xl bg-[#F7EFE1] border border-[#DFCCA8] text-sm text-[#2B1810] focus:outline-none focus:border-[#5B0E14]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#553B2E] mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full min-h-[44px] px-3.5 rounded-xl bg-[#F7EFE1] border border-[#DFCCA8] text-sm text-[#2B1810] focus:outline-none focus:border-[#5B0E14]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#553B2E] mb-1.5">Kata Sandi</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full min-h-[44px] px-3.5 rounded-xl bg-[#F7EFE1] border border-[#DFCCA8] text-sm text-[#2B1810] focus:outline-none focus:border-[#5B0E14]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#553B2E] mb-1.5">Pilih Peran</label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLE_PRESETS.map((r) => (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => setSelectedRole(r.role)}
                      className={`p-2.5 rounded-xl border text-left transition-colors ${
                        selectedRole === r.role
                          ? 'border-[#5B0E14] bg-[#F5E1E3]/60 text-[#5B0E14]'
                          : 'border-[#DFCCA8] bg-[#F7EFE1] text-[#553B2E] hover:border-[#C69032]'
                      }`}
                    >
                      <div className="text-xs font-semibold">{r.label}</div>
                      <div className="text-[11px] text-[#7B6052] line-clamp-1 mt-0.5">{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="text-xs font-medium text-red-700">{error}</p>}

              <button
                type="submit"
                className="w-full min-h-[48px] rounded-xl bg-[#5B0E14] text-[#FBF4E6] font-semibold text-sm hover:bg-[#76161E] transition-colors shadow-sm inline-flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Kirim Kode Verifikasi OTP
              </button>
            </form>
          )}

          {/* REGISTRASI STEP 2: VERIFIKASI OTP */}
          {authMode === 'register' && otpStep && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#FFF6DE] border border-[#DFCCA8] space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#5B0E14]">
                  <KeyRound className="w-4 h-4 text-[#9C6D1E]" />
                  Verifikasi OTP Registrasi
                </div>
                <p className="text-xs text-[#553B2E]">
                  Kode 6 digit telah dikirim ke <span className="font-semibold text-[#2B1810]">{email}</span>.
                </p>
                <div className="pt-1 text-xs text-[#63483A]">
                  Kode OTP simulasi Anda:{' '}
                  <span className="font-mono font-bold text-sm text-[#5B0E14] tracking-widest">
                    {generatedOtp}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#553B2E] mb-1.5">
                  Masukkan 6 Digit Kode OTP
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full min-h-[50px] px-4 rounded-xl bg-[#F7EFE1] border border-[#DFCCA8] text-center font-mono text-xl font-bold tracking-[0.4em] text-[#5B0E14] focus:outline-none focus:border-[#5B0E14]"
                />
              </div>

              {error && <p className="text-xs font-medium text-red-700">{error}</p>}

              <div className="flex items-center justify-between text-xs text-[#63483A]">
                <button
                  type="button"
                  onClick={() => {
                    setOtpStep(false);
                    setError('');
                  }}
                  className="font-semibold text-[#553B2E] hover:text-[#5B0E14]"
                >
                  ← Ubah Data
                </button>
                <button
                  type="button"
                  disabled={otpCountdown > 0}
                  onClick={() => {
                    setGeneratedOtp(generateOtpCode());
                    setOtpCountdown(60);
                    setError('');
                  }}
                  className="font-semibold text-[#5B0E14] disabled:text-[#7B6052]"
                >
                  {otpCountdown > 0 ? `Kirim ulang (${otpCountdown}d)` : 'Kirim Ulang OTP'}
                </button>
              </div>

              <button
                type="submit"
                className="w-full min-h-[48px] rounded-xl bg-[#5B0E14] text-[#FBF4E6] font-semibold text-sm hover:bg-[#76161E] transition-colors shadow-sm"
              >
                Verifikasi OTP & Selesaikan Registrasi
              </button>
            </form>
          )}

          <div className="mt-5 pt-4 border-t border-[#EFE2CA] flex flex-wrap items-center justify-between gap-2 text-xs text-[#7B6052]">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Ingin mencoba cepat?
            </span>
            <button
              type="button"
              onClick={() => handleQuickEnter('pengunjung')}
              className="font-semibold text-[#5B0E14] hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Masuk sebagai Pengunjung
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
