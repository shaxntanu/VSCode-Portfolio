import { createContext, useContext, useState, ReactNode } from 'react';

export type MinimapMode = 'classic' | 'visual';

interface MinimapModeContextType {
  minimapMode: MinimapMode;
  setMinimapMode: (mode: MinimapMode) => void;
  toggleMinimapMode: () => void;
}

const MinimapModeContext = createContext<MinimapModeContextType | undefined>(
  undefined
);

export const MinimapModeProvider = ({ children }: { children: ReactNode }) => {
  const [minimapMode, setMinimapMode] = useState<MinimapMode>('classic');

  const toggleMinimapMode = () => {
    setMinimapMode((prev) => (prev === 'classic' ? 'visual' : 'classic'));
  };

  return (
    <MinimapModeContext.Provider
      value={{
        minimapMode,
        setMinimapMode,
        toggleMinimapMode,
      }}
    >
      {children}
    </MinimapModeContext.Provider>
  );
};

export const useMinimapMode = () => {
  const context = useContext(MinimapModeContext);
  if (!context) {
    throw new Error('useMinimapMode must be used within MinimapModeProvider');
  }
  return context;
};
