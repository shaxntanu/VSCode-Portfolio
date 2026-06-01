import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { rootFile, portfolioFiles, navFolders } from '@/data/navigation';
import styles from '@/styles/CommandPalette.module.css';

interface Command {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  action: () => void;
  category: 'navigation' | 'theme' | 'settings';
}

const themes = [
  { id: 'github-dark', name: 'GitHub Dark' },
  { id: 'dracula', name: 'Dracula' },
  { id: 'ayu-dark', name: 'Ayu Dark' },
  { id: 'ayu-mirage', name: 'Ayu Mirage' },
  { id: 'nord', name: 'Nord' },
  { id: 'night-owl', name: 'Night Owl' },
];

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const setTheme = (themeId: string) => {
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('theme', themeId);
    window.dispatchEvent(new Event('themeChange'));
    window.dispatchEvent(new Event('themeChanged'));
  };

  const allFiles = [
    rootFile,
    ...portfolioFiles,
    ...navFolders.flatMap(f => f.files),
  ];

  const commands: Command[] = [
    ...allFiles.map(file => ({
      id: `nav-${file.path}`,
      label: file.name,
      description: file.path,
      icon: file.icon,
      category: 'navigation' as const,
      action: () => router.push(file.path),
    })),
    ...themes.map(theme => ({
      id: `theme-${theme.id}`,
      label: `Theme: ${theme.name}`,
      description: 'Switch color theme',
      category: 'theme' as const,
      action: () => setTheme(theme.id),
    })),
    {
      id: 'settings-lite',
      label: 'Toggle Lite Mode',
      description: 'Enable or disable animations',
      category: 'settings' as const,
      action: () => {
        const current = localStorage.getItem('liteMode') !== 'false';
        localStorage.setItem('liteMode', String(!current));
        window.location.reload();
      },
    },
    {
      id: 'nav-settings',
      label: 'Open Settings',
      description: '/settings',
      category: 'navigation' as const,
      action: () => router.push('/settings'),
    },
  ];

  const filtered = commands.filter(cmd => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      cmd.label.toLowerCase().includes(q) ||
      (cmd.description?.toLowerCase().includes(q) ?? false)
    );
  });

  const handleOpen = useCallback(() => {
    setOpen(true);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setQuery('');
  }, []);

  const handleSelect = useCallback(
    (cmd: Command) => {
      cmd.action();
      handleClose();
    },
    [handleClose]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (open) {
          handleClose();
        } else {
          handleOpen();
        }
      }
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, handleOpen, handleClose]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    }
    if (e.key === 'Enter' && filtered[selectedIndex]) {
      handleSelect(filtered[selectedIndex]);
    }
  };

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.palette} onClick={e => e.stopPropagation()}>
        <div className={styles.inputWrapper}>
          <span className={styles.searchIcon}>›</span>
          <input
            ref={inputRef}
            className={styles.input}
            placeholder="Type a command or file name..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <kbd className={styles.escKey}>esc</kbd>
        </div>
        <div className={styles.results}>
          {filtered.length === 0 && (
            <div className={styles.empty}>No results for &quot;{query}&quot;</div>
          )}
          {filtered.map((cmd, i) => (
            <div
              key={cmd.id}
              className={`${styles.item} ${i === selectedIndex ? styles.selected : ''}`}
              onClick={() => handleSelect(cmd)}
              onMouseEnter={() => setSelectedIndex(i)}
            >
              <div className={styles.itemLeft}>
                {cmd.icon ? (
                  <Image src={cmd.icon} alt="" width={16} height={16} />
                ) : (
                  <span className={styles.categoryIcon}>
                    {cmd.category === 'theme'
                      ? '🎨'
                      : cmd.category === 'settings'
                      ? '⚙️'
                      : '→'}
                  </span>
                )}
                <span className={styles.itemLabel}>{cmd.label}</span>
              </div>
              {cmd.description && (
                <span className={styles.itemDesc}>{cmd.description}</span>
              )}
            </div>
          ))}
        </div>
        <div className={styles.footer}>
          <span>
            <kbd>↑↓</kbd> navigate
          </span>
          <span>
            <kbd>↵</kbd> select
          </span>
          <span>
            <kbd>esc</kbd> close
          </span>
          <span>
            <kbd>Ctrl K</kbd> toggle
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
