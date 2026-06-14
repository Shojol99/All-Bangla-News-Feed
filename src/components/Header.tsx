import React from 'react';
import { useLocation } from 'react-router-dom';
import BreakingNewsTicker from './BreakingNewsTicker';
import MiddleHeader from './MiddleHeader';
import Navbar from './Navbar';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function Header({ isDarkMode, toggleTheme }: HeaderProps) {
  const location = useLocation();
  const isFifaPage = location.pathname === '/fifa-world-cup-live';

  return (
    <header className={`${isFifaPage ? 'relative w-full' : 'fixed top-0 left-0 right-0'} z-50`}>
      <BreakingNewsTicker />
      <MiddleHeader />
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
    </header>
  );
}
