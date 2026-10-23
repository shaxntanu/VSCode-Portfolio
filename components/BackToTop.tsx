import { useState, useEffect, useCallback, useRef } from 'react';
import { usePageScrollContainer } from '@/hooks/usePageScrollContainer';

const BackToTop = () => {
  const { scrollContainer, layoutVersion } = usePageScrollContainer();
  const [isVisible, setIsVisible] = useState(false);
  const rafRef = useRef<number | null>(null);

  const handleScroll = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (!scrollContainer) {
        setIsVisible(false);
        return;
      }

      const scrollTop = scrollContainer.scrollTop;
      setIsVisible(scrollTop >= 150);
    });
  }, [scrollContainer]);

  const scrollToTop = useCallback(() => {
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [scrollContainer]);

  useEffect(() => {
    if (!scrollContainer) {
      setIsVisible(false);
      return;
    }

    // Add scroll listener to the discovered container
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });

    // Initial check
    handleScroll();

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [scrollContainer, handleScroll, layoutVersion]);

  return (
    <button
      className={`group absolute bottom-6 left-4 z-10 flex h-9 w-[168px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded border border-[var(--border,rgba(255,255,255,0.1))] bg-[var(--explorer-bg,rgb(30,30,30))] font-ui font-semibold text-[var(--text-color,rgba(255,255,255,0.9))] opacity-0 pointer-events-none translate-y-2 transition-[opacity,transform,background-color,border-color] duration-200 ease-out hover:border-[var(--border-subtle,rgba(255,255,255,0.2))] hover:bg-[var(--explorer-hover-bg,rgb(40,40,40))] active:bg-[var(--explorer-active-bg,rgb(50,50,50))] motion-reduce:transition-none ${isVisible ? 'pointer-events-auto translate-y-0 opacity-100' : ''}`}
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
    >
      <svg className="h-[14px] w-[14px] fill-current transition-transform duration-150 group-hover:-translate-y-px motion-reduce:transition-none motion-reduce:group-hover:translate-y-0" viewBox="0 0 384 512">
        <path fill="currentColor" d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0l-160-160z" />
      </svg>
      <span className="text-[13px] font-medium tracking-[0.3px]">Back to Top</span>
    </button>
  );
};

export default BackToTop;
