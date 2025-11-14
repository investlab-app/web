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
}

export function OrderConfirmationModalWrapper({
  children,
  isBuy,
  isLimitOrder,
  ticker,
  volume,
  price,
  onConfirm,
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
              <span className="font-medium">{t('orders.modal.ticker')}:</span>{' '}
              {ticker.toUpperCase()}
            </p>
            <p>
              <span className="font-medium">{t('orders.modal.volume')}:</span>{' '}
              {volume}
            </p>
            <p>
              <span className="font-medium">
                {isLimitOrder
                  ? t('orders.modal.price')
                  : t('orders.modal.approx_price')}
                :
              </span>{' '}
              {price}
            </p>
          </div>
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button>{t('orders.modal.close')}</Button>
          </CredenzaClose>
          <CredenzaClose asChild>
            <Button onClick={onConfirm}>{t('orders.modal.confirm')}</Button>
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
