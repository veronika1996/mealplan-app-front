import React, { useState } from 'react';
import NavBar from '../NavBar/NavBar'; // prilagodi putanju ako je drugačija

const PlansPage: React.FC = () => {
  const [activePage, setActivePage] = useState<'PLANS' | 'RECIPES' | 'INGREDIENTS'>('PLANS');

  const handleNavigate = (page: 'PLANS' | 'RECIPES' | 'INGREDIENTS') => {
    setActivePage(page);
  };

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const username = user?.username || 'Korisnik';
  
  const handleLogout = () => {
    // ovde ide logika za odjavu
    console.log('Odjava');
  };

  return (
    <div>
      <NavBar
        active={activePage}
        onNavigate={handleNavigate}
        username={username}
        onLogout={handleLogout}
      />

      <div style={{ padding: '30px', fontSize: '24px', color: '#2e7d32' }}>
        OVO SU TVOJI PLANOVI
      </div>
    </div>
  );
};

export default PlansPage;
