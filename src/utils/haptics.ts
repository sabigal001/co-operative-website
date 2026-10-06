/**
 * Universal Haptic Feedback Utility for Mosunmola Cooperative Platform
 * Provides native tactile vibration feedback across Mobile PWA & responsive browsers.
 * Integrates Web Audio API mechanical micro-clicks for iOS (Safari & Chrome on iPhone/iPad)
 * and physical navigator.vibrate for Android & supported devices.
 */

export type HapticType = 
  | 'light'       // subtle button tap, tab change
  | 'selection'   // quick slider tick, dropdown scroll
  | 'medium'      // card flip, toggle activation
  | 'heavy'       // major modal open, trigger action
  | 'success'     // payment confirmed, approved, pin success
  | 'warning'     // rejection, confirmation prompt
  | 'error';      // validation failure

const patterns: Record<HapticType, number | number[]> = {
  selection: 6,
  light: 12,
  medium: 28,
  heavy: 50,
  success: [15, 60, 25],
  warning: [30, 50, 30],
  error: [50, 60, 50, 60, 50],
};

let audioCtx: AudioContext | null = null;

const playHapticTone = (freq: number, duration: number, gainValue: number, delay: number = 0) => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const startTime = audioCtx.currentTime + delay;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    // Soft sine wave produces a clean mechanical bump
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);
    // Rapid pitch drop produces a mechanical 'thump/tick' feel
    osc.frequency.exponentialRampToValueAtTime(30, startTime + duration);

    gain.gain.setValueAtTime(gainValue, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  } catch {
    // Ignore audio context initialization or restriction errors
  }
};

export const triggerHaptic = (type: HapticType = 'light'): void => {
  if (typeof window === 'undefined') return;

  // 1. Native physical vibration (Android / devices with vibration motor support)
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator && typeof navigator.vibrate === 'function') {
      const pattern = patterns[type] || 15;
      navigator.vibrate(pattern);
    }
  } catch {}

  // 2. High-precision Web Audio tactile micro-click (Works on iOS iPhone/iPad & desktop)
  try {
    switch (type) {
      case 'selection':
        playHapticTone(180, 0.008, 0.05);
        break;
      case 'light':
        playHapticTone(130, 0.014, 0.07);
        break;
      case 'medium':
        playHapticTone(95, 0.022, 0.12);
        break;
      case 'heavy':
        playHapticTone(75, 0.035, 0.16);
        break;
      case 'success':
        playHapticTone(110, 0.016, 0.12, 0);
        playHapticTone(150, 0.020, 0.14, 0.07);
        break;
      case 'warning':
        playHapticTone(85, 0.025, 0.13, 0);
        playHapticTone(85, 0.025, 0.13, 0.07);
        break;
      case 'error':
        playHapticTone(65, 0.025, 0.15, 0);
        playHapticTone(60, 0.025, 0.15, 0.06);
        playHapticTone(55, 0.025, 0.15, 0.12);
        break;
    }
  } catch {}
};
