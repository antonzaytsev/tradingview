import './App.css';
import SymbolCharts from './symbol-charts'
import Navbar from './navbar'
import ConfigurationPage from './components/ConfigurationPage'
import HomePage from './components/HomePage'
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { ConfigManager } from './lib/config';
import { SettingsProvider } from './contexts/SettingsContext';

// Component to handle dynamic symbol routes
function SymbolRouteHandler({ symbols }) {
  const { encodedSymbol } = useParams();
  const decodedSymbol = decodeURIComponent(encodedSymbol);
  
  // If symbols are not loaded yet, show loading
  if (symbols.length === 0) {
    return <div className="app-symbol-charts-loading">Loading symbol data...</div>;
  }
  
  // Find the matching symbol object
  const symbolData = symbols.find(s => s.symbol === decodedSymbol);
  
  if (!symbolData) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Symbol Not Found</h2>
        <p>The symbol "{decodedSymbol}" could not be found.</p>
        <p>Available symbols: {symbols.map(s => s.symbol).join(', ')}</p>
        <HomePage />
      </div>
    );
  }
  
  return <SymbolCharts 
    symbol={symbolData.symbol} 
    localSettings={symbolData.settings} 
    exchange={symbolData.exchange} 
    coin={symbolData.coin} 
  />;
}

function App() {
  // Get symbols from configuration manager (localStorage or defaults)
  const [symbols, setSymbols] = useState([]);
  
  // Load symbols on mount
  useEffect(() => {
    const loadSymbols = async () => {
      try {
        const allSymbols = await ConfigManager.getSymbols();
        if (allSymbols && Array.isArray(allSymbols)) {
          // Filter symbols based on visibility (default to visible if not set)
          const visibleSymbols = allSymbols.filter(symbol => symbol.visible !== false);
          setSymbols(visibleSymbols);
        } else {
          setSymbols([]);
        }
      } catch (error) {
        console.error('Error loading symbols:', error);
        setSymbols([]);
      }
    };
    loadSymbols();
  }, []);

  // Function to refresh symbols (to be called after config changes)
  const refreshSymbols = async () => {
    const allSymbols = await ConfigManager.getSymbols();
    // Filter symbols based on visibility (default to visible if not set)
    const visibleSymbols = allSymbols.filter(symbol => symbol.visible !== false);
    setSymbols(visibleSymbols);
  };

  return (
    <SettingsProvider>
      <BrowserRouter>
        <div className="app">
          <div className="app-navbar">
            <Navbar symbols={symbols} />
          </div>
          <div className="app-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/config" element={<ConfigurationPage onSymbolsChange={refreshSymbols} />} />
              {/* Dynamic symbol route that handles URL decoding */}
              <Route path="/symbol/:encodedSymbol" element={
                <SymbolRouteHandler symbols={symbols} />
              } />
              {/* Catch-all route for unmatched paths - redirect to home */}
              <Route path="*" element={<HomePage />} />
            </Routes>
            {/* <SymbolCharts symbol={symbol} /> */}
          </div>
        </div>
      </BrowserRouter>
    </SettingsProvider>
  )
}

export default App;
