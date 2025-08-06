import { SignIn } from '@clerk/react-router';

export function meta() {
  return [{ title: 'Sign In | Kape Natin PH' }];
}

export default function SignInPage() {
  return (
    <div className="flex py-20 justify-center items-center min-h-full">
      <SignIn signUpUrl={import.meta.env.CLERK_SIGN_UP_URL} />
    </div>
  );
}
