const express = require('express');
const cors = require('cors');
const { db } = require('./lib/db');
const { tasks, taskTags, columns, users } = require('./lib/db/schema');
const { eq, and } = require('drizzle-orm');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Helper to convert Date objects to ISO strings for sending to client
const serializeTaskDates = (task) => ({
  ...task,
  dueDate: task.dueDate ? task.dueDate.toISOString() : null,
  createdAt: task.createdAt.toISOString(),
  updatedAt: task.updatedAt.toISOString(),
});

// Helper to convert ISO strings back to Date objects for database
const deserializeTaskDates = (task) => ({
  ...task,
  dueDate: task.dueDate ? new Date(task.dueDate) : null,
  createdAt: new Date(task.createdAt),
  updatedAt: new Date(task.updatedAt),
});

// API Endpoints

// Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const dbTasks = await db.query.tasks.findMany({
      with: {
        assignee: true,
        tags: true,
      },
    });

    const tasksWithRelations = dbTasks.map(task => ({
      ...serializeTaskDates(task),
      assignee: task.assignee,
      tags: task.tags.map(tag => tag.tag),
    }));

    res.json(tasksWithRelations);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

// Get all columns
app.get('/api/columns', async (req, res) => {
  try {
    const dbColumns = await db.query.columns.findMany();
    const columnsWithOrder = dbColumns.map(col => ({
      id: col.id,
      title: col.title,
      taskIds: col.order,
    }));
    res.json(columnsWithOrder);
  } catch (error) {
    console.error('Error fetching columns:', error);
    res.status(500).json({ message: 'Failed to fetch columns' });
  }
});

// Add a new task
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignee, column, tags } = req.body;
    const newTaskId = Date.now().toString();

    // Insert task
    const [newTask] = await db.insert(tasks).values({
      id: newTaskId,
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
      priority,
      assigneeId: assignee?.id,
      column,
    }).returning();

    // Insert tags
    if (tags && tags.length > 0) {
      await db.insert(taskTags).values(
        tags.map(tag => ({
          id: `${newTaskId}-${tag}`,
          taskId: newTaskId,
          tag,
        }))
      );
    }

    // Update column order
    await db.update(columns)
      .set({
        order: sql`array_append(order, ${newTaskId})`,
      })
      .where(eq(columns.id, column));

    // Get the full task with relations
    const fullTask = await db.query.tasks.findFirst({
      where: eq(tasks.id, newTaskId),
      with: {
        assignee: true,
        tags: true,
      },
    });

    res.status(201).json({
      ...serializeTaskDates(fullTask),
      assignee: fullTask.assignee,
      tags: fullTask.tags.map(tag => tag.tag),
    });
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ message: 'Failed to add task' });
  }
});

// Update a task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, priority, tags } = req.body;

    // Update task
    const [updatedTask] = await db.update(tasks)
      .set({
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, id))
      .returning();

    // Update tags if provided
    if (tags !== undefined) {
      // Delete existing tags
      await db.delete(taskTags).where(eq(taskTags.taskId, id));

      // Insert new tags
      if (tags.length > 0) {
        await db.insert(taskTags).values(
          tags.map(tag => ({
            id: `${id}-${tag}`,
            taskId: id,
            tag,
          }))
        );
      }
    }

    // Get the full task with relations
    const fullTask = await db.query.tasks.findFirst({
      where: eq(tasks.id, id),
      with: {
        assignee: true,
        tags: true,
      },
    });

    res.json({
      ...serializeTaskDates(fullTask),
      assignee: fullTask.assignee,
      tags: fullTask.tags.map(tag => tag.tag),
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Failed to update task' });
  }
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get the task to find its column
    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, id),
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Delete the task
    await db.delete(tasks).where(eq(tasks.id, id));

    // Delete associated tags
    await db.delete(taskTags).where(eq(taskTags.taskId, id));

    // Remove task from column order
    await db.update(columns)
      .set({
        order: sql`array_remove(order, ${id})`,
      })
      .where(eq(columns.id, task.column));

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Failed to delete task' });
  }
});

// Move a task between columns
app.put('/api/columns/move-task', async (req, res) => {
  try {
    const { taskId, toColumnId } = req.body;

    // Get the task to find its current column
    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId),
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Remove task from its current column
    await db.update(columns)
      .set({
        order: sql`array_remove(order, ${taskId})`,
      })
      .where(eq(columns.id, task.column));

    // Add task to the new column
    await db.update(columns)
      .set({
        order: sql`array_append(order, ${taskId})`,
      })
      .where(eq(columns.id, toColumnId));

    // Update the task's column
    await db.update(tasks)
      .set({
        column: toColumnId,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, taskId));

    // Get updated columns and tasks
    const updatedColumns = await db.query.columns.findMany();
    const updatedTasks = await db.query.tasks.findMany({
      with: {
        assignee: true,
        tags: true,
      },
    });

    const columnsWithOrder = updatedColumns.map(col => ({
      id: col.id,
      title: col.title,
      taskIds: col.order,
    }));

    const tasksWithRelations = updatedTasks.map(task => ({
      ...serializeTaskDates(task),
      assignee: task.assignee,
      tags: task.tags.map(tag => tag.tag),
    }));

    res.json({
      columns: columnsWithOrder,
      tasks: tasksWithRelations,
    });
  } catch (error) {
    console.error('Error moving task:', error);
    res.status(500).json({ message: 'Failed to move task' });
  }
});

app.listen(PORT, () => {
  console.log(`API Server running on http://localhost:${PORT}`);
});