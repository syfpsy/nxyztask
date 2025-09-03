import { pgTable, text, timestamp, varchar, pgEnum } from 'drizzle-orm/pg-core';

export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high']);
export const columnEnum = pgEnum('column', ['todo', 'inProgress', 'done']);

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  avatar: varchar('avatar', { length: 255 }),
  role: varchar('role', { length: 20 }).default('basic').notNull(),
});

export const tasks = pgTable('tasks', {
  id: text('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  dueDate: timestamp('due_date'),
  priority: priorityEnum('priority').default('medium').notNull(),
  assigneeId: text('assignee_id').references(() => users.id),
  column: columnEnum('column').default('todo').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const taskTags = pgTable('task_tags', {
  id: text('id').primaryKey(),
  taskId: text('task_id').references(() => tasks.id).notNull(),
  tag: varchar('tag', { length: 50 }).notNull(),
});

export const columns = pgTable('columns', {
  id: text('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  order: text('order').array().notNull(),
});