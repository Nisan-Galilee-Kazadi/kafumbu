/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import { translations, t as translate } from '../i18n';

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState('fr');
  const [theme, setTheme] = useState(() => localStorage.getItem('ksc-theme') || 'light');

  const setLanguage = (newLang) => setLang(newLang);
  const toggleTheme = () => setTheme(current => (current === 'dark' ? 'light' : 'dark'));
  const t = (key) => {
    const parts = key.split('.');
    if (parts[0] === 'ui' || parts[0] === 'pages') {
      const type = parts[0];
      const newKey = parts.slice(1).join('.');
      return translate(translations[type]?.[lang], newKey) ?? key;
    }
    return translate(translations[lang], key) ?? key;
  };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('ksc-theme', theme);
  }, [theme]);

  return (
    <LangContext.Provider value={{ lang, setLanguage, theme, toggleTheme, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
