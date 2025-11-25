# Dovito.ai - Business Process Automation Platform

## Overview

Dovito.ai is a modern business process automation platform featuring a product showcase landing page with a "Periodic Table of Apps" design. The application provides a content management system for managing products, automated logo generation capabilities, and advanced visual effects including beam animations, floating lines, and splash cursor interactions.

The platform is built as a full-stack TypeScript application with a React frontend and Express backend, utilizing PostgreSQL for data persistence through Drizzle ORM. The design emphasizes modern aesthetics with smooth animations, glass-morphism effects, and responsive layouts inspired by contemporary SaaS landing pages.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing (alternative to React Router)
- Framer Motion for complex animations and transitions

**UI Component System**
- shadcn/ui component library using Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Component configuration stored in `components.json` with path aliases
- Design system following "New York" style variant with neutral base color

**State Management**
- TanStack Query (React Query) for server state management and caching
- Local React state for UI interactions
- Session-based authentication state

**Advanced Visual Effects**
- Custom WebGL canvas implementations for splash cursor effect
- Three.js integration (@react-three/fiber) for 3D beam animations
- Custom shader materials for advanced visual effects
- Floating lines animation using Three.js orthographic camera setup

**Key Design Patterns**
- Component composition with shadcn/ui as base layer
- Custom hooks for reusable logic (toast notifications, mobile detection)
- Ref-based component APIs for imperative animation control
- CSS-in-JS through Tailwind with CSS custom properties for theming

### Backend Architecture

**Server Framework**
- Express.js for HTTP server and API routing
- Native Node.js HTTP server for production
- Development mode integrates Vite middleware for HMR

**Database Layer**
- PostgreSQL as primary data store (via Neon serverless)
- Drizzle ORM for type-safe database queries
- Schema-first approach with migrations in `migrations/` directory
- WebSocket-based connection pooling for serverless compatibility

**Data Models**
- Users: Authentication and role-based access (admin/user roles)
- Products: Showcase items with periodic table positioning
- Content Sections: CMS-managed content blocks with metadata
- Form Submissions: Contact form data persistence
- Sessions: Express session storage in PostgreSQL

**Storage Abstraction**
- `IStorage` interface defines contract for data operations
- `DatabaseStorage` implements PostgreSQL-based storage
- Alternative `NocoStorage` implementation for NocoDB integration (currently unused)
- Mock storage layer for development/testing

**Authentication & Authorization**
- Session-based authentication using express-session
- Password hashing with bcryptjs (10 rounds)
- PostgreSQL session store (connect-pg-simple)
- Role-based middleware for admin route protection

**API Structure**
- RESTful endpoints under `/api` prefix
- Public routes: products, content sections
- Protected admin routes: user management, product CRUD, content updates
- Authentication endpoints: login, logout, session check

### External Dependencies

**Email Service**
- SendGrid integration for transactional emails
- Welcome/invite emails for new admin users
- Automatic temporary password generation
- Graceful fallback when SendGrid not configured (development mode)

**Database Service**
- Neon Serverless PostgreSQL (primary database)
- WebSocket-based connection pooling via @neondatabase/serverless
- Connection string configured via `DATABASE_URL` environment variable

**Optional Integration**
- NocoDB API client implementation available but not actively used
- Structured for potential headless CMS migration

**UI Component Library**
- Radix UI primitives for accessible, unstyled components
- React Bits registry for additional animation components
- Lucide React for consistent iconography

**Development Tools**
- Replit-specific plugins for development environment integration
- Runtime error overlay for better debugging
- Cartographer plugin for code navigation (Replit only)

**Build Dependencies**
- esbuild for server-side bundling in production
- tsx for TypeScript execution in development
- PostCSS with Tailwind and Autoprefixer for CSS processing

**Notable Architectural Decisions**
- Monorepo structure with shared schema between client/server
- Path aliases (@/, @shared, @assets) for clean imports
- Serverless-compatible database connections for deployment flexibility
- Dual storage implementation allowing database backend switching
- Animation toggle system for accessibility and performance preferences
- CSS custom properties for runtime theme customization
- Hybrid SSR approach using Vite in development, static serving in production