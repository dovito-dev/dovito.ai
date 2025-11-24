# Dovito.ai Landing Page & CMS

## Overview

Dovito.ai is a modern business process automation platform with a visually striking landing page featuring a "Periodic Table of Apps" design. The application combines an interactive public-facing website with a full-featured content management system (CMS) that allows administrators to manage products, content sections, and users. Built with React, Express, and PostgreSQL using Drizzle ORM, the platform emphasizes sleek animations, professional design aesthetics inspired by beam.ai, and guaranteed ROI through intelligent automation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Full-Stack Architecture
The application follows a monolithic full-stack architecture with clear separation between client and server code:

- **Frontend**: React with TypeScript, built with Vite
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL accessed via Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens

**Rationale**: This architecture provides type safety across the entire stack while maintaining simplicity and developer productivity. The monolithic approach keeps related code together while still maintaining clear boundaries.

### Frontend Architecture

#### Component Structure
- **Page Components**: Top-level route handlers (`BeamStyleLanding`, `AdminPage`)
- **Feature Components**: Specialized functionality (`AdminDashboard`, `AdminLogin`, `SplashCursor`, `FloatingLines`)
- **UI Components**: Reusable shadcn/ui components in `client/src/components/ui/`

#### State Management
- **React Query (@tanstack/react-query)**: Server state management and caching
- **Local State**: React hooks for component-level state
- **Session Management**: Express sessions with PostgreSQL storage

**Rationale**: React Query eliminates the need for complex state management libraries by handling server state, caching, and synchronization. Local state with hooks keeps components simple and testable.

#### Animation System
- **Framer Motion**: Declarative animations and transitions
- **Custom Components**: `SplashCursor` (fluid dynamics cursor effect), `FloatingLines` (Three.js-based background animations)
- **Animation Toggle**: User preference stored in localStorage to enable/disable animations

**Rationale**: Animations enhance user experience and brand identity while providing users control over performance preferences.

### Backend Architecture

#### API Design
RESTful API with session-based authentication:
- `/api/auth/*` - Authentication endpoints
- `/api/products` - Public product listings
- `/api/admin/*` - Protected admin operations
- `/api/content` - Content sections for landing page

**Rationale**: REST provides a simple, well-understood API pattern. Session-based auth is appropriate for this web application with server-side rendering capabilities.

#### Authentication & Authorization
- **Session Management**: `express-session` with PostgreSQL store (`connect-pg-simple`)
- **Password Hashing**: bcrypt for secure password storage
- **Role-Based Access**: Admin vs. user roles with middleware guards
- **Middleware**: `requireAdmin` middleware protects sensitive endpoints

**Rationale**: Session-based authentication works well for traditional web apps, provides good security, and integrates seamlessly with Express.

#### Storage Layer
Abstraction pattern with `IStorage` interface supporting multiple backends:
- **Primary**: `DatabaseStorage` using Drizzle ORM with PostgreSQL
- **Alternative**: `NocoStorage` for NocoDB integration (currently unused)
- **In-Memory**: Mock storage for development/testing

**Rationale**: Storage abstraction allows swapping backends without changing business logic. Currently uses direct database access for simplicity and performance.

### Database Schema

#### Core Tables
- **users**: Admin accounts with bcrypt-hashed passwords, roles (admin/user)
- **products**: Product catalog for the periodic table display with positioning data
- **content_sections**: Dynamic content management with key-based lookup
- **form_submissions**: Contact form data storage
- **sessions**: Express session storage for authentication

**Rationale**: Simple normalized schema that supports current features while remaining extensible. PostgreSQL provides ACID guarantees and JSON support for flexible metadata storage.

#### Data Migration Strategy
- **Drizzle Kit**: Schema migrations in `migrations/` directory
- **Push Command**: `db:push` for development schema updates
- **Schema Definition**: Single source of truth in `shared/schema.ts`

**Rationale**: Type-safe migrations with Drizzle Kit ensure database schema stays in sync with TypeScript types.

### Build & Deployment

#### Development
- **Vite Dev Server**: Fast HMR and module resolution
- **Express Middleware**: Vite middleware mode for integrated development
- **TypeScript**: `tsx` for server-side TypeScript execution

#### Production
- **Frontend Build**: Vite builds React app to `dist/public`
- **Backend Build**: esbuild bundles server code to `dist/index.js`
- **Static Serving**: Express serves built frontend assets

**Rationale**: Separate build processes optimize each layer. Vite provides excellent developer experience, while esbuild creates fast production bundles.

## External Dependencies

### Third-Party Services

#### Email Service (SendGrid)
- **Purpose**: Welcome emails for new admin users with temporary passwords
- **Integration**: `@sendgrid/mail` package
- **Configuration**: `SENDGRID_API_KEY` environment variable
- **Fallback**: Development mode logs emails instead of sending

**Rationale**: SendGrid provides reliable transactional email delivery with good developer experience and generous free tier.

#### Database (Neon PostgreSQL)
- **Purpose**: Primary data storage
- **Integration**: `@neondatabase/serverless` with WebSocket support
- **Configuration**: `DATABASE_URL` environment variable
- **Features**: Serverless PostgreSQL with connection pooling

**Rationale**: Neon provides serverless PostgreSQL that scales automatically and works well in serverless environments like Replit.

#### Optional: NocoDB
- **Purpose**: Alternative database backend (not currently active)
- **Integration**: REST API client in `server/nocodb.ts`
- **Configuration**: `NOCODB_API_BASE_URL`, `NOCODB_API_TOKEN`

**Note**: Code exists to support NocoDB but `DatabaseStorage` is currently the active implementation.

### Key NPM Packages

#### UI & Styling
- **@radix-ui/***: Accessible component primitives (dialogs, dropdowns, tooltips, etc.)
- **tailwindcss**: Utility-first CSS framework
- **framer-motion**: Animation library
- **lucide-react**: Icon library

#### Forms & Validation
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation integration
- **zod**: Runtime type validation (via drizzle-zod)

#### 3D Graphics
- **three**: WebGL library for FloatingLines background effect

#### Development Tools
- **vite**: Build tool and dev server
- **esbuild**: JavaScript bundler for production
- **tsx**: TypeScript execution for development
- **@replit/vite-plugin-***: Replit-specific development tools

**Rationale**: Best-in-class tools for each concern, with emphasis on TypeScript support and developer experience.