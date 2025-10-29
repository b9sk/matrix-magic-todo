import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, QuadrantType } from '@/types/task';
import { GripVertical, Trash2, Check, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onMove?: (id: string, quadrant: QuadrantType) => void;
}

export const TaskCard = ({ task, onDelete, onToggleComplete, onMove }: TaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "group p-3 bg-card hover:shadow-md transition-all duration-200",
        isDragging && "opacity-50 shadow-lg scale-105"
      )}
    >
      <div className="flex items-start gap-2">
        <button
          className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        
        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-sm break-words",
            task.completed && "line-through text-muted-foreground"
          )}>
            {task.text}
          </p>
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onToggleComplete(task.id)}
          >
            <Check className={cn("h-3 w-3", task.completed && "text-primary")} />
          </Button>
          {onMove && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background border-border">
                <DropdownMenuItem onClick={() => onMove(task.id, 'urgent-important')}>
                  Move to: Do First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onMove(task.id, 'not-urgent-important')}>
                  Move to: Schedule
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onMove(task.id, 'urgent-not-important')}>
                  Move to: Delegate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onMove(task.id, 'not-urgent-not-important')}>
                  Move to: Eliminate
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:text-destructive"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
