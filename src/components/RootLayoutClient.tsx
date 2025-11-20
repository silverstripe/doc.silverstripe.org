'use client';

import { useState } from 'react';
import { Header } from './Header';
import { MobileMenuContext } from '@/contexts/MobileMenuContext';

interface RootLayoutClientProps {
  children: React.ReactNode;
}

export function RootLayoutClient({ children }: RootLayoutClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <MobileMenuContext.Provider value={{ isMobileMenuOpen, onClose: handleMobileMenuClose }}>
      <Header onMobileMenuToggle={setIsMobileMenuOpen} />
      {children}
    </MobileMenuContext.Provider>
  );
}
