import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/router';
import MainAreaLoadingOverlay from '@/components/MainAreaLoadingOverlay';

type LoadingReporter = (source: string, isLoading: boolean) => void;

const MainAreaLoadingContext = createContext<LoadingReporter | null>(null);

export const MainAreaLoadingProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [activeSources, setActiveSources] = useState<Set<string>>(() => new Set());
  const [mainArea, setMainArea] = useState<HTMLElement | null>(null);
  const [overlayMounted, setOverlayMounted] = useState(false);
  const isLoading = activeSources.size > 0;

  const reportLoading = useCallback<LoadingReporter>((source, sourceIsLoading) => {
    setActiveSources((current) => {
      if (current.has(source) === sourceIsLoading) return current;

      const next = new Set(current);
      if (sourceIsLoading) next.add(source);
      else next.delete(source);
      return next;
    });
  }, []);

  useEffect(() => {
    setMainArea(document.getElementById('main-editor'));
  }, []);

  useEffect(() => {
    const handleRouteStart = () => reportLoading('route-transition', true);
    const handleRouteEnd = () => reportLoading('route-transition', false);

    router.events.on('routeChangeStart', handleRouteStart);
    router.events.on('routeChangeComplete', handleRouteEnd);
    router.events.on('routeChangeError', handleRouteEnd);

    return () => {
      router.events.off('routeChangeStart', handleRouteStart);
      router.events.off('routeChangeComplete', handleRouteEnd);
      router.events.off('routeChangeError', handleRouteEnd);
    };
  }, [reportLoading, router.events]);

  useEffect(() => {
    if (isLoading) {
      setOverlayMounted(true);
      return;
    }

    const timeout = window.setTimeout(() => setOverlayMounted(false), 240);
    return () => window.clearTimeout(timeout);
  }, [isLoading]);

  useEffect(() => {
    if (!mainArea) return;

    mainArea.setAttribute('aria-busy', String(isLoading));
    const contentChildren = Array.from(mainArea.children).filter(
      (child): child is HTMLElement => child instanceof HTMLElement && !child.hasAttribute('data-main-loading-overlay')
    );

    contentChildren.forEach((child) => {
      child.inert = isLoading;
    });

    return () => {
      mainArea.removeAttribute('aria-busy');
      contentChildren.forEach((child) => {
        child.inert = false;
      });
    };
  }, [isLoading, mainArea, router.pathname]);

  return (
    <MainAreaLoadingContext.Provider value={reportLoading}>
      {children}
      {overlayMounted && mainArea && createPortal(
        <MainAreaLoadingOverlay isVisible={isLoading} />,
        mainArea
      )}
    </MainAreaLoadingContext.Provider>
  );
};

export const useMainAreaLoading = (source: string, isLoading: boolean) => {
  const reportLoading = useContext(MainAreaLoadingContext);

  useEffect(() => {
    if (!reportLoading) return;

    reportLoading(source, isLoading);
    return () => reportLoading(source, false);
  }, [isLoading, reportLoading, source]);
};
