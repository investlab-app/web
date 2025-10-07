const enPrivacyPolicy = {
  title: 'Privacy Policy',
  lastUpdated:
    'Last updated: {{date, datetime(year: numeric; month: long; day: numeric)}}',

  intro: {
    description:
      'This Privacy Policy describes our policies and procedures on the collection, use and disclosure of your information when you use the Service, and tells you about your privacy rights and how the law protects you.',
    agreement:
      'We use your Personal Data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this Privacy Policy.',
  },

  interpretationDefinitions: {
    title: 'Interpretation and Definitions',
    interpretation: {
      title: 'Interpretation',
      description:
        'Words with an initial capital letter have specific meanings defined under the following conditions. These definitions apply whether the terms appear in singular or plural.',
    },
    definitions: {
      title: 'Definitions',
      account: {
        term: 'Account',
        description: 'A unique account created for you to access our Service.',
      },
      affiliate: {
        term: 'Affiliate',
        description:
          'An entity that controls, is controlled by, or under common control with us.',
      },
      company: {
        term: 'Company',
        description:
          '(referred to as "the Company", "We", "Us" or "Our") refers to InvestLab.',
      },
      cookies: {
        term: 'Cookies',
        description: 'Small files placed on your device by a website.',
      },
      country: {
        term: 'Country',
        description: 'Refers to Poland.',
      },
      device: {
        term: 'Device',
        description:
          'Any device that can access the Service (e.g. laptop, tablet, smartphone).',
      },
      personalData: {
        term: 'Personal Data',
        description:
          'Information that relates to an identified or identifiable individual.',
      },
      service: {
        term: 'Service',
        description:
          'The InvestLab website and related application functionality.',
      },
      serviceProvider: {
        term: 'Service Provider',
        description:
          'A third‑party that processes data on behalf of the Company.',
      },
      thirdPartySocial: {
        term: 'Third‑Party Social Media Service',
        description:
          'External services (e.g. Google) for login or account creation.',
      },
      usageData: {
        term: 'Usage Data',
        description:
          'Data collected automatically (e.g. IP address, browser type, time spent on pages).',
      },
      website: {
        term: 'Website',
        description: 'Refers to InvestLab, accessible from ',
      },
      you: {
        term: 'You',
        description: 'The individual or entity using our Service.',
      },
    },
  },

  collectingData: {
    title: 'Collecting and Using Your Personal Data',
    typesOfData: {
      title: 'Types of Data Collected',
    },
    personalData: {
      title: 'Personal Data',
      description:
        'While using our Service, we may ask you to provide personally identifiable information, including but not limited to:',
      email: 'Email address',
      name: 'First and last name',
      usageData: 'Usage Data',
    },
    usageData: {
      title: 'Usage Data',
      description:
        "Usage Data is collected automatically. It may include your device's IP address, browser type, pages visited, date and time of visit, time spent on pages, unique device identifiers, and diagnostics. On mobile, this may include OS type, browser type, and device IDs.",
    },
    thirdParty: {
      title: 'Information from Third‑Party Social Media Services',
      description:
        'You may be able to create an account or log in using Google. If you do, we may collect Personal Data such as your name and email address linked with that account.',
    },
    cookies: {
      title: 'Tracking Technologies and Cookies',
      description:
        'We use cookies and similar technologies to operate and improve our Service:',
      essential: {
        title: 'Essential Cookies (Authentication)',
        description: 'Used by ',
        suffix: ' for secure login sessions. These are strictly necessary.',
      },
      analytics: {
        title: 'Analytics (Cookieless)',
        description: 'We use ',
        suffix:
          ' in cookieless mode to collect anonymized, aggregated usage metrics. No cookies or persistent identifiers are stored on your device.',
      },
      preference: {
        title: 'Preference Cookies',
        description:
          "Remember your settings (e.g. theme, language), so you don't have to reset them each visit.",
      },
      browserSettings:
        'You can configure your browser to refuse cookies or alert you when cookies are being sent. Disabling essential cookies may prevent login or use of some features.',
    },
  },

  useOfData: {
    title: 'Use of Your Personal Data',
    description: 'We may use Personal Data for the following purposes:',
    purposes: {
      provide: {
        title: 'To provide and maintain the Service',
        description: ', including monitoring usage.',
      },
      manage: {
        title: 'To manage your Account',
        description: ', including registration and profile functionality.',
      },
      contract: {
        title: 'To perform a contract',
        description: ', delivering services you request.',
      },
      contact: {
        title: 'To contact you',
        description: ', regarding updates or security notices.',
      },
      news: {
        title: 'To provide news or offers',
        description: '(unless you opt out).',
      },
      requests: {
        title: 'To manage requests',
        description: 'and customer support.',
      },
      transfers: {
        title: 'For business transfers',
        description: '(mergers/sales).',
      },
      analytics: {
        title: 'For analytics and improvements',
        description: 'to enhance features and usability.',
      },
    },
  },

  sharingData: {
    description: 'We may share Personal Data in the following ways:',
    authProviders: {
      title: 'With Authentication Providers: ',
      description:
        ' processes login credentials and session data securely. Data may be transferred outside the EEA, safeguarded by Standard Contractual Clauses (SCCs).',
    },
    analyticsProviders: {
      title: 'With Analytics Providers: ',
      description:
        ' in cookieless mode collects anonymized, aggregated usage metrics. No cookies or persistent identifiers are stored.',
    },
    otherProviders: {
      title: 'With Other Service Providers',
      description: 'For hosting, infrastructure, and email delivery.',
    },
    businessTransfers: {
      title: 'For business transfers',
      description: ', mergers or acquisitions.',
    },
    affiliates: {
      title: 'With affiliates',
      description: ', under common control and bound by this Policy.',
    },
    partners: {
      title: 'With business partners',
      description: 'for joint offerings.',
    },
    users: {
      title: 'With other users',
      description: ', if you voluntarily share info publicly.',
    },
    consent: {
      title: 'With your consent',
      description: ', for any other purpose.',
    },
  },

  retention: {
    title: 'Retention of Your Personal Data',
    description:
      'We retain Personal Data as long as necessary for the purposes in this Policy, to comply with legal obligations, resolve disputes, and enforce agreements. Usage Data is generally kept for shorter periods, unless used for security or improvements.',
  },

  transfer: {
    title: 'Transfer of Your Personal Data',
    description:
      'Your information may be stored or processed outside your country. We use GDPR‑recognized safeguards when transferring data outside the EEA/UK.',
  },

  delete: {
    title: 'Delete Your Personal Data',
    description:
      'You may delete Personal Data from your Account or by contacting us. Some data may be retained if legally required.',
  },

  disclosure: {
    title: 'Disclosure of Your Personal Data',
    businessTransactions: {
      title: 'Business Transactions',
      description:
        'If involved in a merger or sale, Personal Data may be transferred with notice.',
    },
    lawEnforcement: {
      title: 'Law Enforcement',
      description: 'We may disclose data if required by law or valid request.',
    },
    otherLegal: {
      title: 'Other Legal Requirements',
      description:
        'We may disclose in good faith to comply with law, protect rights/property, ensure safety, or prevent liability.',
    },
  },

  security: {
    title: 'Security of Your Personal Data',
    description:
      'We use industry‑standard safeguards to protect Personal Data, but no method of electronic transmission or storage is 100% secure.',
  },

  gdpr: {
    title:
      'GDPR Notice for Users in the European Economic Area (EEA) and United Kingdom',
    description:
      'If you are located in the EEA or the UK, we process data only under lawful bases recognized by GDPR.',
    lawfulBases: {
      title: 'Lawful Bases for Processing',
      contract: {
        title: 'Performance of a Contract',
        description:
          'account creation, service delivery, and authentication via Clerk.',
      },
      consent: {
        title: 'Consent',
        description:
          'for optional marketing or non‑essential cookies (withdrawable at any time).',
      },
      legitimate: {
        title: 'Legitimate Interests',
        description:
          'analytics through PostHog in cookieless mode, improving features, and protecting security.',
      },
      legal: {
        title: 'Legal Obligations',
        description: 'compliance with finance, tax, and other regulations.',
      },
    },
    transfers: {
      title: 'International Transfers',
      description:
        'Some providers (like Clerk, and PostHog if using their cloud service) may process data outside the EEA/UK. Transfers are secured using Standard Contractual Clauses (SCCs) or other approved safeguards.',
    },
    rights: {
      title: 'Your Data Protection Rights',
      access: 'Access the data we hold;',
      correct: 'Correct inaccuracies;',
      delete: 'Request deletion ("right to be forgotten");',
      restrict: 'Restrict or object to processing;',
      portability: 'Request data portability;',
      withdraw: 'Withdraw consent (where applicable);',
      complaint: 'Lodge a complaint with a Data Protection Authority.',
    },
    children: {
      title: 'Children and Age Restrictions',
      description:
        'Our Service is intended for adults 18+. We do not knowingly collect data of individuals under 18. If discovered, such data will be deleted.',
    },
    contact: {
      title: 'Contact for GDPR Inquiries',
      email: 'By email:',
      mail: 'By mail: [Insert official company address]',
    },
  },

  links: {
    title: 'Links to Other Websites',
    description:
      'Our Service may link to external sites. We are not responsible for their privacy practices, so please review their Privacy Policies.',
  },

  changes: {
    title: 'Changes to this Privacy Policy',
    description:
      'We may update this Privacy Policy from time to time. Updates will be posted on this page with a revised "Last updated" date. In some cases, we may also notify you by email or in‑app notice.',
  },

  contact: {
    title: 'Contact Us',
    description: 'If you have questions about this Privacy Policy:',
    email: 'Email:',
  },
};

export default enPrivacyPolicy;
