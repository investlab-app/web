// src/components/landing-page.tsx
import { Link, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  BarChart3,
  Shield,
  Smartphone,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/features/shared/components/ui/button';
import { Card, CardContent } from '@/features/shared/components/ui/card';
import { InvestLabLogo } from '@/features/shared/components/investlab-logo';

export function LandingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const features = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: t('hero.feature_realtime_title'),
      description: t('hero.feature_realtime_desc'),
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: t('hero.feature_analytics_title'),
      description: t('hero.feature_analytics_desc'),
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: t('hero.feature_security_title'),
      description: t('hero.feature_security_desc'),
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: t('hero.feature_mobile_title'),
      description: t('hero.feature_mobile_desc'),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-purple-800/15 dark:from-purple-900/30 dark:via-blue-900/20 dark:to-purple-800/25" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-20 pb-16 text-center lg:pt-32">
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
                {t('hero.title_1')}
                <span className="text-primary block">{t('hero.title_2')}</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
                {t('hero.description')}
              </p>
              <div className="mt-10 flex items-center justify-center gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate({ to: '/signup' })}
                  className="h-12 px-8"
                >
                  {t('hero.get_started_free')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="h-12 px-8">
                    {t('auth.login')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Screenshot Section */}
      <div className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t('hero.platform_title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('hero.platform_description')}
            </p>
          </div>

          {/* Placeholder for platform screenshot */}
          <div className="relative mx-auto max-w-5xl">
            <div className="relative rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/20 to-secondary/20 dark:from-primary/10 dark:to-secondary/10">
              <div className="aspect-[16/10] flex items-center justify-center bg-muted/30 backdrop-blur-sm">
                <div className="text-center p-8">
                  <BarChart3 className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {t('hero.platform_preview')}
                  </h3>
                  <p className="text-muted-foreground">
                    {t('hero.platform_screenshot_coming')}
                  </p>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute top-4 left-4 flex space-x-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
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
              {t('hero.features_title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('hero.features_description')}
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
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
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

      {/* CTA Section */}
      <div className="py-16 bg-purple-900/20 dark:bg-purple-900/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {t('hero.cta_title')}
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            {t('hero.cta_description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              // onClick={() => navigate({ to: '/signup' })}
              className="h-12 px-8 bg-primary-foreground text-purple-900 hover:bg-primary-foreground/90"
            >
              {t('hero.create_free_account')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              // onClick={() => navigate({ to: '/login' })}
              className="h-12 px-8 border-primary-foreground/20 text-foreground hover:bg-primary-foreground/10"
            >
              {t('hero.sign_in')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
