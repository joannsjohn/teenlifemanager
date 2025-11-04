# Backend Setup Guide

## Quick Start

### Step 1: Initialize Backend Project

```bash
# Create backend directory
mkdir backend
cd backend

# Initialize Node.js project
npm init -y

# Install core dependencies
npm install express cors dotenv
npm install @prisma/client bcrypt jsonwebtoken
npm install zod express-async-errors

# Install TypeScript dependencies
npm install -D typescript @types/node @types/express @types/cors
npm install -D @types/bcrypt @types/jsonwebtoken
npm install -D ts-node nodemon prisma

# Install development tools
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D eslint prettier
```

### Step 2: Set Up TypeScript

Create `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Step 3: Initialize Prisma

```bash
# Initialize Prisma
npx prisma init

# This creates:
# - prisma/schema.prisma
# - .env file
```

### Step 4: Configure Database

Update `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/teenlifemanager?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"
NODE_ENV="development"
PORT=3000
```

### Step 5: Create Database Schema

Edit `prisma/schema.prisma` (see backend-architecture.md for full schema)

### Step 6: Set Up Express Server

Create `src/app.ts`:
```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Step 7: Add Scripts to package.json

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  }
}
```

### Step 8: Run Database Migrations

```bash
# Generate Prisma client
npm run prisma:generate

# Create and apply migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view data
npm run prisma:studio
```

### Step 9: Start Development Server

```bash
npm run dev
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── env.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── error.ts
│   ├── routes/
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   └── users.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── user.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── user.service.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── validation.ts
│   │   └── errors.ts
│   └── app.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## Deployment to Railway

### Option 1: Railway CLI (Recommended)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Add PostgreSQL
railway add postgresql

# Link to existing project (if you have one)
railway link

# Set environment variables
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your-secret
railway variables set JWT_REFRESH_SECRET=your-refresh-secret

# Deploy
railway up
```

### Option 2: GitHub Integration

1. Push code to GitHub
2. Go to Railway dashboard
3. Click "New Project"
4. Connect GitHub repository
5. Railway auto-detects and deploys
6. Add PostgreSQL database
7. Set environment variables

### Environment Variables in Railway

Railway automatically provides `DATABASE_URL` when you add PostgreSQL.

Add these in Railway dashboard:
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `NODE_ENV=production`
- `PORT=3000` (Railway sets this automatically)

## Next Steps

1. ✅ Set up authentication endpoints
2. ✅ Implement user management
3. ✅ Build schedule endpoints
4. ✅ Add volunteering endpoints
5. ✅ Create social features
6. ✅ Implement mental health endpoints
7. ✅ Connect frontend to backend

## Testing the API

```bash
# Health check
curl http://localhost:3000/api/health

# After implementing auth
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","displayName":"Test User"}'
```

## Development Tips

1. Use Prisma Studio to view/edit database: `npm run prisma:studio`
2. Use Postman or Insomnia for API testing
3. Enable CORS for local development
4. Use environment variables for all secrets
5. Run migrations before deploying
6. Test locally before deploying

