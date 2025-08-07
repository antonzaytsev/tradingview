import './App.css';
import SymbolCharts from './symbol-charts'
import Navbar from './navbar'
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { symbols } from './lib/input';

function App() {
  return (
    <BrowserRouter>
      <div className='app'>
        <div className="app-navbar">
          <Navbar symbols={symbols} />
        </div>
        <div className="app-content">
          <Routes>
            {symbols.map((el) => <Route key={el[1]} path={el[1]} element={<SymbolCharts symbol={el[1]} configOverrides={el[2]} charts={el[3]} el={el} />} />)}
            {/* <Route path={symbols[1]} element={<SymbolCharts symbol={symbols[2]} />} /> */}
          </Routes>
          {/* <SymbolCharts symbol={symbol} /> */}
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App;
