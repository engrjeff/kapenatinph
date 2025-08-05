import { SignUp } from '@clerk/react-router';
import type { Route } from './+types/sign-up';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Sign Up | Kape Natin PH' }];
}

export default function SignUpPage() {
  return (
    <div className="flex flex-col justify-center items-center py-10">
      <SignUp />
    </div>
  );
}
