import { Link, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  Bot,
  CandlestickChart,
  History,
  LayoutDashboard,
  Newspaper,
  PieChart,
  ShieldCheck,
  Wallet,
  Workflow,
} from 'lucide-react';
import { Button } from '@/features/shared/components/ui/button';
import { Card, CardContent } from '@/features/shared/components/ui/card';
import { InvestLabLogo } from '@/features/shared/components/investlab-logo';
import { ThemeToggle } from '@/features/shared/components/mode-toggle';
import { LanguageToggle } from '@/features/shared/components/language-toggle';
import { cn } from '@/features/shared/utils/styles';
import { useTheme } from '@/features/shared/components/theme-provider';
import { LANDING_IMGS_BASE_URL } from '@/features/shared/utils/constants';

export function LandingPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { appTheme } = useTheme();

  const features = [
    {
      icon: <Workflow className="h-6 w-6" />,
      title: t('landing.core_features.feature_1_title'),
      description: t('landing.core_features.feature_1_description'),
    },
    {
      icon: <Bot className="h-6 w-6" />,
      title: t('landing.core_features.feature_2_title'),
      description: t('landing.core_features.feature_2_description'),
    },
    {
      icon: <Newspaper className="h-6 w-6" />,
      title: t('landing.core_features.feature_3_title'),
      description: t('landing.core_features.feature_3_description'),
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: t('landing.core_features.feature_4_title'),
      description: t('landing.core_features.feature_4_description'),
    },
  ];

  const platformFeatures = [
    {
      icon: <LayoutDashboard className="h-8 w-8" />,
      title: t('landing.features_overview.dashboard_title'),
      description: t('landing.features_overview.dashboard_description'),
      image: 'dash',
    },
    {
      icon: <Newspaper className="h-8 w-8" />,
      title: t('landing.features_overview.market_data_title'),
      description: t('landing.features_overview.market_data_description'),
      image: 'info',
    },
    {
      icon: <PieChart className="h-8 w-8" />,
      title: t('landing.features_overview.statistics_title'),
      description: t('landing.features_overview.statistics_description'),
      image: 'stats',
    },
    {
      icon: <History className="h-8 w-8" />,
      title: t('landing.features_overview.transactions_title'),
      description: t('landing.features_overview.transactions_description'),
      image: 'history',
    },
    {
      icon: <Wallet className="h-8 w-8" />,
      title: t('landing.features_overview.wallet_title'),
      description: t('landing.features_overview.wallet_description'),
      image: 'wallet',
    },
    {
      icon: <Workflow className="h-8 w-8" />,
      title: t('landing.features_overview.strategy_editor_title'),
      description: t('landing.features_overview.strategy_editor_description'),
      image: 'strategies',
    },
    {
      icon: <Bot className="h-8 w-8" />,
      title: t('landing.features_overview.llm_chat_title'),
      description: t('landing.features_overview.llm_chat_description'),
      image: 'chat',
    },
    {
      icon: <CandlestickChart className="h-8 w-8" />,
      title: t('landing.features_overview.charts_title'),
      description: t('landing.features_overview.charts_description'),
      image: 'charts',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-purple-800/15 dark:from-purple-900/30 dark:via-blue-900/20 dark:to-purple-800/25">
        {/* Language and theme toggles */}
        <nav className="flex justify-end h-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-10 pb-16 text-center lg:pt-16">
            <div className="mx-auto max-w-4xl">
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <div className="flex items-center gap-4">
                  <InvestLabLogo width={48} height={48} className="!size-12" />
                  <h2 className="text-4xl font-bold text-foreground tracking-wide">
                    {t('common.app_name')}
                  </h2>
                </div>
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                {t('landing.header.title_1')}
                <span className="text-primary-foreground  block">
                  {t('landing.header.title_2')}
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto text-balance">
                {t('landing.header.description')}
              </p>
              <div className="mt-10 flex items-center justify-center gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate({ to: '/signup' })}
                  className="h-12 px-8"
                >
                  {t('landing.get_started_free')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="h-12 px-8">
                    {t('landing.login')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t('landing.core_features.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('landing.core_features.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center p-6 hover:shadow-lg transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-foreground">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t('landing.features_overview.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('landing.features_overview.description')}
            </p>
          </div>

          <div className="space-y-16">
            {platformFeatures.map((feature, index) => (
              <div
                key={index}
                className={cn(
                  'flex flex-col md:flex-row items-center gap-8 md:gap-12',
                  index % 2 !== 0 && 'md:flex-row-reverse'
                )}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-foreground">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-lg">
                    {feature.description}
                  </p>
                </div>
                <div className="flex-1 w-full h-64 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">
                    {!feature.image ? (
                      t('landing.features_overview.screenshot_placeholder')
                    ) : (
                      <img
                        src={`${LANDING_IMGS_BASE_URL}/${i18n.language}/${appTheme}/${feature.image}.jpg`}
                        alt={feature.title}
                        className="w-full h-full object-cover rounded-lg border border-foreground/10"
                      />
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-purple-900/20 dark:bg-purple-900/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {t('landing.cta_title')}
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            {t('landing.cta_description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="h-12 px-8">
                {t('landing.get_started_free')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 border-primary-foreground/20 text-foreground hover:bg-primary-foreground/10"
              >
                {t('landing.login')}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground mb-4 sm:mb-0">
              © 2025 InvestLab.
            </div>
            <div className="flex space-x-6">
              <Link
                to="/privacy-policy"
                target="_blank"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('common.privacy_policy')}
              </Link>
              <Link
                to="/terms-of-service"
                target="_blank"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('common.terms_of_service')}
              </Link>
              <Link
                to="/faq"
                target="_blank"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('common.faq')}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
