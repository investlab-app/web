const enPrivacyPolicy = {
  title: 'Privacy Policy',
  lastUpdated: 'Last updated: {{date, datetime}}',

  intro1:
    'This Privacy Policy describes our policies and procedures on the collection, use and disclosure of your information when you use the Service, and tells you about your privacy rights and how the law protects you.',
  intro2:
    'We use your Personal Data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this Privacy Policy.',

  interpretationDefinitions: {
    title: 'Interpretation and Definitions',
    interpretation: {
      title: 'Interpretation',
      text: 'Words with an initial capital letter have specific meanings defined under the following conditions. These definitions apply whether the terms appear in singular or plural.',
    },
    definitions: {
      title: 'Definitions',
      account:
        '<strong>Account</strong> – A unique account created for you to access our Service.',
      affiliate:
        '<strong>Affiliate</strong> – An entity that controls, is controlled by, or under common control with us.',
      company:
        '<strong>Company</strong> (referred to as “the Company”, “We”, “Us” or “Our”) refers to InvestLab.',
      cookies:
        '<strong>Cookies</strong> – Small files placed on your device by a website.',
      country: '<strong>Country</strong> – Refers to Poland.',
      device:
        '<strong>Device</strong> – Any device that can access the Service (e.g. laptop, tablet, smartphone).',
      personalData:
        '<strong>Personal Data</strong> – Information that relates to an identified or identifiable individual.',
      service:
        '<strong>Service</strong> – The InvestLab website and related application functionality.',
      serviceProvider:
        '<strong>Service Provider</strong> – A third‑party that processes data on behalf of the Company.',
      thirdParty:
        '<strong>Third‑Party Social Media Service</strong> – External services (e.g. Google) for login or account creation.',
      usageData:
        '<strong>Usage Data</strong> – Data collected automatically (e.g. IP address, browser type, time spent on pages).',
      website:
        '<strong>Website</strong> – Refers to InvestLab, accessible from <a href="https://investlab.app/" target="_blank" rel="noopener">https://investlab.app/</a>.',
      you: '<strong>You</strong> – The individual or entity using our Service.',
    },
  },

  collecting: {
    title: 'Collecting and Using Your Personal Data',
    typesOfData: 'Types of Data Collected',

    personalData: {
      title: 'Personal Data',
      text: 'While using our Service, we may ask you to provide personally identifiable information, including but not limited to:',
      email: 'Email address',
      name: 'First and last name',
      usageData: 'Usage Data',
    },

    usageData: {
      title: 'Usage Data',
      text: 'Usage Data is collected automatically. It may include your device’s IP address, browser type, pages visited, date and time of visit, time spent on pages, unique device identifiers, and diagnostics. On mobile, this may include OS type, browser type, and device IDs.',
    },

    thirdPartySocial: {
      title: 'Information from Third‑Party Social Media Services',
      text: 'You may be able to create an account or log in using Google. If you do, we may collect Personal Data such as your name and email address linked with that account.',
    },

    cookies: {
      title: 'Tracking Technologies and Cookies',
      text: 'We use cookies and similar technologies to operate and improve our Service:',
      essential:
        '<strong>Essential Cookies (Authentication)</strong> – Used by <a href="https://clerk.com" target="_blank" rel="noopener">Clerk</a> for secure login sessions. These are strictly necessary.',
      analytics:
        '<strong>Analytics (Cookieless)</strong> – We use <a href="https://posthog.com" target="_blank" rel="noopener">PostHog</a> in cookieless mode to collect anonymized, aggregated usage metrics. No cookies or persistent identifiers are stored on your device.',
      preference:
        '<strong>Preference Cookies</strong> – Remember your settings (e.g. theme, language), so you don’t have to reset them each visit.',
      notice:
        'You can configure your browser to refuse cookies or alert you when cookies are being sent. Disabling essential cookies may prevent login or use of some features.',
    },
  },

  contact: {
    title: 'Contact Us',
    text: 'If you have questions about this Privacy Policy:',
    email:
      'Email: <a href="mailto:app.investlab@gmail.com">app.investlab@gmail.com</a>',
  },
};

export default enPrivacyPolicy;
