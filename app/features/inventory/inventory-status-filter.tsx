import { useSearchParams } from 'react-router';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { InventoryStatus } from '~/generated/prisma/enums';

const statusOptions = [
  { value: 'all', label: 'All Items' },
  { value: InventoryStatus.IN_STOCK, label: 'In Stock' },
  { value: InventoryStatus.LOW_IN_STOCK, label: 'Low Stock' },
  { value: InventoryStatus.OUT_OF_STOCK, label: 'Out of Stock' },
];

export function InventoryStatusFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentStatus = searchParams.get('status') || 'all';

  const handleStatusChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value === 'all') {
      newParams.delete('status');
    } else {
      newParams.set('status', value);
    }
    
    newParams.delete('page');
    
    setSearchParams(newParams, { replace: true });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Status:</span>
      <Select value={currentStatus} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}