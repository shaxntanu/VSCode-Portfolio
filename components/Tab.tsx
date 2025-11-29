import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import styles from '@/styles/Tab.module.css';

interface TabProps {
  icon: string;
  filename: string;
  path: string;
  external?: boolean;
}

const Tab = ({ icon, filename, path, external = false }: TabProps) => {
  const router = useRouter();

  if (external) {
    return (
      <a href={path} target="_blank" rel="noopener noreferrer">
        <div className={styles.tab}>
          <Image src={icon} alt={filename} height={18} width={18} />
          <p>{filename}</p>
        </div>
      </a>
    );
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (router.pathname !== path) {
      router.push(path, undefined, { scroll: false });
    }
  };

  return (
    <Link href={path} prefetch={true} onClick={handleClick}>
      <div
        className={`${styles.tab} ${router.pathname === path && styles.active}`}
      >
        <Image src={icon} alt={filename} height={18} width={18} />
        <p>{filename}</p>
      </div>
    </Link>
  );
};

export default Tab;
