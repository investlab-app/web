import * as React from 'react';
import { useIsMobile } from '@/features/shared/hooks/use-media-query';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/features/shared/components/ui/dialog';
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
import { cn } from '@/features/shared/utils/styles';

interface BaseProps {
  children: React.ReactNode;
}

interface RootCredenzaProps extends BaseProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface CredenzaProps extends BaseProps {
  className?: string;
  asChild?: true;
}

const CredenzaContext = React.createContext<{ isMobile: boolean }>({
  isMobile: false,
});

const useCredenzaContext = () => {
  const context = React.useContext(CredenzaContext);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!context) {
    throw new Error(
      'Credenza components cannot be rendered outside the Credenza Context'
    );
  }
  return context;
};

const Credenza = ({ children, ...props }: RootCredenzaProps) => {
  const isMobile = useIsMobile();
  const Comp = isMobile ? Drawer : Dialog;

  return (
    <CredenzaContext.Provider value={{ isMobile }}>
      <Comp {...props} {...(isMobile && { autoFocus: true })}>
        {children}
      </Comp>
    </CredenzaContext.Provider>
  );
};

const CredenzaTrigger = ({ className, children, ...props }: CredenzaProps) => {
  const { isMobile } = useCredenzaContext();
  const Comp = isMobile ? DrawerTrigger : DialogTrigger;

  return (
    <Comp className={className} {...props}>
      {children}
    </Comp>
  );
};

const CredenzaClose = ({ className, children, ...props }: CredenzaProps) => {
  const { isMobile } = useCredenzaContext();
  const Comp = isMobile ? DrawerClose : DialogClose;

  return (
    <Comp className={className} {...props}>
      {children}
    </Comp>
  );
};

const CredenzaContent = ({ className, children, ...props }: CredenzaProps) => {
  const { isMobile } = useCredenzaContext();
  const Comp = isMobile ? DrawerContent : DialogContent;

  return (
    <Comp className={className} {...props}>
      {children}
    </Comp>
  );
};

const CredenzaDescription = ({
  className,
  children,
  ...props
}: CredenzaProps) => {
  const { isMobile } = useCredenzaContext();
  const Comp = isMobile ? DrawerDescription : DialogDescription;

  return (
    <Comp className={className} {...props}>
      {children}
    </Comp>
  );
};

const CredenzaHeader = ({ className, children, ...props }: CredenzaProps) => {
  const { isMobile } = useCredenzaContext();
  const Comp = isMobile ? DrawerHeader : DialogHeader;

  return (
    <Comp className={className} {...props}>
      {children}
    </Comp>
  );
};

const CredenzaTitle = ({ className, children, ...props }: CredenzaProps) => {
  const { isMobile } = useCredenzaContext();
  const Comp = isMobile ? DrawerTitle : DialogTitle;

  return (
    <Comp className={className} {...props}>
      {children}
    </Comp>
  );
};

const CredenzaBody = ({ className, children, ...props }: CredenzaProps) => {
  return (
    <div className={cn('px-4 md:px-0', className)} {...props}>
      {children}
    </div>
  );
};

const CredenzaFooter = ({ className, children, ...props }: CredenzaProps) => {
  const { isMobile } = useCredenzaContext();
  const Comp = isMobile ? DrawerFooter : DialogFooter;

  return (
    <Comp className={className} {...props}>
      {children}
    </Comp>
  );
};

export {
  Credenza,
  CredenzaTrigger,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaBody,
  CredenzaFooter,
};
