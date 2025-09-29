import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ConfigManager } from '../lib/config';
import './HomePage.css';

const HomePage = () => {
  const [symbols, setSymbols] = useState([]);

  useEffect(() => {
    const loadSymbols = async () => {
      const loadedSymbols = await ConfigManager.getSymbols();
      setSymbols(loadedSymbols);
    };
    loadSymbols();
  }, []);

  // Group symbols by coin for better organization
  const groupedSymbols = symbols.reduce((acc, symbolData) => {
    const { coin } = symbolData;
    if (!acc[coin]) {
      acc[coin] = [];
    }
    acc[coin].push(symbolData);
    return acc;
  }, {});

  // Get a color for each coin type for visual distinction
  const getCoinColor = (coin) => {
    const colors = {
      'BTC': '#f7931a',
      'ETH': '#627eea',
      'ARB': '#28a0f0',
      'POL': '#8247e5',
      'TON': '#0088cc',
      'USDKZT': '#6c757d',
      'USDRUB': '#dc3545',
      'EURRUB': '#17a2b8',
      'USDEUR': '#28a745'
    };
    return colors[coin] || '#6c757d';
  };

  // Get icon/symbol for coin
  const getCoinIcon = (coin) => {
    const icons = {
      'BTC': '₿',
      'ETH': 'Ξ',
      'ARB': '◈',
      'POL': '⬟',
      'TON': '💎',
      'USDKZT': '₸',
      'USDRUB': '₽',
      'EURRUB': '€₽',
      'USDEUR': '$€'
    };
    return icons[coin] || '●';
  };

  return (
    <div className="home-page">
      <div className="home-container">
        <header className="home-header">
          <h1>Trading Dashboard</h1>
          <p className="home-subtitle">Select a trading pair to view charts</p>
          <div className="stats-bar">
            <span className="stat-item">
              <span className="stat-number">{symbols.length}</span>
              <span className="stat-label">Trading Pairs</span>
            </span>
            <span className="stat-item">
              <span className="stat-number">{Object.keys(groupedSymbols).length}</span>
              <span className="stat-label">Assets</span>
            </span>
          </div>
        </header>

        <div className="pairs-grid">
          {Object.entries(groupedSymbols).map(([coin, coinSymbols]) => (
            <div key={coin} className="coin-group">
              <h2 className="coin-group-title">
                <span 
                  className="coin-icon" 
                  style={{ color: getCoinColor(coin) }}
                >
                  {getCoinIcon(coin)}
                </span>
                {coin}
                <span className="coin-count">({coinSymbols.length} pair{coinSymbols.length !== 1 ? 's' : ''})</span>
              </h2>
              
              <div className="coin-pairs">
                {coinSymbols.map(({ coin, exchange, symbol, settings }) => (
                  <Link 
                    key={symbol}
                    to={`/symbol/${encodeURIComponent(symbol)}`} 
                    className="pair-tile"
                    style={{ '--coin-color': getCoinColor(coin) }}
                  >
                    <div className="pair-header">
                      <div className="pair-coin">
                        <span className="coin-symbol">{getCoinIcon(coin)}</span>
                        <span className="coin-name">{coin}</span>
                      </div>
                      {exchange && (
                        <div className="pair-exchange">{exchange}</div>
                      )}
                    </div>
                    
                    <div className="pair-symbol">
                      {symbol}
                    </div>
                    
                    {settings?.chart?.hide_volume && (
                      <div className="pair-badge">No Volume</div>
                    )}
                    
                    <div className="pair-arrow">→</div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {symbols.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>No Trading Pairs Found</h3>
            <p>Configure your trading pairs in the settings to get started.</p>
            <Link to="/config" className="config-link">
              Go to Configuration
            </Link>
          </div>
        )}

        <footer className="home-footer">
          <div className="quick-links">
            <Link to="/config" className="footer-link">
              <span className="link-icon">⚙️</span>
              Configuration
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
