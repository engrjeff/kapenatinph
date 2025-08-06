import {
  ArrowLeftIcon,
  ClockIcon,
  PackageIcon,
  PencilIcon,
  TagIcon,
} from 'lucide-react';
import { data, Link } from 'react-router';
import { PageTitle } from '~/components/page-title';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { recipeService } from '~/features/recipe/service';
import { cn, formatCurrency } from '~/lib/utils';
import { requireAuth } from '~/lib/utils.server';
import type { Route } from './+types/recipes.$id';

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `Recipe Details | Kape Natin PH` }];
}

export async function loader(args: Route.LoaderArgs) {
  const userId = await requireAuth(args);
  const { id } = args.params;

  const recipe = await recipeService.getRecipeById(id, userId);

  if (!recipe) {
    throw new Response('Recipe not found', { status: 404 });
  }

  return data({ recipe });
}

export default function RecipeDetailsPage({
  loaderData,
}: Route.ComponentProps) {
  const { recipe } = loaderData;

  return (
    <div className="space-y-6">
      <Button
        size="sm"
        variant="link"
        className="text-foreground px-0 has-[>svg]:px-0"
        asChild
      >
        <Link to="/recipes">
          <ArrowLeftIcon /> Back
        </Link>
      </Button>
      <div className="flex items-center justify-between">
        <PageTitle
          title={recipe.name}
          subtitle={recipe.description || 'Recipe details and ingredients'}
        />
        <Button asChild>
          <Link to={`/recipes/${recipe.id}/edit`}>
            <PencilIcon className="size-4 mr-2" />
            Edit Recipe
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recipe Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TagIcon className="size-5" />
                Recipe Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
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
                </div>

                {recipe.prepTimeMinutes && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Prep Time
                    </p>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="size-4 text-muted-foreground" />
                      <span className="text-sm">
                        {recipe.prepTimeMinutes} minutes
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Cost
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold font-mono">
                      {formatCurrency(recipe.totalCost)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Ingredients
                  </p>
                  <div className="flex items-center gap-2">
                    <PackageIcon className="size-4 text-muted-foreground" />
                    <span className="text-sm">
                      {recipe.ingredients.length} ingredient
                      {recipe.ingredients.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              {recipe.product && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Associated Product
                  </p>
                  <div className="text-sm">
                    <div className="font-medium">{recipe.product.name}</div>
                    <div className="text-muted-foreground">
                      {recipe.product.category.name}
                    </div>
                  </div>
                </div>
              )}

              {recipe.productVariant && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Associated Product Variant
                  </p>
                  <div className="text-sm">
                    <div className="font-medium">
                      {recipe.productVariant.product.name}
                    </div>
                    <div className="text-muted-foreground">
                      {recipe.productVariant.title} •{' '}
                      {recipe.productVariant.product.category.name}
                    </div>
                  </div>
                </div>
              )}

              {recipe.instructions && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Instructions
                  </p>
                  <div className="text-sm whitespace-pre-wrap bg-muted/50 p-3 rounded-md">
                    {recipe.instructions}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PackageIcon className="size-5" />
                Ingredients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-accent">
                      <TableHead>#</TableHead>
                      <TableHead>Ingredient</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Cost per Unit</TableHead>
                      <TableHead>Total Cost</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recipe.ingredients.map((ingredient, index) => {
                      const totalCost =
                        (ingredient.inventory.unitPrice /
                          ingredient.inventory.measurementPerUnit) *
                        ingredient.quantity;
                      return (
                        <TableRow key={ingredient.id}>
                          <TableCell className="font-medium">
                            {index + 1}
                          </TableCell>
                          <TableCell className="font-medium">
                            {ingredient.inventory.name}
                          </TableCell>
                          <TableCell className="font-mono">
                            {ingredient.quantity}
                            <span className="text-muted-foreground">
                              {ingredient.unit}
                            </span>
                          </TableCell>
                          <TableCell className="font-mono">
                            {formatCurrency(ingredient.inventory.unitPrice)}
                            <span className="text-xs text-muted-foreground">
                              /{ingredient.inventory.unit}
                            </span>
                          </TableCell>
                          <TableCell className="font-medium font-mono">
                            {formatCurrency(totalCost)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {ingredient.notes || '-'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="bg-accent hover:bg-accent">
                      <TableCell colSpan={3}></TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell className="font-mono">
                        {formatCurrency(recipe.totalCost)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary font-mono">
                  {formatCurrency(recipe.totalCost)}
                </div>
                <div className="text-sm text-muted-foreground">Total Cost</div>
              </div>

              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {recipe.ingredients.length}
                </div>
                <div className="text-sm text-muted-foreground">Ingredients</div>
              </div>

              {recipe.prepTimeMinutes && (
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {recipe.prepTimeMinutes}m
                  </div>
                  <div className="text-sm text-muted-foreground">Prep Time</div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recipe Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Created
                </p>
                <p className="text-sm">
                  {new Date(recipe.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Last Updated
                </p>
                <p className="text-sm">
                  {new Date(recipe.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
