import { requireAuth } from '~/lib/utils.server';
import type { Route } from './+types/products';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Products | Kape Natin PH' }];
}

export async function loader(args: Route.LoaderArgs) {
  const userId = await requireAuth(args);
  return { testsss: userId };
}

export default function ProductsPage() {
  return <div>ProductsPage</div>;
}
