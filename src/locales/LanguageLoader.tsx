import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import i18n from "@/locales/translation-config";
import { RootState } from "@/store/store";

export function LanguageLoader({ children }: { children: React.ReactNode }) {
  const lang = useSelector((state: RootState) => state.settings.language);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang).finally(() => setReady(true));
    } else {
      setReady(true);
    }
  }, [lang]);

  if (!ready) return null;

  return <>{children}</>;
}
