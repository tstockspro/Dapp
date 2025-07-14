import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../lib/utils';

interface SettingsContextType {
  slippageTolerance: number;
  setSlippageTolerance: (value: number) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  language: string;
  setLanguage: (value: string) => void;
  notifications: boolean;
  setNotifications: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [slippageTolerance, setSlippageToleranceState] = useState(0.5);
  const [darkMode, setDarkModeState] = useState(true);
  const [language, setLanguageState] = useState('zh');
  const [notifications, setNotificationsState] = useState(true);

  // 从本地存储加载设置
  useEffect(() => {
    const savedSettings = storage.get('tstocks-settings', {});
    if (savedSettings.slippageTolerance !== undefined) {
      setSlippageToleranceState(savedSettings.slippageTolerance);
    }
    if (savedSettings.darkMode !== undefined) {
      setDarkModeState(savedSettings.darkMode);
    }
    if (savedSettings.language !== undefined) {
      setLanguageState(savedSettings.language);
    }
    if (savedSettings.notifications !== undefined) {
      setNotificationsState(savedSettings.notifications);
    }
  }, []);

  const setSlippageTolerance = (value: number) => {
    setSlippageToleranceState(value);
    const settings = storage.get('tstocks-settings', {});
    storage.set('tstocks-settings', { ...settings, slippageTolerance: value });
  };

  const setDarkMode = (value: boolean) => {
    setDarkModeState(value);
    const settings = storage.get('tstocks-settings', {});
    storage.set('tstocks-settings', { ...settings, darkMode: value });
  };

  const setLanguage = (value: string) => {
    setLanguageState(value);
    const settings = storage.get('tstocks-settings', {});
    storage.set('tstocks-settings', { ...settings, language: value });
  };

  const setNotifications = (value: boolean) => {
    setNotificationsState(value);
    const settings = storage.get('tstocks-settings', {});
    storage.set('tstocks-settings', { ...settings, notifications: value });
  };

  return (
    <SettingsContext.Provider value={{
      slippageTolerance,
      setSlippageTolerance,
      darkMode,
      setDarkMode,
      language,
      setLanguage,
      notifications,
      setNotifications,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}