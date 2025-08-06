# Claude Rules for Kape Natin PH

## Project Overview
This is a coffee shop management application built with React Router v7, TypeScript, Prisma, and Tailwind CSS. The app helps manage products, categories, inventory, and recipes for coffee shops.

## Technology Stack & Versions
- **React Router**: v7.7.1 (latest architecture with file-based routing)
- **React**: v19.1.0 
- **TypeScript**: v5.8.3
- **Database**: PostgreSQL with Prisma v6.13.0
- **UI Library**: Radix UI components with custom Tailwind styling
- **Forms**: React Hook Form v7.61.1 with Zod v4.0.14 validation
- **Authentication**: Clerk (v5.38.1)
- **Styling**: Tailwind CSS v4.1.4

## File Structure Conventions
```
app/
├── components/
│   ├── ui/           # Reusable UI components (Radix-based)
│   └── [feature]/    # Feature-specific components
├── features/
│   └── [domain]/     # Domain-specific modules
│       ├── schema.ts    # Zod validation schemas
│       ├── service.ts   # Data fetching/mutations
│       └── [name]-[type].tsx  # Components
├── hooks/            # Custom React hooks
├── lib/              # Utilities and configuration
├── routes/           # React Router v7 file-based routing
└── generated/        # Prisma generated client
```

## Code Patterns & Conventions

### Component Naming
- Use kebab-case for file names: `product-form.tsx`
- Use PascalCase for component names: `ProductForm`
- Prefix feature components with domain: `ProductForm`, `InventoryTable`

### Schema Validation (Zod)
- Always use Zod schemas for form validation
- Define schemas in `schema.ts` files within feature directories
- Use consistent error messages with `{ error: 'Field is required' }`
- Use `preprocess` for number fields to handle empty strings
- Include intent-based schemas for CRUD operations:
  ```typescript
  export const createProductSchema = productSchema.extend({
    intent: z.literal('create'),
  });
  ```

### Forms (React Hook Form)
- Use `zodResolver` for validation
- Always include `onError` handler for debugging
- Use `noValidate` on forms to rely on Zod validation
- Disable fieldset during loading states
- Submit JSON data with `encType: 'application/json'` for complex objects

### UI Components
- Use Radix UI primitives with custom Tailwind styling
- Follow shadcn/ui patterns for component composition
- Use `cn()` utility for conditional classes
- Include proper ARIA labels and accessibility attributes

### State Management
- Use React Hook Form for form state
- Use `useFieldArray` for dynamic form fields
- Leverage `useEffect` with form.watch for reactive updates
- Use local state for UI-specific concerns (toggles, modals)

### Data Fetching
- Use custom `useFetcherWithResponseHandler` hook
- Handle loading states with fetcher.state
- Include proper error handling in data mutations

### Database (Prisma)
- Generate client to `app/generated/prisma`
- Use cuid() for primary keys
- Include userId for multi-tenant data isolation
- Use proper indexes on foreign keys and query fields

### Styling Guidelines
- Use Tailwind CSS utility classes
- Follow responsive design patterns: `grid-cols-1 md:grid-cols-2`
- Use semantic color tokens: `text-muted-foreground`, `bg-destructive`
- Implement proper spacing with consistent gap/space values

### TypeScript Patterns
- Export type definitions from schema files
- Use proper typing for form inputs and API responses
- Leverage TypeScript strict mode settings
- Use path mapping with `~/*` for app imports

### Testing & Quality
- Run `npm run typecheck` after code changes
- Use TypeScript strict mode for type safety
- Follow ESLint and Prettier configurations when available

### Commit Message Patterns
Based on git history, follow these patterns:
- `feat:` for new features
- `fix:` for bug fixes  
- `update:` for improvements to existing features
- `wip:` or `wip(scope):` for work in progress
- Use descriptive messages that explain the change

### Environment Setup
- Use absolute imports with `~/*` path mapping
- Configure Vite with React Router plugin
- Use environment variables for database connections
- Ensure proper TypeScript configuration for React Router v7

## Domain-Specific Rules

### Product Management
- Products can have variants with multiple options (size, temperature, etc.)
- Use `generateSku()` utility for SKU generation
- Support both simple products and complex variant products
- Auto-generate variant combinations from options

### Inventory Management
- Track quantity, reorder levels, and unit prices
- Link inventory items to product categories
- Support different measurement units

### Authentication
- Use Clerk for user authentication
- Store userId with all user-specific data
- Implement proper multi-tenant data isolation

## Development Workflow
1. Run `npm run dev` for development server
2. Run `npm run typecheck` before committing
3. Use feature branches for new development
4. Follow the established commit message conventions