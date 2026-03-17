'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface NavigationContextType {
  attemptNavigation: (path: string) => void;
  setInterceptor: (callback: (path: string) => void) => void;
  removeInterceptor: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [interceptor, setInterceptorState] = useState<((path: string) => void) | null>(null);

  const setInterceptor = useCallback((callback: (path: string) => void) => {
    setInterceptorState(() => callback);
  }, []);

  const removeInterceptor = useCallback(() => {
    setInterceptorState(null);
  }, []);

  const attemptNavigation = useCallback((path: string) => {
    if (interceptor) {
      interceptor(path);
    } else {
      if (typeof window !== 'undefined') {
        window.location.assign(path);
      }
    }
  }, [interceptor]);

  return (
    <NavigationContext.Provider
      value={{
        attemptNavigation,
        setInterceptor,
        removeInterceptor,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
