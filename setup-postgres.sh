#!/bin/bash

# PostgreSQL 17 Setup Script
# Run this script to set up PostgreSQL for Teen Life Manager

set -e

echo "🚀 Setting up PostgreSQL 17..."

# Add PostgreSQL to PATH
POSTGRES_PATH=$(brew --prefix postgresql@17)/bin
export PATH="$POSTGRES_PATH:$PATH"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL not found in PATH"
    echo "Adding to PATH..."
    echo 'export PATH="$(brew --prefix postgresql@17)/bin:$PATH"' >> ~/.zshrc
    source ~/.zshrc
    export PATH="$(brew --prefix postgresql@17)/bin:$PATH"
fi

# Verify PostgreSQL version
echo "✅ PostgreSQL version:"
psql --version

# Start PostgreSQL service
echo "🔄 Starting PostgreSQL service..."
brew services start postgresql@17

# Wait a moment for service to start
sleep 2

# Check service status
echo "📊 Service status:"
brew services list | grep postgresql || echo "Service check failed"

# Create database
echo "📦 Creating database 'teenlifemanager'..."
createdb teenlifemanager 2>/dev/null && echo "✅ Database created!" || echo "⚠️  Database may already exist (that's okay)"

# Verify database exists
echo "🔍 Verifying database..."
psql -l | grep teenlifemanager && echo "✅ Database 'teenlifemanager' exists!" || echo "❌ Database not found"

echo ""
echo "✅ PostgreSQL setup complete!"
echo ""
echo "Next steps:"
echo "1. Create backend/.env file with:"
echo "   DATABASE_URL=\"postgresql://postgres@localhost:5432/teenlifemanager?schema=public\""
echo ""
echo "2. Run: cd backend && npm run prisma:generate"
echo "3. Run: cd backend && npm run prisma:migrate"
echo "4. Run: cd backend && npm run dev"


