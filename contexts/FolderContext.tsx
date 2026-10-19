import { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { navFolders } from '@/data/navigation';

interface FolderContextType {
  portfolioOpen: boolean;
  mobileMenuOpen: boolean;
  folderStates: Record<string, boolean>;
  setPortfolioOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setFolderOpen: (folderId: string, open: boolean) => void;
}

const FolderContext = createContext<FolderContextType | undefined>(undefined);

export const FolderProvider = ({ children }: { children: ReactNode }) => {
  const [portfolioOpen, setPortfolioOpenState] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [folderStates, setFolderStates] = useState<Record<string, boolean>>(() => (
    navFolders.reduce((states, folder) => {
      states[folder.id] = false;
      return states;
    }, {} as Record<string, boolean>)
  ));
  const router = useRouter();

  const setPortfolioOpen = (open: boolean) => {
    setPortfolioOpenState(open);
    // Don't close nested folders when portfolio is closed - keep their state
    // Only redirect if closing and on a non-home page
    if (!open && router.pathname !== '/') {
      router.push('/');
    }
  };

  const setFolderOpen = (folderId: string, open: boolean) => {
    setFolderStates((current) => ({ ...current, [folderId]: open }));
  };

  return (
    <FolderContext.Provider
      value={{
        portfolioOpen,
        mobileMenuOpen,
        folderStates,
        setPortfolioOpen,
        setMobileMenuOpen,
        setFolderOpen,
      }}
    >
      {children}
    </FolderContext.Provider>
  );
};

export const useFolderContext = () => {
  const context = useContext(FolderContext);
  if (!context) {
    throw new Error('useFolderContext must be used within FolderProvider');
  }
  return context;
};
