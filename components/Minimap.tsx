/**
 * VS Code-Style Minimap Component - New Architecture
 * Uses shared content model instead of DOM inspection
 * Architecture: Model -> Compiler -> Renderer -> Viewport
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Minimap.module.css';

// New architecture imports
import { compileLayout } from '@/src/minimap/compiler/LayoutCompiler';
import { renderMinimap } from '@/src/minimap/renderer/CanvasRenderer';
import { createViewportRenderer } from '@/src/minimap/renderer/ViewportRenderer';
import { createInteractionController } from '@/src/minimap/interaction/InteractionController';
import { getAboutPageContent } from '@/src/minimap/model/pageModels/aboutPageModel';
import { getExperiencePageContent } from '@/src/minimap/model/pageModels/experiencePageModel';
import { getProjectsPageContent } from '@/src/minimap/model/pageModels/projectsPageModel';
import { getPublicationsPageContent } from '@/src/minimap/model/pageModels/publicationsPageModel';
import { getCertificatesPageContent } from '@/src/minimap/model/pageModels/certificatesPageModel';
import { LayoutModel } from '@/src/minimap/types/layout';

const MINIMAP_PAGES = [
  '/about',
  '/experience',
  '/projects',
  '/publications',
  '/certificates',
];

// Page model registry - maps routes to their content models
const PAGE_MODELS: Record<string, () => any> = {
  '/about': getAboutPageContent,
  '/experience': getExperiencePageContent,
  '/projects': getProjectsPageContent,
  '/publications': getPublicationsPageContent,
  '/certificates': getCertificatesPageContent,
};

const Minimap = () => {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRendererRef = useRef<ReturnType<typeof createViewportRenderer> | null>(null);
  const interactionControllerRef = useRef<ReturnType<typeof createInteractionController> | null>(null);
  const layoutModelRef = useRef<LayoutModel | null>(null);
  const rafRef = useRef<number | null>(null);
  const recompileTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [viewportMetrics, setViewportMetrics] = useState({
    top: 0,
    height: 20,
  });

  const shouldShow = MINIMAP_PAGES.includes(router.pathname) && !!PAGE_MODELS[router.pathname];

  // Initialize viewport renderer
  useEffect(() => {
    if (!containerRef.current) return;

    const viewportRenderer = createViewportRenderer();
    const viewportElement = viewportRenderer.init(containerRef.current);
    viewportRendererRef.current = viewportRenderer;

    // Initialize interaction controller
    const interactionController = createInteractionController();
    interactionControllerRef.current = interactionController;

    // Wire up viewport interactions
    viewportElement.addEventListener('mousedown', (e) => {
      interactionController.handleDragStart();
      viewportRenderer.setDragging(true);
      e.preventDefault();
    });

    return () => {
      viewportRenderer.destroy();
      interactionController.destroy();
    };
  }, []);

  // Compile layout when page changes
  useEffect(() => {
    if (!shouldShow) return;

    const pageModel = PAGE_MODELS[router.pathname];
    if (!pageModel) return;

    // Get content model
    const content = pageModel();
    
    // Compile layout
    const layout = compileLayout(content);
    layoutModelRef.current = layout;

    // Render to canvas
    if (canvasRef.current) {
      renderMinimap(canvasRef.current, layout);
    }

    // Update viewport
    if (viewportRendererRef.current && interactionControllerRef.current) {
      const metrics = interactionControllerRef.current.calculateViewportMetrics();
      setViewportMetrics(metrics);
      viewportRendererRef.current.update(metrics);
    }
  }, [router.pathname, shouldShow]);

  // Handle scroll events
  useEffect(() => {
    const interactionController = interactionControllerRef.current;
    const viewportRenderer = viewportRendererRef.current;
    if (!interactionController || !viewportRenderer) return;

    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const metrics = interactionController.calculateViewportMetrics();
        setViewportMetrics(metrics);
        viewportRenderer.update(metrics);
      });
    };

    const content = document.getElementById('main-editor');
    if (!content) return;

    content.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      content.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (recompileTimeoutRef.current) {
        clearTimeout(recompileTimeoutRef.current);
      }

      recompileTimeoutRef.current = setTimeout(() => {
        const pageModel = PAGE_MODELS[router.pathname];
        if (pageModel && layoutModelRef.current) {
          const content = pageModel();
          const layout = compileLayout(content);
          layoutModelRef.current = layout;

          if (canvasRef.current) {
            renderMinimap(canvasRef.current, layout);
          }
        }
      }, 200);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (recompileTimeoutRef.current) {
        clearTimeout(recompileTimeoutRef.current);
      }
    };
  }, [router.pathname]);

  // Handle theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      if (canvasRef.current && layoutModelRef.current) {
        renderMinimap(canvasRef.current, layoutModelRef.current);
      }
    };

    window.addEventListener('themeChanged', handleThemeChange);

    return () => {
      window.removeEventListener('themeChanged', handleThemeChange);
    };
  }, []);

  // Handle minimap click
  const handleMinimapClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current || !interactionControllerRef.current) return;

      interactionControllerRef.current.handleClick(
        containerRef.current,
        e.clientY
      );
    },
    []
  );

  // Handle viewport drag
  useEffect(() => {
    const interactionController = interactionControllerRef.current;
    const viewportRenderer = viewportRendererRef.current;
    if (!interactionController || !viewportRenderer) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      interactionController.handleDragMove(containerRef.current, e.clientY);
    };

    const handleMouseUp = () => {
      interactionController.handleDragEnd();
      viewportRenderer.setDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Update viewport when metrics change
  useEffect(() => {
    if (viewportRendererRef.current) {
      viewportRendererRef.current.update(viewportMetrics);
    }
  }, [viewportMetrics]);

  if (!shouldShow) return null;

  return (
    <div
      ref={containerRef}
      className={styles.minimap}
      onClick={handleMinimapClick}
    >
      <canvas
        ref={canvasRef}
        width={80}
        height={600}
        className={styles.canvas}
      />
    </div>
  );
};

export default Minimap;
