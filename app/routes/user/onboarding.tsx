import { redirect } from 'react-router';
import { createStoreSchema } from '~/features/store/schema';
import { StoreForm } from '~/features/store/store-form';
import { DEFAULT_CATEGORIES } from '~/lib/constants';
import prisma from '~/lib/prisma';
import { requireAuth } from '~/lib/utils.server';
import type { Route } from './+types/onboarding';

export function meta() {
  return [{ title: 'Welcome | Kape Natin PH' }];
}

export async function loader(args: Route.LoaderArgs) {
  const userId = await requireAuth(args);

  const store = await prisma.store.findFirst({ where: { userId } });

  if (store) {
    return redirect('/dashboard');
  }

  return null;
}

export async function action(args: Route.ActionArgs) {
  const userId = await requireAuth(args);

  const data = await args.request.formData();

  const validatedData = createStoreSchema.safeParse(
    Object.fromEntries(data.entries())
  );

  if (!validatedData.success) {
    return {
      errors: validatedData.error.format(),
    };
  }

  const store = await prisma.store.create({
    data: {
      ...validatedData.data,
      userId,
    },
  });

  // create default categories
  if (store?.id) {
    const categories = await prisma.category.createMany({
      data: DEFAULT_CATEGORIES.map((cat) => ({
        ...cat,
        userId,
      })),
    });
  }

  redirect('/dashboard');
}

function OnboardingPage() {
  return (
    <div className="space-y-6 py-6 container mx-auto max-w-md">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Welcome to KapeNatin PH!</h1>
        <p className="text-sm text-muted-foreground">
          We&apos;re so glad to have you on board.
        </p>
      </div>

      <p className="text-center">
        Get started by telling us some information about your store.
      </p>

      <StoreForm />
    </div>
  );
}

export default OnboardingPage;
