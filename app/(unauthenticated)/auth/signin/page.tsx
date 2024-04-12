import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="w-full h-screen bg-slate-950 flex justify-center items-center">
      <SignIn />
    </div>
  );
}
