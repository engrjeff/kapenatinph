import { MoreVerticalIcon } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { RecipeDeleteDialog } from './recipe-delete-dialog';

interface RecipeRowActionsProps {
  recipe: {
    id: string;
    name: string;
  };
}

export function RecipeRowActions({ recipe }: RecipeRowActionsProps) {
  const [action, setAction] = useState<'delete'>();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <MoreVerticalIcon />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem asChild>
            <Link to={`/recipes/${recipe.id}`}>View</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={`/recipes/${recipe.id}/edit`}>Edit</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setAction('delete')}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RecipeDeleteDialog
        recipe={recipe}
        open={action === 'delete'}
        onOpenChange={(open) => {
          if (!open) {
            setAction(undefined);
          }
        }}
      />
    </>
  );
}