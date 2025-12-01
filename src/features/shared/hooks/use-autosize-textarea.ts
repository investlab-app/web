import { useLayoutEffect, useRef } from 'react';

interface UseAutosizeTextAreaProps {
  ref: React.RefObject<HTMLTextAreaElement | null>;
  maxHeight?: number;
  minHeight?: number;
  borderWidth?: number;
  dependencies: React.DependencyList;
}

export function useAutosizeTextArea({
  ref,
  maxHeight = Number.MAX_SAFE_INTEGER,
  minHeight = 80,
  borderWidth = 0,
  dependencies,
}: UseAutosizeTextAreaProps) {
  const isInitialized = useRef(false);
  const initialScrollHeightCaptured = useRef(false);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const currentRef = ref.current;
    const borderAdjustment = borderWidth * 2;
    const targetHeight = minHeight + borderAdjustment;

    // First initialization: set to minHeight and mark as initialized
    if (!isInitialized.current) {
      currentRef.style.height = `${targetHeight}px`;
      isInitialized.current = true;
      return;
    }

    // Second run: capture initial scrollHeight but don't adjust yet
    // This allows the textarea to settle with proper layout
    if (!initialScrollHeightCaptured.current) {
      initialScrollHeightCaptured.current = true;
      return;
    }

    // From third run onwards: perform normal auto-sizing
    // Reset height to minHeight to get accurate scrollHeight measurement
    currentRef.style.height = `${targetHeight}px`;
    const scrollHeight = currentRef.scrollHeight;

    // Calculate final height with constraints:
    // 1. Don't exceed maxHeight
    const clampedToMax = Math.min(scrollHeight, maxHeight);
    // 2. Don't go below minHeight
    const clampedToMin = Math.max(clampedToMax, minHeight);

    currentRef.style.height = `${clampedToMin + borderAdjustment}px`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxHeight, minHeight, borderWidth, ref, ...dependencies]);
}
