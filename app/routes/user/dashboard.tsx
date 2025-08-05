import type { Route } from './+types/dashboard';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Dashboard | Kape Natin PH' }];
}

export default function DashboardPage() {
  return <div>DashboardPage</div>;
}
