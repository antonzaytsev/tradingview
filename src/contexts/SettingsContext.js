import React, { createContext, useContext, useState } from 'react';
import ConfigStorage from '../lib/configStorage';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(ConfigStorage.getConfig());

  const updateSetting = (key, value) => {
    const updatedSettings = ConfigStorage.setConfigItem(key, value);
    setSettings(updatedSettings);
  };

  const updateSettings = (newSettings) => {
    const updatedSettings = ConfigStorage.updateConfig(newSettings);
    setSettings(updatedSettings);
  };


  const value = {
    settings,
    updateSetting,
    updateSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
