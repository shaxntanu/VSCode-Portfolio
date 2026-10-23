import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface TabProps {
  icon: string;
  filename: string;
  path: string;
  external?: boolean;
}

const Tab = ({ icon, filename, path, external = false }: TabProps) => {
  const router = useRouter();
  const tabClassName = 'flex min-w-fit max-w-[200px] cursor-pointer items-center whitespace-nowrap border border-[var(--tab-border)] bg-[var(--tab-bg)] px-4 py-2 font-ui text-[0.9rem] text-[var(--text-color,#ececec)]';
  const filenameClassName = 'ml-[5px] min-w-0 overflow-hidden text-ellipsis whitespace-nowrap';

  if (external) {
    return (
      <a href={path} target="_blank" rel="noopener noreferrer">
        <div className={tabClassName}>
          <Image src={icon} alt={filename} height={18} width={18} />
          <p className={filenameClassName}>{filename}</p>
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
        className={`${tabClassName} ${router.pathname === path ? 'border-b-0 border-t-[var(--accent-color)] bg-[var(--tab-active-bg)]' : ''}`}
      >
        <Image src={icon} alt={filename} height={18} width={18} />
        <p className={filenameClassName}>{filename}</p>
      </div>
    </Link>
  );
};

export default Tab;
