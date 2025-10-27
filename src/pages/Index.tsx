import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from '@dnd-kit/core';
import { QuadrantCard } from '@/components/QuadrantCard';
import { TaskCard } from '@/components/TaskCard';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Task, QuadrantType, QuadrantInfo } from '@/types/task';
import { useToast } from '@/hooks/use-toast';
import { LayoutGrid } from 'lucide-react';

const QUADRANTS: QuadrantInfo[] = [
  {
    id: 'urgent-important',
    title: 'Do First',
    subtitle: 'Urgent & Important',
    color: 'text-quadrant-urgent-important-foreground',
    bgColor: 'bg-quadrant-urgent-important',
    borderColor: 'border-quadrant-urgent-important',
  },
  {
    id: 'not-urgent-important',
    title: 'Schedule',
    subtitle: 'Not Urgent & Important',
    color: 'text-quadrant-not-urgent-important-foreground',
    bgColor: 'bg-quadrant-not-urgent-important',
    borderColor: 'border-quadrant-not-urgent-important',
  },
  {
    id: 'urgent-not-important',
    title: 'Delegate',
    subtitle: 'Urgent & Not Important',
    color: 'text-quadrant-urgent-not-important-foreground',
    bgColor: 'bg-quadrant-urgent-not-important',
    borderColor: 'border-quadrant-urgent-not-important',
  },
  {
    id: 'not-urgent-not-important',
    title: 'Eliminate',
    subtitle: 'Not Urgent & Not Important',
    color: 'text-quadrant-not-urgent-not-important-foreground',
    bgColor: 'bg-quadrant-not-urgent-not-important',
    borderColor: 'border-quadrant-not-urgent-not-important',
  },
];

const Index = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('eisenhower-tasks', []);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { toast } = useToast();

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
      title: 'Task added',
      description: 'Your task has been added successfully.',
    });
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    toast({
      title: 'Task deleted',
      description: 'Your task has been removed.',
      variant: 'destructive',
    });
  };

  const handleToggleComplete = (id: string) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
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

    const taskId = active.id as string;
    const newQuadrant = over.id as QuadrantType;

    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, quadrant: newQuadrant } : t
    ));

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
              Eisenhower Matrix
            </h1>
          </div>
          <p className="text-muted-foreground">
            Organize your tasks by urgency and importance
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
