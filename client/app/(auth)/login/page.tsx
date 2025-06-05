import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";
import BackgroundPaths from "@/components/BackgroundPaths";

export const metadata: Metadata = {
  title: "Login | Your App Name",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      {/* Ар талд хөдөлгөөнт зураасууд */}
      <BackgroundPaths />

      {/* Гол контент */}
      <div className="relative z-10 flex items-center justify-center p-4 min-h-screen">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
