'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import DonationPopup from '@/components/DonationPopup';

interface DonationContextType {
  openDonationPopup: () => void;
}

const DonationContext = createContext<DonationContextType | null>(null);

export function DonationProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DonationContext.Provider value={{ openDonationPopup: () => setIsOpen(true) }}>
      {children}
      {isOpen && <DonationPopup onClose={() => setIsOpen(false)} />}
    </DonationContext.Provider>
  );
}

export function useDonation() {
  const context = useContext(DonationContext);
  if (!context) throw new Error('useDonation must be used within DonationProvider');
  return context;
}
