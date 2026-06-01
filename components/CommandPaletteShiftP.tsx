import { useState, useEffect, useRef, useCallback } from 'react';
import { allCommands, searchCommands, setNotificationCallback } from '@/data/commands';
import { Command } from '@/types/commands';
import styles from '@/styles/CommandPaletteShiftP.module.css';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

const CommandPaletteShiftP = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Setup notification callback
  useEffect(() => {
    setNotificationCallback((message: string, type: string) => {
      const id = Math.random().toString(36).substr(2, 9);
      const notification: Notification = {
        id,
        message,
        type: type as 'success' | 'info' | 'warning' | 'error',
      };
      setNotifications(prev => [...prev, notification]);
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 3000);
    });
  }, []);

  const filtered = searchCommands(query);

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
    async (cmd: Command) => {
      try {
        await cmd.action();
      } catch (error) {
        console.error('Command execution error:', error);
      }
      handleClose();
    },
    [handleClose]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ctrl+Shift+P to open
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        if (open) {
          handleClose();
        } else {
          handleOpen();
        }
      }
      // Escape to close
      if (e.key === 'Escape' && open) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, handleOpen, handleClose]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Reset selection when query changes
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
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    }
  };

  if (!open) {
    return (
      <div className={styles.notificationContainer}>
        {notifications.map(notif => (
          <div key={notif.id} className={`${styles.notification} ${styles[notif.type]}`}>
            {notif.type === 'success' && <span className={styles.icon}>✓</span>}
            {notif.type === 'error' && <span className={styles.icon}>✕</span>}
            {notif.type === 'warning' && <span className={styles.icon}>⚠</span>}
            {notif.type === 'info' && <span className={styles.icon}>ℹ</span>}
            <span className={styles.message}>{notif.message}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className={styles.overlay} onClick={handleClose}>
        <div className={styles.palette} onClick={e => e.stopPropagation()}>
          <div className={styles.inputWrapper}>
            <span className={styles.searchIcon}>›</span>
            <input
              ref={inputRef}
              className={styles.input}
              placeholder="Type a command..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <kbd className={styles.escKey}>esc</kbd>
          </div>

          <div className={styles.results}>
            {filtered.length === 0 && (
              <div className={styles.empty}>No commands found for &quot;{query}&quot;</div>
            )}

            {filtered.length > 0 && (
              <>
                {/* Group by category */}
                {['resume', 'contact', 'portfolio', 'workspace', 'theme', 'navigation'].map(
                  category => {
                    const categoryCommands = filtered.filter(cmd => cmd.category === category);
                    if (categoryCommands.length === 0) return null;

                    const startIndex = filtered.indexOf(categoryCommands[0]);

                    return (
                      <div key={category} className={styles.categoryGroup}>
                        <div className={styles.categoryHeader}>{category.toUpperCase()}</div>
                        {categoryCommands.map((cmd, idx) => {
                          const globalIndex = startIndex + idx;
                          const IconComponent = cmd.icon;
                          return (
                            <div
                              key={cmd.id}
                              className={`${styles.item} ${
                                globalIndex === selectedIndex ? styles.selected : ''
                              }`}
                              onClick={() => handleSelect(cmd)}
                              onMouseEnter={() => setSelectedIndex(globalIndex)}
                            >
                              <div className={styles.itemLeft}>
                                {IconComponent && (
                                  <span className={styles.itemIcon}>
                                    <IconComponent size={16} />
                                  </span>
                                )}
                                <div className={styles.itemContent}>
                                  <span className={styles.itemTitle}>{cmd.title}</span>
                                  {cmd.description && (
                                    <span className={styles.itemDesc}>{cmd.description}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
                )}
              </>
            )}
          </div>

          <div className={styles.footer}>
            <span>
              <kbd>↑↓</kbd> navigate
            </span>
            <span>
              <kbd>↵</kbd> execute
            </span>
            <span>
              <kbd>esc</kbd> close
            </span>
            <span>
              <kbd>Ctrl Shift P</kbd> toggle
            </span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className={styles.notificationContainer}>
        {notifications.map(notif => (
          <div key={notif.id} className={`${styles.notification} ${styles[notif.type]}`}>
            {notif.type === 'success' && <span className={styles.icon}>✓</span>}
            {notif.type === 'error' && <span className={styles.icon}>✕</span>}
            {notif.type === 'warning' && <span className={styles.icon}>⚠</span>}
            {notif.type === 'info' && <span className={styles.icon}>ℹ</span>}
            <span className={styles.message}>{notif.message}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default CommandPaletteShiftP;
