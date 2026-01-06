/**
 * Sound Effects Utility
 *
 * Uses Web Audio API to generate sounds without external files
 * All sounds are synthesized programmatically
 */

// Audio context singleton (created on first use)
let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

/**
 * Play a beep sound
 * @param frequency - Hz (default: 800)
 * @param duration - seconds (default: 0.1)
 * @param volume - 0 to 1 (default: 0.3)
 */
export const playBeep = (
  frequency: number = 800,
  duration: number = 0.1,
  volume: number = 0.3
): void => {
  try {
    const ctx = getAudioContext();

    // Resume context if suspended (required by browsers)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    // Fade out to avoid clicks
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn('Audio not available:', e);
  }
};

/**
 * Play timer complete sound (3 ascending beeps)
 */
export const playTimerComplete = (): void => {
  playBeep(600, 0.15, 0.4);
  setTimeout(() => playBeep(800, 0.15, 0.4), 150);
  setTimeout(() => playBeep(1000, 0.3, 0.5), 300);
};

/**
 * Play countdown tick sound
 */
export const playCountdownTick = (): void => {
  playBeep(440, 0.05, 0.15);
};

/**
 * Play countdown warning (last 3 seconds)
 */
export const playCountdownWarning = (): void => {
  playBeep(880, 0.1, 0.3);
};

/**
 * Play success/confirmation sound
 */
export const playSuccess = (): void => {
  playBeep(523, 0.1, 0.3); // C5
  setTimeout(() => playBeep(659, 0.1, 0.3), 100); // E5
  setTimeout(() => playBeep(784, 0.15, 0.3), 200); // G5
};

/**
 * Play increment sound (button press)
 */
export const playIncrement = (): void => {
  playBeep(600, 0.05, 0.2);
};

/**
 * Play decrement sound (button press)
 */
export const playDecrement = (): void => {
  playBeep(400, 0.05, 0.2);
};

/**
 * Play error/invalid sound
 */
export const playError = (): void => {
  playBeep(200, 0.2, 0.3);
};

/**
 * Play rest period start sound
 */
export const playRestStart = (): void => {
  playBeep(440, 0.2, 0.3);
  setTimeout(() => playBeep(330, 0.2, 0.3), 200);
};

/**
 * Vibrate device if supported
 * @param pattern - vibration pattern in ms
 */
export const vibrate = (pattern: number | number[] = 100): void => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};

/**
 * Combined feedback: sound + vibration
 */
export const hapticFeedback = (type: 'success' | 'error' | 'tick' | 'complete' = 'tick'): void => {
  switch (type) {
    case 'success':
      playSuccess();
      vibrate(50);
      break;
    case 'error':
      playError();
      vibrate([50, 50, 50]);
      break;
    case 'tick':
      playCountdownTick();
      vibrate(10);
      break;
    case 'complete':
      playTimerComplete();
      vibrate([100, 50, 100, 50, 200]);
      break;
  }
};

export default {
  playBeep,
  playTimerComplete,
  playCountdownTick,
  playCountdownWarning,
  playSuccess,
  playIncrement,
  playDecrement,
  playError,
  playRestStart,
  vibrate,
  hapticFeedback,
};
