import { ChevronDownIcon } from 'lucide-react';
import pluralize from 'pluralize';
import { Button } from '~/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import { RecipeIngredientsTable } from './recipe-ingredients-table';
import type { RecipeWithDetails } from './service';

export function RecipeIngredientsPopover({
  recipe,
}: {
  recipe: RecipeWithDetails;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          <span className="text-sm">
            {pluralize('ingredients', recipe._count.ingredients, true)}
          </span>
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <RecipeIngredientsTable
          totalCost={recipe.totalCost}
          ingredients={recipe.ingredients}
          hideNotes
        />
      </PopoverContent>
    </Popover>
  );
}
