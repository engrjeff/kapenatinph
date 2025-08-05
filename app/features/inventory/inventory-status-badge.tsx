import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { InventoryStatus } from '~/generated/prisma/enums';

export const InventoryStatusBadge = ({
  status,
}: {
  status: InventoryStatus;
}) => {
  switch (status) {
    case InventoryStatus.IN_STOCK:
      return (
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          In Stock
        </Badge>
      );
    case InventoryStatus.LOW_IN_STOCK:
      return (
        <Badge
          variant="secondary"
          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
        >
          <AlertTriangle className="w-3 h-3 mr-1" />
          Low Stock
        </Badge>
      );
    case InventoryStatus.OUT_OF_STOCK:
      return (
        <Badge
          variant="secondary"
          className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
        >
          <XCircle className="w-3 h-3 mr-1" />
          Out of Stock
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};
