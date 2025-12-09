import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';

interface FolderContextType {
  portfolioOpen: boolean;
  cvFolderOpen: boolean;
  miscLogsOpen: boolean;
  mobileMenuOpen: boolean;
  setPortfolioOpen: (open: boolean) => void;
  setCvFolderOpen: (open: boolean) => void;
  setMiscLogsOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
}

const FolderContext = createContext<FolderContextType | undefined>(undefined);

export const FolderProvider = ({ children }: { children: ReactNode }) => {
  const [portfolioOpen, setPortfolioOpenState] = useState(true);
  const [cvFolderOpen, setCvFolderOpenState] = useState(false);
  const [miscLogsOpen, setMiscLogsOpenState] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Portfolio folder paths
  const portfolioPaths = ['/', '/about', '/contact'];
  
  // CV_SYSTEMFILES folder paths (now includes github.md)
  const cvPaths = ['/github', '/projects', '/techstack', '/skillmatrix', '/experience', '/research', '/resume'];
  
  // MISC_LOGS folder paths
  const miscLogsPaths = ['/typing'];

  const setPortfolioOpen = (open: boolean) => {
    setPortfolioOpenState(open);
    // Don't close nested folders when portfolio is closed - keep their state
    // Only redirect if closing and on a non-home page
    if (!open && router.pathname !== '/') {
      router.push('/');
    }
  };

  const setCvFolderOpen = (open: boolean) => {
    setCvFolderOpenState(open);
    // If closing CV folder and currently on a CV page, redirect to main.cpp
    if (!open && cvPaths.includes(router.pathname)) {
      router.push('/');
    }
  };

  const setMiscLogsOpen = (open: boolean) => {
    setMiscLogsOpenState(open);
    // If closing MISC_LOGS folder and currently on a misc logs page, redirect to main.cpp
    if (!open && miscLogsPaths.includes(router.pathname)) {
      router.push('/');
    }
  };

  return (
    <FolderContext.Provider
      value={{
        portfolioOpen,
        cvFolderOpen,
        miscLogsOpen,
        mobileMenuOpen,
        setPortfolioOpen,
        setCvFolderOpen,
        setMiscLogsOpen,
        setMobileMenuOpen,
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
