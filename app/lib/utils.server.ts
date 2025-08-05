import { getAuth } from '@clerk/react-router/ssr.server';
import {
  parsePath,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from 'react-router';

/**
 * Utility function to get the authenticated user ID from loader/action args.
 * Throws an error if the user is not authenticated.
 */
export async function requireAuth(
  args: LoaderFunctionArgs | ActionFunctionArgs
): Promise<string> {
  const { userId } = await getAuth(args);

  if (!userId) {
    throw new Response('Unauthorized', { status: 401 });
  }

  return userId;
}

/**
 * Utility function to get the authenticated user ID from loader/action args.
 * Throws an error if the user is not authenticated.
 */
export async function protect(
  args: LoaderFunctionArgs | ActionFunctionArgs
): Promise<string> {
  const { pathname } = parsePath(args.request.url);

  const { userId } = await getAuth(args);

  if (!userId) {
    const signInUrl = new URL('/sign-in', args.request.url);

    signInUrl.searchParams.set('redirectTo', pathname ?? '/dashboard');

    throw redirect(signInUrl.toString());
  }

  return userId;
}

/**
 * Utility function to optionally get the authenticated user ID.
 * Returns null if the user is not authenticated instead of throwing.
 */
export async function getOptionalAuth(
  args: LoaderFunctionArgs | ActionFunctionArgs
): Promise<string | null> {
  const { userId } = await getAuth(args);
  return userId || null;
}

export function getSkip({ limit, page }: { limit?: number; page?: number }) {
  const _limit = limit ?? 12;
  const _page = page ?? 1;

  return _limit * (_page - 1);
}
