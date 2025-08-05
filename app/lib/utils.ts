import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export function generateSku(fromStr: string, ...others: string[]) {
  return fromStr
    .replaceAll('-', ' ')
    .split(' ')
    .filter(Boolean)
    .map((s) => s.slice(0, 3).toUpperCase())
    .concat(...others.map((o) => o.substring(0, 3).toUpperCase()))
    .join('-');
}
