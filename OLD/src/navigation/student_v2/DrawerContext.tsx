/**
 * Drawer Context
 * Provides drawer control functions throughout navigation
 */

import React, { createContext, useContext, ReactNode } from 'react';

interface DrawerContextType {
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

const DrawerContext = createContext<DrawerContextType | null>(null);

export function useDrawer() {
  const context = useContext(DrawerContext);
  if (!context) {
    // Return no-op functions if context not available
    console.warn('⚠️ DrawerContext not found! Make sure DrawerProvider is wrapping your component.');
    return {
      openDrawer: () => console.log('❌ Drawer not available - context missing'),
      closeDrawer: () => {},
      toggleDrawer: () => {},
    };
  }
  console.log('✅ DrawerContext found, returning functions');
  return context;
}

interface DrawerProviderProps {
  children: ReactNode;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

export function DrawerProvider({ children, openDrawer, closeDrawer, toggleDrawer }: DrawerProviderProps) {
  return (
    <DrawerContext.Provider value={{ openDrawer, closeDrawer, toggleDrawer }}>
      {children}
    </DrawerContext.Provider>
  );
}
