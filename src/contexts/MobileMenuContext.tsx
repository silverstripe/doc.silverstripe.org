'use client';

import { createContext } from 'react';

interface MobileMenuContextType {
  isMobileMenuOpen: boolean;
  onClose: () => void;
}

export const MobileMenuContext = createContext<MobileMenuContextType>({
  isMobileMenuOpen: false,
  onClose: () => {},
});
