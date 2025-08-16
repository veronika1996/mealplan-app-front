import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import './NavBar.css';

type NavBarProps = {
  username: string;
  onLogout: () => void;
};

const NavBar: React.FC<NavBarProps> = ({ username, onLogout }) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Odredi aktivnu stranicu na osnovu URL-a
  const getActive = (): 'PLANS' | 'RECIPES' | 'INGREDIENTS' => {
    if (location.pathname.includes('plans')) return 'PLANS';
    if (location.pathname.includes('recepies')) return 'RECIPES';
    if (location.pathname.includes('ingredients')) return 'INGREDIENTS';
    return 'PLANS'; // default
  };

  const active = getActive();

  return (
    <header className="topbar">
      <div className="nav-options">
        <button
          className={`nav-button ${active === 'PLANS' ? 'active' : ''}`}
          onClick={() => navigate('/plans')}
        >
          PLANOVI
        </button>
        <button
          className={`nav-button ${active === 'RECIPES' ? 'active' : ''}`}
          onClick={() => navigate('/recepies')}
        >
          RECEPTI
        </button>
        <button
          className={`nav-button ${active === 'INGREDIENTS' ? 'active' : ''}`}
          onClick={() => navigate('/ingredients')}
        >
          SASTOJCI
        </button>
      </div>

      <div className="user-info">
        <FaUserCircle
          className="user-icon"
          size={30}
          onClick={() => setShowUserDropdown(!showUserDropdown)}
        />

        {showUserDropdown && (
          <div className="user-dropdown">
            <div className="user-name">{username}</div>
            <button className="logout-button" onClick={onLogout}>
              Odjavi se
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
