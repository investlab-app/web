import { Search } from 'lucide-react';
import { cn } from '../../utils/styles';
import { Input } from './input';
import type { ChangeEvent } from 'react';

type SearchInputProps = {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};

function SearchInput({
  value,
  onChange,
  disabled = false,
  placeholder = 'Search',
  className = '',
}: SearchInputProps) {
  return (
    <div className={cn('w-full max-w-xs space-y-2', className)}>
      <div className="relative">
        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
          <Search className="size-4" />
          <span className="sr-only">User</span>
        </div>
        <Input
          type="text"
          placeholder={placeholder}
          className="peer pl-9"
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

export default SearchInput;
