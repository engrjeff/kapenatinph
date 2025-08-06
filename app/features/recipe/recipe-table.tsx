import { ChefHatIcon } from 'lucide-react';
import { Link } from 'react-router';
import { Badge } from '~/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { cn, formatCurrency } from '~/lib/utils';
import { RecipeRowActions } from './recipe-row-actions';

type RecipeWithDetails = {
  id: string;
  name: string;
  description: string | null;
  totalCost: number;
  prepTimeMinutes: number | null;
  isActive: boolean;
  product?: { name: string; category: { name: string } } | null;
  productVariant?: {
    title: string;
    product: { name: string; category: { name: string } };
  } | null;
  _count: { ingredients: number };
};

export function RecipeTable({ data }: { data: Array<RecipeWithDetails> }) {
  return (
    <>
      <div className="overflow-x-auto border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-accent">
              <TableHead>#</TableHead>
              <TableHead>Recipe Name</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Ingredients</TableHead>
              <TableHead>Prep Time</TableHead>
              <TableHead>Total Cost</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-3 p-2 rounded-full bg-muted/50 dark:bg-muted/20">
                      <ChefHatIcon className="size-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      No recipes found
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Create your first recipe to get started
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((recipe, index) => (
                <TableRow key={recipe.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Link
                        to={`/recipes/${recipe.id}`}
                        className="font-medium hover:underline"
                      >
                        {recipe.name}
                      </Link>
                      {recipe.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {recipe.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {recipe.product && (
                        <div className="text-sm">
                          <div className="font-medium">
                            {recipe.product.name}
                          </div>
                        </div>
                      )}
                      {recipe.productVariant && (
                        <div className="text-sm">
                          <div className="text-xs text-muted-foreground">
                            {recipe.productVariant.title} •{' '}
                            {recipe.productVariant.product.category.name}
                          </div>
                        </div>
                      )}
                      {!recipe.product && !recipe.productVariant && (
                        <span className="text-sm text-muted-foreground">
                          No product linked
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {recipe._count.ingredients} ingredient
                      {recipe._count.ingredients !== 1 ? 's' : ''}
                    </span>
                  </TableCell>
                  <TableCell>
                    {recipe.prepTimeMinutes ? (
                      <span className="text-sm">{recipe.prepTimeMinutes}m</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Not set
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {formatCurrency(recipe.totalCost)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={recipe.isActive ? 'default' : 'secondary'}
                      className={cn(
                        recipe.isActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400'
                      )}
                    >
                      {recipe.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <RecipeRowActions recipe={recipe} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
