import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil, Save, Trash2 } from 'lucide-react';
import { Button } from '@/features/shared/components/ui/button';
import { Input } from '@/features/shared/components/ui/input';

interface FlowHeaderProps {
  initialTitle: string;
  onDelete: () => void;
  canRename: boolean;
  onSave?: (newTitle: string) => void;
  onNameChange?: (newName: string) => void;
}

export function FlowHeader({
  initialTitle,
  onSave,
  onDelete,
  canRename,
  onNameChange,
}: FlowHeaderProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [tempTitle, setTempTitle] = useState(initialTitle);

  // Without the effect, there are infinite re-renders when opening different flows.
  // If I remove the title/SetTitle and use initialTitle directly, then when saving 
  // a new name, before the refetch of new data, the name switches back to the old one
  // - it lasts a second, but is visible nonetheless.
  useEffect(() => {
    // eslint-disable-next-line react-you-might-not-need-an-effect/no-derived-state
    setTitle(initialTitle);
    // eslint-disable-next-line react-you-might-not-need-an-effect/no-derived-state
    setTempTitle(initialTitle);
  }, [initialTitle]);

  const handleEdit = () => {
    setTempTitle(title);
    setIsEditing(true);
  };

  const handleSave = () => {
    setTitle(tempTitle);
    setIsEditing(false);
    onSave!(tempTitle);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (canRename) {
      setTempTitle(newValue);
    } else {
      setTitle(newValue);
      onNameChange?.(newValue);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        value={canRename ? (isEditing ? tempTitle : title) : title}
        onChange={handleChange}
        disabled={canRename && !isEditing}
        className="flex-1 border-0 text-lg font-semibold focus-visible:ring-0 disabled:opacity-100 disabled:cursor-default dark:bg-transparent"
        placeholder={t('flows.placeholders.new_strategy')}
      />
      <div className="flex items-center gap-1">
        {canRename && (
          <>
            {isEditing ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSave}
                className="size-8"
                aria-label={t('flows.sidebar.save')}
                disabled={!tempTitle.trim()}
              >
                <Save className="size-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEdit}
                className="size-8"
                aria-label={t('flows.sidebar.edit')}
              >
                <Pencil className="size-4" />
              </Button>
            )}
          </>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="size-8 text-destructive hover:text-destructive"
          aria-label={t('flows.sidebar.delete')}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}
