/**
 * CyberFlux: Neon Merge
 * Strategy Puzzle & Chain-Reaction Engine (Web + Capacitor Android Play Store Ready)
 */

const GRID_SIZE = 5;

const NODE_TIERS = {
  1:  { num: '2',    tag: 'BIT',      color: '#00f0ff', pts: 10 },
  2:  { num: '4',    tag: 'BYTE',     color: '#38ef7d', pts: 25 },
  3:  { num: '8',    tag: 'NODE',     color: '#b57cff', pts: 60 },
  4:  { num: '16',   tag: 'CORE',     color: '#ff4d79', pts: 140 },
  5:  { num: '32',   tag: 'NEXUS',    color: '#ffd200', pts: 300 },
  6:  { num: '64',   tag: 'MATRIX',   color: '#f48eff', pts: 650 },
  7:  { num: '128',  tag: 'CYBER',    color: '#6fb1fc', pts: 1400 },
  8:  { num: '256',  tag: 'PLASMA',   color: '#ff0844', pts: 3000 },
  9:  { num: '512',  tag: 'QUANTUM',  color: '#1fddff', pts: 6500 },
  10: { num: '1024', tag: 'SINGULAR', color: '#fffc00', pts: 15000 }
};

const POWER_COSTS = {
  emp: 25,
  upgrade: 30,
  quantum: 40,
  purge: 35
};

/* --- Procedural Web Audio Synthesizer, Synthwave Music & Cyber AI Voice Announcer --- */
class CyberAudio {
  constructor() {
    this.enabled = true;      // SFX toggle
    this.musicEnabled = true; // Background Synthwave Music toggle
    this.voiceEnabled = true; // AI Voice Announcer toggle
    this.ctx = null;
    this.musicTimer = null;
    this.step = 0;
    this.musicPlaying = false;
    this.preferredVoice = null;
    this.initVoiceList();
  }

  initVoiceList() {
    if (!('speechSynthesis' in window)) return;
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      this.preferredVoice =
        voices.find((v) => /Google UK English|Microsoft Zira|Microsoft David|Samantha|Daniel/i.test(v.name)) ||
        voices.find((v) => v.lang && v.lang.startsWith('en')) ||
        voices[0] ||
        null;
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.musicEnabled && !this.musicPlaying) {
      this.startMusic();
    }
  }

  /* Cyber AI Voice Announcer */
  speak(phrase, pitch = 0.92, rate = 1.12, priority = false) {
    if (!this.voiceEnabled || !('speechSynthesis' in window)) return;
    try {
      if (priority || window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      const utter = new SpeechSynthesisUtterance(phrase);
      if (this.preferredVoice) utter.voice = this.preferredVoice;
      utter.pitch = pitch;
      utter.rate = rate;
      utter.volume = 0.88;
      window.speechSynthesis.speak(utter);
    } catch (_) {
      // Ignore speech synthesis errors on restricted browsers
    }
  }

  /* Procedural Cyberpunk Synthwave Music Sequencer (122 BPM) */
  startMusic() {
    if (!this.musicEnabled || this.musicPlaying) return;
    this.init();
    if (!this.ctx) return;

    this.musicPlaying = true;
    // D Minor Cyberpunk progression (D2, D2, Bb1, C2, A1...)
    const bassLine = [
      73.42, 73.42, 146.83, 73.42,  73.42, 146.83, 73.42, 110.00,
      58.27, 58.27, 116.54, 58.27,  65.41, 65.41, 130.81, 87.31
    ];
    // Neon Arpeggio Lead (D4, F4, A4, C5, D5, A4, F4, E4...)
    const arpNotes = [
      293.66, 349.23, 440.00, 523.25, 587.33, 440.00, 349.23, 329.63,
      233.08, 293.66, 349.23, 440.00, 523.25, 440.00, 349.23, 440.00
    ];

    const stepDurationMs = 123; // ~122 BPM 16th notes
    this.musicTimer = setInterval(() => {
      if (!this.musicEnabled || !this.ctx || this.ctx.state !== 'running') return;
      const now = this.ctx.currentTime;
      const s = this.step % 16;

      // 1. Driving Sub-Bass Sawtooth with Lowpass Filter
      const bassFreq = bassLine[s];
      const bassOsc = this.ctx.createOscillator();
      const bassFilter = this.ctx.createBiquadFilter();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'sawtooth';
      bassOsc.frequency.setValueAtTime(bassFreq, now);
      bassFilter.type = 'lowpass';
      bassFilter.frequency.setValueAtTime(340, now);
      bassFilter.frequency.exponentialRampToValueAtTime(110, now + 0.11);
      bassGain.gain.setValueAtTime(0.055, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.115);
      bassOsc.connect(bassFilter);
      bassFilter.connect(bassGain);
      bassGain.connect(this.ctx.destination);
      bassOsc.start(now);
      bassOsc.stop(now + 0.12);

      // 2. Cyber Neon Lead Arpeggio (plays on off-beats & melodic steps)
      if (s % 2 === 0 || s === 7 || s === 15) {
        const arpOsc = this.ctx.createOscillator();
        const arpGain = this.ctx.createGain();
        arpOsc.type = 'triangle';
        arpOsc.frequency.setValueAtTime(arpNotes[s], now);
        arpGain.gain.setValueAtTime(0.032, now);
        arpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        arpOsc.connect(arpGain);
        arpGain.connect(this.ctx.destination);
        arpOsc.start(now);
        arpOsc.stop(now + 0.19);
      }

      // 3. Punchy Synth Kick Drum on beats 0, 4, 8, 12
      if (s % 4 === 0) {
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kickOsc.type = 'sine';
        kickOsc.frequency.setValueAtTime(135, now);
        kickOsc.frequency.exponentialRampToValueAtTime(36, now + 0.11);
        kickGain.gain.setValueAtTime(0.11, now);
        kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        kickOsc.connect(kickGain);
        kickGain.connect(this.ctx.destination);
        kickOsc.start(now);
        kickOsc.stop(now + 0.13);
      }

      // 4. Snare / Hi-Hat pulse on beats 4, 12 and off-beats
      if (s === 4 || s === 12) {
        const snareOsc = this.ctx.createOscillator();
        const snareGain = this.ctx.createGain();
        snareOsc.type = 'triangle';
        snareOsc.frequency.setValueAtTime(220, now);
        snareOsc.frequency.exponentialRampToValueAtTime(75, now + 0.08);
        snareGain.gain.setValueAtTime(0.055, now);
        snareGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        snareOsc.connect(snareGain);
        snareGain.connect(this.ctx.destination);
        snareOsc.start(now);
        snareOsc.stop(now + 0.095);
      }

      this.step++;
    }, stepDurationMs);
  }

  stopMusic() {
    this.musicPlaying = false;
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    if (this.musicEnabled) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
    return this.musicEnabled;
  }

  playMerge(level, chain = 1) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const baseFreq = 220 * Math.pow(1.12, level + chain * 1.5);
    osc.type = chain > 1 ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.45, now + 0.16);

    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.19);
  }

  playPowerUp() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [330, 440, 660, 880].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.045);
      gain.gain.setValueAtTime(0.14, now + idx * 0.045);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.045 + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.045);
      osc.stop(now + idx * 0.045 + 0.16);
    });
  }

  playError() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(135, now);
    osc.frequency.setValueAtTime(98, now + 0.08);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.19);
  }
}

/* --- Canvas Particle FX Engine --- */
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.loop();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burst(x, y, color = '#00f0ff', count = 22) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 6.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        size: 2.5 + Math.random() * 4.5,
        color,
        alpha: 1,
        decay: 0.02 + Math.random() * 0.025
      });
    }
  }

  loop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.14; // gravity
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.shadowColor = p.color;
      this.ctx.shadowBlur = 10;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
    requestAnimationFrame(() => this.loop());
  }
}

/* --- Main CyberFlux Game Controller --- */
class CyberFluxGame {
  constructor() {
    this.audio = new CyberAudio();
    this.fx = new ParticleSystem(document.getElementById('fx-canvas'));

    this.boardEl = document.getElementById('grid-board');
    this.floatEl = document.getElementById('floating-announcements');
    this.statusEl = document.getElementById('status-prompt');

    this.mode = 'endless'; // 'endless' | 'daily'
    this.grid = [];
    this.score = 0;
    this.bestScore = parseInt(localStorage.getItem('cyberflux_best') || '0', 10);
    this.energy = 35;
    this.moves = 0;
    this.maxLevel = 1;
    this.chainCount = 1;
    this.maxChain = 1;
    this.totalMerges = 0;
    this.activePower = null;
    this.lastMergedPos = null;
    this.rngSeed = 1;

    this.bindEvents();
    this.initGame();
  }

  /* Seeded RNG for Daily Blitz mode */
  nextRand() {
    if (this.mode === 'daily') {
      this.rngSeed = (this.rngSeed * 1664525 + 1013904223) % 4294967296;
      return this.rngSeed / 4294967296;
    }
    return Math.random();
  }

  initGame() {
    if (this.mode === 'daily') {
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      this.rngSeed = parseInt(today, 10) || 20261124;
    }

    this.score = 0;
    this.energy = 35;
    this.moves = 0;
    this.maxLevel = 1;
    this.chainCount = 1;
    this.maxChain = 1;
    this.totalMerges = 0;
    this.activePower = null;
    this.lastMergedPos = null;

    this.grid = Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => this.generateTile(true))
    );

    // Ensure at least 2 valid clusters on start
    if (!this.hasValidClusters()) {
      this.grid[2][2].level = this.grid[2][3].level;
    }

    document.getElementById('modal-gameover').classList.add('hidden');
    this.setPrompt('Tap any group of <strong>2+ matching adjacent nodes</strong> to merge!');
    this.render();
  }

  generateTile(initial = false) {
    const cap = Math.min(5, Math.max(3, this.maxLevel - 1));
    const r = this.nextRand();

    // Small chance to spawn a Virus obstacle every few moves (never on initial board)
    if (!initial && this.moves > 5 && this.moves % 6 === 0 && r < 0.14) {
      return {
        id: Math.random().toString(36).slice(2),
        level: 0,
        virus: true,
        isNew: true
      };
    }

    let level = 1;
    if (r > 0.85) level = Math.min(cap, 4);
    else if (r > 0.60) level = 3;
    else if (r > 0.32) level = 2;

    return {
      id: Math.random().toString(36).slice(2),
      level,
      virus: false,
      isNew: !initial
    };
  }

  /* Flood-fill orthogonal connected cluster of identical level */
  getCluster(r, c) {
    const start = this.grid[r]?.[c];
    if (!start || start.virus) return [];

    const targetLevel = start.level;
    const visited = new Set();
    const queue = [[r, c]];
    const cluster = [];

    while (queue.length > 0) {
      const [cr, cc] = queue.shift();
      const key = `${cr},${cc}`;
      if (visited.has(key)) continue;
      visited.add(key);

      const cell = this.grid[cr]?.[cc];
      if (!cell || cell.virus || cell.level !== targetLevel) continue;

      cluster.push([cr, cc]);
      const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (const [dr, dc] of dirs) {
        const nr = cr + dr;
        const nc = cc + dc;
        if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
          queue.push([nr, nc]);
        }
      }
    }
    return cluster;
  }

  hasValidClusters() {
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (this.getCluster(r, c).length >= 2) return true;
      }
    }
    return false;
  }

  handleTileClick(r, c, tileEl) {
    // Handle tactical power-up targeting if active
    if (this.activePower) {
      this.executePowerUp(this.activePower, r, c, tileEl);
      return;
    }

    const cell = this.grid[r][c];
    if (!cell) return;

    if (cell.virus) {
      this.audio.playError();
      this.setPrompt('⚠️ <strong>MALWARE NODE!</strong> Merge a 4+ cluster next to it or use <strong>EMP / Firewall</strong>.');
      return;
    }

    const cluster = this.getCluster(r, c);
    if (cluster.length < 2) {
      this.audio.playError();
      this.setPrompt('Select a tile connected to at least <strong>1 matching neighbor</strong>.');
      return;
    }

    // Check if player continued a chain from the previously upgraded node
    const continuedChain =
      this.lastMergedPos &&
      cluster.some(([cr, cc]) => cr === this.lastMergedPos[0] && cc === this.lastMergedPos[1]);

    if (continuedChain) {
      this.chainCount++;
    } else {
      this.chainCount = 1;
    }
    if (this.chainCount > this.maxChain) this.maxChain = this.chainCount;

    const currentLevel = cell.level;
    // Mega clusters (6+ tiles) jump +2 levels!
    const levelGain = cluster.length >= 6 ? 2 : 1;
    const nextLevel = Math.min(10, currentLevel + levelGain);

    // Calculate score and flux energy gain
    const tierInfo = NODE_TIERS[currentLevel] || NODE_TIERS[1];
    const clusterBonus = cluster.length * tierInfo.pts;
    const chainMultiplier = 1 + (this.chainCount - 1) * 0.5;
    const gainedScore = Math.round(clusterBonus * chainMultiplier);

    this.score += gainedScore;
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem('cyberflux_best', String(this.bestScore));
    }

    const energyGain = Math.min(25, (cluster.length - 1) * 4 + (this.chainCount > 1 ? 6 : 0));
    this.energy = Math.min(100, this.energy + energyGain);
    this.moves++;
    this.totalMerges++;

    // Particle burst at clicked tile screen coordinates
    const rect = tileEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const nextTierInfo = NODE_TIERS[nextLevel] || NODE_TIERS[10];
    this.fx.burst(cx, cy, nextTierInfo.color, 18 + cluster.length * 3);

    // Floating score text
    const boardRect = this.boardEl.getBoundingClientRect();
    const relX = cx - boardRect.left;
    const relY = cy - boardRect.top;
    const label = this.chainCount > 1
      ? `+${gainedScore} (CHAIN x${this.chainCount}!)`
      : levelGain > 1
        ? `+${gainedScore} (MEGA +2 LV!)`
        : `+${gainedScore}`;
    this.spawnFloatingText(relX, relY, label);

    // Clear merged tiles except target
    for (const [cr, cc] of cluster) {
      if (cr === r && cc === c) continue;
      this.grid[cr][cc] = null;

      // If cluster is 4+ tiles, purge adjacent Malware/Virus tiles automatically!
      if (cluster.length >= 4) {
        for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
          const nr = cr + dr;
          const nc = cc + dc;
          if (this.grid[nr]?.[nc]?.virus) {
            this.grid[nr][nc] = null;
          }
        }
      }
    }

    // Upgrade target tile
    this.grid[r][c] = {
      id: Math.random().toString(36).slice(2),
      level: nextLevel,
      virus: false,
      upgraded: true
    };

    if (nextLevel > this.maxLevel) {
      this.maxLevel = nextLevel;
      if (nextLevel >= 5 && nextLevel < 10) {
        const tierName = NODE_TIERS[nextLevel]?.tag || 'NODE';
        this.audio.speak(`New node unlocked: ${tierName}!`, 1.0, 1.15);
      }
    }

    this.audio.playMerge(nextLevel, this.chainCount);

    // Cyber AI Voice callouts for chains & mega clusters
    if (nextLevel === 10) {
      this.audio.speak('Singularity achieved! Maximum overdrive!', 0.85, 1.1, true);
    } else if (this.chainCount === 2) {
      this.audio.speak('Double Chain!', 1.05, 1.2);
    } else if (this.chainCount === 3) {
      this.audio.speak('Triple Chain! Unstoppable!', 1.1, 1.22, true);
    } else if (this.chainCount >= 4) {
      this.audio.speak(`Mega Chain times ${this.chainCount}! Cyber Overdrive!`, 1.15, 1.25, true);
    } else if (cluster.length >= 6) {
      this.audio.speak('Quantum Surge! Plus two levels!', 0.98, 1.18);
    }

    // Singularity Lv.10 detonation bonus!
    if (nextLevel === 10) {
      this.triggerSingularity(r, c, cx, cy);
    }

    this.applyGravityAndRefill(r, c);
    this.render();
    this.checkGameState();
  }

  triggerSingularity(r, c, screenX, screenY) {
    this.fx.burst(screenX, screenY, '#fffc00', 55);
    this.score += 5000;
    this.energy = 100;
    // Clear 3x3 area around singularity
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
          this.grid[nr][nc] = null;
        }
      }
    }
    this.setPrompt('🌟 <strong>SINGULARITY DETONATED!</strong> +5,000 Bonus Score & Full Flux Energy!');
  }

  applyGravityAndRefill(targetR, targetC) {
    let trackedPos = [targetR, targetC];

    for (let c = 0; c < GRID_SIZE; c++) {
      let writeRow = GRID_SIZE - 1;
      for (let r = GRID_SIZE - 1; r >= 0; r--) {
        if (this.grid[r][c] !== null) {
          const tile = this.grid[r][c];
          this.grid[r][c] = null;
          this.grid[writeRow][c] = tile;
          if (r === targetR && c === targetC) {
            trackedPos = [writeRow, c];
          }
          writeRow--;
        }
      }
      for (let r = writeRow; r >= 0; r--) {
        this.grid[r][c] = this.generateTile(false);
      }
    }

    this.lastMergedPos = trackedPos;
  }

  /* --- Tactical Power-Ups --- */
  togglePowerUp(powerKey) {
    if (this.activePower === powerKey) {
      this.activePower = null;
      this.setPrompt('Power-up cancelled. Tap any 2+ matching nodes to merge.');
      this.render();
      return;
    }

    const cost = POWER_COSTS[powerKey];
    if (this.energy < cost) {
      this.audio.playError();
      this.setPrompt(`⚡ Need <strong>${cost} Flux Energy</strong> for this tactical module!`);
      return;
    }

    // Firewall Purge executes immediately across the entire board
    if (powerKey === 'purge') {
      this.executeFirewallPurge();
      return;
    }

    this.activePower = powerKey;
    const prompts = {
      emp: '💥 <strong>EMP ARMED:</strong> Tap any tile to vaporize a 3×3 area!',
      upgrade: '🔼 <strong>OVERCLOCK ARMED:</strong> Tap any node to boost its level by +1!',
      quantum: '🌀 <strong>QUANTUM SYNC ARMED:</strong> Tap a node to pull all matching nodes into it!'
    };
    this.setPrompt(prompts[powerKey]);
    this.render();
  }

  executeFirewallPurge() {
    this.energy -= POWER_COSTS.purge;
    this.audio.playPowerUp();
    this.audio.speak('Firewall activated. Purging malware.', 0.9, 1.15, true);

    let purged = 0;
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (this.grid[r][c]?.virus || this.grid[r][c]?.level === 1) {
          this.grid[r][c] = null;
          purged++;
        }
      }
    }

    this.applyGravityAndRefill(0, 0);
    this.setPrompt(`🛡️ <strong>FIREWALL EXECUTED!</strong> Cleared ${purged} Malware & Lv.1 nodes!`);
    this.render();
    this.checkGameState();
  }

  executePowerUp(powerKey, r, c, tileEl) {
    const cost = POWER_COSTS[powerKey];
    const target = this.grid[r][c];
    if (!target) return;

    const rect = tileEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    if (powerKey === 'emp') {
      this.energy -= cost;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
            this.grid[nr][nc] = null;
          }
        }
      }
      this.score += 350;
      this.fx.burst(cx, cy, '#ff007f', 35);
      this.applyGravityAndRefill(r, c);
      this.setPrompt('💥 <strong>EMP BLAST COMPLETE!</strong> 3×3 sector refreshed.');
      this.audio.speak('E M P Blast deployed!', 0.88, 1.15, true);
    } else if (powerKey === 'upgrade') {
      this.energy -= cost;
      if (target.virus) {
        this.grid[r][c] = { id: Math.random().toString(36).slice(2), level: 3, virus: false, upgraded: true };
      } else {
        target.level = Math.min(10, target.level + 1);
        target.upgraded = true;
        if (target.level > this.maxLevel) this.maxLevel = target.level;
      }
      this.fx.burst(cx, cy, '#00ff88', 28);
      this.setPrompt('🔼 <strong>NODE OVERCLOCKED!</strong> Tile upgraded +1 level.');
      this.audio.speak('Node Overclocked!', 1.05, 1.18, true);
    } else if (powerKey === 'quantum') {
      if (target.virus) {
        this.audio.playError();
        this.setPrompt('Select a non-virus node for Quantum Sync!');
        return;
      }
      this.energy -= cost;
      const targetLevel = target.level;
      let absorbed = 0;

      for (let gr = 0; gr < GRID_SIZE; gr++) {
        for (let gc = 0; gc < GRID_SIZE; gc++) {
          if ((gr !== r || gc !== c) && this.grid[gr][gc]?.level === targetLevel) {
            this.grid[gr][gc] = null;
            absorbed++;
          }
        }
      }

      const boost = absorbed >= 4 ? 2 : 1;
      const newLevel = Math.min(10, targetLevel + boost);
      this.grid[r][c] = {
        id: Math.random().toString(36).slice(2),
        level: newLevel,
        virus: false,
        upgraded: true
      };
      if (newLevel > this.maxLevel) this.maxLevel = newLevel;
      this.score += absorbed * (NODE_TIERS[targetLevel]?.pts || 50);
      this.fx.burst(cx, cy, '#00f0ff', 40);
      this.applyGravityAndRefill(r, c);
      this.setPrompt(`🌀 <strong>QUANTUM SYNC!</strong> Absorbed ${absorbed} matching nodes across the grid!`);
      this.audio.speak('Quantum Sync complete!', 0.95, 1.15, true);
    }

    this.audio.playPowerUp();
    this.activePower = null;
    this.render();
    this.checkGameState();
  }

  checkGameState() {
    // In Daily Blitz mode, end after 35 moves
    if (this.mode === 'daily' && this.moves >= 35) {
      this.showGameOver('DAILY BLITZ COMPLETE', 'You completed all 35 tactical turns in today\'s Daily Blitz!');
      return;
    }

    // Check if any cluster of 2+ exists or player has enough energy for any powerup
    const canUsePower = this.energy >= 25;
    if (!this.hasValidClusters() && !canUsePower) {
      this.showGameOver('GRID LOCKED', 'No adjacent matching nodes and insufficient Flux energy.');
    }
  }

  showGameOver(title, desc) {
    this.audio.speak('System overload. Grid locked.', 0.82, 1.05, true);
    document.getElementById('gameover-title').textContent = title;
    document.getElementById('gameover-desc').textContent = desc;
    document.getElementById('final-score').textContent = this.score.toLocaleString();
    const maxTier = NODE_TIERS[this.maxLevel] || NODE_TIERS[1];
    document.getElementById('final-max-node').textContent = `Lv.${this.maxLevel} (${maxTier.num})`;
    document.getElementById('final-max-chain').textContent = `x${this.maxChain}`;
    document.getElementById('final-merges').textContent = String(this.totalMerges);
    document.getElementById('modal-gameover').classList.remove('hidden');
  }

  spawnFloatingText(x, y, text) {
    const el = document.createElement('div');
    el.className = 'float-text';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.textContent = text;
    this.floatEl.appendChild(el);
    setTimeout(() => el.remove(), 850);
  }

  setPrompt(html) {
    this.statusEl.innerHTML = html;
  }

  render() {
    // Update top HUD values
    document.getElementById('score-val').textContent = this.score.toLocaleString();
    document.getElementById('best-val').textContent = this.bestScore.toLocaleString();
    const tier = NODE_TIERS[this.maxLevel] || NODE_TIERS[1];
    document.getElementById('max-tile-val').textContent = `Lv.${this.maxLevel} (${tier.num})`;
    document.getElementById('moves-val').textContent =
      this.mode === 'daily' ? `${35 - this.moves} LEFT` : String(this.moves);

    // Update Flux Energy & Chain badge
    document.getElementById('energy-fill').style.width = `${this.energy}%`;
    document.getElementById('energy-val').textContent = String(this.energy);
    const comboBadge = document.getElementById('combo-badge');
    comboBadge.textContent = `CHAIN x${this.chainCount}`;
    comboBadge.classList.toggle('pulse', this.chainCount > 1);

    // Update Power-Up buttons
    this.boardEl.classList.toggle('power-targeting', Boolean(this.activePower));
    document.querySelectorAll('.power-btn').forEach((btn) => {
      const key = btn.dataset.power;
      const cost = POWER_COSTS[key];
      btn.classList.toggle('active', this.activePower === key);
      btn.classList.toggle('disabled', this.energy < cost);
    });

    // Render 5x5 grid tiles
    this.boardEl.innerHTML = '';
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const cell = this.grid[r][c];
        const tile = document.createElement('div');
        tile.dataset.r = r;
        tile.dataset.c = c;

        if (cell.virus) {
          tile.className = `tile tile-virus ${cell.isNew ? 'spawn-anim' : ''}`;
          tile.innerHTML = `
            <span class="tile-badge">⚠️</span>
            <span class="tile-num">👾</span>
            <span class="tile-tag">VIRUS</span>
          `;
        } else {
          const info = NODE_TIERS[cell.level] || NODE_TIERS[1];
          const clusterSize = this.getCluster(r, c).length;
          const animClass = cell.upgraded
            ? 'upgrade-anim'
            : cell.isNew
              ? 'spawn-anim'
              : '';
          const hintClass = clusterSize >= 2 ? 'cluster-hint' : '';

          tile.className = `tile tile-lv-${cell.level} ${animClass} ${hintClass}`;
          tile.innerHTML = `
            <span class="tile-badge">${clusterSize >= 2 ? `•${clusterSize}` : ''}</span>
            <span class="tile-num">${info.num}</span>
            <span class="tile-tag">${info.tag}</span>
          `;
        }

        cell.isNew = false;
        cell.upgraded = false;

        // Hover cluster highlight
        tile.addEventListener('pointerenter', () => this.highlightCluster(r, c, true));
        tile.addEventListener('pointerleave', () => this.highlightCluster(r, c, false));
        tile.addEventListener('click', () => this.handleTileClick(r, c, tile));

        this.boardEl.appendChild(tile);
      }
    }
  }

  highlightCluster(r, c, active) {
    if (this.activePower) return;
    const cluster = this.getCluster(r, c);
    if (cluster.length < 2) return;

    for (const [cr, cc] of cluster) {
      const idx = cr * GRID_SIZE + cc;
      const el = this.boardEl.children[idx];
      if (el) el.classList.toggle('cluster-hover', active);
    }
  }

  bindEvents() {
    // Power-up deck buttons
    document.querySelectorAll('.power-btn').forEach((btn) => {
      btn.addEventListener('click', () => this.togglePowerUp(btn.dataset.power));
    });

    // Restart & Play Again
    document.getElementById('btn-restart').addEventListener('click', () => this.initGame());
    document.getElementById('btn-play-again').addEventListener('click', () => this.initGame());

    // Switch Mode (Endless Overdrive vs Daily Blitz)
    document.getElementById('btn-mode').addEventListener('click', () => {
      this.mode = this.mode === 'endless' ? 'daily' : 'endless';
      document.getElementById('mode-icon').textContent = this.mode === 'endless' ? '∞' : '📅';
      document.getElementById('mode-label').textContent =
        this.mode === 'endless' ? 'ENDLESS OVERDRIVE' : 'DAILY TACTICAL BLITZ (35 MOVES)';
      this.initGame();
    });

    // Toggle Cyberpunk Synthwave Music
    const musicBtn = document.getElementById('btn-music');
    musicBtn.addEventListener('click', () => {
      const active = this.audio.toggleMusic();
      document.getElementById('music-icon').textContent = active ? '🎵' : '🔕';
      musicBtn.classList.toggle('muted', !active);
    });

    // Toggle Cyber AI Voice Announcer
    const voiceBtn = document.getElementById('btn-voice');
    voiceBtn.addEventListener('click', () => {
      this.audio.voiceEnabled = !this.audio.voiceEnabled;
      document.getElementById('voice-icon').textContent = this.audio.voiceEnabled ? '🎙️' : '🙊';
      voiceBtn.classList.toggle('muted', !this.audio.voiceEnabled);
      if (this.audio.voiceEnabled) {
        this.audio.speak('Cyber voice online.', 0.95, 1.15, true);
      }
    });

    // Toggle Sound Effects
    const soundBtn = document.getElementById('btn-sound');
    soundBtn.addEventListener('click', () => {
      this.audio.enabled = !this.audio.enabled;
      document.getElementById('sound-icon').textContent = this.audio.enabled ? '🔊' : '🔇';
      soundBtn.classList.toggle('muted', !this.audio.enabled);
    });

    // Auto-start music & welcome voice on first board interaction
    let welcomed = false;
    document.body.addEventListener('pointerdown', () => {
      this.audio.init();
      if (!welcomed) {
        welcomed = true;
        this.audio.speak('CyberFlux system online. Initiate node merge.', 0.95, 1.12);
      }
    }, { once: true });

    // Help Modal
    const helpModal = document.getElementById('modal-help');
    document.getElementById('btn-help').addEventListener('click', () => {
      helpModal.classList.remove('hidden');
    });
    document.getElementById('btn-close-help').addEventListener('click', () => {
      helpModal.classList.add('hidden');
    });

    // Copy Shareable Score Card
    document.getElementById('btn-share-score').addEventListener('click', () => {
      const tier = NODE_TIERS[this.maxLevel] || NODE_TIERS[1];
      const text = `⚡ CYBERFLUX: NEON MERGE ⚡\nMode: ${this.mode.toUpperCase()}\nScore: ${this.score.toLocaleString()}\nMax Node: Lv.${this.maxLevel} (${tier.num})\nMax Chain: x${this.maxChain}`;
      navigator.clipboard?.writeText(text);
      const btn = document.getElementById('btn-share-score');
      btn.textContent = '✅ COPIED TO CLIPBOARD!';
      setTimeout(() => {
        btn.textContent = '📋 COPY SCORE CARD';
      }, 2000);
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.cyberFlux = new CyberFluxGame();
});

