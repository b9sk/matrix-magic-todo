import { useMemo } from 'react';

export type Language = 'en' | 'ru' | 'zh';

interface Translations {
  appTitle: string;
  appSubtitle: string;
  addTask: string;
  enterTask: string;
  taskAdded: string;
  taskAddedDescription: string;
  taskDeleted: string;
  taskDeletedDescription: string;
  taskMoved: string;
  taskMovedDescription: string;
  taskUpdated: string;
  taskUpdatedDescription: string;
  deleteTask: string;
  deleteTaskConfirmation: string;
  editTask: string;
  cancel: string;
  delete: string;
  save: string;
  moveTo: string;
  hideCompleted: string;
  showCompleted: string;
  clearFilter: string;
  quadrants: {
    'urgent-important': {
      title: string;
      subtitle: string;
    };
    'not-urgent-important': {
      title: string;
      subtitle: string;
    };
    'urgent-not-important': {
      title: string;
      subtitle: string;
    };
    'not-urgent-not-important': {
      title: string;
      subtitle: string;
    };
  };
}

const translations: Record<Language, Translations> = {
  en: {
    appTitle: 'Eisenhower Matrix',
    appSubtitle: 'Organize your tasks by urgency and importance',
    addTask: 'Add Task',
    enterTask: 'Enter task...',
    taskAdded: 'Task added',
    taskAddedDescription: 'Your task has been added successfully.',
    taskDeleted: 'Task deleted',
    taskDeletedDescription: 'Your task has been removed.',
    taskMoved: 'Task moved',
    taskMovedDescription: 'Your task has been moved to a different quadrant.',
    taskUpdated: 'Task updated',
    taskUpdatedDescription: 'Your task has been updated successfully.',
    deleteTask: 'Delete task?',
    deleteTaskConfirmation: 'This action cannot be undone. The task will be deleted permanently.',
    editTask: 'Edit task',
    cancel: 'Cancel',
    delete: 'Delete',
    save: 'Save',
    moveTo: 'Move to:',
    hideCompleted: 'Hide Completed',
    showCompleted: 'Show Completed',
    clearFilter: 'Clear filter',
    quadrants: {
      'urgent-important': {
        title: 'Do First',
        subtitle: 'Urgent & Important',
      },
      'not-urgent-important': {
        title: 'Schedule',
        subtitle: 'Not Urgent & Important',
      },
      'urgent-not-important': {
        title: 'Delegate',
        subtitle: 'Urgent & Not Important',
      },
      'not-urgent-not-important': {
        title: 'Eliminate',
        subtitle: 'Not Urgent & Not Important',
      },
    },
  },
  ru: {
    appTitle: 'Матрица Эйзенхауэра',
    appSubtitle: 'Организуйте ваши задачи по срочности и важности',
    addTask: 'Добавить задачу',
    enterTask: 'Введите задачу...',
    taskAdded: 'Задача добавлена',
    taskAddedDescription: 'Ваша задача успешно добавлена.',
    taskDeleted: 'Задача удалена',
    taskDeletedDescription: 'Ваша задача была удалена.',
    taskMoved: 'Задача перемещена',
    taskMovedDescription: 'Ваша задача была перемещена в другой квадрант.',
    taskUpdated: 'Задача обновлена',
    taskUpdatedDescription: 'Ваша задача успешно обновлена.',
    deleteTask: 'Удалить задачу?',
    deleteTaskConfirmation: 'Это действие нельзя отменить. Задача будет удалена навсегда.',
    editTask: 'Редактировать',
    cancel: 'Отмена',
    delete: 'Удалить',
    save: 'Сохранить',
    moveTo: 'Переместить в:',
    hideCompleted: 'Скрыть выполненные',
    showCompleted: 'Показать выполненные',
    clearFilter: 'Сбросить фильтр',
    quadrants: {
      'urgent-important': {
        title: 'Сделать сейчас',
        subtitle: 'Срочно и важно',
      },
      'not-urgent-important': {
        title: 'Запланировать',
        subtitle: 'Не срочно, но важно',
      },
      'urgent-not-important': {
        title: 'Делегировать',
        subtitle: 'Срочно, но не важно',
      },
      'not-urgent-not-important': {
        title: 'Исключить',
        subtitle: 'Не срочно и не важно',
      },
    },
  },
  zh: {
    appTitle: '艾森豪威尔矩阵',
    appSubtitle: '按紧急程度和重要性组织任务',
    addTask: '添加任务',
    enterTask: '输入任务...',
    taskAdded: '任务已添加',
    taskAddedDescription: '您的任务已成功添加。',
    taskDeleted: '任务已删除',
    taskDeletedDescription: '您的任务已被删除。',
    taskMoved: '任务已移动',
    taskMovedDescription: '您的任务已移动到其他象限。',
    taskUpdated: '任务已更新',
    taskUpdatedDescription: '您的任务已成功更新。',
    deleteTask: '删除任务？',
    deleteTaskConfirmation: '此操作无法撤消。任务将被永久删除。',
    editTask: '编辑',
    cancel: '取消',
    delete: '删除',
    save: '保存',
    moveTo: '移至：',
    hideCompleted: '隐藏已完成',
    showCompleted: '显示已完成',
    clearFilter: '清除过滤器',
    quadrants: {
      'urgent-important': {
        title: '立即执行',
        subtitle: '紧急且重要',
      },
      'not-urgent-important': {
        title: '计划安排',
        subtitle: '不紧急但重要',
      },
      'urgent-not-important': {
        title: '委派他人',
        subtitle: '紧急但不重要',
      },
      'not-urgent-not-important': {
        title: '删除消除',
        subtitle: '不紧急不重要',
      },
    },
  },
};

const detectLanguage = (): Language => {
  const browserLang = navigator.language.toLowerCase();
  
  if (browserLang.startsWith('ru')) return 'ru';
  if (browserLang.startsWith('zh')) return 'zh';
  
  return 'en'; // Default to English
};

export const useTranslations = () => {
  const language = useMemo(() => detectLanguage(), []);
  
  return translations[language];
};