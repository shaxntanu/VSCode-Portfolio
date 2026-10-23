import { useRouter } from 'next/router';
import Image from 'next/image';
import { rootFile, portfolioFiles, navFolders } from '@/data/navigation';

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
    <div className="scrollbar-hidden flex h-7 shrink-0 items-center gap-1 overflow-x-auto whitespace-nowrap border-b border-[var(--explorer-border)] bg-[var(--main-bg)] px-4 py-1 font-code text-[0.78rem] text-[var(--text-secondary,rgba(255,255,255,0.5))] max-[600px]:px-3 max-[600px]:text-[0.7rem]">
      <span className="cursor-default text-[var(--text-secondary,rgba(255,255,255,0.5))]">shantanu-portfolio</span>
      <span className="px-[0.1rem] text-[0.7rem] text-[var(--text-muted,rgba(255,255,255,0.25))]">›</span>
      {folder && (
        <>
          <span className="cursor-default text-[var(--text-secondary,rgba(255,255,255,0.5))]">{folder}</span>
          <span className="px-[0.1rem] text-[0.7rem] text-[var(--text-muted,rgba(255,255,255,0.25))]">›</span>
        </>
      )}
      <span className="flex items-center gap-[0.35rem] text-[var(--text-color,rgba(255,255,255,0.9))]">
        <Image src={file.icon} alt={file.name} width={14} height={14} />
        <span>{file.name}</span>
      </span>
    </div>
  );
};

export default Breadcrumbs;
