# Kape Natin PH

A modern coffee shop management system built with React Router, designed for Filipino coffee businesses to manage products, inventory, and operations efficiently.

## Tech Stack

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Zod](https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white)
![Clerk](https://img.shields.io/badge/clerk-%23553C9A.svg?style=for-the-badge&logo=clerk&logoColor=white)
![Radix UI](https://img.shields.io/badge/radix%20ui-161618.svg?style=for-the-badge&logo=radix-ui&logoColor=white)

## Features

- ☕ **Product Management**: Create and manage coffee products with variants (size, temperature, milk options)
- 📦 **Inventory Tracking**: Monitor stock levels, reorder points, and inventory status
- 📋 **Recipe Management**: Create and manage recipes with ingredients and instructions
- 🏪 **Store Management**: Multi-store support with category organization
- 🔧 **Variant Generation**: Automatic combination generation for product options
- 🔐 **Authentication**: Secure user authentication with Clerk
- 📊 **Dashboard Analytics**: Sales overview and inventory status tracking
- 🎨 **Modern UI**: Radix UI components with Tailwind CSS styling
- 🚀 **Server-side Rendering**: Built on React Router v7 with SSR
- ⚡️ **Hot Module Replacement**: Fast development with HMR
- 🔒 **Type Safety**: Full TypeScript integration with Zod validation

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:3000`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fremix-run%2Freact-router-templates%2Ftree%2Fmain%2Fvercel&project-name=my-react-router-app&repository-name=my-react-router-app)

## Project Structure

```
app/
├── features/           # Feature-based modules
│   ├── product/       # Product management
│   ├── inventory/     # Inventory tracking
│   ├── recipe/        # Recipe management
│   ├── product-category/ # Category management
│   └── store/         # Store configuration
├── components/        # Reusable UI components
│   ├── ui/           # Radix UI-based components
│   └── layouts/      # Layout components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── routes/           # React Router v7 file-based routing
│   ├── site/         # Public marketing pages
│   └── user/         # Protected application pages
└── generated/        # Prisma generated client
```

## Key Features

### Product Variant Generation

The system includes a powerful `generateCombinations` function that automatically creates all possible product variants from options like size, temperature, and milk type. For detailed documentation, see [`/docs/generateCombinations-function.md`](./docs/generateCombinations-function.md).

### Database Schema

Built with Prisma ORM supporting:
- Products with optional variants and SKU generation
- Inventory management with reorder levels and status tracking
- Recipe management with ingredient tracking and instructions
- Product categories and store management
- User authentication and multi-tenant data isolation
- Comprehensive relationship mapping between entities

## API Routes

- `/user/products` - Product management with CRUD operations
- `/user/inventory` - Inventory tracking and management
- `/user/recipes` - Recipe creation and ingredient management
- `/user/product-categories` - Category organization
- `/user/dashboard` - Analytics and overview

## Documentation

- [generateCombinations Function](./docs/generateCombinations-function.md) - Detailed documentation of the variant combination generator

## Development

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or pnpm package manager

### Environment Variables

Copy `.env.example` to `.env` and configure:
```bash
DATABASE_URL="postgresql://..."
CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
```

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## Styling

Built with [Tailwind CSS](https://tailwindcss.com/) v4 and [Radix UI](https://radix-ui.com/) components for a modern, accessible design system.

---

Built with ❤️ using React Router for Filipino coffee entrepreneurs.
