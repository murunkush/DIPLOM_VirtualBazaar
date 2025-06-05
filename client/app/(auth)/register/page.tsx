// app/register/page.tsx

import { RegisterForm } from "@/components/register-form";
import BackgroundPaths from "@/components/BackgroundPaths";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Your App Name",
  description: "Create an account to access your app",
};

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      {/* Ар талд хөдөлгөөнт зураасууд */}
      <BackgroundPaths />

      {/* Гол контент */}
      <div className="relative z-10 flex items-center justify-center p-4 min-h-screen">
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
