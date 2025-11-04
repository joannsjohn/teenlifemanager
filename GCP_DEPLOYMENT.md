# Quick GCP Deployment Guide

## TL;DR: What You Need

1. **Mobile App** → App Store/Play Store (via Expo EAS Build)
2. **Backend API** → Cloud Run (recommended)
3. **Database** → Cloud SQL for PostgreSQL

## Quick Setup Commands

### 1. Create PostgreSQL Database

```bash
# Create Cloud SQL instance
gcloud sql instances create teenlife-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --root-password=YOUR_STRONG_PASSWORD

# Create database
gcloud sql databases create teenlifemanager --instance=teenlife-db

# Create application user
gcloud sql users create api_user \
  --instance=teenlife-db \
  --password=USER_PASSWORD
```

### 2. Deploy Backend to Cloud Run

```bash
cd backend

# Build and deploy
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/teenlife-api

gcloud run deploy teenlife-api \
  --image gcr.io/YOUR_PROJECT_ID/teenlife-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --add-cloudsql-instances YOUR_PROJECT_ID:us-central1:teenlife-db \
  --set-env-vars "DATABASE_URL=postgresql://api_user:PASSWORD@/teenlifemanager?host=/cloudsql/YOUR_PROJECT_ID:us-central1:teenlife-db" \
  --set-env-vars "JWT_SECRET=your-secret-key" \
  --set-env-vars "NODE_ENV=production"
```

### 3. Get Your API URL

```bash
gcloud run services describe teenlife-api --region us-central1 --format="value(status.url)"
```

### 4. Update Mobile App

```typescript
// src/config/api.ts
export const API_URL = 'https://teenlife-api-xxxxx-uc.a.run.app';
```

## Cost Estimate

- **Small app**: ~$7-17/month
- **Medium app**: ~$45-75/month
- **Large app**: ~$150-550/month

## Why Not GKE?

**GKE is overkill** for a single backend API. Use it only if:
- You have 10+ microservices
- You need advanced orchestration
- You have a DevOps team

**Cloud Run is better** because:
- ✅ Simpler (just deploy a container)
- ✅ Cheaper (pay per request)
- ✅ Auto-scales
- ✅ No Kubernetes knowledge needed

## Full Documentation

See `memory-bank/gcp-deployment.md` for complete guide.

