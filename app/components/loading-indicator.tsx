import { Loader2Icon } from 'lucide-react';
import { useNavigation } from 'react-router';

export function LoadingIndicator() {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);

  if (!isNavigating) return null;

  return (
    <span className="fixed right-4 top-4">
      <Loader2Icon
        strokeWidth={2}
        className="size-5 animate-spin text-primary"
      />
    </span>
  );
}
