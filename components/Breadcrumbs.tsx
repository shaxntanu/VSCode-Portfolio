import { useRouter } from 'next/router';
import Image from 'next/image';
import { rootFile, portfolioFiles, navFolders } from '@/data/navigation';
import styles from '@/styles/Breadcrumbs.module.css';

const Breadcrumbs = () => {
  const router = useRouter();
  const path = router.pathname;

  const findFile = () => {
    if (path === '/') return { file: rootFile, folder: null };
    
    const portfolioFile = portfolioFiles.find(f => f.path === path);
    if (portfolioFile) return { file: portfolioFile, folder: 'Portfolio' };
    
    for (const folder of navFolders) {
      const found = folder.files.find(f => f.path === path);
      if (found) return { file: found, folder: folder.label };
    }
    
    return null;
  };

  const result = findFile();
  if (!result) return null;

  const { file, folder } = result;

  return (
    <div className={styles.breadcrumbs}>
      <span className={styles.segment}>shantanu-portfolio</span>
      <span className={styles.separator}>›</span>
      {folder && (
        <>
          <span className={styles.segment}>{folder}</span>
          <span className={styles.separator}>›</span>
        </>
      )}
      <span className={styles.current}>
        <Image src={file.icon} alt={file.name} width={14} height={14} />
        <span>{file.name}</span>
      </span>
    </div>
  );
};

export default Breadcrumbs;
