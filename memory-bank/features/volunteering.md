# Volunteering Feature Documentation

## Overview
Complete implementation of the Volunteering feature with Organizations management, allowing users to create organizations, log volunteer hours, and track their volunteering activities.

## Implementation Date
November 2025

## Architecture

### Backend

#### Database Schema
- **Organization Model**: Stores volunteer organizations
  - Fields: id, name, description, website, contactEmail, contactPhone, address, categories, isVerified, userId
  - Relations: Links to User and VolunteerHour
- **VolunteerHour Model**: Stores volunteer hour records
  - Fields: id, organizationId, organization (string), description, hours, date, location, verified, verificationCode, supervisorEmail, supervisorName, userId
  - Relations: Links to User and Organization (via organizationId)

#### API Endpoints
- `POST /api/organizations` - Create organization
- `GET /api/organizations` - Get all organizations (with filters)
- `GET /api/organizations/stats` - Get organizations with stats
- `GET /api/organizations/:id` - Get organization by ID
- `PUT /api/organizations/:id` - Update organization
- `DELETE /api/organizations/:id` - Delete organization
- `POST /api/volunteer` - Create volunteer hour
- `GET /api/volunteer` - Get volunteer hours (with filters)
- `GET /api/volunteer/total` - Get total hours
- `GET /api/volunteer/:id` - Get volunteer hour by ID
- `PUT /api/volunteer/:id` - Update volunteer hour
- `DELETE /api/volunteer/:id` - Delete volunteer hour
- `POST /api/volunteer/verify` - Verify hours by code (public)

#### Services
- **organization.service.ts**: Business logic for organizations
  - CRUD operations
  - Filtering and search
  - Stats calculation
- **volunteer.service.ts**: Business logic for volunteer hours
  - CRUD operations
  - Total hours calculation
  - Verification code generation

### Frontend

#### Screens
1. **VolunteeringScreen.tsx** - Main volunteering screen
   - Stats dashboard (total hours, pending hours, record count)
   - Tab navigation (Records / Organizations)
   - Floating action buttons
   - Empty states
   - Pull-to-refresh

2. **AddOrganizationScreen.tsx** - Create organizations
   - Full form with validation
   - Category management (add/remove)
   - Contact information fields
   - Website and address fields

3. **EditOrganizationScreen.tsx** - Edit organizations
   - Pre-populated form
   - Same fields as AddOrganizationScreen
   - Update functionality

4. **OrganizationDetailsScreen.tsx** - View organization details
   - Complete organization information
   - "Add Hours" button for quick access
   - Edit and Delete actions
   - Clickable contact information (email, phone, website)

5. **AddVolunteerHoursScreen.tsx** - Log volunteer hours
   - Organization picker modal
   - "Add New Organization" button
   - Full form: description, hours, date, location, supervisor info
   - Pre-fills organization when navigated from organization screen

6. **VolunteerHourDetailsScreen.tsx** - View hour record details
   - Complete record information
   - Status badges (approved/pending/rejected)
   - Verification code display
   - Delete functionality

#### Services
- **organizationService.ts**: Frontend API service for organizations
  - getOrganizations(filters?)
  - getOrganizationById(id)
  - createOrganization(data)
  - updateOrganization(id, data)
  - deleteOrganization(id)
  - Graceful error handling

- **volunteerService.ts**: Frontend API service for volunteer hours
  - getVolunteerHours(filters?)
  - getTotalHours()
  - createVolunteerHour(data)
  - updateVolunteerHour(id, data)
  - deleteVolunteerHour(id)
  - Graceful error handling

#### Navigation
- Updated SimpleNavigation to support route parameters
- All screens registered in App.tsx
- Type definitions updated in types/index.ts

## Key Features

### Interconnected Workflow
1. **Add Hours from Organizations**: 
   - Organization cards have "Add Hours" button
   - OrganizationDetailsScreen has "Log Volunteer Hours" button
   - Pre-fills organization in AddVolunteerHoursScreen

2. **Add Organizations from Hours**:
   - AddVolunteerHoursScreen has "Add New Organization" button
   - Opens AddOrganizationScreen
   - After creation, returns to hours screen with organization selected

3. **Organization Picker Modal**:
   - Modal in AddVolunteerHoursScreen
   - Lists all organizations
   - "Add New Organization" option in modal
   - Easy selection

### UI/UX Features
- **Modern Theme**: Light gradient backgrounds matching profile screens
- **Consistent Styling**: h3/h4 titles, white back buttons, consistent spacing
- **Empty States**: Helpful messages with action buttons
- **Error Handling**: Graceful degradation when backend unavailable
- **Pull-to-Refresh**: On both Records and Organizations tabs
- **Stats Dashboard**: Quick overview of volunteering activity
- **Status Indicators**: Visual badges for hour approval status
- **Category Tags**: Visual organization categories

### Error Handling
- Services handle network errors gracefully
- Screens show empty states instead of errors
- Only logs errors in development mode
- User-friendly messages
- App continues to work when backend unavailable

## Data Flow

### Creating an Organization
1. User navigates to AddOrganizationScreen
2. Fills in organization details
3. Submits form → organizationService.createOrganization()
4. Backend creates organization in database
5. User redirected back or to organization details

### Logging Volunteer Hours
1. User navigates to AddVolunteerHoursScreen
2. Selects organization (or creates new one)
3. Fills in hours, description, date, etc.
4. Submits form → volunteerService.createVolunteerHour()
5. Backend creates volunteer hour record
6. Links to organization if organizationId provided
7. User redirected back

### Viewing Data
1. VolunteeringScreen loads on mount
2. Calls both organizationService.getOrganizations() and volunteerService.getVolunteerHours()
3. Displays data in respective tabs
4. Pull-to-refresh reloads data
5. Shows empty states if no data or backend unavailable

## Technical Decisions

### Why No Local Store for Volunteering?
- Direct API integration provides real-time data
- No need for complex sync logic
- Simpler architecture
- Backend handles all data persistence

### Why Organization Model?
- Reusable across multiple hour entries
- Better data organization
- Can add future features (verified orgs, public orgs)
- Easier to track hours per organization

### Why Interconnected Screens?
- Better UX - users can add hours while viewing organization
- Reduces navigation steps
- More intuitive workflow
- Matches real-world usage patterns

## Future Enhancements
- Edit volunteer hour records
- Hour verification workflow
- Achievement/badge system
- Reports and analytics
- Organization discovery/browse
- Public organization profiles
- Organization verification system

## Files Created/Modified

### Backend
- `backend/prisma/schema.prisma` - Added Organization model
- `backend/src/services/organization.service.ts` - New
- `backend/src/controllers/organization.controller.ts` - New
- `backend/src/routes/organization.routes.ts` - New
- `backend/src/services/volunteer.service.ts` - Updated (added organizationId)
- `backend/src/app.ts` - Added organization routes

### Frontend
- `frontend/src/services/organizationService.ts` - New
- `frontend/src/services/volunteerService.ts` - New
- `frontend/src/screens/VolunteeringScreen.tsx` - Complete rewrite
- `frontend/src/screens/AddOrganizationScreen.tsx` - New
- `frontend/src/screens/EditOrganizationScreen.tsx` - New
- `frontend/src/screens/OrganizationDetailsScreen.tsx` - New
- `frontend/src/screens/AddVolunteerHoursScreen.tsx` - New
- `frontend/src/screens/VolunteerHourDetailsScreen.tsx` - New
- `frontend/src/navigation/SimpleNavigation.tsx` - Added route parameters support
- `frontend/src/types/index.ts` - Added new screen routes
- `frontend/App.tsx` - Added new screen routes

## Testing Notes
- Backend must be running for full functionality
- Database migration required: `npx prisma db push`
- Prisma client generation required: `npx prisma generate`
- App gracefully handles backend unavailability
- Network errors don't crash the app

## Known Limitations
- No offline support (future enhancement)
- No edit functionality for volunteer hours (future enhancement)
- No achievement system yet (future enhancement)
- No organization discovery/browse (future enhancement)

