const plPrivacyPolicy = {
  title: 'Polityka prywatności',
  lastUpdated:
    'Ostatnia aktualizacja: {{date, datetime(year: numeric; month: long; day: numeric)}}',

  intro: {
    description:
      'Niniejsza polityka prywatności opisuje nasze zasady i procedury dotyczące zbierania, wykorzystywania i ujawniania Twoich informacji podczas korzystania z Serwisu oraz informuje o Twoich prawach do prywatności i o tym, jak prawo Cię chroni.',
    agreement:
      'Wykorzystujemy Twoje dane osobowe do świadczenia i ulepszania Serwisu. Korzystając z Serwisu, zgadzasz się na zbieranie i wykorzystywanie informacji zgodnie z niniejszą Polityką Prywatności.',
  },

  interpretationDefinitions: {
    title: 'Interpretacja i definicje',
    interpretation: {
      title: 'Interpretacja',
      description:
        'Słowa pisane wielką literą mają określone znaczenia zdefiniowane w poniższych warunkach. Definicje te mają zastosowanie niezależnie od tego, czy terminy występują w liczbie pojedynczej czy mnogiej.',
    },
    definitions: {
      title: 'Definicje',
      account: {
        term: 'Konto',
        description:
          'Unikalne konto utworzone dla Ciebie w celu uzyskania dostępu do naszego Serwisu.',
      },
      affiliate: {
        term: 'Podmiot powiązany',
        description:
          'Podmiot, który kontroluje, jest kontrolowany lub znajduje się pod wspólną kontrolą z nami.',
      },
      company: {
        term: 'Firma',
        description:
          '(określana jako "Firma", "My", "Nas" lub "Nasz") odnosi się do InvestLab.',
      },
      cookies: {
        term: 'Pliki cookie',
        description:
          'Małe pliki umieszczane na Twoim urządzeniu przez stronę internetową.',
      },
      country: {
        term: 'Kraj',
        description: 'Odnosi się do Polski.',
      },
      device: {
        term: 'Urządzenie',
        description:
          'Każde urządzenie, które może uzyskać dostęp do Serwisu (np. laptop, tablet, smartfon).',
      },
      personalData: {
        term: 'Dane osobowe',
        description:
          'Informacje odnoszące się do zidentyfikowanej lub możliwej do zidentyfikowania osoby.',
      },
      service: {
        term: 'Serwis',
        description:
          'Strona internetowa InvestLab i powiązane funkcje aplikacji.',
      },
      serviceProvider: {
        term: 'Dostawca usług',
        description: 'Podmiot trzeci, który przetwarza dane w imieniu Firmy.',
      },
      thirdPartySocial: {
        term: 'Zewnętrzne serwisy społecznościowe',
        description:
          'Usługi zewnętrzne (np. Google) do logowania lub tworzenia konta.',
      },
      usageData: {
        term: 'Dane użytkowania',
        description:
          'Dane zbierane automatycznie (np. adres IP, typ przeglądarki, czas spędzony na stronach).',
      },
      website: {
        term: 'Strona internetowa',
        description: 'Odnosi się do InvestLab, dostępnej pod adresem ',
      },
      you: {
        term: 'Ty',
        description:
          'Osoba fizyczna lub podmiot korzystający z naszego Serwisu.',
      },
    },
  },

  collectingData: {
    title: 'Zbieranie i wykorzystywanie Twoich danych osobowych',
    typesOfData: {
      title: 'Rodzaje zbieranych danych',
    },
    personalData: {
      title: 'Dane osobowe',
      description:
        'Podczas korzystania z naszego Serwisu możemy poprosić Cię o podanie danych osobowych umożliwiających identyfikację, w tym między innymi:',
      email: 'Adres e-mail',
      name: 'Imię i nazwisko',
      usageData: 'Dane użytkowania',
    },
    usageData: {
      title: 'Dane użytkowania',
      description:
        'Dane użytkowania są zbierane automatycznie. Mogą obejmować adres IP Twojego urządzenia, typ przeglądarki, odwiedzane strony, datę i godzinę wizyty, czas spędzony na stronach, unikalne identyfikatory urządzeń i dane diagnostyczne. Na urządzeniach mobilnych mogą to być typ systemu operacyjnego, typ przeglądarki i identyfikatory urządzeń.',
    },
    thirdParty: {
      title: 'Informacje z zewnętrznych serwisów społecznościowych',
      description:
        'Możesz mieć możliwość utworzenia konta lub zalogowania się za pomocą Google. Jeśli to zrobisz, możemy zbierać dane osobowe, takie jak Twoje imię i adres e-mail powiązany z tym kontem.',
    },
    cookies: {
      title: 'Technologie śledzenia i pliki cookie',
      description:
        'Używamy plików cookie i podobnych technologii do obsługi i ulepszania naszego Serwisu:',
      essential: {
        title: 'Niezbędne pliki cookie (Uwierzytelnianie)',
        description: 'Używane przez ',
        suffix:
          ' do bezpiecznych sesji logowania. Są one absolutnie niezbędne.',
      },
      analytics: {
        title: 'Analityka (bez plików cookie)',
        description: 'Używamy ',
        suffix:
          ' w trybie bez plików cookie do zbierania anonimowych, zagregowanych danych użytkowania. Żadne pliki cookie ani trwałe identyfikatory nie są przechowywane na Twoim urządzeniu.',
      },
      preference: {
        title: 'Pliki cookie preferencji',
        description:
          'Zapamiętują Twoje ustawienia (np. motyw, język), aby nie trzeba było ich resetować przy każdej wizycie.',
      },
      browserSettings:
        'Możesz skonfigurować swoją przeglądarkę tak, aby odrzucała pliki cookie lub ostrzegała, gdy pliki cookie są wysyłane. Wyłączenie niezbędnych plików cookie może uniemożliwić logowanie lub korzystanie z niektórych funkcji.',
    },
  },

  useOfData: {
    title: 'Wykorzystanie Twoich danych osobowych',
    description: 'Możemy wykorzystywać dane osobowe w następujących celach:',
    purposes: {
      provide: {
        title: 'Świadczenie i utrzymanie Serwisu',
        description: ', w tym monitorowanie użytkowania.',
      },
      manage: {
        title: 'Zarządzanie Twoim kontem',
        description: ', w tym rejestracja i funkcje profilu.',
      },
      contract: {
        title: 'Wykonanie umowy',
        description: ', dostarczanie usług, o które prosisz.',
      },
      contact: {
        title: 'Kontakt z Tobą',
        description: ', w sprawie aktualizacji lub powiadomień bezpieczeństwa.',
      },
      news: {
        title: 'Dostarczanie wiadomości lub ofert',
        description: '(chyba że zrezygnujesz).',
      },
      requests: {
        title: 'Zarządzanie żądaniami',
        description: 'i obsługa klienta.',
      },
      transfers: {
        title: 'Transfery biznesowe',
        description: '(fuzje/sprzedaż).',
      },
      analytics: {
        title: 'Analityka i ulepszenia',
        description: 'w celu poprawy funkcji i użyteczności.',
      },
    },
  },

  sharingData: {
    description: 'Możemy udostępniać dane osobowe w następujący sposób:',
    authProviders: {
      title: 'Z dostawcami uwierzytelniania: ',
      description:
        ' przetwarza dane logowania i sesji w sposób bezpieczny. Dane mogą być przekazywane poza EOG, zabezpieczone standardowymi klauzulami umownymi (SCC).',
    },
    analyticsProviders: {
      title: 'Z dostawcami analityki: ',
      description:
        ' w trybie bez plików cookie zbiera anonimowe, zagregowane dane użytkowania. Żadne pliki cookie ani trwałe identyfikatory nie są przechowywane.',
    },
    otherProviders: {
      title: 'Z innymi dostawcami usług',
      description:
        'Do hostingu, infrastruktury i dostarczania wiadomości e-mail.',
    },
    businessTransfers: {
      title: 'Dla transferów biznesowych',
      description: ', fuzji lub przejęć.',
    },
    affiliates: {
      title: 'Z podmiotami powiązanymi',
      description: ', pod wspólną kontrolą i związanymi niniejszą Polityką.',
    },
    partners: {
      title: 'Z partnerami biznesowymi',
      description: 'dla wspólnych ofert.',
    },
    users: {
      title: 'Z innymi użytkownikami',
      description: ', jeśli dobrowolnie udostępnisz informacje publicznie.',
    },
    consent: {
      title: 'Za Twoją zgodą',
      description: ', w każdym innym celu.',
    },
  },

  retention: {
    title: 'Przechowywanie Twoich danych osobowych',
    description:
      'Przechowujemy dane osobowe tak długo, jak jest to konieczne do celów określonych w niniejszej Polityce, aby wypełnić zobowiązania prawne, rozwiązywać spory i egzekwować nasze umowy. Dane użytkowania są zazwyczaj przechowywane przez krótsze okresy, chyba że są używane do celów bezpieczeństwa lub ulepszeń.',
  },

  transfer: {
    title: 'Transfer Twoich danych osobowych',
    description:
      'Twoje informacje mogą być przechowywane lub przetwarzane poza Twoim krajem. Używamy zabezpieczeń uznanych przez RODO przy transferze danych poza EOG/UK.',
  },

  delete: {
    title: 'Usuwanie Twoich danych osobowych',
    description:
      'Możesz usunąć dane osobowe ze swojego konta lub kontaktując się z nami. Niektóre dane mogą być zachowane, jeśli jest to wymagane prawnie.',
  },

  disclosure: {
    title: 'Ujawnianie Twoich danych osobowych',
    businessTransactions: {
      title: 'Transakcje biznesowe',
      description:
        'W przypadku fuzji lub sprzedaży dane osobowe mogą zostać przekazane z powiadomieniem.',
    },
    lawEnforcement: {
      title: 'Organy ścigania',
      description:
        'Możemy ujawnić dane, jeśli jest to wymagane przez prawo lub ważne żądanie.',
    },
    otherLegal: {
      title: 'Inne wymogi prawne',
      description:
        'Możemy ujawnić dane w dobrej wierze, aby przestrzegać prawa, chronić prawa/własność, zapewnić bezpieczeństwo lub zapobiec odpowiedzialności.',
    },
  },

  security: {
    title: 'Bezpieczeństwo Twoich danych osobowych',
    description:
      'Używamy standardowych zabezpieczeń branżowych do ochrony danych osobowych, ale żadna metoda transmisji elektronicznej lub przechowywania nie jest w 100% bezpieczna.',
  },

  gdpr: {
    title:
      'Informacja RODO dla użytkowników w Europejskim Obszarze Gospodarczym (EOG) i Wielkiej Brytanii',
    description:
      'Jeśli znajdujesz się w EOG lub Wielkiej Brytanii, przetwarzamy dane tylko na podstawach prawnych uznanych przez RODO.',
    lawfulBases: {
      title: 'Podstawy prawne przetwarzania',
      contract: {
        title: 'Wykonanie umowy',
        description:
          'tworzenie konta, świadczenie usług i uwierzytelnianie przez Clerk.',
      },
      consent: {
        title: 'Zgoda',
        description:
          'na opcjonalny marketing lub nieistotne pliki cookie (możliwe do wycofania w każdej chwili).',
      },
      legitimate: {
        title: 'Uzasadnione interesy',
        description:
          'analityka przez PostHog w trybie bez plików cookie, ulepszanie funkcji i ochrona bezpieczeństwa.',
      },
      legal: {
        title: 'Obowiązki prawne',
        description: 'zgodność z przepisami finansowymi, podatkowymi i innymi.',
      },
    },
    transfers: {
      title: 'Transfery międzynarodowe',
      description:
        'Niektórzy dostawcy (jak Clerk i PostHog, jeśli korzystają z usługi w chmurze) mogą przetwarzać dane poza EOG/UK. Transfery są zabezpieczone za pomocą standardowych klauzul umownych (SCC) lub innych zatwierdzonych zabezpieczeń.',
    },
    rights: {
      title: 'Twoje prawa ochrony danych',
      access: 'Dostęp do danych, które posiadamy;',
      correct: 'Poprawianie nieścisłości;',
      delete: 'Żądanie usunięcia ("prawo do bycia zapomnianym");',
      restrict: 'Ograniczenie lub sprzeciw wobec przetwarzania;',
      portability: 'Żądanie przenoszenia danych;',
      withdraw: 'Wycofanie zgody (gdzie ma to zastosowanie);',
      complaint: 'Złożenie skargi do organu ochrony danych.',
    },
    children: {
      title: 'Dzieci i ograniczenia wiekowe',
      description:
        'Nasz Serwis jest przeznaczony dla osób dorosłych 18+. Nie zbieramy świadomie danych osób poniżej 18 roku życia. Jeśli takie dane zostaną odkryte, zostaną usunięte.',
    },
    contact: {
      title: 'Kontakt w sprawach RODO',
      email: 'E-mail:',
      mail: 'Pocztą: [Wstaw oficjalny adres firmy]',
    },
  },

  links: {
    title: 'Linki do innych stron internetowych',
    description:
      'Nasz Serwis może zawierać linki do zewnętrznych witryn. Nie ponosimy odpowiedzialności za ich praktyki prywatności, dlatego prosimy o zapoznanie się z ich Politykami Prywatności.',
  },

  changes: {
    title: 'Zmiany w tej Polityce Prywatności',
    description:
      'Możemy od czasu do czasu aktualizować tę Politykę Prywatności. Aktualizacje będą publikowane na tej stronie ze zaktualizowaną datą "Ostatniej aktualizacji". W niektórych przypadkach możemy również powiadomić Cię e-mailem lub powiadomieniem w aplikacji.',
  },

  contact: {
    title: 'Kontakt',
    description: 'Jeśli masz pytania dotyczące tej Polityki Prywatności:',
    email: 'E-mail:',
  },
};

export default plPrivacyPolicy;
