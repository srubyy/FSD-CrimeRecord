import React, { createContext, useState } from 'react';

// Create AppContext for shared global UI state
export const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Theme state: dark mode default
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Filtering & Tab state
  const [searchTerm, setSearchTerm] = useState('');
  const [securityFilter, setSecurityFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('ALL');

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        setIsDarkMode,
        searchTerm,
        setSearchTerm,
        securityFilter,
        setSecurityFilter,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
