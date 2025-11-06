# Teen Life Manager - Backend API

Backend API for Teen Life Manager built with Node.js, Express, TypeScript, and PostgreSQL.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Docker (optional, for local PostgreSQL)
- npm or yarn

### Option 1: Using Docker for PostgreSQL (Recommended ✅)

**No PostgreSQL installation needed!**

1. **Start PostgreSQL with Docker**:
```bash
# From project root
docker-compose up -d
```

This starts PostgreSQL in a container. You can stop it with:
```bash
docker-compose down
```

2. **Set up environment variables**:
```bash
cd backend
cp .env.example .env
# .env already has the correct DATABASE_URL for Docker
```

3. **Set up database**:
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations (creates tables)
npm run prisma:migrate
```

4. **Start development server**:
```bash
npm run dev
```

### Option 2: Install PostgreSQL Locally

If you prefer to install PostgreSQL directly:

**macOS (Homebrew)**:
```bash
brew install postgresql@15
brew services start postgresql@15
createdb teenlifemanager
```

**Linux (Ubuntu/Debian)**:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
createdb teenlifemanager
```

**Windows**:
Download from [postgresql.org](https://www.postgresql.org/download/windows/)

Then update `.env` with your connection string.

### Option 3: Use Cloud Database (Even for Development)

You can use a free hosted PostgreSQL service:

- **Supabase** (Free tier): [supabase.com](https://supabase.com)
- **Neon** (Free tier): [neon.tech](https://neon.tech)
- **Railway** (Free tier): [railway.app](https://railway.app)
- **Google Cloud SQL** (Free trial available)

Just get the connection string and put it in `.env`.

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Create and apply database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run prisma:deploy` - Apply migrations in production
- `npm run type-check` - Type check without building

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.ts  # Prisma client
│   │   └── env.ts       # Environment variables
│   ├── middleware/      # Express middleware
│   │   ├── auth.ts      # Authentication middleware
│   │   └── error.ts     # Error handling
│   ├── routes/          # API routes
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Helper functions
│   │   └── errors.ts    # Custom error classes
│   └── app.ts           # Express app setup
├── prisma/
│   └── schema.prisma    # Database schema
├── dist/                # Compiled JavaScript (generated)
├── .env                 # Environment variables (not in git)
├── Dockerfile          # Docker configuration
└── package.json
```

## API Endpoints

### Health Check
- `GET /api/health` - Check if API is running

### Authentication (Coming Soon)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

## Database Management

### Using Prisma Studio (Database GUI)

```bash
npm run prisma:studio
```

Opens a web interface at `http://localhost:5555` where you can:
- View all tables
- Edit data
- Add/delete records
- Browse relationships

### Creating Migrations

**Important**: Always use migrations instead of `prisma db push` to preserve your data!

```bash
npm run prisma:migrate
```

This will:
1. Create a migration file
2. Apply it to your database
3. Update Prisma Client types

**⚠️ Never use `prisma db push --force-reset`** - it will delete all your data!

### Resetting Database (Development Only!)

```bash
npx prisma migrate reset
```

⚠️ **Warning**: This deletes all data! Only use in development.

## Deployment

### Deploy to Cloud Run

1. Build Docker image:
```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/teenlife-api
```

2. Deploy to Cloud Run:
```bash
gcloud run deploy teenlife-api \
  --image gcr.io/YOUR_PROJECT_ID/teenlife-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --add-cloudsql-instances YOUR_PROJECT_ID:us-central1:teenlife-db \
  --set-env-vars "DATABASE_URL=postgresql://user:pass@/dbname?host=/cloudsql/PROJECT_ID:REGION:INSTANCE" \
  --set-env-vars "JWT_SECRET=your-secret" \
  --set-env-vars "NODE_ENV=production"
```

See `../memory-bank/setup/GCP_DEPLOYMENT.md` for detailed instructions.

## Environment Variables

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_REFRESH_SECRET` - Secret key for refresh tokens

Optional:
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - CORS allowed origin (default: *)

## Database Schema

The database schema is defined in `prisma/schema.prisma`. Key models:

- **User** - User accounts and profiles
- **Event** - Calendar events and tasks
- **VolunteerHour** - Volunteering hours tracking
- **MoodEntry** - Daily mood tracking
- **JournalEntry** - Journal entries (text and voice)
- **Friendship** - Friend connections
- **Achievement** - Achievement/badge system

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Input validation with Zod
- SQL injection protection via Prisma
- CORS configured
- Error handling doesn't leak sensitive info

## Troubleshooting

### Database Connection Issues

1. **Check if PostgreSQL is running**:
   ```bash
   # Docker
   docker-compose ps
   
   # Local installation
   pg_isready
   ```

2. **Check connection string in `.env`**:
   - Format: `postgresql://user:password@host:port/database`
   - For Docker: `postgresql://postgres:postgres@localhost:5432/teenlifemanager`

3. **Test connection**:
   ```bash
   npx prisma db pull
   ```

### Port Already in Use

If port 3000 is taken:
```bash
# Change PORT in .env
PORT=3001
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run type checking: `npm run type-check`
4. Test your changes
5. Submit a pull request

## License

MIT
