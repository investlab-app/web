const plPrivacyPolicy = {
  title: 'Polityka prywatności',
  lastUpdated: 'Ostatnia aktualizacja: {{date, datetime}}',

  intro1:
    'Niniejsza Polityka prywatności opisuje nasze zasady i procedury dotyczące zbierania, wykorzystywania i ujawniania Twoich informacji podczas korzystania z Usługi oraz informuje Cię o Twoich prawach do prywatności i o tym, jak prawo Cię chroni.',
  intro2:
    'Wykorzystujemy Twoje Dane Osobowe, aby świadczyć i ulepszać Usługę. Korzystając z Usługi, wyrażasz zgodę na zbieranie i wykorzystywanie informacji zgodnie z niniejszą Polityką prywatności.',

  interpretationDefinitions: {
    title: 'Interpretacje i definicje',
    interpretation: {
      title: 'Interpretacje',
      text: 'Wyrazy rozpoczynające się wielką literą mają określone znaczenia zdefiniowane w poniższych warunkach. Definicje te stosuje się zarówno w liczbie pojedynczej, jak i mnogiej.',
    },
    definitions: {
      title: 'Definicje',
      account:
        '<strong>Konto</strong> – Unikalne konto utworzone dla Ciebie w celu uzyskania dostępu do naszej Usługi.',
      affiliate:
        '<strong>Podmiot powiązany</strong> – Podmiot, który kontroluje, jest kontrolowany lub znajduje się pod wspólną kontrolą z nami.',
      company:
        '<strong>Firma</strong> (określana jako „Firma”, „My”, „Nas” lub „Nasz”) odnosi się do InvestLab.',
      cookies:
        '<strong>Ciasteczka</strong> – Małe pliki umieszczane na Twoim urządzeniu przez stronę internetową.',
      country: '<strong>Kraj</strong> – Odnosi się do Polski.',
      device:
        '<strong>Urządzenie</strong> – Każde urządzenie, które może uzyskać dostęp do Usługi (np. laptop, tablet, smartfon).',
      personalData:
        '<strong>Dane osobowe</strong> – Informacje, które odnoszą się do zidentyfikowanej lub możliwej do zidentyfikowania osoby fizycznej.',
      service:
        '<strong>Usługa</strong> – Strona internetowa InvestLab i powiązane funkcjonalności aplikacji.',
      serviceProvider:
        '<strong>Dostawca usług</strong> – Podmiot zewnętrzny, który przetwarza dane w imieniu Firmy.',
      thirdParty:
        '<strong>Zewnętrzna usługa społecznościowa</strong> – Usługi zewnętrzne (np. Google) wykorzystywane do logowania lub tworzenia konta.',
      usageData:
        '<strong>Dane dotyczące użytkowania</strong> – Dane gromadzone automatycznie (np. adres IP, typ przeglądarki, czas spędzony na stronach).',
      website:
        '<strong>Strona internetowa</strong> – Odnosi się do InvestLab, dostępnej pod adresem <a href="https://investlab.app/" target="_blank" rel="noopener">https://investlab.app/</a>.',
      you: '<strong>Ty</strong> – Osoba fizyczna lub podmiot korzystający z naszej Usługi.',
    },
  },

  collecting: {
    title: 'Zbieranie i wykorzystywanie Twoich danych osobowych',
    typesOfData: 'Rodzaje zbieranych danych',

    personalData: {
      title: 'Dane osobowe',
      text: 'Podczas korzystania z naszej Usługi możemy poprosić Cię o podanie danych umożliwiających identyfikację, w tym między innymi:',
      email: 'Adres e-mail',
      name: 'Imię i nazwisko',
      usageData: 'Dane dotyczące użytkowania',
    },

    usageData: {
      title: 'Dane dotyczące użytkowania',
      text: 'Dane dotyczące użytkowania są zbierane automatycznie. Mogą obejmować adres IP Twojego urządzenia, typ przeglądarki, odwiedzane strony, datę i godzinę wizyty, czas spędzony na stronach, unikalne identyfikatory urządzeń i dane diagnostyczne. Na urządzeniach mobilnych mogą obejmować typ systemu operacyjnego, typ przeglądarki oraz identyfikatory urządzeń.',
    },

    thirdPartySocial: {
      title: 'Informacje z zewnętrznych usług społecznościowych',
      text: 'Możesz utworzyć konto lub zalogować się, korzystając z Google. Jeśli to zrobisz, możemy gromadzić Dane Osobowe, takie jak Twoje imię i adres e-mail powiązane z tym kontem.',
    },

    cookies: {
      title: 'Technologie śledzące i pliki cookie',
      text: 'Używamy plików cookie i podobnych technologii do działania i ulepszania naszej Usługi:',
      essential:
        '<strong>Niezbędne pliki cookie (uwierzytelnianie)</strong> – Używane przez <a href="https://clerk.com" target="_blank" rel="noopener">Clerk</a> do bezpiecznych sesji logowania. Są absolutnie konieczne.',
      analytics:
        '<strong>Analityka (bez plików cookie)</strong> – Korzystamy z <a href="https://posthog.com" target="_blank" rel="noopener">PostHog</a> w trybie bez cookies do zbierania anonimowych, zagregowanych danych o korzystaniu z usługi. Żadne cookies ani trwałe identyfikatory nie są zapisywane na Twoim urządzeniu.',
      preference:
        '<strong>Pliki cookie preferencji</strong> – Zapamiętują Twoje ustawienia (np. motyw, język), abyś nie musiał ich ponownie ustawiać przy każdej wizycie.',
      notice:
        'Możesz skonfigurować przeglądarkę, aby odrzucała pliki cookie lub ostrzegała, gdy są wysyłane. Wyłączenie niezbędnych plików cookie może uniemożliwić logowanie się lub korzystanie z niektórych funkcji.',
    },
  },

  contact: {
    title: 'Skontaktuj się z nami',
    text: 'Jeśli masz pytania dotyczące niniejszej Polityki prywatności:',
    email:
      'Email: <a href="mailto:app.investlab@gmail.com">app.investlab@gmail.com</a>',
  },
};

export default plPrivacyPolicy;
