import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';

interface FolderContextType {
  portfolioOpen: boolean;
  cvFolderOpen: boolean;
  githubFolderOpen: boolean;
  miscLogsOpen: boolean;
  mobileMenuOpen: boolean;
  setPortfolioOpen: (open: boolean) => void;
  setCvFolderOpen: (open: boolean) => void;
  setGithubFolderOpen: (open: boolean) => void;
  setMiscLogsOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
}

const FolderContext = createContext<FolderContextType | undefined>(undefined);

export const FolderProvider = ({ children }: { children: ReactNode }) => {
  const [portfolioOpen, setPortfolioOpenState] = useState(true);
  const [cvFolderOpen, setCvFolderOpenState] = useState(false);
  const [githubFolderOpen, setGithubFolderOpenState] = useState(false);
  const [miscLogsOpen, setMiscLogsOpenState] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Portfolio folder paths
  const portfolioPaths = ['/', '/about', '/contact'];
  
  // CV_SYSTEMFILES folder paths
  const cvPaths = ['/projects', '/techstack', '/skillmatrix', '/experience', '/research', '/resume'];
  
  // Github folder paths
  const githubPaths = ['/github', '/readme'];
  
  // MISC_LOGS folder paths
  const miscLogsPaths = ['/typing'];

  const setPortfolioOpen = (open: boolean) => {
    setPortfolioOpenState(open);
    // If closing portfolio folder, also close CV folder, github folder and MISC_LOGS (they're nested inside)
    if (!open) {
      setCvFolderOpenState(false);
      setGithubFolderOpenState(false);
      setMiscLogsOpenState(false);
      // Redirect to main.cpp if on any page other than home
      if (router.pathname !== '/') {
        router.push('/');
      }
    }
  };

  const setCvFolderOpen = (open: boolean) => {
    setCvFolderOpenState(open);
    // If closing CV folder, also close github folder
    if (!open) {
      setGithubFolderOpenState(false);
    }
    // If closing CV folder and currently on a CV or github page, redirect to main.cpp
    if (!open && (cvPaths.includes(router.pathname) || githubPaths.includes(router.pathname))) {
      router.push('/');
    }
  };

  const setGithubFolderOpen = (open: boolean) => {
    setGithubFolderOpenState(open);
    // If closing github folder and currently on a github page, redirect to main.cpp
    if (!open && githubPaths.includes(router.pathname)) {
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
        githubFolderOpen,
        miscLogsOpen,
        mobileMenuOpen,
        setPortfolioOpen,
        setCvFolderOpen,
        setGithubFolderOpen,
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
