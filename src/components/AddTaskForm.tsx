import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslations } from '@/hooks/useTranslations';

interface AddTaskFormProps {
  onAdd: (text: string) => void;
}

export const AddTaskForm = ({ onAdd }: AddTaskFormProps) => {
  const [text, setText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const t = useTranslations();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
      setIsExpanded(false);
    }
  };

  if (!isExpanded) {
    return (
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setIsExpanded(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        {t.addTask}
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t.enterTask}
        onBlur={() => {
          if (!text.trim()) setIsExpanded(false);
        }}
        className="flex-1"
      />
      <Button type="submit" size="icon">
        <Plus className="h-4 w-4" />
      </Button>
    </form>
  );
};
