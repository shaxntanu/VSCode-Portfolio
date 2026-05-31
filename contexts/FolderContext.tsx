import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';

interface FolderContextType {
  portfolioOpen: boolean;
  mobileMenuOpen: boolean;
  developmentOpen: boolean;
  skillsOpen: boolean;
  careerOpen: boolean;
  researchOpen: boolean;
  resumeOpen: boolean;
  setPortfolioOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setDevelopmentOpen: (open: boolean) => void;
  setSkillsOpen: (open: boolean) => void;
  setCareerOpen: (open: boolean) => void;
  setResearchOpen: (open: boolean) => void;
  setResumeOpen: (open: boolean) => void;
}

const FolderContext = createContext<FolderContextType | undefined>(undefined);

export const FolderProvider = ({ children }: { children: ReactNode }) => {
  const [portfolioOpen, setPortfolioOpenState] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [developmentOpen, setDevelopmentOpen] = useState(false);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [careerOpen, setCareerOpen] = useState(false);
  const [researchOpen, setResearchOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const router = useRouter();

  // Portfolio folder paths
  const portfolioPaths = ['/', '/about', '/contact'];

  const setPortfolioOpen = (open: boolean) => {
    setPortfolioOpenState(open);
    // Don't close nested folders when portfolio is closed - keep their state
    // Only redirect if closing and on a non-home page
    if (!open && router.pathname !== '/') {
      router.push('/');
    }
  };

  return (
    <FolderContext.Provider
      value={{
        portfolioOpen,
        mobileMenuOpen,
        developmentOpen,
        skillsOpen,
        careerOpen,
        researchOpen,
        resumeOpen,
        setPortfolioOpen,
        setMobileMenuOpen,
        setDevelopmentOpen,
        setSkillsOpen,
        setCareerOpen,
        setResearchOpen,
        setResumeOpen,
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
