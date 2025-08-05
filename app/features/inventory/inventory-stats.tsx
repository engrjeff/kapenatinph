import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { Card, CardContent } from '~/components/ui/card';
import { cn, formatDate } from '~/lib/utils';

interface InventoryStatsProps {
  lowInStockCount: number;
  inStockCount: number;
  outOfStockCount: number;
}

export function InventoryStats({
  lowInStockCount,
  inStockCount,
  outOfStockCount,
}: InventoryStatsProps) {
  const statsData = [
    {
      label: 'In Stock',
      icon: CheckCircle,
      value: inStockCount,
      iconColor: 'text-green-800 dark:text-green-400',
      badgeClass:
        'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    },
    {
      label: 'Low in Stock',
      icon: AlertTriangle,
      value: lowInStockCount,
      iconColor: 'text-yellow-800 dark:text-yellow-400',
      badgeClass:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    },
    {
      label: 'Out of Stock',
      icon: XCircle,
      value: outOfStockCount,
      iconColor: 'text-red-800 dark:text-red-400',
      badgeClass:
        'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Cards */}
      {statsData.map((stat) => (
        <Card key={`inventory-stat-${stat.label}`} className="py-4 shadow-none">
          <CardContent className="flex flex-col h-full px-4">
            {/* Title & Badge */}
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={cn('size-4', stat.iconColor)} />
              <Badge className={cn('px-2 py-1 rounded-full', stat.badgeClass)}>
                {stat.label}
              </Badge>
            </div>
            {/* Value & Date */}
            <div className="flex-1 flex flex-col justify-between grow">
              {/* Value */}
              <div>
                <div className="text-base font-medium mb-1">{stat.label}</div>
                <div>
                  <span className="text-sm font-bold">{stat.value}</span>{' '}
                  <span className="text-xs text-muted-foreground">
                    {stat.value <= 1 ? 'item' : 'items'}
                  </span>
                </div>
              </div>
              <div className="pt-3 hidden border-t border-muted text-xs text-muted-foreground font-medium">
                As of {formatDate(new Date().toISOString())}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
