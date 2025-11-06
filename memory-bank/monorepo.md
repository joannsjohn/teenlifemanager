# Monorepo Structure

This project is organized as a **monorepo** to manage both the frontend (React Native) and backend (Node.js API) in a single repository.

## Structure

```
TeenLifeManager/
├── frontend/              # React Native app
│   ├── src/              # Source code
│   ├── App.tsx           # Entry point
│   ├── package.json      # Frontend dependencies
│   └── tsconfig.json     # TypeScript config
│
├── backend/              # Node.js API
│   ├── src/              # Source code
│   ├── prisma/           # Database schema
│   ├── package.json      # Backend dependencies
│   └── tsconfig.json     # TypeScript config
│
├── .github/workflows/    # CI/CD pipelines
│   ├── ci.yml           # Combined CI
│   ├── frontend.yml     # Frontend CI/CD
│   └── backend.yml      # Backend CI/CD
│
├── memory-bank/          # Project documentation
├── package.json          # Root workspace config
└── README.md            # Main README
```

## Benefits

1. **Single Repository**: All code in one place
2. **Shared Types**: Can share TypeScript types between frontend and backend
3. **Unified CI/CD**: Manage deployments from one place
4. **Easier Development**: Switch between frontend and backend easily
5. **Version Control**: Coordinated releases

## Workspace Management

### Root Scripts

The root `package.json` provides convenient scripts:

```bash
# Install all dependencies
npm run install:all

# Start frontend
npm run frontend:dev

# Start backend
npm run backend:dev

# Type check both
npm run type-check
```

### Working with Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### Working with Backend

```bash
cd backend

# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Start dev server
npm run dev
```

## CI/CD

### GitHub Actions Workflows

1. **`.github/workflows/ci.yml`**
   - Runs on all pushes/PRs
   - Type checks both frontend and backend
   - Fast feedback loop

2. **`.github/workflows/frontend.yml`**
   - Runs on frontend changes
   - Type checks
   - Builds for iOS/Android on main branch

3. **`.github/workflows/backend.yml`**
   - Runs on backend changes
   - Runs tests
   - Builds and deploys to Cloud Run on main branch

### Path-Based Triggers

Workflows only run when relevant files change:
- Frontend workflow: `frontend/**` changes
- Backend workflow: `backend/**` changes

This prevents unnecessary builds.

## Deployment

### Frontend
Deploys separately to App Store/Play Store via Expo EAS Build.

### Backend
Deploys to Google Cloud Run via GitHub Actions on push to main.

## Adding New Scripts

### Root Level
Add to root `package.json`:
```json
{
  "scripts": {
    "my-script": "cd frontend && npm run something"
  }
}
```

### Frontend/Backend
Add to respective `package.json` files in `frontend/` or `backend/` directories.

## Best Practices

1. **Keep Dependencies Separate**: Each workspace manages its own dependencies
2. **Use Path-Based CI**: Only run workflows when relevant files change
3. **Shared Types**: Consider creating a `shared/` package for common types
4. **Consistent Naming**: Use consistent naming conventions across workspaces
5. **Document Changes**: Update this file when structure changes

## Future Improvements

- [ ] Add shared TypeScript types package
- [ ] Add workspace-level linting
- [ ] Add workspace-level testing
- [ ] Consider using Turborepo or Nx for better monorepo tooling

