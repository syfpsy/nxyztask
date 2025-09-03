export interface User {
  id: string
  name: string
  avatar?: string
  email?: string
  password?: string
}

export type UserRole = 'guest' | 'basic' | 'admin';

export interface Task {
  id: string
  title: string
  description?: string
  dueDate?: Date
  priority: 'low' | 'medium' | 'high'
  assignee?: User
  column: 'todo' | 'inProgress' | 'done'
  tags: string[] // New: Array of tags
  createdAt: Date
  updatedAt: Date
}

export interface Column {
  id: string
  title: string
  taskIds: string[]
}