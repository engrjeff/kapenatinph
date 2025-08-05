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

## Features

- ☕ **Product Management**: Create and manage coffee products with variants (size, temperature, milk options)
- 📦 **Inventory Tracking**: Monitor stock levels, reorder points, and inventory status
- 🏪 **Store Management**: Multi-store support with category organization
- 🔧 **Variant Generation**: Automatic combination generation for product options
- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

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
│   ├── product-category/ # Category management
│   └── store/         # Store configuration
├── components/        # Reusable UI components
├── lib/              # Utility functions
└── routes/           # Application routes
```

## Key Features

### Product Variant Generation

The system includes a powerful `generateCombinations` function that automatically creates all possible product variants from options like size, temperature, and milk type. For detailed documentation, see [`/docs/generateCombinations-function.md`](./docs/generateCombinations-function.md).

### Database Schema

Built with Prisma ORM supporting:
- Products with optional variants
- Inventory management with reorder levels
- Product categories and store management
- Automatic SKU generation

## Documentation

- [generateCombinations Function](./docs/generateCombinations-function.md) - Detailed documentation of the variant combination generator

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router for Filipino coffee entrepreneurs.
