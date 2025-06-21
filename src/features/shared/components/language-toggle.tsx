import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

import { Button } from '@/features/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/features/shared/components/ui/dropdown-menu';

const LANGUAGES = [
  { code: 'en', label: 'English', symbol: 'EN' },
  { code: 'pl', label: 'Polski', symbol: 'PL' },
];

export function LanguageToggle() {
  const { i18n } = useTranslation();

  const handleChangeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const currentLang = LANGUAGES.find((lang) => lang.code === i18n.language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-7">
          {currentLang ? (
            <div className="font-semibold"> {currentLang.symbol} </div>
          ) : (
            <Globe className="h-[1.2rem] w-[1.2rem]" />
          )}
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map(({ code, label }) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleChangeLanguage(code)}
            className={i18n.language === code ? 'font-semibold' : ''}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
