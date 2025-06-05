import NavbarWrapper from "@/components/NavbarWrapper";
import { getUser } from "@/lib/dal";
import "../globals.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <div className="min-h-screen bg-[#0f0c29] text-white relative overflow-hidden">
      {/* Cyberpunk Style Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="cyberpunk-background"></div>
      </div>

      <div className="relative z-10">
        <NavbarWrapper user={user} />
        {children}
      </div>
    </div>
  );
}