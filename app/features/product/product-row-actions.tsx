import { CopyIcon, EditIcon, MoreHorizontalIcon } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

export function ProductRowActions({ productId }: { productId: string }) {
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
            <MoreHorizontalIcon />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuItem asChild>
            <Link to={`/products/${productId}/edit`}>
              <EditIcon /> Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={`/products/new?duplicateId=${productId}`}>
              <CopyIcon /> Make a copy
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
