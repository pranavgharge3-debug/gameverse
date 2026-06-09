# GamerVerse

A production-ready full-stack gaming social platform built with React, Vite, Tailwind CSS, Node.js, Express, Prisma, PostgreSQL, JWT, and Socket.io.

## Workspace Structure

- `client/` — React frontend with Tailwind, routing, and realtime data handling.
- `server/` — Express backend with modular controllers, Prisma ORM, WebSocket support, and auth.
- `server/prisma/` — Prisma schema and migrations for PostgreSQL.

## Getting Started

1. Copy environment templates:
   - `cp .env.example server/.env`
2. Install dependencies:
   - `npm install`
3. Start development:
   - `npm run dev`

## Deployment

- Frontend: Vercel
- Backend: Render / Railway
- Database: Supabase PostgreSQL

## Features

- Authentication: Email/password, JWT, Google OAuth, forgot password
- Profiles: Avatars, bio, favorite games, ranks, XP, badges
- Social feed: Posts, media uploads, likes, comments, trending
- Friends system: Requests, approvals, friends list
- Clans: Create, join, roles, announcements
- Tournaments: Create, join, brackets, leaderboards
- Realtime chat: Personal and clan chat with presence
- Admin panel: User/content moderation and analytics
