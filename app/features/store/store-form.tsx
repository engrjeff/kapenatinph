import { zodResolver } from '@hookform/resolvers/zod';
import {
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { SubmitButton } from '~/components/ui/submit-button';
import { Textarea } from '~/components/ui/textarea';
import { useFetcherWithResponseHandler } from '~/hooks/useFetcherWithResponseHandler';
import { storeSchema, type StoreInputs } from './schema';

export function StoreForm() {
  const form = useForm<StoreInputs>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: '',
      address: '',
      email: '',
      phone: '',
      website: undefined,
      logoUrl: undefined,
    },
  });

  const fetcher = useFetcherWithResponseHandler<StoreInputs>();

  const onError: SubmitErrorHandler<StoreInputs> = (errors) => {
    console.log(`Store Form Errors: `, errors);
  };

  const onSubmit: SubmitHandler<StoreInputs> = async (data) => {
    fetcher.submit(
      { ...data, intent: 'create' },
      {
        method: 'POST',
        action: '/onboarding',
        encType: 'application/json',
      }
    );
  };

  return (
    <Form {...form}>
      <form
        noValidate
        className="pb-6"
        onSubmit={form.handleSubmit(onSubmit, onError)}
      >
        <fieldset
          disabled={fetcher.state === 'submitting'}
          className="space-y-4 disabled:opacity-90"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What is your coffee shop called?</FormLabel>
                <FormControl>
                  <Input autoFocus placeholder="Store name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Where is it located?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Store address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="mycoffeeshop@email.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Number</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    inputMode="tel"
                    placeholder="+639XXXXXXXXX"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    inputMode="url"
                    placeholder="https://mycoffeeshop.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="pt-4">
            <SubmitButton
              loading={fetcher.state === 'submitting'}
              className="w-full"
            >
              Save my Store
            </SubmitButton>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
