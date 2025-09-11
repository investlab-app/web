import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useEffect, useState } from 'react';
import type { ClassValue } from 'clsx';

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}

export function cssVar(name: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

/**
 * Hook that watches CSS custom property changes (via class/style/head mutations)
 * and returns the current computed value. Use for theme colors (light/dark),
 * not for high‑frequency variable updates like animations.
 */
export function useCssVar(name: string) {
  const [value, setValue] = useState(() => cssVar(name));

  useEffect(() => {
    const update = () => setValue(cssVar(name));
    update();

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (
          (m.type === 'attributes' &&
            (m.attributeName === 'class' || m.attributeName === 'style')) ||
          m.type === 'childList'
        ) {
          update();
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style'],
    });

    observer.observe(document.head, {
      childList: true, // for dynamically added/removed <style>/<link>
      subtree: true,
    });

    return () => observer.disconnect();
  }, [name]);

  return value;
}
