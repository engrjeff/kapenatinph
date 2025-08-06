import { SignedIn, UserButton, useUser } from '@clerk/clerk-react';
import { data, redirect } from 'react-router';
import z from 'zod';
import { AppFooter } from '~/components/app-footer';
import { ThemeToggler } from '~/components/theme-toggler';
import { createStoreSchema } from '~/features/store/schema';
import { storeService } from '~/features/store/service';
import { StoreForm } from '~/features/store/store-form';
import { DEFAULT_CATEGORIES } from '~/lib/constants';
import { handleActionError } from '~/lib/errorHandler';
import prisma from '~/lib/prisma';
import type { ActionResponse } from '~/lib/types';
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
  try {
    const userId = await requireAuth(args);

    const body = await args.request.json();

    const validatedData = createStoreSchema.safeParse(body);

    if (!validatedData.success) {
      return data(
        {
          errors: z.treeifyError(validatedData.error),
        },
        { status: 400 }
      );
    }

    const { intent, ...storeData } = validatedData.data;

    const store = await storeService.createStore(storeData, userId);

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
  } catch (error) {
    const errorResponse = handleActionError(error);

    const response: ActionResponse = {
      success: false,
      error: errorResponse.error,
      message: errorResponse.message,
      statusCode: errorResponse.statusCode,
      field: errorResponse.field,
    };

    return data(response, { status: errorResponse.statusCode });
  }
}

function OnboardingPage() {
  const { user, isLoaded } = useUser();

  return (
    <>
      <header className="flex items-center gap-4 h-16 px-6 py-2 border-b">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          {isLoaded && user ? <p>Hi, {user.fullName}!</p> : null}
          <div className="ml-auto flex items-center gap-2">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <ThemeToggler />
          </div>
        </div>
      </header>
      <main className="space-y-6 py-6 container mx-auto max-w-md">
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
      </main>
      <AppFooter />
    </>
  );
}

export default OnboardingPage;
