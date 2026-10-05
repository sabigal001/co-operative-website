/**
 * Web Haptic Feedback Utility for Mosunmola Cooperative Platform
 * Provides native tactile vibration feedback across Mobile PWA & responsive browsers.
 */

export type HapticType = 
  | 'light'       // 10ms - subtle button tap, tab change
  | 'selection'   // 6ms - quick slider tick, dropdown scroll
  | 'medium'      // 25ms - card flip, toggle activation
  | 'heavy'       // 45ms - major modal open, trigger action
  | 'success'     // [15, 50, 20] - payment confirmed, approved, pin success
  | 'warning'     // [30, 50, 30] - rejection, confirmation prompt
  | 'error';      // [50, 60, 50, 60, 50] - validation failure

const patterns: Record<HapticType, number | number[]> = {
  selection: 6,
  light: 12,
  medium: 28,
  heavy: 50,
  success: [15, 60, 25],
  warning: [30, 50, 30],
  error: [50, 60, 50, 60, 50],
};

export const triggerHaptic = (type: HapticType = 'light'): void => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return;

  try {
    if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
      const pattern = patterns[type] || 15;
      navigator.vibrate(pattern);
    }
  } catch (err) {
    // Graceful fallback for non-supporting browsers / environments
    console.debug('Haptics not supported or blocked by browser policy:', err);
  }
};
