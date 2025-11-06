/**
 * Script to list all users in the database
 */

import prisma from '../src/config/database';

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        displayName: true,
        passwordHash: true,
        createdAt: true,
      },
    });

    console.log(`\nFound ${users.length} users:\n`);
    users.forEach((user, index) => {
      const hasPassword = user.passwordHash && user.passwordHash !== 'mock' ? '✅' : '❌';
      const passwordType = !user.passwordHash ? 'none' : user.passwordHash === 'mock' ? 'mock' : 'real';
      console.log(`${index + 1}. ${user.email} (${user.displayName}) ${hasPassword} [${passwordType}] - Created: ${user.createdAt}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error listing users:', error);
    process.exit(1);
  }
}

listUsers();

