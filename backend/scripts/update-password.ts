/**
 * Script to update a user's password hash
 * Usage: npx ts-node scripts/update-password.ts <email> <newPassword>
 */

import bcrypt from 'bcrypt';
import prisma from '../src/config/database';

async function updatePassword(email: string, newPassword: string) {
  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update user
    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { passwordHash },
    });

    console.log(`✅ Password updated successfully for ${email}`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating password:', error);
    process.exit(1);
  }
}

// Get command line arguments
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('Usage: npx ts-node scripts/update-password.ts <email> <newPassword>');
  process.exit(1);
}

updatePassword(email, password);

