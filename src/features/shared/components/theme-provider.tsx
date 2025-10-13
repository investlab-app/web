import { createContext, useContext, useLayoutEffect, useState } from 'react';

type UserTheme = 'dark' | 'light' | 'system';
type AppTheme = 'dark' | 'light';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: UserTheme;
  storageKey?: string;
};

type ThemeProviderState = {
  userTheme: UserTheme;
  appTheme: AppTheme;
  setTheme: (theme: UserTheme) => void;
};

const initialState: ThemeProviderState = {
  userTheme: 'system',
  appTheme: undefined!,
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

function getAppTheme(userTheme: UserTheme) {
  if (userTheme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light';
    return systemTheme;
  }

  return userTheme;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [userTheme, setUserTheme] = useState<UserTheme>(
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    () => (localStorage.getItem(storageKey) as UserTheme) || defaultTheme
  );
  const appTheme = getAppTheme(userTheme);

  useLayoutEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(appTheme);
  }, [appTheme]);

  const value = {
    userTheme,
    appTheme,
    setTheme: (newTheme: UserTheme) => {
      localStorage.setItem(storageKey, newTheme);
      setUserTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
