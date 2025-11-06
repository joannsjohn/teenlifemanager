# PostgreSQL & pgAdmin Setup Guide

## Installation Options

### Option 1: Install via Homebrew (Recommended for macOS)

**First, install Homebrew** (if not already installed):
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Then install PostgreSQL**:
```bash
brew install postgresql@15
```

**Start PostgreSQL service**:
```bash
brew services start postgresql@15
```

**Create database**:
```bash
createdb teenlifemanager
```

**Install pgAdmin**:
```bash
brew install --cask pgadmin4
```

### Option 2: Download Installers (Easier if no Homebrew)

**PostgreSQL**:
1. Go to https://www.postgresql.org/download/macosx/
2. Download the installer (choose version 15 or 16)
3. Run the installer
4. During installation, remember the password you set for the `postgres` user
5. PostgreSQL will start automatically

**pgAdmin**:
1. Go to https://www.pgadmin.org/download/pgadmin-4-macos/
2. Download the installer
3. Run the installer
4. pgAdmin will open in your browser

### Option 3: Postgres.app (Simplest for macOS)

1. Download from https://postgresapp.com/
2. Drag to Applications
3. Open Postgres.app
4. Click "Initialize" to create a new database server
5. Click "Open psql" to access the command line

**pgAdmin** (still install separately):
```bash
# Download from https://www.pgadmin.org/download/pgadmin-4-macos/
```

## Verify Installation

### Check PostgreSQL is running:
```bash
psql --version
# Should show: psql (PostgreSQL) 15.x or 16.x
```

### Connect to PostgreSQL:
```bash
psql postgres
# Or if you set a password:
psql -U postgres
```

### Create your database:
```sql
CREATE DATABASE teenlifemanager;
\q
```

## Configure Backend

### Update `.env` file:

```bash
cd backend
cp .env.example .env
```

Edit `.env` and set:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/teenlifemanager?schema=public"
```

**Replace `YOUR_PASSWORD` with the password you set during PostgreSQL installation.**

### Common Connection Strings:

**Default (no password)**:
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

## Setup Database Schema

```bash
cd backend

# Generate Prisma Client
npm run prisma:generate

# Run migrations (creates all tables)
npm run prisma:migrate

# Optional: Open Prisma Studio to view data
npm run prisma:studio
```

## Using pgAdmin

### First Time Setup:

1. **Open pgAdmin** (from Applications or command line)

2. **Add Server**:
   - Right-click "Servers" → "Create" → "Server"
   - **General Tab**:
     - Name: `TeenLifeManager` (or any name)
   - **Connection Tab**:
     - Host: `localhost`
     - Port: `5432`
     - Database: `postgres` (or `teenlifemanager`)
     - Username: `postgres`
     - Password: (your password)
   - Click "Save"

3. **View Database**:
   - Expand Servers → TeenLifeManager → Databases → teenlifemanager
   - You'll see all your tables after running migrations

### Useful pgAdmin Features:

- **Query Tool**: Run SQL queries
- **View Data**: Browse table data
- **Edit Data**: Modify records visually
- **Backup/Restore**: Database management

## Troubleshooting

### PostgreSQL not running:

**macOS (Homebrew)**:
```bash
brew services start postgresql@15
```

**macOS (Postgres.app)**:
- Open Postgres.app from Applications

**macOS (Installer)**:
```bash
# Check status
pg_ctl -D /usr/local/var/postgres status

# Start
pg_ctl -D /usr/local/var/postgres start
```

### Connection refused:

1. Check PostgreSQL is running:
```bash
psql postgres
```

2. Check port 5432 is not blocked:
```bash
lsof -i :5432
```

### Wrong password:

Reset password (macOS):
```bash
psql postgres
ALTER USER postgres WITH PASSWORD 'newpassword';
\q
```

Then update `.env` file.

### Can't find psql command:

Add PostgreSQL to PATH:

**Homebrew**:
```bash
echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**Installer** (default location):
```bash
echo 'export PATH="/Library/PostgreSQL/15/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

## Quick Start Commands

```bash
# Start PostgreSQL (if stopped)
brew services start postgresql@15

# Connect to database
psql teenlifemanager

# View all databases
psql -l

# Create database (if needed)
createdb teenlifemanager

# Delete database (careful!)
dropdb teenlifemanager
```

## Next Steps

Once PostgreSQL is installed and running:

1. ✅ Update `backend/.env` with your connection string
2. ✅ Run `npm run prisma:generate` in backend folder
3. ✅ Run `npm run prisma:migrate` to create tables
4. ✅ Start backend: `npm run dev`
5. ✅ Open pgAdmin to view your database

## Resources

- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **pgAdmin Docs**: https://www.pgadmin.org/docs/
- **Prisma Docs**: https://www.prisma.io/docs/

