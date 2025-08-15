import { type } from 'arktype';
import { Result } from 'neverthrow';
import { createContext, use, useEffect, useState } from 'react';
import { clientOnly, createIsomorphicFn } from '@tanstack/react-start';
import { ScriptOnce } from '@tanstack/react-router';
import type { ReactNode } from 'react';

export const userThemeType = type("'light' | 'dark' | 'system'");
export type UserTheme = typeof userThemeType.infer;
export const userThemeOrDefault = (input: unknown): UserTheme =>
  Result.fromThrowable((x: unknown) => userThemeType.assert(x))(input).unwrapOr(
    'system'
  );

export const appThemeType = type("'light' | 'dark'");
export type AppTheme = typeof appThemeType.infer;
export const appThemeOrDefault = (input: unknown): AppTheme =>
  Result.fromThrowable((x: unknown) => appThemeType.assert(x))(input).unwrapOr(
    'light'
  );

const themeStorageKey = 'ui-theme';

const getStoredUserTheme = createIsomorphicFn()
  .server((): UserTheme => 'system')
  .client((): UserTheme => {
    const stored = localStorage.getItem(themeStorageKey);
    return userThemeOrDefault(stored);
  });

const setStoredTheme = clientOnly((theme: UserTheme) => {
  const validatedTheme = userThemeOrDefault(theme);
  localStorage.setItem(themeStorageKey, validatedTheme);
});

const getSystemTheme = createIsomorphicFn()
  .server((): AppTheme => 'light')
  .client((): AppTheme => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

const handleThemeChange = clientOnly((userTheme: UserTheme) => {
  const validatedTheme = userThemeOrDefault(userTheme);

  const root = document.documentElement;
  root.classList.remove('light', 'dark', 'system');

  if (validatedTheme === 'system') {
    const systemTheme = getSystemTheme();
    root.classList.add(systemTheme, 'system');
  } else {
    root.classList.add(validatedTheme);
  }
});

const setupPreferredListener = clientOnly(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = () => handleThemeChange('system');
  mediaQuery.addEventListener('change', handler);
  return () => mediaQuery.removeEventListener('change', handler);
});

const themeScript = (function () {
  function themeFn() {
    try {
      const storedTheme = localStorage.getItem('ui-theme') || 'system';
      const validTheme = ['light', 'dark', 'system'].includes(storedTheme)
        ? storedTheme
        : 'system';

      if (validTheme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
          ? 'dark'
          : 'light';
        document.documentElement.classList.add(systemTheme, 'system');
      } else {
        document.documentElement.classList.add(validTheme);
      }
    } catch {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      document.documentElement.classList.add(systemTheme, 'system');
    }
  }
  return `(${themeFn.toString()})();`;
})();

type ThemeContextProps = {
  userTheme: UserTheme;
  appTheme: AppTheme;
  setTheme: (theme: UserTheme) => void;
};
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

type ThemeProviderProps = {
  children: ReactNode;
};
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [userTheme, setUserTheme] = useState<UserTheme>(getStoredUserTheme);

  useEffect(() => {
    if (userTheme !== 'system') return;
    return setupPreferredListener();
  }, [userTheme]);

  const appTheme = userTheme === 'system' ? getSystemTheme() : userTheme;

  const setTheme = (newUserTheme: UserTheme) => {
    const validatedTheme = userThemeOrDefault(newUserTheme);
    setUserTheme(validatedTheme);
    setStoredTheme(validatedTheme);
    handleThemeChange(validatedTheme);
  };

  return (
    <ThemeContext value={{ userTheme, appTheme, setTheme }}>
      <ScriptOnce children={themeScript} />

      {children}
    </ThemeContext>
  );
}

export const useTheme = () => {
  const context = use(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
