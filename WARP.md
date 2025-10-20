# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a **Pickcel Digital Signage Dashboard** - a SaaS application for managing digital signage displays, content, and playlists. The architecture follows a monorepo pattern with Express server and React client, both using TypeScript.

## Build, Lint, and Test Commands

### Development
- **Start dev server:** `npm run dev` - Runs Express server with Vite hot reloading on `http://localhost:1337` (or `PORT` env var)
- **Type check:** `npm run check` - Runs TypeScript compiler in no-emit mode

### Production
- **Build:** `npm run build` - Builds client with Vite and bundles server with esbuild
- **Build client only:** `npm run build:client` - Runs Vite build for client
- **Start production server:** `npm run start` - Runs production build on specified PORT

### Deployment
- Uses Vercel (see `vercel.json`) - Default build uses `npm install` and `npm run build`

## Architecture

### High-Level Structure
```
Root (monorepo)
├── client/          # React SPA (Vite)
├── server/          # Express backend
├── shared/          # Shared types, schemas, utilities
└── attached_assets/ # Static assets
```

### Client-Side Architecture (client/src)
- **Pages:** Single-page app with Dashboard as the main entry point. Routing via wouter handles module-based navigation (dashboard, screens, media, playlists, layouts, apps, publish, myplan, settings, account)
- **Components:** 
  - `ui/` - Radix UI component library (shadcn/ui style)
  - `examples/` - Feature-specific components
- **Hooks:** Custom React hooks for business logic
- **Lib:** Utilities including React Query client setup
- **Styling:** Tailwind CSS with dark mode support

### Server-Side Architecture (server/)
- **index.ts:** Express app setup with request logging middleware
- **routes.ts:** Route registration placeholder (add `/api` routes here)
- **storage.ts:** In-memory storage interface with CRUD operations for users
  - `IStorage` interface defines contract
  - `MemStorage` is current implementation (use for development)
  - Design allows swapping to database (PostgreSQL via `@neondatabase/serverless`)
- **vite.ts:** Vite middleware setup for dev server and static file serving for production

### Shared Layer (shared/)
- **schema.ts:** Zod schemas for validation and type definitions (User schema)
- All shared types should be defined here and imported across client/server

### Key Design Patterns
1. **Type-safe data flow:** Zod schemas in shared layer ensure consistent validation
2. **Storage abstraction:** `IStorage` interface allows implementation switching without code changes
3. **Environment-aware config:** Development uses Vite middleware + HMR; production serves static files
4. **Request logging:** All `/api` routes automatically logged with method, path, status, duration
5. **Error handling:** Express error middleware catches and returns JSON errors

## Development Workflow

### Adding API Routes
1. Add route handler in `server/routes.ts` (prefix with `/api`)
2. Use `storage` interface for data operations
3. Routes are automatically logged

### Adding Storage Operations
1. Define method signature in `IStorage` interface (server/storage.ts)
2. Implement in `MemStorage` class
3. Export `storage` instance from the module for server/routes.ts to import

### Adding Shared Types
1. Define Zod schema in `shared/schema.ts`
2. Export inferred TypeScript type alongside schema
3. Use in both client and server code

### Client-Side Development
- Run `npm run dev` to start with hot reloading
- Pages are added to `client/src/pages/`
- Components use Radix UI primitives from `client/src/components/ui/`
- React Query (`@tanstack/react-query`) is set up for API calls

## Design System & Styling

The dashboard follows **Material Design inspired enterprise dashboard patterns** (see `design_guidelines.md`):
- **Color palette:** Blue primary (#217 91% 60%), status colors (green/red/amber/cyan for success/error/warning/info)
- **Typography:** System fonts via Tailwind defaults
- **Spacing:** Consistent Tailwind units (2, 4, 6, 8, 12, 16, 20, 24)
- **Layout:** 3-column grid on desktop, 2-column on tablet, single-column on mobile
- **Components:** Cards use `rounded-xl` border-radius, `shadow-sm`, 6px padding

## Dependencies

### Frontend
- **React 18** with React DOM
- **Vite** for bundling and dev server
- **Radix UI** for accessible component primitives
- **React Hook Form** + Zod for form validation
- **React Query** for server state management
- **Wouter** for client-side routing
- **Tailwind CSS** for styling
- **Lucide React** for icons

### Backend
- **Express 4** for HTTP server
- **TypeScript** for type safety
- **esbuild** for server bundling

### Optional
- **@neondatabase/serverless** for PostgreSQL support (currently not in use)

## Important Notes

1. **Environment variables:** Port specified via `PORT` env var (defaults to 1337)
2. **Module routing:** Invalid routes beyond known modules return 404
3. **Storage:** Currently in-memory only; persists only during session
4. **Build artifacts:** Client builds to `dist/public/`, server bundles to `dist/index.js`
5. **Development mode detection:** Uses `NODE_ENV=development` flag for middleware selection
