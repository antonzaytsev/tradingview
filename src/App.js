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
  
  // Load symbols on mount
  useEffect(() => {
    setSymbols(ConfigManager.getSymbols());
  }, []);

  // Function to refresh symbols (to be called after config changes)
  const refreshSymbols = () => {
    setSymbols(ConfigManager.getSymbols());
  };

  return (
    <SettingsProvider>
      <BrowserRouter>
        <div className='app'>
          <div className="app-navbar">
            <Navbar symbols={symbols} />
          </div>
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
