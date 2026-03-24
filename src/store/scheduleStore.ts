import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, DayOfWeek, ColorTag, ContentType } from '../types/TaskTypes';

interface ScheduleState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  clearAllTasks: () => void;
  duplicateTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  moveTask: (id: string, newDay: DayOfWeek, newTime?: string) => void;
  filter: {
    color: ColorTag | 'all';
    contentType: ContentType | 'all';
    boostedOnly: boolean;
    completedOnly: boolean | 'all';
  };
  setFilter: (filter: Partial<ScheduleState['filter']>) => void;
}

const generateId = () => {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
  } catch (e) {
    // Fallback if crypto.randomUUID throws an error
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set) => ({
      tasks: [
        { id: '1', day: 'Sábado', time: '10:00', title: 'Dicas de Engajamento', color: 'blue', completed: false, contentType: 'Post', caption: 'Arrasta pro lado para ver as 5 dicas infalíveis de engajamento! 🚀' },
        { id: '2', day: 'Domingo', time: '12:00', title: 'Bastidores da Agência', color: 'purple', completed: false, contentType: 'Reels', boost: { enabled: true, amount: 50, objective: 'Alcance', platform: 'Instagram' } },
      ],
      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, { ...task, id: generateId() }]
      })),
      updateTask: (id, updatedTask) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, ...updatedTask } : t)
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
      })),
      clearAllTasks: () => set({ tasks: [] }),
      duplicateTask: (id) => set((state) => {
        const taskToDuplicate = state.tasks.find(t => t.id === id);
        if (!taskToDuplicate) return state;
        return {
          tasks: [...state.tasks, { ...taskToDuplicate, id: generateId(), title: `${taskToDuplicate.title} (Cópia)` }]
        };
      }),
      toggleTaskCompletion: (id) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
      })),
      moveTask: (id, newDay, newTime) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, day: newDay, ...(newTime ? { time: newTime } : {}) } : t)
      })),
      filter: {
        color: 'all',
        contentType: 'all',
        boostedOnly: false,
        completedOnly: 'all',
      },
      setFilter: (newFilter) => set((state) => ({
        filter: { ...state.filter, ...newFilter }
      }))
    }),
    {
      name: 'schedule-storage-v2',
    }
  )
);
