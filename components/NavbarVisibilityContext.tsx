'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';

type NavbarVisibilityContextType = {
  isNavbarVisible: boolean;
  setNavbarVisible: (visible: boolean) => void;
};

const NavbarVisibilityContext = createContext<NavbarVisibilityContextType>({
  isNavbarVisible: false,
  setNavbarVisible: () => {},
});

export const useNavbarVisibility = () => useContext(NavbarVisibilityContext);

export const NavbarVisibilityProvider = ({ children }: { children: React.ReactNode }) => {
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);

  const setNavbarVisible = (visible: boolean) => {
    setIsNavbarVisible(visible);
  };

  return (
    <NavbarVisibilityContext.Provider
      value={{
        isNavbarVisible,
        setNavbarVisible,
      }}
    >
      {children}
    </NavbarVisibilityContext.Provider>
  );
}; 