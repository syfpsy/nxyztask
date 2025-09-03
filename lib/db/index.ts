import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

// Create database connection
export const db = drizzle(sql, { schema });

// Export types
export * from './schema';