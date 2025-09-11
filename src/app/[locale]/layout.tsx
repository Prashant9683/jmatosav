import type { ReactNode } from "react";
import { AuthProvider } from "@/components/AuthProvider";
import I18nClientProvider from "@/components/I18nClientProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import HeaderActions from "@/components/HeaderActions";
import Link from "next/link";
import "./../globals.css";
import Footer from "@/components/Footer";

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
              <HeaderActions />
            </header>
            <main>{children}</main>
            <Footer />
          </I18nClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
