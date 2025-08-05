import { useEffect } from 'react';
import { type FieldValues, type UseFormReturn } from 'react-hook-form';
import { useFetcher, useNavigate } from 'react-router';
import { toast } from 'sonner';
import type { ActionResponse } from '~/lib/types';

interface UseFetcherActionResponseHandlerArgs<
  TFormValues extends FieldValues = FieldValues,
> {
  redirectTo?: string;
  form?: UseFormReturn<TFormValues>;
}

export function useFetcherWithResponseHandler<
  TFormValues extends FieldValues = FieldValues,
>(args?: UseFetcherActionResponseHandlerArgs<TFormValues>) {
  const navigate = useNavigate();

  const fetcher = useFetcher<ActionResponse>();

  const actionData = fetcher.data;

  // Handle action response
  useEffect(() => {
    if (actionData) {
      // handle errors
      if (actionData.success === false) {
        const error = actionData.message;

        if (actionData.field) {
          args?.form?.setError(actionData.field as any, { message: error });
        }

        toast.error(error);
        return;
      }

      if (actionData.success) {
        let message = 'Success!';

        if (actionData?.intent === 'create') message = 'Successfully created!';
        if (actionData?.intent === 'update') message = 'Successfully updated!';
        if (actionData?.intent === 'delete') message = 'Successfully deleted!';

        // Show success toast
        toast.success(message);
        // Navigate to redirectTo url
        if (args?.redirectTo) {
          navigate(args?.redirectTo);
        }
      }
    }
  }, [actionData, navigate]);

  return fetcher;
}
