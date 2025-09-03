import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

const db = drizzle(sql, { schema });

async function migrate() {
  try {
    console.log('Starting database migration...');

    // Create priority enum
    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE priority AS ENUM ('low', 'medium', 'high');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create column enum
    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE column AS ENUM ('todo', 'inProgress', 'done');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create users table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        avatar VARCHAR(255),
        role VARCHAR(20) DEFAULT 'basic' NOT NULL
      );
    `);

    // Create tasks table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        due_date TIMESTAMP,
        priority priority NOT NULL DEFAULT 'medium',
        assignee_id TEXT REFERENCES users(id),
        column column NOT NULL DEFAULT 'todo',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Create task_tags table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS task_tags (
        id TEXT PRIMARY KEY,
        task_id TEXT NOT NULL REFERENCES tasks(id),
        tag VARCHAR(50) NOT NULL
      );
    `);

    // Create columns table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS columns (
        id TEXT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        order TEXT[] NOT NULL DEFAULT '{}'
      );
    `);

    // Insert initial columns
    await db.execute(sql`
      INSERT INTO columns (id, title, order)
      VALUES
        ('todo', 'To Do', ARRAY[]::TEXT[]),
        ('inProgress', 'In Progress', ARRAY[]::TEXT[]),
        ('done', 'Done', ARRAY[]::TEXT[])
      ON CONFLICT (id) DO NOTHING;
    `);

    // Insert initial users
    await db.execute(sql`
      INSERT INTO users (id, name, email, password, avatar, role)
      VALUES
        ('1', 'Admin User', 'admin@example.com', 'admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=32&h=32&fit=crop&q=80', 'admin'),
        ('2', 'Basic User', 'user@example.com', 'user', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&q=80', 'basic')
      ON CONFLICT (id) DO NOTHING;
    `);

    console.log('Database migration completed successfully');
  } catch (error) {
    console.error('Error during database migration:', error);
    throw error;
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrate().catch(console.error);
}

export { migrate };