# PostgreSQL Setup Guide (Homebrew)

## Step 1: Find PostgreSQL Installation

Homebrew typically installs PostgreSQL in one of these locations:
- **Apple Silicon (M1/M2/M3)**: `/opt/homebrew/opt/postgresql@17/bin`
- **Intel Mac**: `/usr/local/opt/postgresql@17/bin`

Check which version you installed:
```bash
brew list | grep postgresql
```

## Step 2: Add PostgreSQL to PATH

Add to your `~/.zshrc` file:

**For Apple Silicon (M1/M2/M3)**:
```bash
echo 'export PATH="/opt/homebrew/opt/postgresql@17/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**For Intel Mac**:
```bash
echo 'export PATH="/usr/local/opt/postgresql@17/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

## Step 3: Verify Installation

```bash
psql --version
# Should show: psql (PostgreSQL) 17.x
```

## Step 4: Start PostgreSQL Service

```bash
brew services start postgresql@17
```

**Check if it's running**:
```bash
brew services list | grep postgresql
```

Should show `started` status for `postgresql@17`.

## Step 5: Create Database

**Option A: Using psql command**
```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE teenlifemanager;

# Exit
\q
```

**Option B: Using createdb command**
```bash
createdb teenlifemanager
```

**Verify database was created**:
```bash
psql -l | grep teenlifemanager
```

## Step 6: Configure Backend

### Update `.env` file:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and set:

```env
DATABASE_URL="postgresql://postgres@localhost:5432/teenlifemanager?schema=public"
```

**Note**: 
- If you set a password during installation, use: `postgresql://postgres:YOUR_PASSWORD@localhost:5432/teenlifemanager?schema=public`
- If no password was set (default), use: `postgresql://postgres@localhost:5432/teenlifemanager?schema=public`

### Common Connection Strings:

**No password** (default):
```
postgresql://postgres@localhost:5432/teenlifemanager?schema=public
```

**With password**:
```
postgresql://postgres:yourpassword@localhost:5432/teenlifemanager?schema=public
```

**Custom user** (if you created one):
```
postgresql://username:password@localhost:5432/teenlifemanager?schema=public
```

## Step 7: Test Connection

```bash
cd backend

# Test connection
npx prisma db pull
```

If successful, you're all set!

## Step 8: Setup Database Schema

```bash
cd backend

# Generate Prisma Client
npm run prisma:generate

# Run migrations (creates all tables)
npm run prisma:migrate

# Optional: Open Prisma Studio to view data
npm run prisma:studio
```

## Troubleshooting

### PostgreSQL not found

**Check where Homebrew installed it**:
```bash
brew --prefix postgresql@17
```

Then add that path to your PATH:
```bash
echo 'export PATH="$(brew --prefix postgresql@17)/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Service won't start

```bash
# Check logs
brew services info postgresql@17

# Try restarting
brew services restart postgresql@17
```

### Permission denied

If you get permission errors, you might need to create a user:
```bash
psql postgres
CREATE USER postgres WITH SUPERUSER;
ALTER USER postgres WITH PASSWORD 'yourpassword';
\q
```

### Connection refused

1. **Check PostgreSQL is running**:
```bash
brew services list | grep postgresql
```

2. **Check port 5432**:
```bash
lsof -i :5432
```

3. **Start PostgreSQL**:
```bash
brew services start postgresql@17
```

### Can't create database

Make sure you're connected as a superuser:
```bash
psql postgres
# Should connect without password if no password was set
```

## Quick Reference Commands

```bash
# Start PostgreSQL
brew services start postgresql@17

# Stop PostgreSQL
brew services stop postgresql@17

# Restart PostgreSQL
brew services restart postgresql@17

# Check status
brew services list | grep postgresql
```

# Connect to database
psql teenlifemanager

# View all databases
psql -l

# List all tables (after migrations)
psql teenlifemanager -c "\dt"
```

## Next Steps

Once PostgreSQL is set up:

1. ✅ Update `backend/.env` with connection string
2. ✅ Run `npm run prisma:generate` in backend folder
3. ✅ Run `npm run prisma:migrate` to create tables
4. ✅ Start backend: `npm run dev`
5. ✅ Open pgAdmin to connect and view your database

## pgAdmin Setup

Once PostgreSQL is working, you can use pgAdmin:

1. **Install pgAdmin** (if not already):
```bash
brew install --cask pgadmin4
```

2. **Open pgAdmin** and add server:
   - Host: `localhost`
   - Port: `5432`
   - Database: `teenlifemanager`
   - Username: `postgres`
   - Password: (leave blank if no password, or enter your password)

3. **View your database**:
   - Expand Servers → localhost → Databases → teenlifemanager
   - You'll see all tables after running migrations

## Need Help?

If you're stuck, check:
- PostgreSQL is running: `brew services list`
- Connection string in `.env` is correct
- Database exists: `psql -l | grep teenlifemanager`
- PATH is set: `echo $PATH` (should include PostgreSQL bin directory)

