import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { QuadrantCard } from '@/components/QuadrantCard';
import { TaskCard } from '@/components/TaskCard';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Task, QuadrantType, QuadrantInfo } from '@/types/task';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from '@/hooks/useTranslations';
import { LayoutGrid } from 'lucide-react';

const Index = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('eisenhower-tasks', []);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { toast } = useToast();
  const t = useTranslations();

  const QUADRANTS: QuadrantInfo[] = [
    {
      id: 'urgent-important',
      title: t.quadrants['urgent-important'].title,
      subtitle: t.quadrants['urgent-important'].subtitle,
      color: 'text-quadrant-urgent-important-foreground',
      bgColor: 'bg-quadrant-urgent-important',
      borderColor: 'border-quadrant-urgent-important',
    },
    {
      id: 'not-urgent-important',
      title: t.quadrants['not-urgent-important'].title,
      subtitle: t.quadrants['not-urgent-important'].subtitle,
      color: 'text-quadrant-not-urgent-important-foreground',
      bgColor: 'bg-quadrant-not-urgent-important',
      borderColor: 'border-quadrant-not-urgent-important',
    },
    {
      id: 'urgent-not-important',
      title: t.quadrants['urgent-not-important'].title,
      subtitle: t.quadrants['urgent-not-important'].subtitle,
      color: 'text-quadrant-urgent-not-important-foreground',
      bgColor: 'bg-quadrant-urgent-not-important',
      borderColor: 'border-quadrant-urgent-not-important',
    },
    {
      id: 'not-urgent-not-important',
      title: t.quadrants['not-urgent-not-important'].title,
      subtitle: t.quadrants['not-urgent-not-important'].subtitle,
      color: 'text-quadrant-not-urgent-not-important-foreground',
      bgColor: 'bg-quadrant-not-urgent-not-important',
      borderColor: 'border-quadrant-not-urgent-not-important',
    },
  ];


  const handleAddTask = (quadrant: QuadrantType, text: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random()}`,
      text,
      quadrant,
      completed: false,
      createdAt: Date.now(),
    };
    setTasks([...tasks, newTask]);
    toast({
      title: t.taskAdded,
      description: t.taskAddedDescription,
    });
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    toast({
      title: t.taskDeleted,
      description: t.taskDeletedDescription,
      variant: 'destructive',
    });
  };

  const handleToggleComplete = (id: string) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const handleEditTask = (id: string, newText: string) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, text: newText } : t
    ));
    toast({
      title: t.taskUpdated,
      description: t.taskUpdatedDescription,
    });
  };

  const handleMoveTask = (id: string, newQuadrant: QuadrantType) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, quadrant: newQuadrant } : t
    ));
    toast({
      title: t.taskMoved,
      description: t.taskMovedDescription,
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the active task
    const activeTask = tasks.find(t => t.id === activeId);
    if (!activeTask) {
      setActiveTask(null);
      return;
    }

    // Check if we're dropping on a quadrant or another task
    const isQuadrant = QUADRANTS.some(q => q.id === overId);
    
    if (isQuadrant) {
      // Moving to a different quadrant
      const newQuadrant = overId as QuadrantType;
      setTasks(tasks.map(t => 
        t.id === activeId ? { ...t, quadrant: newQuadrant } : t
      ));
    } else {
      // Reordering within the same quadrant or moving between quadrants
      const overTask = tasks.find(t => t.id === overId);
      if (!overTask) {
        setActiveTask(null);
        return;
      }

      if (activeTask.quadrant === overTask.quadrant) {
        // Reordering within the same quadrant
        const quadrantTasks = tasks.filter(t => t.quadrant === activeTask.quadrant);
        const oldIndex = quadrantTasks.findIndex(t => t.id === activeId);
        const newIndex = quadrantTasks.findIndex(t => t.id === overId);
        
        const reorderedQuadrantTasks = arrayMove(quadrantTasks, oldIndex, newIndex);
        
        // Merge back with other tasks
        const otherTasks = tasks.filter(t => t.quadrant !== activeTask.quadrant);
        setTasks([...otherTasks, ...reorderedQuadrantTasks]);
      } else {
        // Moving to a different quadrant by dropping on a task
        setTasks(tasks.map(t => 
          t.id === activeId ? { ...t, quadrant: overTask.quadrant } : t
        ));
      }
    }

    setActiveTask(null);
  };

  const getTasksByQuadrant = (quadrant: QuadrantType) => {
    return tasks.filter(t => t.quadrant === quadrant);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <LayoutGrid className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {t.appTitle}
            </h1>
          </div>
          <p className="text-muted-foreground">
            {t.appSubtitle}
          </p>
        </header>

        <DndContext
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {QUADRANTS.map((quadrant) => (
              <QuadrantCard
                key={quadrant.id}
                quadrant={quadrant}
                tasks={getTasksByQuadrant(quadrant.id)}
                onAddTask={(text) => handleAddTask(quadrant.id, text)}
                onDeleteTask={handleDeleteTask}
                onToggleComplete={handleToggleComplete}
                onEditTask={handleEditTask}
                onMoveTask={handleMoveTask}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask ? (
              <TaskCard
                task={activeTask}
                onDelete={() => {}}
                onToggleComplete={() => {}}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default Index;
