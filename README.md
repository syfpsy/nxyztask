# Task Management App

A modern task management application built with Next.js, React, and PostgreSQL.

## Features

- Kanban board with drag-and-drop functionality
- User authentication and role-based access control
- Real-time task management
- Priority levels and tagging system
- Responsive design with dark mode support

## Tech Stack

- **Frontend**: Next.js 13, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Drizzle ORM
- **Deployment**: Vercel

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
```

3. Run the development server:
```bash
npm run dev
```

## Deployment to Vercel

1. Connect your repository to Vercel
2. Set up Vercel Postgres database
3. Add environment variables in Vercel dashboard
4. Deploy automatically on git push

## Environment Variables

- `POSTGRES_URL`: PostgreSQL connection string
- `POSTGRES_USER`: Database username
- `POSTGRES_PASSWORD`: Database password
- `POSTGRES_HOST`: Database host
- `POSTGRES_DATABASE`: Database name

## Default Users

- Admin: admin@example.com / admin
- User: user@example.com / user