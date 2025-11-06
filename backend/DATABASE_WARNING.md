# ⚠️ Database Migration Warning

## Never Use `prisma db push --force-reset`

**This command will DELETE ALL YOUR DATA!**

The `--force-reset` flag drops all tables and recreates them, which means:
- ❌ All users are deleted
- ❌ All volunteer hours are deleted
- ❌ All organizations are deleted
- ❌ All events, mood entries, journal entries are deleted
- ❌ Everything is lost!

## Safe Migration Commands

### For Development (creates migration files)
```bash
npm run prisma:migrate
```

This will:
1. Create a migration file in `prisma/migrations/`
2. Apply it to your database
3. **Preserve all existing data**

### For Production (applies existing migrations)
```bash
npm run prisma:deploy
```

This applies migrations without creating new ones.

## When to Use `prisma db push`

**Only use `prisma db push` (without `--force-reset`) when:**
- You're in early development with no important data
- You're prototyping and don't care about data loss
- You're working on a fresh database

**Never use it when:**
- You have users registered
- You have any data you want to keep
- You're in production or staging

## If You Accidentally Reset

If you accidentally ran `prisma db push --force-reset`:
1. Your data is gone (unless you have a backup)
2. Users will need to re-register
3. All volunteer hours, organizations, etc. are lost

## Best Practice

Always use migrations:
```bash
# Create and apply migration
npm run prisma:migrate

# This creates a file like: prisma/migrations/20241106_add_organization/migration.sql
# This file can be version controlled and applied to other environments
```

Migrations are:
- ✅ Version controlled
- ✅ Reversible
- ✅ Safe for production
- ✅ Preserve data

