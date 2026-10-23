// Web Audio API Retro Chiptune Synthesizer

class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  private isMuted: boolean = false;
  private masterVolume: number = 0.7;
  private musicVolume: number = 0.5;
  private sfxVolume: number = 0.8;

  private currentTrack: string | null = null;
  private musicInterval: number | null = null;
  private musicStep: number = 0;
  private isUnlocked: boolean = false;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : this.masterVolume;
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.musicVolume;
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.sfxVolume;
      this.sfxGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isUnlocked = true;
  }

  public unlock() {
    this.initCtx();
  }

  public setVolumes(master: number, music: number, sfx: number) {
    this.masterVolume = master;
    this.musicVolume = music;
    this.sfxVolume = sfx;

    if (this.masterGain && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(master, this.ctx?.currentTime || 0, 0.05);
    }
    if (this.musicGain) {
      this.musicGain.gain.setTargetAtTime(music, this.ctx?.currentTime || 0, 0.05);
    }
    if (this.sfxGain) {
      this.sfxGain.gain.setTargetAtTime(sfx, this.ctx?.currentTime || 0, 0.05);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Helper note frequency converter
  private noteToFreq(note: string): number {
    const notes: Record<string, number> = {
      'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
      'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
      'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77,
      'C6': 1046.50, 'D6': 1174.66, 'E6': 1318.51, 'G6': 1567.98, 'C7': 2093.00,
      '-': 0
    };
    return notes[note] || 0;
  }

  // Chiptune BGM Engine
  public startMusic(track: 'grass' | 'forest' | 'lava' | 'menu') {
    this.initCtx();
    if (this.currentTrack === track && this.musicInterval !== null) {
      return;
    }
    this.stopMusic();
    this.currentTrack = track;
    this.musicStep = 0;

    let leadNotes: string[] = [];
    let bassNotes: string[] = [];
    let tempoMs = 140;

    if (track === 'grass' || track === 'menu') {
      tempoMs = 135;
      leadNotes = [
        'E5', 'E5', '-', 'E5', '-', 'C5', 'E5', '-',
        'G5', '-', '-', '-', 'G4', '-', '-', '-',
        'C5', '-', '-', 'G4', '-', '-', 'E4', '-',
        'A4', '-', 'B4', '-', 'A#4', 'A4', '-', 'G4',
        'E5', 'G5', 'A5', '-', 'F5', 'G5', '-', 'E5',
        '-', 'C5', 'D5', 'B4', '-', '-', '-', '-'
      ];
      bassNotes = [
        'C3', '-', 'G3', '-', 'C3', '-', 'G3', '-',
        'G3', '-', 'D3', '-', 'G3', '-', 'D3', '-',
        'A3', '-', 'E3', '-', 'A3', '-', 'E3', '-',
        'F3', '-', 'C3', '-', 'G3', '-', 'B3', '-',
        'C3', '-', 'G3', '-', 'F3', '-', 'C3', '-',
        'G3', '-', 'G3', '-', 'C3', '-', '-', '-'
      ];
    } else if (track === 'forest') {
      tempoMs = 150;
      leadNotes = [
        'A4', 'C5', 'E5', 'A5', 'G5', 'E5', 'C5', 'D5',
        'E5', '-', 'D5', 'C5', 'B4', '-', 'C5', 'B4',
        'A4', 'C5', 'E5', 'A5', 'B5', 'C6', 'B5', 'A5',
        'G#5', '-', 'E5', '-', 'B4', '-', 'C5', 'D5'
      ];
      bassNotes = [
        'A3', '-', 'A3', '-', 'E3', '-', 'E3', '-',
        'F3', '-', 'F3', '-', 'G3', '-', 'E3', '-',
        'A3', '-', 'A3', '-', 'D3', '-', 'D3', '-',
        'E3', '-', 'E3', '-', 'E3', '-', 'E3', '-'
      ];
    } else if (track === 'lava') {
      tempoMs = 115;
      leadNotes = [
        'D5', 'D5', 'F5', 'D5', 'G5', 'F5', 'D5', 'C5',
        'D5', 'D5', 'F5', 'G#5', 'A5', 'G#5', 'F5', 'D5',
        'C5', 'C5', 'E5', 'C5', 'F5', 'E5', 'C5', 'A#4',
        'D5', 'F5', 'A5', 'D6', 'C6', 'A5', 'F5', 'E5'
      ];
      bassNotes = [
        'D3', 'D3', 'A3', 'D3', 'D3', 'A3', 'D3', 'F3',
        'D3', 'D3', 'A3', 'D3', 'G3', 'F3', 'E3', 'C3',
        'C3', 'C3', 'G3', 'C3', 'C3', 'G3', 'C3', 'E3',
        'D3', 'A3', 'D3', 'A3', 'F3', 'G3', 'A3', 'C#3'
      ];
    }

    this.musicInterval = window.setInterval(() => {
      if (!this.ctx || !this.musicGain || this.isMuted) return;

      const idx = this.musicStep % leadNotes.length;
      const noteL = leadNotes[idx];
      const noteB = bassNotes[this.musicStep % bassNotes.length];

      const freqL = this.noteToFreq(noteL);
      const freqB = this.noteToFreq(noteB);

      const now = this.ctx.currentTime;
      const noteDuration = tempoMs / 1000;

      // Lead voice (Pulse / Square)
      if (freqL > 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freqL, now);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + noteDuration * 0.85);

        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.start(now);
        osc.stop(now + noteDuration * 0.9);
      }

      // Bass voice (Triangle)
      if (freqB > 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(freqB, now);

        bassGain.gain.setValueAtTime(0.14, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + noteDuration * 0.95);

        bassOsc.connect(bassGain);
        bassGain.connect(this.musicGain);

        bassOsc.start(now);
        bassOsc.stop(now + noteDuration);
      }

      this.musicStep++;
    }, tempoMs);
  }

  public stopMusic() {
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.currentTrack = null;
  }

  // --- SOUND EFFECTS ---

  public playJump() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(480, now + 0.12);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playSpring() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(750, now + 0.22);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.26);
  }

  public playCoin() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;

    // Crisp high two-tone ding
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(987.77, now); // B5
    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc1.connect(gain1);
    gain1.connect(this.sfxGain);
    osc1.start(now);
    osc1.stop(now + 0.08);

    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1318.51, now + 0.07); // E6
    gain2.gain.setValueAtTime(0.2, now + 0.07);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc2.connect(gain2);
    gain2.connect(this.sfxGain);
    osc2.start(now + 0.07);
    osc2.stop(now + 0.25);
  }

  public playStomp() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playHurt() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.18);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  public playBlockHit() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.08);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  public playBlockBreak() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  public playPowerUp() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C4, E4, G4, C5, E5, G5
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const now = this.ctx.currentTime + idx * 0.05;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.12);
    });
  }

  public playCheckpoint() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const now = this.ctx.currentTime + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.18);
    });
  }

  public playLevelClear() {
    this.stopMusic();
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const fanfare = [
      { note: 'G4', dur: 0.1 },
      { note: 'C5', dur: 0.1 },
      { note: 'E5', dur: 0.1 },
      { note: 'G5', dur: 0.15 },
      { note: 'E5', dur: 0.1 },
      { note: 'G5', dur: 0.4 }
    ];

    let t = this.ctx.currentTime;
    fanfare.forEach(item => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(this.noteToFreq(item.note), t);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + item.dur * 0.95);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + item.dur);
      t += item.dur;
    });
  }

  public playGameOver() {
    this.stopMusic();
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const notes = ['F4', 'E4', 'D#4', 'D4'];
    let t = this.ctx.currentTime;
    notes.forEach((note, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(this.noteToFreq(note), t);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.3);
      t += (idx === 2 ? 0.35 : 0.22);
    });
  }

  public playVictory() {
    this.stopMusic();
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const victoryNotes = [
      { note: 'C5', dur: 0.15 },
      { note: 'C5', dur: 0.15 },
      { note: 'C5', dur: 0.15 },
      { note: 'C5', dur: 0.3 },
      { note: 'G#4', dur: 0.3 },
      { note: 'A#4', dur: 0.3 },
      { note: 'C5', dur: 0.2 },
      { note: 'A#4', dur: 0.1 },
      { note: 'C5', dur: 0.6 }
    ];

    let t = this.ctx.currentTime;
    victoryNotes.forEach(item => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(this.noteToFreq(item.note), t);

      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + item.dur * 0.95);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + item.dur);
      t += item.dur;
    });
  }
}

export const audio = new AudioManager();
