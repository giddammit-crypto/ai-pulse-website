import { EventHorizonScene } from './three-scene.js';
import { initAnimations } from './animations.js';
import { initCursor } from './cursor.js';
import { init3DCardTilt } from './parallax.js';
import { initNewsLoader } from './news-loader.js';

/**
 * AI PULSE — MAIN APPLICATION ENTRY POINT
 * Coordinates 3D Event Horizon scene, GSAP timelines, Lenis scroll,
 * interactive sound generator, and news loader.
 */

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🌌 Initializing AI PULSE — Event Horizon Architecture...');

  // 1. Initialize Custom Cyber Cursor
  initCursor();

  // 2. Initialize Three.js 3D Event Horizon Scene
  const scene3D = new EventHorizonScene('webgl-container');

  // 3. Initialize GSAP & Lenis Smooth Scrolling
  const lenis = initAnimations();

  // 4. Initialize Dynamic News Loader & Feed
  await initNewsLoader();

  // 5. Initialize 3D Perspective Card Tilt
  init3DCardTilt();

  // 6. Bind 3D Singularity Lab & Quickbar Controls
  setupVisualizerControls(scene3D);

  // 7. Ambient Audio Synthesizer (Web Audio API)
  setupAmbientAudio();

  // 8. Mobile Navigation Toggle
  setupMobileNav();

  console.log('🚀 AI PULSE Fully Operational.');
});

/**
 * Controls for 3D Event Horizon & Singularity Lab
 */
function setupVisualizerControls(scene3D) {
  if (!scene3D) return;

  // Quickbar theme buttons (Hero section)
  const modeBtns = document.querySelectorAll('.mode-btn');
  modeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const theme = btn.dataset.theme;
      scene3D.setTheme(theme);
    });
  });

  // Lab Sliders
  const sliderSpeed = document.getElementById('slider-speed');
  const valSpeed = document.getElementById('val-speed');
  if (sliderSpeed && valSpeed) {
    sliderSpeed.addEventListener('input', (e) => {
      const v = e.target.value;
      valSpeed.textContent = `${v}x`;
      scene3D.setSpeed(v);
    });
  }

  const sliderParticles = document.getElementById('slider-particles');
  const valParticles = document.getElementById('val-particles');
  if (sliderParticles && valParticles) {
    sliderParticles.addEventListener('input', (e) => {
      const v = parseInt(e.target.value, 10);
      valParticles.textContent = v.toLocaleString();
      scene3D.setParticleCount(v);
    });
  }

  const sliderWarp = document.getElementById('slider-warp');
  const valWarp = document.getElementById('val-warp');
  if (sliderWarp && valWarp) {
    sliderWarp.addEventListener('input', (e) => {
      const v = e.target.value;
      valWarp.textContent = `${v}x`;
      scene3D.setWarp(v);
    });
  }

  // Lab Buttons
  const btnBurst = document.getElementById('btn-burst');
  if (btnBurst) {
    btnBurst.addEventListener('click', () => {
      scene3D.triggerBurst();
    });
  }

  const btnReset = document.getElementById('btn-reset-cam');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      scene3D.resetCamera();
    });
  }
}

/**
 * Web Audio Ambient Cosmic Drone Generator (Zero dependencies, pure sound synthesis)
 */
function setupAmbientAudio() {
  const toggleBtn = document.getElementById('sound-toggle');
  const iconOff = document.getElementById('sound-icon-off');
  const iconOn = document.getElementById('sound-icon-on');

  if (!toggleBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let osc1 = null;
  let osc2 = null;
  let gainNode = null;
  let filterNode = null;

  function startAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      // Master gain
      gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 3);

      // Lowpass resonant filter for deep space hum
      filterNode = audioCtx.createBiquadFilter();
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(120, audioCtx.currentTime);
      filterNode.Q.setValueAtTime(4.0, audioCtx.currentTime);

      // Deep drone oscillators (55Hz and 110Hz harmonics)
      osc1 = audioCtx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(55, audioCtx.currentTime); // A1 note

      osc2 = audioCtx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(55.4, audioCtx.currentTime); // Slight detune for pulsing beat

      osc1.connect(filterNode);
      osc2.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc1.start();
      osc2.start();

      isPlaying = true;
      toggleBtn.classList.add('active');
      iconOff.style.display = 'none';
      iconOn.style.display = 'block';
    } catch (e) {
      console.warn('Web Audio not supported', e);
    }
  }

  function stopAudio() {
    if (gainNode && audioCtx) {
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1);
      setTimeout(() => {
        try {
          if (osc1) osc1.stop();
          if (osc2) osc2.stop();
          if (audioCtx) audioCtx.close();
        } catch (e) {}
        isPlaying = false;
        toggleBtn.classList.remove('active');
        iconOff.style.display = 'block';
        iconOn.style.display = 'none';
      }, 1000);
    }
  }

  toggleBtn.addEventListener('click', () => {
    if (!isPlaying) {
      startAudio();
    } else {
      stopAudio();
    }
  });
}

/**
 * Mobile Navigation Toggle
 */
function setupMobileNav() {
  const toggleBtn = document.getElementById('mobile-nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  navMenu.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
    });
  });
}
