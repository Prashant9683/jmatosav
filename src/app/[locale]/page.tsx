import { getI18n } from "../../../i18n/server";

export default async function Home() {
  const t = await getI18n();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">{t("welcome_message")}</h1>
    </div>
  );
}
