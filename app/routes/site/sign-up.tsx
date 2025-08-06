import { SignUp } from '@clerk/react-router';

export function meta() {
  return [{ title: 'Sign Up | Kape Natin PH' }];
}

export default function SignUpPage() {
  return (
    <div className="flex flex-col justify-center items-center py-10">
      <SignUp />
    </div>
  );
}
