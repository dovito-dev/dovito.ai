# Dovito.ai Landing Page

## Overview

Dovito.ai is a modern landing page application showcasing business process automation products through an interactive "Periodic Table of Apps" interface. The application features a full-stack TypeScript architecture with a React frontend, Express backend, and PostgreSQL database. It includes a comprehensive CMS for managing products and content, authentication system, and advanced visual effects including custom cursor animations and WebGL-based background effects.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Animations**: Framer Motion for component animations

**Key Design Patterns**:
- Component-based architecture with reusable UI components
- Custom hooks for shared logic (toast notifications, mobile detection)
- Animation toggle system for performance optimization
- Multiple cursor effect implementations (Splash, Fluid Glass, Normal)

**Visual Effects**:
- Custom WebGL-based cursor effects using Three.js and React Three Fiber
- Floating line animations using Three.js
- Beam effects with custom shader materials
- All animations can be toggled on/off for performance

### Backend Architecture

**Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ESM modules
- **Development**: tsx for TypeScript execution in development
- **Production**: esbuild for bundling server code

**API Design**:
- RESTful API endpoints under `/api` prefix
- Session-based authentication using express-session
- Role-based access control (admin/user roles)
- CRUD operations for products, users, and content sections

**Storage Layer**:
- Abstract storage interface (`IStorage`) allows flexibility in data persistence
- Current implementation uses Drizzle ORM with PostgreSQL
- Database migrations managed through drizzle-kit
- Session storage in PostgreSQL using connect-pg-simple

**Authentication**:
- bcrypt for password hashing
- Express session middleware for session management
- Protected admin routes requiring authentication
- User invite system with temporary passwords

### Database Schema

**Core Tables**:
1. **users**: Admin and user accounts with role-based access
2. **products**: Product catalog for the periodic table display
3. **content_sections**: Dynamic content management with key-value structure
4. **form_submissions**: Contact form data storage
5. **sessions**: Session persistence for authentication

**Key Fields**:
- Products include name, abbreviation, position (x,y), status (live/coming_soon), category
- Content sections support JSON metadata and active/inactive states
- All tables include timestamp tracking (createdAt, updatedAt)

### Content Management System

**Admin Features**:
- Product management (add, edit, delete products)
- User management (invite users, manage roles, change passwords)
- Content section editing
- Form submission viewing

**Product Management**:
- Auto-generate abbreviations from product names
- Grid position management for periodic table layout
- Status toggles (live vs coming soon)
- URL assignment for product links

**Access Control**:
- Login page at `/admin`
- Session-based authentication
- Role verification middleware on sensitive routes

## External Dependencies

### Third-Party Services

**Email Service**: SendGrid
- User invite emails with temporary passwords
- Configurable via `SENDGRID_API_KEY` environment variable
- Graceful degradation when not configured (logs to console)

**Database**: NeonDB (PostgreSQL)
- Serverless PostgreSQL using `@neondatabase/serverless`
- WebSocket-based connections
- Connection pooling via pg Pool
- Required environment variable: `DATABASE_URL`

### Key NPM Packages

**Frontend**:
- `@radix-ui/*`: Accessible UI component primitives
- `@tanstack/react-query`: Server state management and caching
- `framer-motion`: Animation library
- `three` & `@react-three/fiber`: 3D graphics and WebGL effects
- `wouter`: Lightweight routing
- `axios`: HTTP client

**Backend**:
- `express`: Web framework
- `drizzle-orm`: TypeScript ORM
- `bcryptjs`: Password hashing
- `@sendgrid/mail`: Email delivery
- `express-session`: Session management
- `connect-pg-simple`: PostgreSQL session store

**Development**:
- `vite`: Build tool and dev server
- `tsx`: TypeScript execution
- `esbuild`: Production bundling
- `drizzle-kit`: Database migration tool
- `tailwindcss`: Utility-first CSS

### Asset Management

**Static Assets**:
- Logo and brand assets stored in `attached_assets/`
- Public assets served from Vite build output
- Custom fonts via Google Fonts (Inter)
- Font Awesome icons via CDN

### Build & Deployment

**Development**:
- Vite dev server with HMR
- Express server proxying for API routes
- Concurrent frontend and backend development

**Production**:
- Vite builds frontend to `dist/public`
- esbuild bundles server to `dist/index.js`
- Static file serving from Express
- Environment-based configuration via process.env

**Environment Variables Required**:
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `SENDGRID_API_KEY`: Email service (optional)
- `NODE_ENV`: Environment mode