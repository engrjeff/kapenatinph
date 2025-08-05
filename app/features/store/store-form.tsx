import { zodResolver } from '@hookform/resolvers/zod';
import {
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from 'react-hook-form';
import { useFetcher } from 'react-router';
import { toast } from 'sonner';
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
import { createStoreSchema, type CreateStoreInputs } from './schema';

export function StoreForm() {
  const form = useForm<CreateStoreInputs>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: {
      name: '',
      address: '',
      email: '',
      phone: '',
      website: undefined,
      logoUrl: undefined,
    },
  });

  const fetcher = useFetcher();

  const onError: SubmitErrorHandler<CreateStoreInputs> = (errors) => {
    console.log(`Store Form Errors: `, errors);
  };

  const onSubmit: SubmitHandler<CreateStoreInputs> = async (data) => {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, String(value));
        }
      });

      fetcher.submit(formData, { method: 'POST' });

      // const result = await createStore(data);

      // if (result.id) {
      //   toast.success('Store saved!');

      //   // create default categories
      //   await createDefaultCategories();

      //   navigate('/inventory', { replace: true });
      // }
    } catch (error) {
      toast.error('Error');
    }
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
          <div className="pt-6">
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
