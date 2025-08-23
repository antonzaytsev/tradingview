import './App.css';
import SymbolCharts from './symbol-charts'
import Navbar from './navbar'
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { symbols } from './lib/input';
import { SettingsProvider } from './contexts/SettingsContext';

function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <div className='app'>
          <div className="app-navbar">
            <Navbar symbols={symbols} />
          </div>
          <div className="app-content">
            <Routes>
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
