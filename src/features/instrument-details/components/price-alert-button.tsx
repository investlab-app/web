import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BellIcon } from 'lucide-react';

import { PriceAlertForm } from './price-alert-form';
import { Button } from '@/features/shared/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/features/shared/components/ui/drawer';
import { useIsMobile } from '@/features/shared/hooks/use-media-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/features/shared/components/ui/dialog';

interface PriceAlertButtonProps {
  ticker: string;
}

export function PriceAlertButton({ ticker }: PriceAlertButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  const handleSuccess = () => {
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm">
            <BellIcon className="size-4 mr-2" />
            {t('instruments.price_alert.set_alert')}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              {t('instruments.price_alert.set_price_alert_for', { ticker })}
            </DrawerTitle>
            <DrawerDescription>
              {t('instruments.price_alert.alert_description')}
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4">
            <PriceAlertForm ticker={ticker} onSuccess={handleSuccess} />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">{t('common.cancel')}</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <BellIcon className="size-4 mr-2" />
          {t('instruments.price_alert.set_alert')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {t('instruments.price_alert.set_price_alert_for', { ticker })}
          </DialogTitle>
          <DialogDescription>
            {t('instruments.price_alert.alert_description')}
          </DialogDescription>
        </DialogHeader>
        <PriceAlertForm ticker={ticker} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
