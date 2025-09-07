"use client";

import { Button } from "@/components/ui/button";
import { useChangeLocale, useCurrentLocale } from "../../i18n/client";

export default function LanguageSwitcher() {
  const currentLocale = useCurrentLocale();
  const changeLocale = useChangeLocale();

  return (
    <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit">
      <Button
        variant={currentLocale === "en" ? "default" : "outline"}
        size="sm"
        onClick={() => changeLocale("en")}
        className={
          currentLocale === "en"
            ? ""
            : "bg-transparent border-transparent hover:bg-accent"
        }
      >
        English
      </Button>
      <Button
        variant={currentLocale === "hi" ? "default" : "outline"}
        size="sm"
        onClick={() => changeLocale("hi")}
        className={
          currentLocale === "hi"
            ? ""
            : "bg-transparent border-transparent hover:bg-accent"
        }
      >
        हिन्दी
      </Button>
    </div>
  );
}
