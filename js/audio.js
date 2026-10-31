// ============================================================================
// Christmas Audio Engine (Real Vocal Songs Playback + Web Audio Sound Effects)
// High-Quality Vocal Tracks + Synthesized Tactile SFX (Wax Crack, Shutter, Bells)
// ============================================================================

class ChristmasAudioEngine {
  constructor() {
    this.ctx = null;
    this.sfxGain = null;
    this.audioElement = new Audio();
    this.isPlaying = false;
    this.currentTrackIndex = 0;

    // Real Authentic Christmas Songs with Real Vocals
    this.playlist = [
      {
        id: 'last-christmas',
        title: 'Last Christmas',
        artist: 'Wham!',
        duration: '04:24',
        src: 'assets/audio/last-christmas.mp3'
      },
      {
        id: 'all-i-want',
        title: 'All I Want for Christmas Is You',
        artist: 'Mariah Carey',
        duration: '03:55',
        src: 'assets/audio/all-i-want.mp3'
      },
      {
        id: 'jingle-bells',
        title: 'Jingle Bells (Vocal Swing)',
        artist: 'Frank Sinatra',
        duration: '02:54',
        src: 'assets/audio/jingle-bells-sinatra.mp3'
      },
      {
        id: 'white-christmas',
        title: 'The Christmas Song / Have Yourself a Merry Little Christmas',
        artist: 'Frank Sinatra',
        duration: '03:13',
        src: 'assets/audio/white-christmas-sinatra.mp3'
      }
    ];

    this.onTrackChange = null;
    this.onPlayStateChange = null;

    // Audio Element Event Listeners
    this.audioElement.addEventListener('ended', () => {
      this.nextTrack();
    });

    this.audioElement.addEventListener('play', () => {
      this.isPlaying = true;
      if (this.onPlayStateChange) this.onPlayStateChange(true);
    });

    this.audioElement.addEventListener('pause', () => {
      this.isPlaying = false;
      if (this.onPlayStateChange) this.onPlayStateChange(false);
    });
  }

  initContext() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.setValueAtTime(0.75, this.ctx.currentTime);
    this.sfxGain.connect(this.ctx.destination);
  }

  ensureContext() {
    if (!this.ctx) this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --------------------------------------------------------------------------
  // SOUND EFFECTS (Web Audio API Synthesizer)
  // --------------------------------------------------------------------------

  playWaxCrack() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 0.18;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.05));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.Q.setValueAtTime(3.0, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.7, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.sfxGain);
    noise.start(now);

    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);

    oscGain.gain.setValueAtTime(0.5, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(oscGain);
    oscGain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  playBellChime() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const bellFrequencies = [1760, 2093, 2637, 3135];

    bellFrequencies.forEach((freq, idx) => {
      const stagger = now + idx * 0.035;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, stagger);

      gain.gain.setValueAtTime(0.18, stagger);
      gain.gain.exponentialRampToValueAtTime(0.001, stagger + 0.6);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(stagger);
      osc.stop(stagger + 0.62);
    });
  }

  playCameraShutter() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 0.08;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.02));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(2000, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.6, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.sfxGain);
    noise.start(now);
  }

  playCountdownBeep(isFinal = false) {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const freq = isFinal ? 1320 : 880;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (isFinal ? 0.35 : 0.18));

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + (isFinal ? 0.36 : 0.2));
  }

  playPageTurn() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * (i / bufferSize));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    noise.start(now);
  }

  playStickerPop() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.exponentialRampToValueAtTime(950, now + 0.08);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  playFanfare() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const t = now + idx * 0.09;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.72);
    });
  }

  // --------------------------------------------------------------------------
  // REAL VOCAL SONG PLAYBACK (HTML5 Audio)
  // --------------------------------------------------------------------------

  loadCurrentTrack() {
    const track = this.playlist[this.currentTrackIndex];
    this.audioElement.src = track.src;
    this.audioElement.load();
    if (this.onTrackChange) this.onTrackChange(track);
  }

  startMusicLoop() {
    this.ensureContext();
    if (!this.audioElement.src || this.audioElement.src === window.location.href) {
      this.loadCurrentTrack();
    }

    this.audioElement.play().then(() => {
      this.isPlaying = true;
      if (this.onPlayStateChange) this.onPlayStateChange(true);
    }).catch(err => {
      console.warn('Playback prevented or file error:', err);
    });
  }

  stopMusicLoop() {
    this.audioElement.pause();
    this.isPlaying = false;
    if (this.onPlayStateChange) this.onPlayStateChange(false);
  }

  togglePlay() {
    this.ensureContext();
    if (this.isPlaying) {
      this.stopMusicLoop();
    } else {
      this.startMusicLoop();
    }
  }

  nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
    this.loadCurrentTrack();
    if (this.isPlaying) {
      this.startMusicLoop();
    }
  }

  prevTrack() {
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
    this.loadCurrentTrack();
    if (this.isPlaying) {
      this.startMusicLoop();
    }
  }

  setTrack(index) {
    if (index >= 0 && index < this.playlist.length) {
      this.currentTrackIndex = index;
      this.loadCurrentTrack();
      this.startMusicLoop();
    }
  }

  getCurrentTrack() {
    return this.playlist[this.currentTrackIndex];
  }
}

// Global instance
window.xmasAudio = new ChristmasAudioEngine();
