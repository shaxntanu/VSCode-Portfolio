import styles from '@/styles/SkeletonLoader.module.css';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  className?: string;
  animation?: boolean;
}

const Skeleton = ({ 
  variant = 'text', 
  width = '100%', 
  height = '1em', 
  className = '',
  animation = true 
}: SkeletonProps) => {
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={`${styles.skeleton} ${styles[variant]} ${animation ? styles.animated : ''} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
};

export default Skeleton;