import Navbar from "@/components/navbar";
import { getUser } from "@/lib/dal";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getUser();
  return (
      <>
        <Navbar user={user} />
         {children}
      </>
  );
}
