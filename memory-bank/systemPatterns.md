# System Patterns

## Architecture Overview

### High-Level Architecture
```
┌─────────────────────────────────────────┐
│           React Native App              │
│                                         │
│  ┌──────────┐  ┌──────────┐  ┌───────┐ │
│  │  Screens │  │Components│  │ Store │ │
│  └──────────┘  └──────────┘  └───────┘ │
│       ↓              ↓           ↓      │
│  ┌─────────────────────────────────┐   │
│  │      Navigation Layer           │   │
│  └─────────────────────────────────┘   │
│       ↓              ↓           ↓      │
│  ┌──────────┐  ┌──────────┐  ┌───────┐ │
│  │ Services │  │  Utils   │  │ Types │ │
│  └──────────┘  └──────────┘  └───────┘ │
│       ↓                                 │
│  ┌─────────────────────────────────┐   │
│  │    Local Storage (SQLite)       │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

## Project Structure

### Monorepo Organization
```
TeenLifeManager/
├── frontend/           # React Native app (Expo)
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── common/    # Shared components
│   │   │   ├── schedule/
│   │   │   ├── volunteering/
│   │   │   ├── social/
│   │   │   └── mental-health/
│   │   ├── screens/       # Screen components
│   │   ├── navigation/    # Navigation configuration
│   │   ├── store/         # Zustand state management
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Helper functions
│   ├── App.tsx
│   ├── package.json
│   └── tsconfig.json
├── backend/           # Node.js API (Express + TypeScript)
│   ├── src/
│   │   ├── config/        # Configuration
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── controllers/   # Request handlers
│   │   ├── services/      # Business logic
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Helper functions
│   ├── prisma/         # Database schema
│   ├── package.json
│   └── tsconfig.json
├── .github/workflows/  # CI/CD pipelines
├── memory-bank/        # Project documentation
└── package.json        # Root workspace config
```

### Component Hierarchy
```
App.tsx (Root)
└── NavigationContainer
    └── Stack Navigator (Auth Flow)
        ├── LoginScreen
        ├── RegisterScreen
        └── MainTabNavigator (Protected)
            ├── ScheduleScreen
            ├── VolunteeringScreen
            ├── SocialScreen
            ├── MentalHealthScreen
            └── ProfileScreen
```

## Key Technical Decisions

### State Management Strategy
**Decision**: Use Zustand for global state management

**Rationale**:
- Simpler API than Redux
- No boilerplate required
- Great TypeScript support
- Smaller bundle size
- Sufficient for our needs

**Store Architecture**:
```typescript
// Separate stores by feature domain
- authStore      // User authentication, theme, notifications, token management
- scheduleStore  // Events, tasks, calendar data (future)
// Volunteering uses API services directly (organizationService, volunteerService)
- socialStore    // Friends, groups, activities (future)
- mentalHealthStore  // Mood tracking, journal entries (future)
```

### Navigation Pattern
**Decision**: Custom SimpleNavigation using Context API

**Pattern**:
- Bottom tabs for main features (Schedule, Volunteering, Social, Wellness, Profile)
- Custom navigation system with route parameters support
- History-based navigation with goBack functionality
- Screen routing via App.tsx ScreenRenderer component
- Supports passing parameters between screens
- Auth flow as separate stack before main tabs

**Implementation**:
```typescript
// Type-safe navigation
type MainTabParamList = {
  Schedule: undefined;
  Volunteering: undefined;
  Social: undefined;
  MentalHealth: undefined;
  Profile: undefined;
}
```

### Data Persistence
**Decision**: PostgreSQL via Prisma ORM (backend) + API services (frontend)

**Rationale**:
- Relational data structure fits our use case
- Type-safe queries with Prisma
- Easy migrations and schema management
- Centralized data storage
- RESTful API for frontend communication

**Backend Schema** (Prisma):
- User, Organization, VolunteerHour, Notification, Event, MoodEntry, JournalEntry, Friendship models
- Automatic migrations with `prisma db push`
- Type-safe database client generated

**Frontend Pattern**:
- API services (organizationService, volunteerService, etc.) handle all data operations
- Services gracefully handle network errors
- Empty states shown when backend unavailable

**Schema Strategy**:
- Normalized tables for each feature
- Local-first with sync capability (future)
- Migrations handled through versioning

### Component Design Patterns

#### Feature-Based Organization
Components are organized by feature domain:
- Promotes modularity and maintainability
- Clear ownership boundaries
- Easier code navigation
- Supports team scalability

#### Composition Pattern
```typescript
// Example: Building complex UIs from smaller components
<Card>
  <CardHeader title="..." subtitle="..." />
  <CardContent>
    <StatItem label="..." value="..." />
  </CardContent>
  <CardActions>
    <Button />
  </CardActions>
</Card>
```

#### Container/Presentational Split
- **Container components**: Handle logic, state, data fetching
- **Presentational components**: Pure, reusable, styling-focused
- Stored in respective feature folders

### Styling Approach
**Decision**: StyleSheet API with design system constants

**Design System**:
```typescript
const colors = {
  primary: '#6366f1',    // Indigo
  secondary: '#8b5cf6',  // Purple
  success: '#10b981',    // Green
  danger: '#ef4444',     // Red
  warning: '#f59e0b',    // Amber
  // ... etc
}

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
}

const typography = {
  h1: { fontSize: 32, fontWeight: 'bold' },
  h2: { fontSize: 24, fontWeight: 'bold' },
  body: { fontSize: 16 },
  // ... etc
}
```

**Rationale**:
- Consistent visual language
- Easier maintenance
- Better performance than CSS-in-JS
- No additional dependencies

### Type Safety
**Decision**: Strict TypeScript configuration

**Patterns**:
```typescript
// Define all data models in src/types/index.ts
export interface User {
  id: string;
  email: string;
  name: string;
  // ... etc
}

// Use discriminated unions for state
type LoadingState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: any }
  | { status: 'error'; error: string };
```

### Error Handling
**Pattern**: Graceful degradation with user-friendly feedback

**Implementation**:
- Services catch network errors and re-throw for caller handling
- Screens handle errors gracefully with empty states
- Only log errors in development mode (`__DEV__`)
- User-friendly empty states when backend unavailable
- Pull-to-refresh allows retry

```typescript
// Service pattern
try {
  const data = await fetch(...);
  return data;
} catch (error) {
  if (__DEV__) {
    console.log('Service unavailable - backend may not be running');
  }
  throw error; // Let caller handle
}

// Screen pattern
try {
  const data = await service.getData();
  setData(data);
} catch (error) {
  // Set empty defaults, show empty state
  setData([]);
}
```

## Performance Patterns

### Optimization Strategies
1. **Memoization**: React.memo for expensive components
2. **List virtualization**: FlatList for long scrollable lists
3. **Image optimization**: Proper sizing and caching
4. **Lazy loading**: Load features on-demand
5. **Debouncing**: Search and filter inputs

### Code Splitting
- Feature-based splitting using dynamic imports
- Reduce initial bundle size
- Load screens as needed

## Security Patterns

### Authentication Flow
```
1. User enters credentials
2. Validate locally (format check)
3. Send to auth service (future)
4. Receive JWT token
5. Store securely (Expo SecureStore)
6. Add to all API requests
7. Refresh token when expired
```

### Data Protection
- Sensitive data in SecureStore (not AsyncStorage)
- Input sanitization before storage
- No sensitive data in logs
- Clear data on logout

## Testing Strategy (Future)

### Test Pyramid
```
        ┌──────────┐
        │   E2E    │  ← Few, critical user journeys
        └──────────┘
      ┌──────────────┐
      │ Integration  │  ← Component + Store interactions
      └──────────────┘
    ┌──────────────────┐
    │      Unit        │  ← Utils, helpers, business logic
    └──────────────────┘
```

### Testing Tools
- Jest for unit tests
- React Native Testing Library for component tests
- Detox for E2E tests (future)

## Accessibility Patterns

### WCAG 2.1 Compliance
- Minimum touch target: 44x44 points
- Color contrast ratios: 4.5:1 for text
- Screen reader labels on all interactive elements
- Keyboard navigation support
- Focus indicators

### Implementation
```typescript
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Add new event"
  accessibilityHint="Opens form to create a calendar event"
  accessibilityRole="button"
>
```

## Build & Deployment

### Development Workflow
```
1. Local development with Expo Go
2. Feature branches for all work
3. Pull requests with review
4. Automated checks (lint, type-check)
5. Merge to main
6. Deploy preview (future)
7. Promote to production
```

### Build Process
- EAS Build for native builds
- Environment-based configuration
- Automated version bumping
- Over-the-air updates for JS changes

## Monitoring & Analytics (Future)

### Tracking Strategy
- User events (button clicks, screen views)
- Performance metrics (render times, API latency)
- Error tracking (crashes, exceptions)
- Usage patterns (feature adoption)

### Privacy-First Analytics
- Anonymous user IDs
- Aggregate data only
- Opt-out capability
- No sensitive data collection






