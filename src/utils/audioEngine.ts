import { InstrumentNote, SoundProfile } from '../types/karawi';

class KarawiAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private volume = 0.8;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volume;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.02);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public playMetronomeClick(accent = false) {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(accent ? 1180 : 860, now);
    osc.frequency.exponentialRampToValueAtTime(accent ? 540 : 410, now + 0.04);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(accent ? 0.28 : 0.16, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.055);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  public playNote(note: InstrumentNote, profile: SoundProfile, velocity = 1) {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const vel = Math.max(0.2, Math.min(1.2, velocity));

    if (profile === 'gendang-melayu' || profile === 'gendang-sike') {
      this.playDrumTone(ctx, now, note, profile, vel);
      return;
    }

    if (profile === 'gong-deep' || profile === 'tetawak-mid') {
      this.playGongTone(ctx, now, note, profile, vel);
      return;
    }

    this.playKalinongTone(ctx, now, note, profile, vel);
  }

  private playKalinongTone(
    ctx: AudioContext,
    now: number,
    note: InstrumentNote,
    profile: SoundProfile,
    vel: number
  ) {
    if (!this.masterGain) return;

    const baseFreq = note.frequency;
    const decay = profile === 'kalinong-high' ? 1.55 : profile === 'kalinong-mid' ? 1.95 : 2.35;

    // Bronze kettle partials (fundamental + warm slightly inharmonic metallic overtones)
    const partials = [
      { ratio: 1.0, amp: 0.42, decayMult: 1.0, type: 'sine' as OscillatorType },
      { ratio: 1.003, amp: 0.18, decayMult: 0.9, type: 'sine' as OscillatorType }, // subtle shimmering beat
      { ratio: 2.02, amp: 0.16, decayMult: 0.55, type: 'triangle' as OscillatorType },
      { ratio: 2.86, amp: 0.09, decayMult: 0.32, type: 'sine' as OscillatorType },
      { ratio: 4.18, amp: 0.045, decayMult: 0.16, type: 'sine' as OscillatorType },
    ];

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(profile === 'kalinong-high' ? 5200 : 3800, now);
    filter.frequency.exponentialRampToValueAtTime(1100, now + decay * 0.7);
    filter.connect(this.masterGain);

    partials.forEach((p) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = p.type;
      osc.frequency.setValueAtTime(baseFreq * p.ratio, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(p.amp * vel, now + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + decay * p.decayMult);

      osc.connect(gain);
      gain.connect(filter);
      osc.start(now);
      osc.stop(now + decay * p.decayMult + 0.04);
    });

    // Soft padded mallet transient
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(baseFreq * 3.1, now);
    clickOsc.frequency.exponentialRampToValueAtTime(baseFreq * 1.2, now + 0.025);
    clickGain.gain.setValueAtTime(0.14 * vel, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    clickOsc.connect(clickGain);
    clickGain.connect(this.masterGain);
    clickOsc.start(now);
    clickOsc.stop(now + 0.035);
  }

  private playGongTone(
    ctx: AudioContext,
    now: number,
    note: InstrumentNote,
    profile: SoundProfile,
    vel: number
  ) {
    if (!this.masterGain) return;

    const isRim = note.toneType === 'gong-rim';
    const isDeepGong = profile === 'gong-deep';
    const baseFreq = note.frequency;
    const duration = isRim ? 1.4 : isDeepGong ? 4.2 : 2.9;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isRim ? 3200 : isDeepGong ? 1200 : 1850, now);
    filter.frequency.exponentialRampToValueAtTime(isDeepGong ? 360 : 620, now + duration);
    filter.connect(this.masterGain);

    // Traditional Indonesian gong "ombak" (slow amplitude beating via detuned pairs)
    const beatHz = isDeepGong ? 1.7 : 2.3;
    const harmonics = isRim
      ? [
          { freq: baseFreq * 1.45, amp: 0.25, dur: 1.1 },
          { freq: baseFreq * 2.32, amp: 0.16, dur: 0.85 },
          { freq: baseFreq * 3.61, amp: 0.1, dur: 0.45 },
        ]
      : [
          { freq: baseFreq, amp: 0.48, dur: duration },
          { freq: baseFreq + beatHz, amp: 0.32, dur: duration * 0.95 },
          { freq: baseFreq * 1.5, amp: 0.18, dur: duration * 0.65 },
          { freq: baseFreq * 2.01, amp: 0.14, dur: duration * 0.5 },
          { freq: baseFreq * 2.94, amp: 0.08, dur: duration * 0.3 },
        ];

    harmonics.forEach((h) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(h.freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(h.amp * vel, now + (isRim ? 0.008 : 0.045));
      gain.gain.exponentialRampToValueAtTime(0.0005, now + h.dur);

      osc.connect(gain);
      gain.connect(filter);
      osc.start(now);
      osc.stop(now + h.dur + 0.06);
    });
  }

  private playDrumTone(
    ctx: AudioContext,
    now: number,
    note: InstrumentNote,
    profile: SoundProfile,
    vel: number
  ) {
    if (!this.masterGain) return;

    const toneType = note.toneType || 'drum-low';
    const isSike = profile === 'gendang-sike';

    if (toneType === 'drum-low') {
      // Resonant open low membrane ("Dung" / "Bum")
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startFreq = isSike ? note.frequency * 1.55 : note.frequency * 1.75;
      const endFreq = note.frequency;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.085);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.68 * vel, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (isSike ? 0.42 : 0.52));

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.55);

      // Warm overtone body
      const overtone = ctx.createOscillator();
      const overGain = ctx.createGain();
      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(endFreq * 1.52, now);
      overGain.gain.setValueAtTime(0.18 * vel, now);
      overGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      overtone.connect(overGain);
      overGain.connect(this.masterGain);
      overtone.start(now);
      overtone.stop(now + 0.16);
    } else {
      // Crisp high/slap membrane ("Tak", "Ting", "Pak", "Tek")
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      const isSlap = toneType === 'drum-slap';

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.frequency * 1.4, now);
      osc.frequency.exponentialRampToValueAtTime(note.frequency, now + 0.04);

      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.linearRampToValueAtTime((isSlap ? 0.34 : 0.42) * vel, now + 0.003);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + (isSlap ? 0.09 : 0.18));

      osc.connect(oscGain);
      oscGain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.2);

      // Filtered noise burst for authentic hand-skin strike
      const bufferSize = Math.floor(ctx.sampleRate * 0.12);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.025));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(isSlap ? 1850 : 1250, now);
      bandpass.Q.setValueAtTime(1.8, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime((isSlap ? 0.55 : 0.35) * vel, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      noise.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      noise.start(now);
      noise.stop(now + 0.11);
    }
  }
}

export const karawiAudio = new KarawiAudioEngine();
