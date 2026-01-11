import { useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from '@/styles/404Page.module.css';

const Custom404 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    let animationId: number;
    let time = 0;

    const animate = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      ctx.clearRect(0, 0, w, h);

      // Get CSS variable for accent color
      const accentColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--accent-color')
        .trim() || '#ff6b6b';

      // Draw animated circles
      for (let i = 0; i < 3; i++) {
        const offset = (i * Math.PI * 2) / 3;
        const x = w / 2 + Math.cos(time + offset) * (w / 6);
        const y = h / 2 + Math.sin(time + offset) * (h / 6);
        const radius = 20 + Math.sin(time * 2 + offset) * 10;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = accentColor + '40';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, radius / 2, 0, Math.PI * 2);
        ctx.fillStyle = accentColor + '80';
        ctx.fill();
      }

      time += 0.02;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.logoWrapper}>
            <canvas ref={canvasRef} className={styles.canvas}></canvas>
          </div>

          <div className={styles.errorCode}>404</div>
          <h1 className={styles.title}>Page Not Found</h1>
          <p className={styles.message}>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          <div className={styles.actions}>
            <Link href="/">
              <button className={styles.button}>
                <span className={styles.shadow}></span>
                <span className={styles.edge}></span>
                <div className={styles.front}>
                  <span>← Back to Home</span>
                </div>
              </button>
            </Link>
          </div>
        </div>
      </div>
  );
};

export async function getStaticProps() {
  return {
    props: { title: '404 - Page Not Found' },
  };
}

export default Custom404;
