import type { ReactNode } from "react";
import I18nClientProvider from "@/components/I18nClientProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import "./../globals.css";
import HeaderActions from "@/components/HeaderActions";
import Link from "next/link";
import { AuthProvider } from "@/components/AuthProvider";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

interface RootLayoutProps {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;
  
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Check for an active user session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang={locale}>
      <body>
        <AuthProvider>
          <I18nClientProvider locale={locale}>
            <header className="p-4 bg-gray-800 text-white flex justify-between items-center">
              <Link href="/" className="text-xl font-bold">
                Jalore Mahotsav
              </Link>{" "}
              <LanguageSwitcher />
              <HeaderActions session={session} />
            </header>
            <main>{children}</main>
          </I18nClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
