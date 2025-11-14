import { useTranslation } from 'react-i18next';
import { Button } from '@/features/shared/components/ui/button';
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from '@/features/shared/components/ui/credenza';

interface OrderConfirmationModalWrapperProps {
  children: React.ReactNode;
  isBuy: boolean;
  isLimitOrder: boolean;
  price: number;
  volume: number;
  ticker: string;
  onConfirm: () => void;
  onClose?: () => void;
}

export function OrderConfirmationModalWrapper({
  children,
  isBuy,
  isLimitOrder,
  ticker,
  volume,
  price,
  onConfirm,
  onClose,
}: OrderConfirmationModalWrapperProps) {
  const { t } = useTranslation();
  return (
    <Credenza>
      <CredenzaTrigger asChild>{children}</CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>{t('orders.modal.title')}</CredenzaTitle>
          <CredenzaDescription>
            {t('orders.modal.subtitle', {
              orderType: isLimitOrder ? 'limit' : 'market',
            })}
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="space-y-2">
          <p className="font-semibold text-lg">
            {t(`orders.modal.${isBuy ? 'buy' : 'sell'}`).toUpperCase()}
          </p>
          <div className="space-y-1">
            <p>
              <span className="font-medium">
                {t('orders.modal.ticker_label', {
                  ticker: ticker.toUpperCase(),
                })}
              </span>
            </p>
            <p>
              <span className="font-medium">
                {t('orders.modal.volume_label', {
                  volume: volume.toFixed(5),
                })}
              </span>
            </p>
            <p>
              <span className="font-medium">
                {t(
                  isLimitOrder
                    ? 'orders.modal.price_label'
                    : 'orders.modal.approx_price_label',
                  {
                    price: price.toFixed(2),
                  }
                )}
              </span>
            </p>
          </div>
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button onClick={onClose}>{t('orders.modal.close')}</Button>
          </CredenzaClose>
          <CredenzaClose asChild>
            <Button onClick={onConfirm}>{t('orders.modal.confirm')}</Button>
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
