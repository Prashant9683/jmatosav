"use client"; // This is the most important line. It declares this a Client Component.

import { I18nProviderClient } from "../../i18n/client";
import type { ReactNode } from "react";

// Define the properties the component will accept
interface Props {
  locale: string;
  children: ReactNode;
}

export default function I18nClientProvider({ locale, children }: Props) {
  return (
    <I18nProviderClient locale={locale} fallback={<p>Loading...</p>}>
      {children}
    </I18nProviderClient>
  );
}
