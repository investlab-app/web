import { EmptyMessage } from '@/features/shared/components/empty-message';

interface StopLimitProps {
  ticker: string;
}

export const StopLimit = ({ ticker }: StopLimitProps) => {
  void ticker;
  return <EmptyMessage message="Not implemented yet :/" />;
};
