import { Link, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

function Navbar({ symbols, symbol }) {
  const location = useLocation();
  const [activeSymbol, setActiveSymbol] = useState(false)

  useEffect(() => {
    // console.log('Current location is ', location);
    setActiveSymbol(location.pathname)
  }, [location]);

  // console.log(symbol);

  return (
    <div className="navbar">
      <div className="navbar-title">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 18L20 18" stroke="#000000" stroke-width="2" stroke-linecap="round"/>
          <path d="M4 12L20 12" stroke="#000000" stroke-width="2" stroke-linecap="round"/>
          <path d="M4 6L20 6" stroke="#000000" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <div className="navbar-links">
        {symbols.map((el) => <div key={el[1]} className={activeSymbol === "/" + el[1] ? 'navbar-element-active' : ''}><Link
          to={"/" + el[1]}>{el[0]}</Link></div>)}
      </div>
    </div>
  )
}

export default Navbar
