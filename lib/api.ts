import { Task, Column } from '@/types';

// Helper to convert Date objects to ISO strings for sending to server
const serializeTaskDates = (task: Partial<Task>) => {
  const serializedTask = { ...task };
  if (serializedTask.dueDate instanceof Date) {
    serializedTask.dueDate = serializedTask.dueDate.toISOString();
  }
  return serializedTask;
};

// Helper to convert ISO strings back to Date objects for client-side use
const deserializeTaskDates = (task: any): Task => ({
  ...task,
  dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
  createdAt: new Date(task.createdAt),
  updatedAt: new Date(task.updatedAt),
});

export const api = {
  getTasks: async (): Promise<Task[]> => {
    const response = await fetch('/api/tasks');
    if (!response.ok) throw new Error('Failed to fetch tasks');
    const data = await response.json();
    return data.map(deserializeTaskDates);
  },

  getColumns: async (): Promise<Column[]> => {
    const response = await fetch('/api/columns');
    if (!response.ok) throw new Error('Failed to fetch columns');
    return response.json();
  },

  addTask: async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serializeTaskDates(task)),
    });
    if (!response.ok) throw new Error('Failed to add task');
    const data = await response.json();
    return deserializeTaskDates(data);
  },

  updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serializeTaskDates(updates)),
    });
    if (!response.ok) throw new Error('Failed to update task');
    const data = await response.json();
    return deserializeTaskDates(data);
  },

  deleteTask: async (id: string): Promise<void> => {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete task');
  },

  moveTask: async (taskId: string, toColumnId: Column['id']): Promise<{ columns: Column[], tasks: Task[] }> => {
    const response = await fetch('/api/columns/move-task', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, toColumnId }),
    });
    if (!response.ok) throw new Error('Failed to move task');
    const data = await response.json();
    return {
      columns: data.columns,
      tasks: data.tasks.map(deserializeTaskDates),
    };
  },
};