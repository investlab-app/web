import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil, Save, Trash2 } from 'lucide-react';
import { Button } from '@/features/shared/components/ui/button';
import { Input } from '@/features/shared/components/ui/input';

interface FlowHeaderProps {
  initialTitle: string;
  onSave: (newTitle: string) => void;
  onDelete: () => void;
}

export function FlowHeader({
  initialTitle,
  onSave,
  onDelete,
}: FlowHeaderProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [tempTitle, setTempTitle] = useState(initialTitle);

  const handleEdit = () => {
    setTempTitle(title);
    setIsEditing(true);
  };

  const handleSave = () => {
    setTitle(tempTitle);
    setIsEditing(false);
    onSave(tempTitle);
  };

  const handleCancel = () => {
    setTempTitle(title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="flex items-center gap-2 mr-4">
      <Input
        value={isEditing ? tempTitle : title}
        onChange={(e) => setTempTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={!isEditing}
        className="flex-1 border-0 text-lg font-semibold focus-visible:ring-0 disabled:opacity-100 disabled:cursor-default dark:bg-transparent"
        placeholder={t('flows.header.title_placeholder') || 'Flow Title'}
      />
      <div className="flex items-center gap-1">
        {isEditing ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            className="size-8"
            aria-label={t('flows.header.save') || 'Save'}
          >
            <Save className="size-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEdit}
            className="size-8"
            aria-label={t('flows.header.edit') || 'Edit'}
          >
            <Pencil className="size-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="size-8 text-destructive hover:text-destructive"
          aria-label={t('flows.header.delete') || 'Delete'}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}
