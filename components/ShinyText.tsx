import styles from '@/styles/ShinyText.module.css';
import { ReactNode } from 'react';

interface ShinyTextProps {
  text?: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  children?: ReactNode;
}

const ShinyText = ({ 
  text, 
  disabled = false, 
  speed = 5, 
  className = '',
  children 
}: ShinyTextProps) => {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={`${styles.shinyText} ${disabled ? styles.disabled : ''} ${className}`}
      style={{ animationDuration }}
    >
      {children || text}
    </div>
  );
};

export default ShinyText;
