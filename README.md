# Teen Life Manager

A comprehensive React Native app designed to help teenagers manage their schedules, volunteering hours, social life, and mental health.

## 📁 Project Structure

This is a **monorepo** containing:

```
TeenLifeManager/
├── frontend/          # React Native app (Expo)
│   ├── src/
│   ├── App.tsx
│   ├── package.json
│   └── ...
├── backend/           # Node.js API (Express + TypeScript)
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   └── ...
├── memory-bank/       # Project documentation
├── .github/workflows/ # CI/CD pipelines
└── package.json       # Root workspace config
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- For iOS: macOS with Xcode
- For Android: Android Studio
- PostgreSQL (local or Cloud SQL)

### Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd TeenLifeManager
```

2. **Install all dependencies**:
```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

Or use the workspace script:
```bash
npm run install:all
```

### Frontend (React Native)

```bash
cd frontend

# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

### Backend (Node.js API)

```bash
cd backend

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and secrets

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run dev
```

The API will be available at `http://localhost:3000`

## 📦 Features

### 📅 Schedule Management
- Calendar view with daily, weekly, and monthly options
- Task and event creation with categories
- Smart reminders and notifications
- Time blocking for study sessions
- Integration with school calendars

### ❤️ Volunteering Tracker
- Organization management
- Hours logging with verification
- Achievement badges and progress tracking
- Volunteer opportunity discovery
- Community impact visualization

### 👥 Social Life Management
- Friend connections and activity sharing
- Group study sessions
- Social event planning
- Peer support networks
- Activity recommendations

### 🧠 Mental Health Support
- Mood tracking with journaling
- Stress level monitoring
- Breathing exercises and meditation
- Resource library (articles, videos, helplines)
- Crisis support integration

## 🛠 Tech Stack

### Frontend
- **React Native** with Expo
- **TypeScript**
- **React Navigation**
- **Zustand** (State management)
- **TanStack Query** (Server state)
- **Expo SQLite** (Local storage)

### Backend
- **Node.js** + **Express**
- **TypeScript**
- **PostgreSQL** (via Prisma ORM)
- **JWT** Authentication

## 📚 Documentation

- `memory-bank/` - Complete project documentation
- `memory-bank/setup/` - Setup and deployment guides
- `frontend/README.md` - Frontend-specific docs (if exists)
- `backend/README.md` - Backend-specific docs

## 🚢 Deployment

### Frontend (Mobile App)
Deploy to App Store/Play Store using Expo EAS Build:
```bash
cd frontend
eas build --platform ios
eas build --platform android
```

### Backend (API)
Deploy to Google Cloud Run:
```bash
cd backend
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/teenlife-api
gcloud run deploy teenlife-api --image gcr.io/YOUR_PROJECT_ID/teenlife-api
```

See `memory-bank/setup/GCP_DEPLOYMENT.md` for detailed instructions.

## 🔄 CI/CD

The project includes GitHub Actions workflows:

- **Backend CI/CD** (`.github/workflows/backend.yml`):
  - Runs tests on push/PR
  - Builds and deploys to Cloud Run on main branch
  
- **Frontend CI/CD** (`.github/workflows/frontend.yml`):
  - Runs type checks on push/PR
  - Builds for iOS/Android on main branch

## 📝 Scripts

### Root Level
- `npm run frontend:dev` - Start frontend dev server
- `npm run backend:dev` - Start backend dev server
- `npm run type-check` - Type check both frontend and backend
- `npm run install:all` - Install all dependencies

### Frontend
- `npm start` - Start Expo dev server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run on web browser

### Backend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run type checking: `npm run type-check`
4. Test your changes
5. Submit a pull request

## 📄 License

MIT

## 🔗 Links

- [Expo Documentation](https://docs.expo.dev/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [React Navigation](https://reactnavigation.org/)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
