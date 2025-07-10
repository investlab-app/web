/**
 * Utilities to manage authentication provided by Clerk.
 *
 * A lot of utilities directly use the Clerk frontend and backend API since:
 * - The `@clerk/clerk-react` package cannot be used in this `Playwright`
 *   (non-React) environment, so its hooks and utilities are unavailable.
 * - The `@clerk/clerk-js` is also hard to use in this environment.
 */

import { v4 as uuidv4 } from 'uuid';
import type { Cookie, Page } from '@playwright/test';

export const getRandomClerkTestEmail = () => {
  const randomStr = uuidv4();
  return `${randomStr}+clerk_test@example.com`;
};

export const cleanClerkUser = async (userId: string) => {
  const clerkSecretKey = process.env.CLERK_SECRET_KEY;

  if (!clerkSecretKey) {
    throw new Error('CLERK_SECRET_KEY env var required');
  }

  const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${clerkSecretKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete user', { cause: response });
  }
};

export const cleanCurrentClerkUser = async (page: Page) => {
  const frontendApiUrl = process.env.CLERK_FRONTEND_API_URL;

  if (!frontendApiUrl) {
    throw new Error('CLERK_FRONTEND_API_URL env var required');
  }

  await page.waitForTimeout(100);

  const cookies = await page.context().cookies();

  const clerkDbJwt = cookies.find(
    (cookie: Cookie) => cookie.name === '__clerk_db_jwt'
  )?.value;

  if (!clerkDbJwt) {
    throw new Error('Clerk DB JWT not found');
  }

  const searchParams = new URLSearchParams({
    __clerk_db_jwt: clerkDbJwt,
  });

  const getMeResponse = await fetch(
    `${frontendApiUrl}/v1/me?${searchParams.toString()}`
  );

  if (!getMeResponse.ok) {
    throw new Error('Failed to get current user', { cause: getMeResponse });
  }

  const user = await getMeResponse.json();

  const userId = user.response.id;

  if (!userId) {
    throw new Error('User ID not found');
  }

  await cleanClerkUser(userId);
};

interface ClerkUser {
  external_id?: string;
  first_name?: string;
  last_name?: string;
  email_address: Array<string>;
  phone_number?: Array<string>;
  web3_wallet?: Array<string>;
  username?: string;
  password?: string;
  password_digest?: string;
  password_hasher?: string;
  skip_password_checks?: boolean;
  skip_password_requirement?: boolean;
  totp_secret: null;
  backup_codes: [];
  public_metadata: Record<string, unknown>;
  private_metadata: Record<string, unknown>;
  unsafe_metadata: Record<string, unknown>;
  delete_self_enabled: true;
  legal_accepted_at: null;
  skip_legal_checks: true;
  create_organization_enabled: true;
  create_organizations_limit: 0;
  created_at: null;
}

export const createClerkUser = async (clerkUser?: ClerkUser) => {
  const clerkSecretKey = process.env.CLERK_SECRET_KEY;

  if (!clerkSecretKey) {
    throw new Error('CLERK_SECRET_KEY env var required');
  }

  const user = {
    ...clerkUser,
    first_name: clerkUser?.first_name || 'E2E_CLERK_USER_FIRSTNAME',
    last_name: clerkUser?.last_name || 'E2E_CLERK_USER_LASTNAME',
    email_address: clerkUser?.email_address || [getRandomClerkTestEmail()],
    password: clerkUser?.password || uuidv4(),
  };

  const response = await fetch(`https://api.clerk.com/v1/users`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${clerkSecretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    console.error('Failed to create user', responseBody);
    throw new Error('Failed to create user', { cause: responseBody });
  }

  const userId = responseBody.id;

  return {
    ...user,
    id: userId,
  };
};
