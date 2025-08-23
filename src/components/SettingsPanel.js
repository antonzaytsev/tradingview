import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import './SettingsPanel.css';

const SettingsPanel = ({ isOpen, onClose }) => {
  const { settings, updateSetting, resetSettings } = useSettings();
  const [tempChartCount, setTempChartCount] = useState(settings.chartCount);

  const handleSave = () => {
    updateSetting('chartCount', tempChartCount);
    onClose();
  };

  const handleReset = () => {
    resetSettings();
    setTempChartCount(6); // Default chart count
  };

  const handleCancel = () => {
    setTempChartCount(settings.chartCount); // Reset to current setting
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="settings-overlay">
      <div className="settings-panel">
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-button" onClick={handleCancel}>×</button>
        </div>
        
        <div className="settings-content">
          <div className="setting-group">
            <label htmlFor="chart-count">Number of Charts per Symbol:</label>
            <div className="chart-count-control">
              <input
                id="chart-count"
                type="range"
                min="1"
                max="8"
                value={tempChartCount}
                onChange={(e) => setTempChartCount(parseInt(e.target.value))}
                className="chart-count-slider"
              />
              <span className="chart-count-value">{tempChartCount}</span>
            </div>
            <small className="setting-description">
              Controls how many time interval charts are displayed for each symbol
            </small>
          </div>
        </div>

        <div className="settings-footer">
          <button className="button button-secondary" onClick={handleReset}>
            Reset to Defaults
          </button>
          <div className="button-group">
            <button className="button button-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button className="button button-primary" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
