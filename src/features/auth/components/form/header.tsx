import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';

interface HeaderProps {
  title: string;
  description: string;
}

export const Header = ({ title, description }: HeaderProps) => (
  <CardHeader className="text-center">
    <CardTitle>{title}</CardTitle>
    <CardDescription>{description}</CardDescription>
  </CardHeader>
);
