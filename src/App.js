import './App.css';
import SymbolCharts from './symbol-charts'
import Navbar from './navbar'
import ConfigurationPage from './components/ConfigurationPage'
import HomePage from './components/HomePage'
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigManager } from './lib/config';
import { SettingsProvider } from './contexts/SettingsContext';

function App() {
  // Get symbols from configuration manager (localStorage or defaults)
  const [symbols, setSymbols] = useState([]);
  // State for sidebar visibility
  const [sidebarVisible, setSidebarVisible] = useState(true);
  
  // Load symbols on mount
  useEffect(() => {
    const allSymbols = ConfigManager.getSymbols();
    // Filter symbols based on visibility (default to visible if not set)
    const visibleSymbols = allSymbols.filter(symbol => symbol.visible !== false);
    setSymbols(visibleSymbols);
  }, []);

  // Function to refresh symbols (to be called after config changes)
  const refreshSymbols = () => {
    const allSymbols = ConfigManager.getSymbols();
    // Filter symbols based on visibility (default to visible if not set)
    const visibleSymbols = allSymbols.filter(symbol => symbol.visible !== false);
    setSymbols(visibleSymbols);
  };

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev);
  };

  return (
    <SettingsProvider>
      <BrowserRouter>
        <div className={`app ${sidebarVisible ? '' : 'sidebar-hidden'}`}>
          {sidebarVisible && (
            <div className="app-navbar">
              <Navbar symbols={symbols} onToggleSidebar={toggleSidebar} />
            </div>
          )}
          {!sidebarVisible && (
            <div className="floating-sidebar-toggle" onClick={toggleSidebar}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12L21 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 6L21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 18L21 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
          <div className="app-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/config" element={<ConfigurationPage onSymbolsChange={refreshSymbols} />} />
              {symbols.map(({coin, exchange, symbol, settings}) => <Route key={symbol} path={symbol} element={<SymbolCharts symbol={symbol} localSettings={settings} exchange={exchange} coin={coin} />} />)}
              {/* <Route path={symbols[1]} element={<SymbolCharts symbol={symbols[2]} />} /> */}
            </Routes>
            {/* <SymbolCharts symbol={symbol} /> */}
          </div>
        </div>
      </BrowserRouter>
    </SettingsProvider>
  )
}

export default App;
