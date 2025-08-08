import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import type { Inventory, RecipeIngredient } from '~/generated/prisma/client';
import { formatCurrency } from '~/lib/utils';

export function RecipeIngredientsTable({
  totalCost,
  ingredients,
  hideNotes,
}: {
  totalCost: number;
  ingredients: Array<RecipeIngredient & { inventory: Inventory }>;
  hideNotes?: boolean;
}) {
  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow className="bg-accent">
            <TableHead>#</TableHead>
            <TableHead>Ingredient</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Total Cost</TableHead>
            {hideNotes ? null : <TableHead>Notes</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {ingredients.map((ingredient, index) => {
            const totalCost =
              (ingredient.inventory.unitPrice /
                ingredient.inventory.amountPerUnit) *
              ingredient.quantity;
            return (
              <TableRow key={ingredient.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
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
                  {formatCurrency(
                    ingredient.inventory.unitPrice /
                      ingredient.inventory.amountPerUnit
                  )}
                  <span className="text-xs text-muted-foreground">
                    /{ingredient.inventory.unit}
                  </span>
                </TableCell>
                <TableCell className="font-medium font-mono">
                  {formatCurrency(totalCost)}
                </TableCell>
                {hideNotes ? null : (
                  <TableCell className="text-sm text-muted-foreground">
                    {ingredient.notes || '-'}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
          <TableRow className="bg-accent hover:bg-accent">
            <TableCell colSpan={3}></TableCell>
            <TableCell>Total</TableCell>
            <TableCell className="font-mono" colSpan={2}>
              {formatCurrency(totalCost)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
