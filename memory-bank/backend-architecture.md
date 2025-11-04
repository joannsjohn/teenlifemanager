# Backend Architecture

## Recommended Stack

### Backend Framework
**Node.js + Express + TypeScript**
- **Rationale**:
  - Matches frontend TypeScript for consistency
  - Large ecosystem and community
  - Fast development and deployment
  - Easy to deploy on various platforms
  - Excellent performance for our use case

**Alternative**: Fastify (faster, smaller) or NestJS (more structure, enterprise-grade)

### Database
**PostgreSQL** (Primary) + **Redis** (Optional, for caching/sessions)

**Why PostgreSQL?**
- Relational data fits our needs (users, events, volunteering, social connections)
- ACID compliance for data integrity
- Excellent JSON support for flexible fields
- Strong performance for complex queries
- Free tier available on most cloud providers
- Great for volunteer hours, schedules, relationships

**Schema Considerations**:
- Users and authentication
- Events and tasks (schedule)
- Organizations and volunteer hours
- Social connections and groups
- Mood entries and journal entries
- Achievements and badges

### ORM/Database Tool
**Prisma**
- **Rationale**:
  - Best-in-class TypeScript support
  - Type-safe database queries
  - Excellent migration system
  - Auto-generated types
  - Great developer experience
  - Easy to switch databases if needed

### Authentication
**JWT (JSON Web Tokens)**
- Access tokens (short-lived: 15-60 min)
- Refresh tokens (long-lived: 7-30 days)
- Stored securely in database for revocation
- Support for OAuth (Google, Apple) via `expo-auth-session`

### API Design
**RESTful API** (with potential GraphQL later)
- Simple to understand and implement
- Good caching support
- Easy to document
- Works well with React Query

## Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.ts   # Prisma client
│   │   ├── env.ts        # Environment variables
│   │   └── jwt.ts        # JWT configuration
│   ├── middleware/       # Express middleware
│   │   ├── auth.ts       # Authentication middleware
│   │   ├── error.ts      # Error handling
│   │   └── validation.ts # Request validation
│   ├── routes/           # API routes
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── schedule.ts
│   │   ├── volunteering.ts
│   │   ├── social.ts
│   │   └── mental-health.ts
│   ├── controllers/      # Business logic
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   └── ...
│   ├── services/         # Service layer
│   │   ├── auth.service.ts
│   │   ├── email.service.ts
│   │   └── ...
│   ├── models/           # Prisma models (schema.prisma)
│   ├── types/            # TypeScript types
│   ├── utils/            # Helper functions
│   │   ├── validation.ts
│   │   ├── errors.ts
│   │   └── ...
│   └── app.ts            # Express app setup
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
├── tests/                # Test files
├── .env.example          # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

## Database Schema (High-Level)

### Core Tables
```prisma
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  passwordHash  String?  // null for OAuth users
  displayName   String
  nickname      String?  // Pseudonymous profile
  avatar        String?
  googleId      String?  @unique
  appleId       String?  @unique
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Relations
  events        Event[]
  volunteerHours VolunteerHour[]
  moodEntries   MoodEntry[]
  journalEntries JournalEntry[]
  friends       Friendship[] @relation("UserFriends")
  friendOf      Friendship[] @relation("FriendOf")
  achievements  UserAchievement[]
}

model Event {
  id          String   @id @default(uuid())
  title       String
  description String?
  startTime   DateTime
  endTime     DateTime?
  category    String   // homework, exam, personal, volunteer
  color       String?
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VolunteerHour {
  id            String   @id @default(uuid())
  organization  String
  description   String
  hours         Float
  date          DateTime
  location      String?
  verified      Boolean  @default(false)
  verificationCode String? @unique
  supervisorEmail String?
  userId        String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model MoodEntry {
  id          String   @id @default(uuid())
  mood        Int      // 1-10 scale
  emotions    String[] // ["happy", "anxious", etc.]
  notes       String?
  userId      String
  createdAt   DateTime @default(now())
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model JournalEntry {
  id          String   @id @default(uuid())
  content     String
  isVoice     Boolean  @default(false)
  audioUrl    String?
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Friendship {
  id        String   @id @default(uuid())
  userId    String
  friendId  String
  status    String   // pending, accepted, blocked
  createdAt DateTime @default(now())
  
  user      User     @relation("UserFriends", fields: [userId], references: [id])
  friend    User     @relation("FriendOf", fields: [friendId], references: [id])
  
  @@unique([userId, friendId])
}

model Achievement {
  id          String   @id @default(uuid())
  name        String
  description String
  icon        String
  type        String   // mood_streak, volunteer_hours, etc.
  threshold   Int?
  
  users       UserAchievement[]
}

model UserAchievement {
  id            String   @id @default(uuid())
  userId        String
  achievementId String
  unlockedAt    DateTime @default(now())
  
  user          User     @relation(fields: [userId], references: [id])
  achievement   Achievement @relation(fields: [achievementId], references: [id])
  
  @@unique([userId, achievementId])
}
```

## API Endpoints Structure

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
POST   /api/auth/google
POST   /api/auth/apple
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

### Users
```
GET    /api/users/me
PATCH  /api/users/me
DELETE /api/users/me
GET    /api/users/:id/profile
```

### Schedule
```
GET    /api/schedule/events
POST   /api/schedule/events
GET    /api/schedule/events/:id
PATCH  /api/schedule/events/:id
DELETE /api/schedule/events/:id
GET    /api/schedule/calendar/sync
```

### Volunteering
```
GET    /api/volunteering/hours
POST   /api/volunteering/hours
GET    /api/volunteering/hours/:id
PATCH  /api/volunteering/hours/:id
DELETE /api/volunteering/hours/:id
POST   /api/volunteering/hours/:id/verify
GET    /api/volunteering/reports
POST   /api/volunteering/export
GET    /api/volunteering/leaderboard
```

### Social
```
GET    /api/social/friends
POST   /api/social/friends/request
POST   /api/social/friends/:id/accept
DELETE /api/social/friends/:id
GET    /api/social/groups
POST   /api/social/groups
GET    /api/social/forum/posts
POST   /api/social/forum/posts
```

### Mental Health
```
GET    /api/mental-health/moods
POST   /api/mental-health/moods
GET    /api/mental-health/moods/insights
GET    /api/mental-health/journal
POST   /api/mental-health/journal
GET    /api/mental-health/journal/:id
PATCH  /api/mental-health/journal/:id
DELETE /api/mental-health/journal/:id
GET    /api/mental-health/resources
```

## Deployment Options (Same Cloud)

### Recommended: Railway
**Why Railway?**
- ✅ Simple deployment (git push to deploy)
- ✅ PostgreSQL database included
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Environment variables management
- ✅ Easy to scale
- ✅ Great for small to medium apps

**Setup**:
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Add PostgreSQL
railway add postgresql

# Deploy
railway up
```

### Alternative: Render
- Free tier for PostgreSQL
- Free tier for web services
- Automatic SSL
- Easy setup

### Alternative: Fly.io
- Global edge deployment
- PostgreSQL included
- Good performance
- Free tier available

### Alternative: AWS (if more control needed)
- **EC2** or **Elastic Beanstalk** for backend
- **RDS** for PostgreSQL
- **S3** for file storage
- More complex but very scalable

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# JWT
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-secret"
APPLE_CLIENT_ID="your-apple-client-id"
APPLE_CLIENT_SECRET="your-apple-secret"

# App
NODE_ENV="production"
PORT=3000
API_URL="https://your-api.railway.app"

# Email (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-password"
```

## Security Considerations

1. **Password Hashing**: Use bcrypt (cost factor 10-12)
2. **JWT Security**: Store refresh tokens in database, rotate regularly
3. **Rate Limiting**: Implement on auth endpoints
4. **CORS**: Configure properly for mobile apps
5. **Input Validation**: Use Zod or similar
6. **SQL Injection**: Prisma handles this
7. **XSS**: Sanitize user input
8. **HTTPS Only**: Enforce in production
9. **Data Privacy**: Encrypt sensitive mental health data
10. **Content Moderation**: For forum features

## Development Workflow

### Local Development
```bash
# Install dependencies
npm install

# Set up database
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev

# Run tests
npm test
```

### Database Migrations
```bash
# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset
```

## Performance Considerations

1. **Database Indexing**: Add indexes on foreign keys and frequently queried fields
2. **Pagination**: All list endpoints should be paginated
3. **Caching**: Use Redis for session storage and frequently accessed data
4. **Connection Pooling**: Prisma handles this automatically
5. **Query Optimization**: Use Prisma's query optimization features
6. **Rate Limiting**: Prevent abuse
7. **Compression**: Use gzip compression

## Monitoring & Logging

1. **Error Tracking**: Sentry or similar
2. **Logging**: Winston or Pino
3. **Health Checks**: `/api/health` endpoint
4. **Metrics**: Track API response times, errors
5. **Database Monitoring**: Track query performance

## Next Steps

1. ✅ Set up backend project structure
2. ✅ Initialize Prisma with schema
3. ✅ Set up Express server
4. ✅ Implement authentication endpoints
5. ✅ Create user management
6. ✅ Build feature-specific endpoints
7. ✅ Deploy to cloud platform
8. ✅ Connect frontend to backend

