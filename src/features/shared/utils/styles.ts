import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ClassValue } from 'clsx';

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}

export function cssVar(name: string) {
  if (typeof document === 'undefined') {
    return undefined;
  }

  try {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
    return value || undefined;
  } catch (error) {
    console.warn(`Failed to get CSS variable ${name}:`, error);
    return undefined;
  }
}
