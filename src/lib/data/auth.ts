'use server';

import jsonwebtoken from 'jsonwebtoken';
import { sdk } from "@lib/config"
import { setAuthToken } from './cookies';

interface DecodedJWT {
  exp?: number;
  sub?: string;
  [key: string]: unknown;
}

/**
 * Check if a JWT token is expired or will expire soon
 * @param token - The JWT token to validate
 * @param bufferSeconds - Number of seconds before expiry to consider token as expired (default: 60)
 * @returns true if token is expired or will expire within buffer time
 */
export async function isTokenExpired(token: string, bufferSeconds = 60): Promise<boolean> {
  try {
    const decoded = jsonwebtoken.decode(token) as DecodedJWT | null;

    if (!decoded || !decoded.exp) {
      console.info('No expiration claim means we should treat as expired');
      return true; // No expiration claim means we should treat as expired
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const expirationTime = decoded.exp - bufferSeconds;

    return currentTime >= expirationTime;
  } catch {
    return true; // If we can't decode, treat as expired
  }
}

/**
 * Refresh the Medusa authentication token using the SDK
 * This function attempts to refresh the token by calling the Medusa auth refresh endpoint
 * @param currentToken - The current JWT token
 * @returns The new token if successful, null otherwise
 */
export async function refreshMedusaToken(currentToken: string): Promise<string | null> {
  try {
    // Attempt to refresh the token using the Medusa SDK
    // The SDK should handle the refresh token logic internally
    const result = await sdk.client.fetch<{ token?: string }>('/auth/token/refresh', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (result.token) {
      // Update the token in the cookie
      await setAuthToken(result.token);
      // Update the SDK's internal token
      await sdk.client.setToken(result.token);
      return result.token;
    }

    return null;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
}

/**
 * Validate and refresh token if needed
 * @param token - The current JWT token
 * @returns Valid token (either the original or refreshed), null if refresh fails
 */
export async function validateAndRefreshToken(token: string): Promise<string | null> {
  // Check if token is expired or will expire soon
  const isExpired = await isTokenExpired(token);
  if (!isExpired) {
    return token; // Token is still valid
  }

  // Attempt to refresh the token
  const newToken = await refreshMedusaToken(token);

  if (!newToken) {
    console.warn('Failed to refresh expired token, user may need to re-authenticate');
    return null;
  }

  return newToken;
}
