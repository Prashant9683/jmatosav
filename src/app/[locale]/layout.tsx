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

export default async function LocaleLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;

  return (
    <AuthProvider>
      <I18nClientProvider locale={locale}>
        <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/95 backdrop-blur-lg shadow-sm">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link
              href={`/${locale}`}
              className="text-2xl font-bold text-black transition-colors hover:text-gray-700"
            >
              Jalore Mahotsav
            </Link>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <HeaderActions />
            </div>
          </div>
        </header>
        <main>{children}</main>
        <Footer />
      </I18nClientProvider>
    </AuthProvider>
  );
}
