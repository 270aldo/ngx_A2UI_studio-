import { useState, useEffect } from 'react';

/**
 * useReducedMotion - Respects user's motion preferences for accessibility
 *
 * Returns true if the user has enabled "Reduce Motion" in their OS settings.
 * Use this to disable or simplify animations for users who are sensitive to motion.
 *
 * @returns boolean indicating if reduced motion is preferred
 *
 * @example
 * const prefersReducedMotion = useReducedMotion();
 *
 * <motion.div
 *   animate={prefersReducedMotion ? {} : { scale: [1, 1.2, 1] }}
 * >
 */
export const useReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if window is available (SSR safety)
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
};

/**
 * useAnimationConfig - Returns animation config based on reduced motion preference
 *
 * @param fullAnimation - The full animation object
 * @param reducedAnimation - The simplified animation (default: empty object)
 * @returns The appropriate animation config
 *
 * @example
 * const bounceAnimation = useAnimationConfig(
 *   { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] },
 *   { opacity: [0.8, 1] }
 * );
 */
export const useAnimationConfig = <T extends object>(
  fullAnimation: T,
  reducedAnimation: T = {} as T
): T => {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? reducedAnimation : fullAnimation;
};

/**
 * useAnimationDuration - Returns adjusted duration based on reduced motion preference
 *
 * @param normalDuration - Normal animation duration in ms
 * @param reducedDuration - Reduced duration (default: 0)
 * @returns The appropriate duration
 */
export const useAnimationDuration = (
  normalDuration: number,
  reducedDuration: number = 0
): number => {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? reducedDuration : normalDuration;
};

export default useReducedMotion;
