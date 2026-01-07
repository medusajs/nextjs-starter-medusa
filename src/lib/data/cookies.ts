import "server-only"

import { headers, cookies as nextCookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { validateAndRefreshToken } from './auth';


/**
 * Get auth headers from cookie for server-side requests
 * Automatically validates and refreshes expired tokens
 */
export const getAuthHeaders = async (): Promise<{authorization: string; } | undefined> => {
  try {
    const cookies = await nextCookies();
    const token = cookies.get('_medusa_jwt')?.value;

    // If there's no valid token available, we want to destroy the supabase cookies and force reauthentication
    if (!token) {
      const redirectUrl = await getLoginRedirectUrl();
      redirect(redirectUrl);
    }

    // Validate and refresh token if needed
    const validToken = await validateAndRefreshToken(token);

    // If token validation/refreshing failed, clear
    if (!validToken) {
      await removeAuthToken();
      const redirectUrl = await getLoginRedirectUrl();
      redirect(redirectUrl);
    }

    return { authorization: `Bearer ${validToken}` };
  } catch {
    await removeAuthToken();
    const redirectUrl = await getLoginRedirectUrl();
    redirect(redirectUrl);
  }
};

/**
 * Helper to build login redirect URL with current page as ext parameter
 */
const getLoginRedirectUrl = async (): Promise<string> => {
  try {
    const headersList = await headers();
    // Try to get the current page from various headers
    const referer = headersList.get('referer');
    const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path');

    let currentPage = '/';

    if (referer) {
      // Extract pathname and search params from referer URL
      const url = new URL(referer);
      currentPage = url.pathname + url.search;
    } else if (pathname) {
      const searchParams = headersList.get('x-search-params') || '';
      currentPage = searchParams ? `${pathname}?${searchParams}` : pathname;
    }

    return `/login?next=${encodeURIComponent(currentPage)}`;
  } catch {
    return '/login';
  }
};

export const getCacheTag = async (tag: string): Promise<string> => {
  try {
    const cookies = await nextCookies()
    const cacheId = cookies.get("_medusa_cache_id")?.value

    if (!cacheId) {
      return ""
    }

    return `${tag}-${cacheId}`
  } catch (error) {
    return ""
  }
}

export const getCacheOptions = async (
  tag: string
): Promise<{ tags: string[] } | {}> => {
  if (typeof window !== "undefined") {
    return {}
  }

  const cacheTag = await getCacheTag(tag)

  if (!cacheTag) {
    return {}
  }

  return { tags: [`${cacheTag}`] }
}

export const setAuthToken = async (token: string) => {
  const cookies = await nextCookies()
  cookies.set("_medusa_jwt", token, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  })
}

export const removeAuthToken = async () => {
  const cookies = await nextCookies()
  cookies.set("_medusa_jwt", "", {
    maxAge: -1,
  })
}

export const getCartId = async () => {
  const cookies = await nextCookies()
  return cookies.get("_medusa_cart_id")?.value
}

export const setCartId = async (cartId: string) => {
  const cookies = await nextCookies()
  cookies.set("_medusa_cart_id", cartId, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  })
}

export const removeCartId = async () => {
  const cookies = await nextCookies()
  cookies.set("_medusa_cart_id", "", {
    maxAge: -1,
  })
}
