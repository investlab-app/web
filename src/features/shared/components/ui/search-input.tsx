import { Search } from 'lucide-react';
import type { ChangeEvent } from 'react';

type SearchInputProps = {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
};

function SearchInput({
  value,
  onChange,
  placeholder = 'Search',
  className = '',
}: SearchInputProps) {
  return (
    <div
      className={`flex items-center gap-2 border border-input bg-background rounded-md px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${className}`}
    >
      <Search className="text-muted-foreground w-4 h-4" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="bg-transparent outline-none flex-1 placeholder:text-muted-foreground"
      />
    </div>
  );
}

export default SearchInput;
