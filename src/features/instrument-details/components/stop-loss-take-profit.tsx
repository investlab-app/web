import { EmptyMessage } from '@/features/shared/components/empty-message';

interface StopLossTakeProfitProps {
  ticker: string;
}

export const StopLossTakeProfit = ({ ticker }: StopLossTakeProfitProps) => {
  void ticker;
  return <EmptyMessage message="Not implemented yet :/" />;
};
