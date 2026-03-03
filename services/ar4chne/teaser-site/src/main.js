// ============================================
// AR4CHNE Teaser — Main Entry
// ============================================

import './style.css';
import { initBackground } from './background.js';
import { initAnimations } from './animations.js';
import { initCountdown } from './countdown.js';
import { initCursorTrail } from './cursor-trail.js';
import { initTerminal } from './terminal.js';

// --- Initialize Three.js background ---
const canvas = document.getElementById('bg-canvas');
initBackground(canvas);

// --- Initialize GSAP animations ---
initAnimations();

// --- Initialize countdown ---
initCountdown();

// --- Initialize cursor trail (PC only) ---
initCursorTrail();

// --- Initialize terminal resume ---
initTerminal();
