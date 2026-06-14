import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface UIStateContextType {
  // Zen Mode
  zenMode: boolean;
  setZenMode: (enabled: boolean) => void;

  // Focus Mode
  focusMode: boolean;
  setFocusMode: (enabled: boolean) => void;

  // Terminal
  terminalOpen: boolean;
  setTerminalOpen: (open: boolean) => void;
  terminalHeight: number;
  setTerminalHeight: (height: number) => void;

  // Problems Panel
  problemsOpen: boolean;
  setProblemsOpen: (open: boolean) => void;

  // Source Control Panel
  sourceControlOpen: boolean;
  setSourceControlOpen: (open: boolean) => void;

  // Extensions Panel
  extensionsOpen: boolean;
  setExtensionsOpen: (open: boolean) => void;

  // Portfolio Stats Modal
  statsModalOpen: boolean;
  setStatsModalOpen: (open: boolean) => void;

  // UI Visibility
  sidebarVisible: boolean;
  setSidebarVisible: (visible: boolean) => void;

  minimapVisible: boolean;
  setMinimapVisible: (visible: boolean) => void;

  bottombarVisible: boolean;
  setBottombarVisible: (visible: boolean) => void;
}

const UIStateContext = createContext<UIStateContextType | undefined>(undefined);

export const UIStateProvider = ({ children }: { children: ReactNode }) => {
  const [zenMode, setZenMode] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalHeight, setTerminalHeight] = useState(250);
  const [problemsOpen, setProblemsOpen] = useState(false);
  const [sourceControlOpen, setSourceControlOpen] = useState(false);
  const [extensionsOpen, setExtensionsOpen] = useState(false);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [minimapVisible, setMinimapVisible] = useState(true);
  const [bottombarVisible, setBottombarVisible] = useState(true);

  // When zen mode is enabled, hide all UI chrome
  const handleZenMode = useCallback((enabled: boolean) => {
    setZenMode(enabled);
    if (enabled) {
      setSidebarVisible(false);
      setMinimapVisible(false);
      setBottombarVisible(false);
      setTerminalOpen(false);
      setProblemsOpen(false);
    }
  }, []);

  // When focus mode is enabled, dim UI chrome but keep tabs
  const handleFocusMode = useCallback((enabled: boolean) => {
    setFocusMode(enabled);
    if (enabled) {
      setTerminalOpen(false);
      setProblemsOpen(false);
      setSourceControlOpen(false);
      setExtensionsOpen(false);
    }
  }, []);

  return (
    <UIStateContext.Provider
      value={{
        zenMode,
        setZenMode: handleZenMode,
        focusMode,
        setFocusMode: handleFocusMode,
        terminalOpen,
        setTerminalOpen,
        terminalHeight,
        setTerminalHeight,
        problemsOpen,
        setProblemsOpen,
        sourceControlOpen,
        setSourceControlOpen,
        extensionsOpen,
        setExtensionsOpen,
        statsModalOpen,
        setStatsModalOpen,
        sidebarVisible,
        setSidebarVisible,
        minimapVisible,
        setMinimapVisible,
        bottombarVisible,
        setBottombarVisible,
      }}
    >
      {children}
    </UIStateContext.Provider>
  );
};

export const useUIState = () => {
  const context = useContext(UIStateContext);
  if (!context) {
    throw new Error('useUIState must be used within UIStateProvider');
  }
  return context;
};
