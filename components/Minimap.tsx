import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Minimap.module.css';

const MINIMAP_PAGES = ['/about', '/experience', '/projects', '/research', '/certificates'];

const Minimap = () => {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollPercent, setScrollPercent] = useState(0);

  const shouldShow = MINIMAP_PAGES.includes(router.pathname);

  useEffect(() => {
    const mainEditor = document.getElementById('main-editor');
    if (!mainEditor) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = mainEditor;
      const percent =
        scrollHeight > clientHeight ? scrollTop / (scrollHeight - clientHeight) : 0;
      setScrollPercent(percent);
    };

    mainEditor.addEventListener('scroll', handleScroll);
    return () => mainEditor.removeEventListener('scroll', handleScroll);
  }, [router.pathname]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Get accent color from CSS variable
    const accentColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent-color')
      .trim() || '#e6b450';

    const lineCount = 80;
    const lineHeight = height / lineCount;

    for (let i = 0; i < lineCount; i++) {
      const y = i * lineHeight + lineHeight / 2;
      const indent = Math.floor(Math.random() * 4) * 6;
      const lineWidth = 15 + Math.random() * (width - indent - 20);
      const alpha = 0.08 + Math.random() * 0.12;

      // Occasional highlighted lines (simulating code)
      if (Math.random() > 0.85) {
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillRect(0, i * lineHeight, width, lineHeight);
      }

      // Occasional colored tokens
      if (Math.random() > 0.7) {
        ctx.fillStyle = accentColor;
        ctx.globalAlpha = alpha * 2;
        ctx.fillRect(indent, y - 1, Math.random() * 20 + 10, 2);
        ctx.globalAlpha = 1;
      }

      // Main line body
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fillRect(indent, y - 1, lineWidth, 1.5);
    }
  }, [router.pathname]);

  if (!shouldShow) return null;

  return (
    <div className={styles.minimap}>
      <canvas
        ref={canvasRef}
        width={80}
        height={600}
        className={styles.canvas}
      />
      <div
        className={styles.viewport}
        style={{ top: `${scrollPercent * 70}%` }}
      />
    </div>
  );
};

export default Minimap;
