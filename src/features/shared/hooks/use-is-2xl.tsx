import { useEffect, useState } from 'react';

const _2XL_BREAKPOINT = 1536;

export function useIs2XL() {
  const [is2XL, setIs2XL] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${_2XL_BREAKPOINT}px)`);
    const onChange = () => {
      setIs2XL(window.innerWidth >= _2XL_BREAKPOINT);
    };
    mql.addEventListener('change', onChange);
    // We set initial value inside an effect so it runs only on the client.
    // This avoids touching `window` during render and prevents hydration issues if SSR is introduced later.
    // eslint-disable-next-line react-you-might-not-need-an-effect/no-initialize-state
    setIs2XL(window.innerWidth >= _2XL_BREAKPOINT);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return !!is2XL;
}
