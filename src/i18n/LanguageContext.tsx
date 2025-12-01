import React, { createContext, useContext, useEffect, useState } from "react";
import { translations, Lang, TKey } from "./translations";

type LanguageContextType = {
  lang: Lang;
  t: (key: TKey) => string;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem("lang") : null;
      if (stored === "en" || stored === "es") {
        setLangState(stored);
        return;
      }
      // optional: browser detection fallback
      if (typeof navigator !== "undefined") {
        const nav = navigator.language?.startsWith("en") ? "en" : "es";
        setLangState(nav as Lang);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") localStorage.setItem("lang", lang);
    } catch {}
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);
  const toggleLang = () => setLangState((s) => (s === "es" ? "en" : "es"));
  const t = (key: TKey) => translations[lang][key];

  return <LanguageContext.Provider value={{ lang, t, setLang, toggleLang }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
