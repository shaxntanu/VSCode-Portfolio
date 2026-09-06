// Simplified Avatar runtime for Portfolio Companion
// Based on bible-strong/avatar-lab Avatar component
import { useEffect, useLayoutEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import styles from './Avatar.module.css';

interface AvatarDefinition {
  schema: string;
  schemaVersion: number;
  name: string;
  colors: {
    body: string;
    eyes: string;
  };
  body: any;
  expressions: Record<string, any>;
  expressionOrder: string[];
  animations: Record<string, any>;
  animationOrder: string[];
}

interface AvatarProps {
  definition: AvatarDefinition;
  defaultAnimation?: string;
  autoplay?: boolean;
  size?: number;
  ariaLabel?: string;
}

export interface AvatarRef {
  play: (animationKey: string) => void;
  stop: () => void;
}

const Avatar = forwardRef<AvatarRef, AvatarProps>(({
  definition,
  defaultAnimation = 'idle',
  autoplay = true,
  size = 96,
  ariaLabel = 'Avatar'
}, ref) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const currentAnimationRef = useRef<string>(defaultAnimation);
  const animationFrameRef = useRef<number | null>(null);

  // Simple render - just show the neutral expression with colors
  useLayoutEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const { colors } = definition;

    // Clear existing content
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Create a simple circular avatar with the body color
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '0');
    circle.setAttribute('cy', '0');
    circle.setAttribute('r', '120');
    circle.setAttribute('fill', colors.body);
    svg.appendChild(circle);

    // Add eyes
    const leftEye = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    leftEye.setAttribute('cx', '-35');
    leftEye.setAttribute('cy', '-20');
    leftEye.setAttribute('rx', '15');
    leftEye.setAttribute('ry', '35');
    leftEye.setAttribute('fill', colors.eyes);
    svg.appendChild(leftEye);

    const rightEye = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    rightEye.setAttribute('cx', '35');
    rightEye.setAttribute('cy', '-20');
    rightEye.setAttribute('rx', '15');
    rightEye.setAttribute('ry', '35');
    rightEye.setAttribute('fill', colors.eyes);
    svg.appendChild(rightEye);
  }, [definition]);

  // Simple animation loop
  useEffect(() => {
    if (!autoplay || !defaultAnimation) return;

    let isRunning = true;
    
    const animate = () => {
      if (!isRunning) return;
      
      // Placeholder for animation logic
      // In a full implementation, this would update the SVG based on animation frames
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      isRunning = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [autoplay, defaultAnimation]);

  // Expose control methods
  useImperativeHandle(ref, () => ({
    play: (animationKey: string) => {
      currentAnimationRef.current = animationKey;
      // In full implementation: trigger animation change
    },
    stop: () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }
  }));

  return (
    <div
      className={styles.avatar}
      style={{
        width: size,
        height: size,
      }}
      role="img"
      aria-label={ariaLabel}
    >
      <svg
        ref={svgRef}
        className={styles.svg}
        viewBox="-150 -150 300 300"
        aria-hidden="true"
      />
    </div>
  );
});

Avatar.displayName = 'Avatar';

export default Avatar;
