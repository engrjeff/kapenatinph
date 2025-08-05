import type { Route } from './+types/sales';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Sales | Kape Natin PH' }];
}

export default function SalesPage() {
  return <div>SalesPage</div>;
}
