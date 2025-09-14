import { useEffect, useState } from 'react';

export function useMediaQuery(query: string, defaultValue = false) {
  const [matches, setMatches] = useState<boolean>(defaultValue);

  useEffect(() => {
    if (typeof window === 'undefined') return; // SSR safeguard
    const mql = window.matchMedia(query);
    const onChange = () => {
      setMatches(mql.matches);
    };
    mql.addEventListener('change', onChange);
    setMatches(mql.matches);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export function useIsMinWidth(minWidth: number) {
  return useMediaQuery(`(min-width: ${minWidth}px)`);
}

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  return useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
}

const _2XL_BREAKPOINT = 1536;

export function useIs2XL() {
  return useIsMinWidth(_2XL_BREAKPOINT);
}
