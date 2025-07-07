import { Link } from '@tanstack/react-router';
import { BackButton } from './back-button';

interface FooterProps {
  onBack?: () => void;
  text: string;
  oppositeType: 'login' | 'signup';
  actionText: string;
}

export const Footer = ({ text, oppositeType, actionText }: FooterProps) => {
  return (
    <div className="grid gap-4 mt-2">
      <BackButton />
      <div className="text-center text-sm">
        {text}{' '}
        <Link
          to={`/${oppositeType}`}
          className="underline underline-offset-4 hover:text-primary"
        >
          {actionText}
        </Link>
      </div>
    </div>
  );
};
