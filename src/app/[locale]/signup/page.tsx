import { AuthForm } from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <AuthForm mode="signup" />
      </div>
    </div>
  );
}
