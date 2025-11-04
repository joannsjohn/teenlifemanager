# Active Context

## Current Status
**Phase**: Early Development - Foundation & Structure Setup
**Date**: October 2025
**Focus**: Monorepo reorganization and backend setup

### Recent Changes
- ✅ **Monorepo Structure**: Reorganized into `frontend/` and `backend/` folders
- ✅ **Root Workspace**: Created root package.json for workspace management
- ✅ **CI/CD Setup**: Created GitHub Actions workflows for frontend and backend
- ✅ **Backend Foundation**: Initialized backend with Express, TypeScript, Prisma

## What We're Working On

### Immediate Focus
1. **Memory Bank Creation** ✓ (Current task)
   - Setting up comprehensive documentation structure
   - Establishing project memory for future development sessions
   - Documenting current architecture and decisions

### Recently Completed
- Project initialization with Expo and TypeScript
- Basic project structure created (screens, components, navigation)
- Navigation architecture established (Tab Navigator)
- Initial screen placeholders created for all main features
- Authentication store setup with Zustand
- README documentation with comprehensive feature overview
- Basic login UI in App.tsx (not yet integrated with navigation)

## Current Codebase State

### Implemented Components

#### Navigation
- **MainTabNavigator.tsx**: Bottom tab navigation with 5 main screens
  - Schedule, Volunteering, Social, Mental Health (Wellness), Profile tabs
  - Uses Ionicons for tab icons
  - Primary color: #6366f1 (Indigo)
  - Platform-aware tab bar sizing

#### Screens (Placeholder Stage)
- **LoginScreen.tsx**: Login interface (placeholder)
- **RegisterScreen.tsx**: Registration interface (placeholder)
- **ScheduleScreen.tsx**: Calendar and task management (placeholder)
- **VolunteeringScreen.tsx**: Volunteer tracking (placeholder)
- **SocialScreen.tsx**: Social features (placeholder)
- **MentalHealthScreen.tsx**: Wellness features (placeholder)
- **ProfileScreen.tsx**: User profile (placeholder)
- **SettingsScreen.tsx**: App settings (placeholder)

#### State Management
- **authStore.ts**: Zustand store for authentication
  - User state management
  - Login/logout actions
  - Theme management (light/dark)
  - Notification state
  - Currently local only, no API integration

#### Root Component
- **App.tsx**: Contains basic login UI with demo functionality
  - Simple email/password form
  - Mock authentication
  - Tab interface for logged-in state
  - Special "Jayden & Lilly" feature (personal content)
  - **Note**: Not yet integrated with MainTabNavigator

### Component Structure (Directories Created)
```
src/components/
├── common/           (empty - for shared components)
├── schedule/         (empty - for schedule components)
├── volunteering/     (empty - for volunteering components)
├── social/           (empty - for social components)
└── mental-health/    (empty - for mental health components)
```

### Services & Utils
- `src/services/`: Empty (prepared for API services)
- `src/utils/`: Empty (prepared for helper functions)
- `src/types/`: Contains type definitions

## Active Decisions & Considerations

### Architecture Decisions
1. **Navigation Flow**: Need to integrate App.tsx auth flow with MainTabNavigator
   - Current: App.tsx has its own auth UI
   - Target: Proper stack navigator with auth screens → main tabs

2. **State Management**: Using Zustand
   - Currently only authStore implemented
   - Need to create: scheduleStore, volunteeringStore, socialStore, mentalHealthStore

3. **Data Persistence**: Expo SQLite selected but not yet implemented
   - Will need schema design for each feature
   - Consider migration strategy

### Design System Status
Current styling approach:
- Inline StyleSheet in each component
- Primary color: #6366f1 (Indigo)
- Consistent 12px border radius
- 8px grid spacing system

**To Do**: Extract into centralized design system
- Create `src/theme/` directory
- Define colors, spacing, typography constants
- Create reusable component library

### Technical Debt Tracking
1. **App.tsx Integration**: Basic auth UI not using navigation system
2. **Type Safety**: Some 'any' types in authStore (notifications)
3. **Error Handling**: No comprehensive error boundary or handling
4. **Validation**: No form validation library integrated
5. **Assets**: Images not optimized, have convert-images.js script unused

## Next Steps (Prioritized)

### High Priority
1. **Refactor Authentication Flow**
   - Move App.tsx login UI to LoginScreen.tsx properly
   - Set up proper auth stack navigation
   - Connect authStore to navigation guards
   - Implement proper protected routes

2. **Design System Foundation**
   - Create theme constants (colors, typography, spacing)
   - Build common component library (Button, Card, Input, etc.)
   - Document component usage patterns

3. **Feature Implementation - Schedule**
   - Design calendar UI
   - Implement event creation
   - Build task list
   - Set up local storage

### Medium Priority
4. **Complete State Management**
   - Create remaining Zustand stores
   - Implement proper TypeScript types
   - Add persistence layer

5. **Volunteering Feature**
   - Organization management
   - Hours logging interface
   - Progress tracking

6. **Form Management**
   - Integrate react-hook-form or similar
   - Build reusable form components
   - Add validation schemas

### Lower Priority
7. **Social Features**
   - Friend connections UI
   - Activity feed
   - Group management

8. **Mental Health Features**
   - Mood tracker
   - Journal interface
   - Resources library

9. **Polish & Optimization**
   - Add loading states
   - Implement error boundaries
   - Optimize performance
   - Add animations

## Current Blockers
- None at this moment
- All dependencies installed and working
- Development environment stable

## Backend Architecture Decision (October 2025)

### Recommended Stack
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL (via Prisma ORM)
- **Deployment**: Railway (recommended) or Render/Fly.io
- **Authentication**: JWT with refresh tokens
- **API Design**: RESTful API (with React Query integration)

### Rationale
1. **TypeScript Consistency**: Matches frontend, shared types possible
2. **PostgreSQL**: Relational data fits our needs (users, events, volunteering, social)
3. **Prisma**: Excellent TypeScript support, type-safe queries, easy migrations
4. **Railway**: Simple deployment, PostgreSQL included, free tier, git-based deploys
5. **REST API**: Simple, works well with React Query, easy to cache

### Implementation Plan
1. Set up backend project structure
2. Initialize Prisma with database schema
3. Build authentication endpoints (email/password, Google, Apple)
4. Create user management endpoints
5. Implement feature-specific endpoints (schedule, volunteering, social, mental health)
6. Deploy to Railway
7. Connect frontend via React Query

### Files Created
- `memory-bank/backend-architecture.md` - Complete backend architecture documentation
- `BACKEND_SETUP.md` - Step-by-step setup guide
- `memory-bank/gcp-deployment.md` - Complete GCP deployment guide
- `GCP_DEPLOYMENT.md` - Quick reference for GCP setup

### Deployment Strategy
- **Mobile App**: Deploys to App Store/Play Store via Expo EAS Build (separate from backend)
- **Backend API**: Deploy to **Cloud Run** (recommended) or App Engine
- **Database**: **Cloud SQL for PostgreSQL** (fully managed)
- **Why not GKE**: Overkill for single backend API - use Cloud Run instead

## Open Questions (Resolved)
1. ✅ **Backend Strategy**: Building backend now with Node.js + Express + PostgreSQL
2. ✅ **Database**: PostgreSQL selected for relational data needs
3. ✅ **Deployment**: Railway recommended for simplicity and PostgreSQL inclusion
4. **Authentication Provider**: Social auth (Google, Apple) - implement after email/password
5. **Data Sync**: Hybrid approach - offline-first with background sync
6. **Parent Dashboard**: Defer to later phase after core features solid
7. **Testing Strategy**: Start with critical paths (auth, data integrity) soon

## Environment Notes
- Development on macOS (darwin 24.5.0)
- Using zsh shell
- Workspace: `/Users/nitinpunnen/Documents/Code/TeenLifeManager`
- Node/npm environment set up correctly
- All Expo dependencies working

## Key Files to Reference
- `package.json`: All dependencies and scripts
- `App.tsx`: Current entry point (needs refactoring)
- `src/navigation/MainTabNavigator.tsx`: Main navigation structure
- `src/store/authStore.ts`: Authentication state management
- `src/types/index.ts`: TypeScript type definitions
- `README.md`: Comprehensive feature documentation

## Communication Notes
- Project owner: Nitin Punnen
- Development approach: Iterative, feature-by-feature
- Documentation preference: Comprehensive memory bank system
- Planning style: Clarifying questions before implementation

## Special Features
- "Jayden & Lilly" tab in App.tsx appears to be personal/custom feature
  - Contains image gallery modal
  - May or may not be part of final production app
  - Keep or remove based on user preference






