# Active Context

## Current Status
**Phase**: Core Feature Development - Volunteering Feature Complete
**Date**: November 2025
**Focus**: Volunteering feature with Organizations management

### Recent Changes
- ✅ **Volunteering Feature Complete**: Full implementation with Organizations
  - Backend: Organization model, API endpoints, database migration
  - Frontend: 5 new screens, interconnected functionality, modern UI
  - Services: organizationService and volunteerService for API communication
  - Navigation: Updated to support route parameters
- ✅ **UI Theme Consistency**: All Profile-related screens use consistent theme
  - Light gradient backgrounds (#F8FAFC → #EDE9FE → #F3E8FF)
  - Smaller h3/h4 titles that don't truncate
  - White back buttons with colored icons
- ✅ **Error Handling**: Graceful degradation when backend is unavailable
- ✅ **Monorepo Structure**: Reorganized into `frontend/` and `backend/` folders
- ✅ **Root Workspace**: Created root package.json for workspace management
- ✅ **CI/CD Setup**: Created GitHub Actions workflows for frontend and backend
- ✅ **Backend Foundation**: Initialized backend with Express, TypeScript, Prisma

## What We're Working On

### Recently Completed
- ✅ **Volunteering Feature - Full Stack Implementation**
  - Created Organization model in Prisma schema with full CRUD
  - Built backend API endpoints (`/api/organizations`, `/api/volunteer`)
  - Updated VolunteerHour model to link to Organization via `organizationId`
  - Created frontend services (organizationService.ts, volunteerService.ts)
  - Redesigned VolunteeringScreen with modern UI matching profile theme
  - Created 5 interconnected screens:
    - AddOrganizationScreen - Create organizations with categories, contact info
    - EditOrganizationScreen - Edit existing organizations
    - OrganizationDetailsScreen - View details with "Add Hours" button
    - AddVolunteerHoursScreen - Log hours with organization picker modal
    - VolunteerHourDetailsScreen - View individual hour records
  - Implemented interconnected workflow:
    - Add hours directly from organizations screen
    - Add organizations from hours screen
    - Organization picker modal in hours form
  - Added graceful error handling for network failures
  - Updated navigation system to support route parameters
  - Implemented pull-to-refresh and empty states
  - Database migration completed (Organization table created)

- ✅ **Profile Screen Navigation**: All buttons navigate to respective screens
  - Created placeholder screens: PrivacyScreen, HelpScreen, AboutScreen
  - Updated navigation types and App.tsx
  - Consistent theme across all profile screens

- ✅ **Notifications System**: Improved UI and error handling
  - Updated NotificationsScreen with modern design
  - Graceful error handling when backend unavailable
  - Better empty states and loading indicators

## Current Codebase State

### Implemented Components

#### Navigation
- **MainTabNavigator.tsx**: Bottom tab navigation with 5 main screens
  - Schedule, Volunteering, Social, Mental Health (Wellness), Profile tabs
  - Uses Ionicons for tab icons
  - Primary color: #6366f1 (Indigo)
  - Platform-aware tab bar sizing

#### Volunteering Screens (Fully Implemented)
- **VolunteeringScreen.tsx**: Main volunteering screen
  - Modern UI matching profile theme
  - Stats dashboard (total hours, pending, records)
  - Tab navigation (Records / Organizations)
  - Floating action buttons
  - Empty states with helpful messages
  - Pull-to-refresh functionality
- **AddOrganizationScreen.tsx**: Create organizations
  - Full form with categories, contact info, website, address
  - Category management (add/remove)
  - Validation and error handling
- **EditOrganizationScreen.tsx**: Edit existing organizations
  - Pre-populated form
  - Category management
- **OrganizationDetailsScreen.tsx**: View organization details
  - Shows all organization information
  - "Add Hours" button for quick access
  - Edit and Delete actions
  - Contact information with clickable links
- **AddVolunteerHoursScreen.tsx**: Log volunteer hours
  - Organization picker modal
  - "Add New Organization" button
  - Full form with description, hours, date, location, supervisor info
  - Pre-fills organization when navigated from organization screen
- **VolunteerHourDetailsScreen.tsx**: View hour record details
  - Shows all record information
  - Status badges
  - Delete functionality

#### Profile Screens (Fully Implemented)
- **ProfileScreen.tsx**: Main profile with navigation to all sub-screens
- **EditProfileScreen.tsx**: Edit user profile information
- **NotificationsScreen.tsx**: View and manage notifications
- **SettingsScreen.tsx**: App settings and preferences
- **PrivacyScreen.tsx**: Privacy and security settings
- **HelpScreen.tsx**: Help and support resources
- **AboutScreen.tsx**: App information and version

#### Screens (Placeholder Stage)
- **LoginScreen.tsx**: Login interface (placeholder)
- **RegisterScreen.tsx**: Registration interface (placeholder)
- **ScheduleScreen.tsx**: Calendar and task management (placeholder)
- **SocialScreen.tsx**: Social features (placeholder)
- **MentalHealthScreen.tsx**: Wellness features (placeholder)

#### State Management
- **authStore.ts**: Zustand store for authentication
  - User state management
  - Login/logout actions
  - Theme management (light/dark)
  - Notification state
  - Token management for API calls

#### Services
- **organizationService.ts**: API service for organizations
  - getOrganizations, getOrganizationById
  - createOrganization, updateOrganization, deleteOrganization
  - Graceful error handling
- **volunteerService.ts**: API service for volunteer hours
  - getVolunteerHours, getTotalHours
  - createVolunteerHour, updateVolunteerHour, deleteVolunteerHour
  - Graceful error handling
- **notificationService.ts**: API service for notifications
- **userService.ts**: API service for user data

#### Backend Services
- **organization.service.ts**: Business logic for organizations
- **volunteer.service.ts**: Business logic for volunteer hours
- **notification.service.ts**: Business logic for notifications
- **auth.service.ts**: Authentication logic

#### Backend Controllers
- **OrganizationController**: CRUD endpoints for organizations
- **VolunteerController**: CRUD endpoints for volunteer hours
- **NotificationController**: Notification management

#### Backend Routes
- `/api/organizations` - Organization management
- `/api/volunteer` - Volunteer hour management
- `/api/notifications` - Notification management

### Component Structure
```
src/components/
├── common/
│   ├── GradientCard.tsx
│   ├── GradientButton.tsx
│   ├── NotificationBell.tsx
│   └── NotificationItem.tsx
├── schedule/         (empty - for schedule components)
├── volunteering/     (empty - for volunteering components)
├── social/           (empty - for social components)
└── mental-health/    (empty - for mental health components)
```

### Services & Utils
- `src/services/`: 
  - organizationService.ts
  - volunteerService.ts
  - notificationService.ts
  - userService.ts
- `src/utils/`: 
  - animations.ts
- `src/types/`: Contains type definitions including Organization, VolunteeringRecord

## Active Decisions & Considerations

### Architecture Decisions
1. **Navigation Flow**: SimpleNavigation with route parameters support
   - Custom navigation system using Context API
   - Supports route parameters for passing data between screens
   - History-based navigation with goBack functionality

2. **State Management**: Using Zustand
   - authStore implemented with token management
   - Services handle API communication
   - No local stores for volunteering (uses API directly)

3. **Data Persistence**: PostgreSQL via Prisma
   - Organization model with full CRUD
   - VolunteerHour model linked to Organization
   - Database migrations with `prisma migrate dev` (preserves data)

4. **Error Handling**: Graceful degradation
   - Services handle network errors gracefully
   - Screens show empty states when backend unavailable
   - Only logs errors in development mode

### Design System Status
Current styling approach:
- Light gradient backgrounds for profile/volunteering screens
- Consistent typography (h3, h4 for titles)
- White back buttons with colored icons
- Consistent spacing and border radius
- Shadows for depth
- Theme colors defined in `src/theme/index.ts`

**Implemented**: 
- Centralized theme system (`src/theme/index.ts`)
- GradientCard and GradientButton components
- Consistent spacing, colors, typography

### Technical Debt Tracking
1. ✅ **App.tsx Integration**: Navigation system fully implemented
2. ✅ **Type Safety**: Strong TypeScript types throughout
3. ✅ **Error Handling**: Comprehensive error handling with graceful degradation
4. ⚠️ **Validation**: Form validation could be improved (currently basic)
5. ⚠️ **Assets**: Images not optimized
6. ✅ **Navigation Parameters**: Route parameters now supported

## Next Steps (Prioritized)

### High Priority
1. **Schedule Feature**
   - Design calendar UI
   - Implement event creation
   - Build task list
   - Set up API integration

2. **Social Features**
   - Friend connections
   - Activity feed
   - Group management

### Medium Priority
3. **Mental Health Features**
   - Mood tracker
   - Journal interface
   - Resources library

4. **Form Validation**
   - Integrate react-hook-form or similar
   - Build reusable form components
   - Add validation schemas

5. **Achievement System** (Volunteering)
   - Badge showcase
   - Achievement notifications
   - Milestone tracking

### Lower Priority
6. **Polish & Optimization**
   - Add loading states (already have some)
   - Implement error boundaries
   - Optimize performance
   - Add animations (basic animations implemented)

## Current Blockers
- None at this moment
- All dependencies installed and working
- Development environment stable
- Backend running and database synced

## Backend Architecture

### Stack
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: JWT with mock token support for development
- **API Design**: RESTful API

### Database Schema
- **User**: User accounts with authentication
- **Organization**: Volunteer organizations with categories, contact info
- **VolunteerHour**: Volunteer hour records linked to Organization
- **Notification**: User notifications
- **Event**: Schedule events (future)
- **MoodEntry**: Mental health entries (future)
- **JournalEntry**: Journal entries (future)
- **Friendship**: Social connections (future)

### API Endpoints
- `/api/organizations` - Full CRUD for organizations
- `/api/volunteer` - Full CRUD for volunteer hours
- `/api/notifications` - Notification management
- `/api/auth` - Authentication endpoints
- `/api/users` - User management

## Environment Notes
- Development on macOS (darwin 25.1.0)
- Using zsh shell
- Workspace: `/Users/nitinpunnen/Documents/Code/TeenLifeManager`
- Node/npm environment set up correctly
- All Expo dependencies working
- Backend running on port 3000
- Database: PostgreSQL on localhost:5432

## Key Files to Reference
- `frontend/App.tsx`: Main entry point with screen routing
- `frontend/src/navigation/SimpleNavigation.tsx`: Navigation system
- `frontend/src/store/authStore.ts`: Authentication state management
- `frontend/src/services/organizationService.ts`: Organization API service
- `frontend/src/services/volunteerService.ts`: Volunteer hours API service
- `frontend/src/types/index.ts`: TypeScript type definitions
- `backend/src/services/organization.service.ts`: Organization business logic
- `backend/src/services/volunteer.service.ts`: Volunteer hours business logic
- `backend/prisma/schema.prisma`: Database schema
- `README.md`: Comprehensive feature documentation

## Communication Notes
- Project owner: Nitin Punnen
- Development approach: Iterative, feature-by-feature
- Documentation preference: Comprehensive memory bank system
- Planning style: Clarifying questions before implementation
