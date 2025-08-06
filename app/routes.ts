import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes';

export default [
  layout('routes/site/site-layout.tsx', [
    index('routes/site/home.tsx'),
    route('sign-in/*', 'routes/site/sign-in.tsx'),
    route('sign-up/*', 'routes/site/sign-up.tsx'),
  ]),
  route('onboarding', 'routes/user/onboarding.tsx'),
  layout('routes/user/user-pages-layout.tsx', [
    route('dashboard', 'routes/user/dashboard.tsx'),

    route('inventory', 'routes/user/inventory.tsx'),
    route('inventory/new', 'routes/user/inventory-new.tsx'),
    route('inventory/:id', 'routes/user/inventory-details.tsx'),

    route('products', 'routes/user/products.tsx'),
    route('products/new', 'routes/user/products.new.tsx'),
    route('products/:id/edit', 'routes/user/products.$id.edit.tsx'),

    route('product-categories', 'routes/user/product-categories.tsx'),

    route('recipes', 'routes/user/recipes.tsx'),
    route('recipes/new', 'routes/user/recipes.new.tsx'),
    route('recipes/:id', 'routes/user/recipes.$id.tsx'),
    route('recipes/:id/edit', 'routes/user/recipes.$id.edit.tsx'),

    route('sales', 'routes/user/sales.tsx'),
  ]),
] satisfies RouteConfig;
