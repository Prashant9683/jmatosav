"use client";

import { Button } from "@/components/ui/button";
import { useChangeLocale, useCurrentLocale } from "../../i18n/client";

export default function LanguageSwitcher() {
  const currentLocale = useCurrentLocale();
  const changeLocale = useChangeLocale();

  return (
    <div className="flex gap-1 p-1 bg-white border border-black/10 rounded-lg w-fit shadow-sm">
      <Button
        variant={currentLocale === "en" ? "default" : "ghost"}
        size="sm"
        onClick={() => changeLocale("en")}
        className={
          currentLocale === "en"
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-white text-black hover:bg-blue-50 hover:text-blue-600"
        }
      >
        English
      </Button>
      <Button
        variant={currentLocale === "hi" ? "default" : "ghost"}
        size="sm"
        onClick={() => changeLocale("hi")}
        className={
          currentLocale === "hi"
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-white text-black hover:bg-blue-50 hover:text-blue-600"
        }
      >
        हिन्दी
      </Button>
    </div>
  );
}
