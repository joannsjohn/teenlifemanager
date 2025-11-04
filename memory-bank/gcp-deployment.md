# GCP Deployment Guide

## Architecture Overview

### Important: Two Separate Deployments

```
┌─────────────────────────────────────────────────┐
│  Mobile App (React Native/Expo)                 │
│  ↓ Deploys to                                    │
│  • App Store (iOS)                               │
│  • Play Store (Android)                          │
│  • This is just the app code, no backend needed │
└─────────────────────────────────────────────────┘
                    ↓
            Makes API calls to
                    ↓
┌─────────────────────────────────────────────────┐
│  Backend API (Node.js + Express)                 │
│  ↓ Deploys to                                    │
│  • GCP Cloud Run (Recommended) ✅                │
│  • GCP App Engine                                │
│  • GCP Compute Engine                            │
│  • GKE (Kubernetes) - Overkill for most apps    │
└─────────────────────────────────────────────────┘
                    ↓
            Connects to
                    ↓
┌─────────────────────────────────────────────────┐
│  Database (PostgreSQL)                           │
│  ↓ Deploys to                                    │
│  • Cloud SQL for PostgreSQL ✅ (Recommended)     │
└─────────────────────────────────────────────────┘
```

## PostgreSQL on GCP

### Option 1: Cloud SQL for PostgreSQL (Recommended ✅)

**What it is**: Fully managed PostgreSQL database service

**Why use it**:
- ✅ Fully managed (backups, updates, patches automatic)
- ✅ High availability options
- ✅ Automatic backups
- ✅ Easy scaling
- ✅ Point-in-time recovery
- ✅ Private IP connectivity (secure)
- ✅ Integrated with other GCP services

**Pricing**:
- **Free tier**: None (but very affordable)
- **db-f1-micro**: ~$7/month (shared-core, 0.6GB RAM)
- **db-g1-small**: ~$25/month (1 vCPU, 1.7GB RAM)
- **db-n1-standard-1**: ~$50/month (1 vCPU, 3.75GB RAM)

**Setup**:
```bash
# Using gcloud CLI
gcloud sql instances create teenlife-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --root-password=YOUR_PASSWORD

# Create database
gcloud sql databases create teenlifemanager --instance=teenlife-db

# Get connection string
gcloud sql instances describe teenlife-db
```

**Connection String**:
```env
DATABASE_URL="postgresql://username:password@PRIVATE_IP:5432/teenlifemanager"
```

### Option 2: Self-Managed on Compute Engine (Not Recommended)

**Why avoid**:
- ❌ You manage backups, updates, security patches
- ❌ More complex setup
- ❌ More maintenance overhead
- ❌ No automatic failover
- ✅ Only use if you need specific PostgreSQL versions/extensions

### Option 3: Cloud SQL Proxy (For Local Development)

Allows secure connection to Cloud SQL from local machine:
```bash
# Install Cloud SQL Proxy
curl -o cloud-sql-proxy https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.8.0/cloud-sql-proxy.linux.amd64
chmod +x cloud-sql-proxy

# Connect
./cloud-sql-proxy PROJECT_ID:REGION:INSTANCE_NAME
```

## Backend API Deployment Options

### Option 1: Cloud Run (Recommended ✅) - BEST FOR MOST APPS

**What it is**: Serverless container platform - pay only when handling requests

**Why use it**:
- ✅ **Simplest deployment** - Just deploy a container
- ✅ **Auto-scaling** - Scales to zero when not in use
- ✅ **Cost-effective** - Pay per request (can be free for low traffic)
- ✅ **Automatic HTTPS** - SSL certificates included
- ✅ **Easy CI/CD** - Connect to GitHub for auto-deploy
- ✅ **No server management** - Fully managed
- ✅ **Fast cold starts** - Good for Node.js

**Limitations**:
- ⚠️ Request timeout: 60 minutes (usually fine)
- ⚠️ Memory: Up to 8GB
- ⚠️ CPU: Up to 4 vCPU

**When to use**: **99% of apps** - Start here!

**Pricing**:
- **Free tier**: 2 million requests/month
- **After free**: ~$0.40 per million requests + $0.00002400 per vCPU-second

**Setup Steps**:

1. **Create Dockerfile**:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

EXPOSE 8080

CMD ["node", "dist/app.js"]
```

2. **Build and deploy**:
```bash
# Build container
gcloud builds submit --tag gcr.io/PROJECT_ID/teenlife-api

# Deploy to Cloud Run
gcloud run deploy teenlife-api \
  --image gcr.io/PROJECT_ID/teenlife-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL="your-cloud-sql-connection" \
  --add-cloudsql-instances PROJECT_ID:REGION:INSTANCE_NAME
```

3. **Connect to Cloud SQL**:
```bash
# Add Cloud SQL connection
gcloud run services update teenlife-api \
  --add-cloudsql-instances PROJECT_ID:us-central1:teenlife-db \
  --set-env-vars DATABASE_URL="postgresql://user:pass@/dbname?host=/cloudsql/PROJECT_ID:us-central1:teenlife-db"
```

### Option 2: App Engine (Good Alternative)

**What it is**: Platform-as-a-Service (PaaS) - deploy code, GCP manages infrastructure

**Why use it**:
- ✅ Very simple deployment
- ✅ Auto-scaling
- ✅ Free tier available
- ✅ Integrated with other GCP services
- ✅ Good for standard Node.js apps

**Limitations**:
- ⚠️ Less flexible than Cloud Run
- ⚠️ Some platform restrictions
- ⚠️ Can be more expensive than Cloud Run at scale

**When to use**: If you prefer PaaS over containers

**Setup**:
```yaml
# app.yaml
runtime: nodejs18
env: standard

instance_class: F1

automatic_scaling:
  min_instances: 0
  max_instances: 10

env_variables:
  DATABASE_URL: "your-connection-string"
```

```bash
gcloud app deploy
```

### Option 3: Compute Engine (VM) - Most Control

**What it is**: Virtual machines - you manage everything

**Why use it**:
- ✅ Full control over server
- ✅ Can install anything
- ✅ Good for complex setups
- ✅ Predictable costs (fixed monthly)

**Limitations**:
- ❌ You manage: OS updates, security, scaling, backups
- ❌ More complex setup
- ❌ More expensive than Cloud Run for low-medium traffic
- ❌ Need to set up load balancing, auto-scaling manually

**When to use**: 
- Very high traffic
- Need specific system-level configurations
- Legacy applications
- **Not recommended for most apps**

**Setup**:
```bash
# Create VM
gcloud compute instances create teenlife-api \
  --machine-type=e2-micro \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud \
  --boot-disk-size=10GB

# SSH and install Node.js, deploy app
gcloud compute ssh teenlife-api
```

### Option 4: GKE (Google Kubernetes Engine) - Overkill

**What it is**: Managed Kubernetes service

**Why use it**:
- ✅ Excellent for microservices
- ✅ Automatic scaling
- ✅ High availability
- ✅ Container orchestration

**Limitations**:
- ❌ **Very complex** - requires Kubernetes knowledge
- ❌ More expensive (need cluster management)
- ❌ Overkill for single API service
- ❌ Steeper learning curve

**When to use**: 
- Multiple microservices
- Very high scale
- Need advanced orchestration
- **Not recommended for single backend API**

**Cost**: ~$73/month minimum (3 nodes) + workload costs

## Recommended Architecture for Your App

### Best Option: Cloud Run + Cloud SQL

```
┌─────────────────────────────────────────┐
│  Mobile App (iOS/Android)               │
│  Deployed via Expo EAS Build           │
└─────────────────────────────────────────┘
              ↓ HTTPS
┌─────────────────────────────────────────┐
│  Cloud Run (Backend API)                │
│  • Auto-scaling                         │
│  • Pay-per-request                      │
│  • Automatic HTTPS                      │
│  • Serverless                           │
└─────────────────────────────────────────┘
              ↓ Private IP
┌─────────────────────────────────────────┐
│  Cloud SQL (PostgreSQL)                 │
│  • Managed backups                      │
│  • High availability                    │
│  • Automatic updates                    │
└─────────────────────────────────────────┘
```

## Step-by-Step GCP Setup

### 1. Initial Setup

```bash
# Install gcloud CLI
# https://cloud.google.com/sdk/docs/install

# Login
gcloud auth login

# Set project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  sqladmin.googleapis.com \
  compute.googleapis.com
```

### 2. Create Cloud SQL Database

```bash
# Create PostgreSQL instance
gcloud sql instances create teenlife-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --root-password=STRONG_PASSWORD_HERE \
  --backup-start-time=03:00 \
  --enable-bin-log

# Create database
gcloud sql databases create teenlifemanager --instance=teenlife-db

# Create user
gcloud sql users create api_user \
  --instance=teenlife-db \
  --password=USER_PASSWORD
```

### 3. Prepare Backend for Deployment

```bash
cd backend

# Create .dockerignore
echo "node_modules
dist
.env
.git
*.md" > .dockerignore

# Create Dockerfile (see above)

# Build and test locally
docker build -t teenlife-api .
docker run -p 8080:8080 --env-file .env teenlife-api
```

### 4. Deploy to Cloud Run

```bash
# Build container image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/teenlife-api

# Deploy to Cloud Run
gcloud run deploy teenlife-api \
  --image gcr.io/YOUR_PROJECT_ID/teenlife-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --add-cloudsql-instances YOUR_PROJECT_ID:us-central1:teenlife-db \
  --set-env-vars "DATABASE_URL=postgresql://api_user:PASSWORD@/teenlifemanager?host=/cloudsql/YOUR_PROJECT_ID:us-central1:teenlife-db" \
  --set-env-vars "JWT_SECRET=your-jwt-secret" \
  --set-env-vars "NODE_ENV=production" \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10 \
  --min-instances 0

# Get your API URL
gcloud run services describe teenlife-api --region us-central1
```

### 5. Update Mobile App Configuration

```typescript
// src/config/api.ts
export const API_URL = __DEV__ 
  ? 'http://localhost:3000'  // Development
  : 'https://teenlife-api-xxxxx-uc.a.run.app';  // Production
```

### 6. Set Up CI/CD (Optional but Recommended)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: google-github-actions/setup-gcloud@v1
        with:
          service_account_key: ${{ secrets.GCP_SA_KEY }}
          project_id: ${{ secrets.GCP_PROJECT_ID }}
      - run: |
          gcloud builds submit --tag gcr.io/${{ secrets.GCP_PROJECT_ID }}/teenlife-api
          gcloud run deploy teenlife-api \
            --image gcr.io/${{ secrets.GCP_PROJECT_ID }}/teenlife-api \
            --region us-central1 \
            --platform managed
```

## Cost Estimation

### Small App (< 10,000 users)
- **Cloud Run**: ~$0-10/month (mostly free tier)
- **Cloud SQL (db-f1-micro)**: ~$7/month
- **Total**: ~$7-17/month

### Medium App (10,000-100,000 users)
- **Cloud Run**: ~$20-50/month
- **Cloud SQL (db-g1-small)**: ~$25/month
- **Total**: ~$45-75/month

### Large App (100,000+ users)
- **Cloud Run**: ~$100-500/month
- **Cloud SQL (db-n1-standard-1)**: ~$50/month
- **Total**: ~$150-550/month

## Security Best Practices

1. **Use Private IP for Cloud SQL**:
   ```bash
   gcloud sql instances patch teenlife-db \
     --network=projects/YOUR_PROJECT/global/networks/default \
     --no-assign-ip
   ```

2. **Use Secret Manager for sensitive data**:
   ```bash
   # Store secrets
   echo -n "your-secret" | gcloud secrets create jwt-secret --data-file=-
   
   # Use in Cloud Run
   gcloud run services update teenlife-api \
     --set-secrets JWT_SECRET=jwt-secret:latest
   ```

3. **Enable Cloud Armor** (for DDoS protection)

4. **Use IAM roles** (least privilege)

5. **Enable audit logs**

## Monitoring & Logging

```bash
# View logs
gcloud run services logs read teenlife-api --region us-central1

# Set up alerts
gcloud alpha monitoring policies create --policy-from-file=policy.yaml
```

## Comparison Table

| Feature | Cloud Run | App Engine | Compute Engine | GKE |
|---------|-----------|------------|----------------|-----|
| **Complexity** | ⭐ Simple | ⭐⭐ Medium | ⭐⭐⭐ Complex | ⭐⭐⭐⭐ Very Complex |
| **Cost (Low Traffic)** | $0-10/mo | $0-10/mo | $10-20/mo | $73+/mo |
| **Auto-scaling** | ✅ Yes | ✅ Yes | ❌ Manual | ✅ Yes |
| **Server Management** | ✅ None | ✅ None | ❌ You manage | ⚠️ Partial |
| **Best For** | Most apps | Standard apps | Custom needs | Microservices |

## Recommendation

**Start with Cloud Run + Cloud SQL**:
- Simplest to deploy and manage
- Cost-effective
- Auto-scales
- Perfect for your use case
- Easy to migrate to other options later if needed

**Only consider GKE if**:
- You have multiple microservices
- You need advanced orchestration
- You have a dedicated DevOps team
- You're at very large scale

## Next Steps

1. ✅ Set up GCP project
2. ✅ Create Cloud SQL instance
3. ✅ Build and deploy backend to Cloud Run
4. ✅ Configure mobile app to use Cloud Run URL
5. ✅ Deploy mobile app to App Store/Play Store (separate process)

