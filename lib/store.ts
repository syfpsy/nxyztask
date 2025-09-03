import { create } from 'zustand'
import { Task, Column, User } from '@/types'
import { api } from './api' // Import the new API utility

interface Store {
  tasks: Task[]
  columns: Column[]
  users: User[]
  loading: boolean // New loading state
  error: string | null // New error state
  fetchInitialData: () => Promise<void> // New action to fetch data
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  moveTask: (taskId: string, toColumn: Column['id']) => Promise<void>
  deleteTask: (id: string) => Promise<void>
}

const initialUsers: User[] = [
  { id: '1', name: 'Alice', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&q=80' },
  { id: '2', name: 'Bob', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&q=80' },
  { id: '3', name: 'Charlie', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=32&h=32&fit=crop&q=80' },
]

// Initial tasks and columns are now empty as they will be fetched from the server
const initialTasks: Task[] = []
const initialColumns: Column[] = []

export const useStore = create<Store>((set, get) => ({
  tasks: initialTasks,
  columns: initialColumns,
  users: initialUsers, // Users are still static client-side data
  loading: false,
  error: null,

  fetchInitialData: async () => {
    set({ loading: true, error: null });
    try {
      const [fetchedTasks, fetchedColumns] = await Promise.all([
        api.getTasks(),
        api.getColumns(),
      ]);
      set({ tasks: fetchedTasks, columns: fetchedColumns, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
      console.error("Failed to fetch initial data:", err);
    }
  },

  addTask: async (task) => {
    try {
      const newTask = await api.addTask(task);
      set((state) => ({
        tasks: [...state.tasks, newTask],
        columns: state.columns.map(col =>
          col.id === newTask.column
            ? { ...col, taskIds: [...col.taskIds, newTask.id] }
            : col
        ),
      }));
    } catch (err: any) {
      set({ error: err.message });
      console.error("Failed to add task:", err);
    }
  },

  updateTask: async (id, updates) => {
    try {
      const updatedTask = await api.updateTask(id, updates);
      set((state) => ({
        tasks: state.tasks.map(task =>
          task.id === id
            ? { ...task, ...updatedTask } // Use the full updatedTask from server
            : task
        ),
      }));
    } catch (err: any) {
      set({ error: err.message });
      console.error("Failed to update task:", err);
    }
  },

  moveTask: async (taskId, toColumn) => {
    try {
      const { columns: updatedColumns, tasks: updatedTasks } = await api.moveTask(taskId, toColumn);
      set({
        tasks: updatedTasks,
        columns: updatedColumns,
      });
    } catch (err: any) {
      set({ error: err.message });
      console.error("Failed to move task:", err);
    }
  },

  deleteTask: async (id) => {
    try {
      await api.deleteTask(id);
      set((state) => ({
        tasks: state.tasks.filter(task => task.id !== id),
        columns: state.columns.map(col => ({
          ...col,
          taskIds: col.taskIds.filter(taskId => taskId !== id),
        })),
      }));
    } catch (err: any) {
      set({ error: err.message });
      console.error("Failed to delete task:", err);
    }
  },
}))