'use server';

import { getSelf } from '@/api/users';
import { type User } from '@/types/user';

/**
 * Retrieves the user from the server.
 * @returns The user if found, otherwise null.
 */
export async function getUserServerSide(): Promise<User | null> {
  try {
    return await getSelf();
  } catch (error) {
    console.error('Failed to get user role:', error);
    return null;
  }
}
