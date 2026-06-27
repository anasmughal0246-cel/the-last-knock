const Sound = {
  ctx: null,
  gainNode: null,
  ambienceSource: null,
  enabled: true,

  init() {
    this.enabled = localStorage.getItem('soundEnabled') !== 'false';
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.value = 0.4;
      this.gainNode.connect(this.ctx.destination);
    } catch (e) {
      console.log('Web Audio not supported');
    }
  },

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  },

  // ── Knock sound (heavy, deep) ──
  playKnock() {
    if (!this.enabled || !this.ctx) return;
    this.resume();
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const osc  = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const dist = this.ctx.createWaveShaper();

        // Distortion curve
        const curve = new Float32Array(256);
        for (let j = 0; j < 256; j++) {
          const x = (j * 2) / 256 - 1;
          curve[j] = (Math.PI + 400) * x / (Math.PI + 400 * Math.abs(x));
        }
        dist.curve = curve;

        osc.connect(dist);
        dist.connect(gain);
        gain.connect(this.gainNode);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(60, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(20, this.ctx.currentTime + 0.3);

        gain.gain.setValueAtTime(1.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.4);
      }, i * 500);
    }
  },

  // ── Heartbeat ──
  playHeartbeat() {
    if (!this.enabled || !this.ctx) return;
    this.resume();
    const beats = [0, 0.15, 0.8, 0.95];
    beats.forEach(t => {
      const osc  = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.gainNode);
      osc.type = 'sine';
      osc.frequency.value = 55;
      gain.gain.setValueAtTime(0, this.ctx.currentTime + t);
      gain.gain.linearRampToValueAtTime(1.2, this.ctx.currentTime + t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + t + 0.25);
      osc.start(this.ctx.currentTime + t);
      osc.stop(this.ctx.currentTime + t + 0.3);
    });
  },

  // ── Whisper (eerie high freq noise) ──
  playWhisper() {
    if (!this.enabled || !this.ctx) return;
    this.resume();
    const buf    = this.ctx.createBuffer(1, this.ctx.sampleRate * 2, this.ctx.sampleRate);
    const data   = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.15;

    const src    = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain   = this.ctx.createGain();

    filter.type = 'bandpass';
    filter.frequency.value = 2000;
    filter.Q.value = 0.5;

    src.buffer = buf;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.gainNode);

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.6, this.ctx.currentTime + 0.5);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 2);

    src.start();
    src.stop(this.ctx.currentTime + 2);
  },

  // ── Footsteps ──
  playFootsteps() {
    if (!this.enabled || !this.ctx) return;
    this.resume();
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const buf  = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.1, this.ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let j = 0; j < data.length; j++) data[j] = Math.random() * 2 - 1;

        const src    = this.ctx.createBufferSource();
        const filter = this.ctx.createBiquadFilter();
        const gain   = this.ctx.createGain();

        filter.type = 'lowpass';
        filter.frequency.value = 200;

        src.buffer = buf;
        src.connect(filter);
        filter.connect(gain);
        gain.connect(this.gainNode);

        gain.gain.setValueAtTime(0.8, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

        src.start();
        src.stop(this.ctx.currentTime + 0.15);
      }, i * 600);
    }
  },

  // ── Horror sting (jumpscare sound) ──
  playHorrorSting() {
    if (!this.enabled || !this.ctx) return;
    this.resume();
    const freqs = [200, 300, 180, 400, 150, 500];
    freqs.forEach((freq, i) => {
      const osc  = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.gainNode);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.08);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.08 + 0.4);
      osc.start(this.ctx.currentTime + i * 0.08);
      osc.stop(this.ctx.currentTime + i * 0.08 + 0.5);
    });
  },

  // ── Achievement chime ──
  playAchievementChime() {
    if (!this.enabled || !this.ctx) return;
    this.resume();
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const osc  = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.gainNode);
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.15 + 0.4);
      osc.start(this.ctx.currentTime + i * 0.15);
      osc.stop(this.ctx.currentTime + i * 0.15 + 0.5);
    });
  },

  // ── Click sound ──
  playClick() {
    if (!this.enabled || !this.ctx) return;
    this.resume();
    const osc  = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.gainNode);
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.1);
  },

  // ── Ambient drone ──
  startAmbience(type) {
    if (!this.enabled || !this.ctx) return;
    this.stopAmbience();
    this.resume();

    if (type === 'heartbeat') {
      this._heartbeatInterval = setInterval(() => this.playHeartbeat(), 1000);
      return;
    }
    if (type === 'footsteps') {
      setTimeout(() => this.playFootsteps(), 500);
      return;
    }
    if (type === 'whisper') {
      this.playWhisper();
      this._whisperInterval = setInterval(() => this.playWhisper(), 3000);
      return;
    }

    // Default ambient drone
    const osc1  = this.ctx.createOscillator();
    const osc2  = this.ctx.createOscillator();
    const gain  = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.value = 55;
    osc2.frequency.value = 58;

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.gainNode);

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 2);

    osc1.start();
    osc2.start();

    this.ambienceSource = { osc1, osc2, gain };
  },

  stopAmbience() {
    if (this._heartbeatInterval) { clearInterval(this._heartbeatInterval); this._heartbeatInterval = null; }
    if (this._whisperInterval)   { clearInterval(this._whisperInterval);   this._whisperInterval   = null; }
    if (this.ambienceSource) {
      try {
        this.ambienceSource.gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1);
        setTimeout(() => {
          try { this.ambienceSource.osc1.stop(); this.ambienceSource.osc2.stop(); } catch(e) {}
          this.ambienceSource = null;
        }, 1000);
      } catch(e) { this.ambienceSource = null; }
    }
  },

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('soundEnabled', this.enabled);
    if (!this.enabled) this.stopAmbience();
    return this.enabled;
  }
};

window.Sound = Sound;