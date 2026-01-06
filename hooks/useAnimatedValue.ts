import { useState, useEffect, useRef } from 'react';

// Easing functions
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeOutElastic = (t: number): number => {
  const c4 = (2 * Math.PI) / 3;
  return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};
const easeOutBounce = (t: number): number => {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
  if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
  return n1 * (t -= 2.625 / d1) * t + 0.984375;
};

export type EasingType = 'cubic' | 'elastic' | 'bounce' | 'linear';

const easingFunctions: Record<EasingType, (t: number) => number> = {
  cubic: easeOutCubic,
  elastic: easeOutElastic,
  bounce: easeOutBounce,
  linear: (t) => t,
};

interface UseAnimatedValueOptions {
  duration?: number;
  easing?: EasingType;
  decimals?: number;
  onComplete?: () => void;
}

/**
 * useAnimatedValue - Animates a numeric value with easing
 *
 * @param targetValue - The value to animate towards
 * @param options - Animation options
 * @returns The current animated value
 *
 * @example
 * const animatedProgress = useAnimatedValue(progress, { duration: 1000, easing: 'elastic' });
 */
export const useAnimatedValue = (
  targetValue: number,
  options: UseAnimatedValueOptions = {}
): number => {
  const {
    duration = 500,
    easing = 'cubic',
    decimals = 0,
    onComplete,
  } = options;

  const [displayValue, setDisplayValue] = useState(targetValue);
  const animationRef = useRef<number | null>(null);
  const startValueRef = useRef(targetValue);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const start = displayValue;
    const end = targetValue;

    // Don't animate if value hasn't changed
    if (start === end) return;

    startValueRef.current = start;
    startTimeRef.current = null;

    const easingFn = easingFunctions[easing];

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easingFn(progress);
      const current = startValueRef.current + (end - startValueRef.current) * easedProgress;

      const rounded = decimals === 0
        ? Math.round(current)
        : Number(current.toFixed(decimals));

      setDisplayValue(rounded);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(end);
        onComplete?.();
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetValue, duration, easing, decimals]);

  return displayValue;
};

/**
 * useCountUp - Counts up from 0 to a target value on mount
 *
 * @param targetValue - The value to count up to
 * @param options - Animation options
 * @returns The current count value
 */
export const useCountUp = (
  targetValue: number,
  options: UseAnimatedValueOptions = {}
): number => {
  const [hasStarted, setHasStarted] = useState(false);
  const animatedValue = useAnimatedValue(hasStarted ? targetValue : 0, options);

  useEffect(() => {
    // Start animation after mount
    const timer = setTimeout(() => setHasStarted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return animatedValue;
};

/**
 * useSpringValue - Animates with spring physics (bouncy effect)
 */
export const useSpringValue = (
  targetValue: number,
  options: Omit<UseAnimatedValueOptions, 'easing'> = {}
): number => {
  return useAnimatedValue(targetValue, { ...options, easing: 'elastic' });
};

export default useAnimatedValue;
