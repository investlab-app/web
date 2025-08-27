import { useEffect, useState } from 'react';

export function useIsMinWidth(minWidth: number) {
  const [isMinWidth, setIsMinWidth] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${minWidth}px)`);
    const onChange = () => {
      setIsMinWidth(window.innerWidth >= minWidth);
    };
    mql.addEventListener('change', onChange);
    setIsMinWidth(window.innerWidth >= minWidth);
    return () => mql.removeEventListener('change', onChange);
  }, [minWidth]);

  return !!isMinWidth;
}
