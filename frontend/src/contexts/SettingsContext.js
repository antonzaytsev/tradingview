import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  // Load initial settings from backend
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const config = await ConfigStorage.getConfig();
        setSettings(config);
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const updateSetting = async (key, value) => {
    try {
      const updatedSettings = await ConfigStorage.setConfigItem(key, value);
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Error updating setting:', error);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      const updatedSettings = await ConfigStorage.updateConfig(newSettings);
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };


  const value = {
    settings,
    updateSetting,
    updateSettings,
    loading,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
