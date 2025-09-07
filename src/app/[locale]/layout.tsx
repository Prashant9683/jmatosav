import type { ReactNode } from "react";
import I18nClientProvider from "@/components/I18nClientProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import "./../globals.css";

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
        <I18nClientProvider locale={locale}>
          <header className="p-4 bg-gray-800 text-white flex justify-between items-center">
            <h1 className="text-xl font-bold">Jalore Mahotsav</h1>
            <LanguageSwitcher />
          </header>
          <main>{children}</main>
        </I18nClientProvider>
      </body>
    </html>
  );
}
