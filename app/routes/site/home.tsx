import { useUser } from '@clerk/clerk-react';
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Kape Natin PH' },
    { name: 'description', content: 'Simple Coffee Shop Management system.' },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: 'Hello from Vercel' };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { isSignedIn, user, isLoaded } = useUser();

  return <h1>Hello, {user?.fullName}</h1>;
}
