import { statusBarItems } from '@/data/statusbar';
import styles from '@/styles/Bottombar.module.css';

const Bottombar = () => {
  const leftItems = statusBarItems.filter(item => item.side === 'left').sort((a, b) => a.priority - b.priority);
  const rightItems = statusBarItems.filter(item => item.side === 'right').sort((a, b) => a.priority - b.priority);

  const renderItem = (item: typeof statusBarItems[0]) => {
    const content = (
      <>
        {item.icon && <item.icon className={styles.icon} />}
        <span>{item.text}</span>
      </>
    );

    const className = `${styles.section} ${styles[`priority${item.priority}`]}`;

    if (item.link) {
      return (
        <a
          key={item.id}
          href={item.link}
          target="_blank"
          rel="noreferrer noopener"
          className={className}
          title={item.tooltip}
        >
          {content}
        </a>
      );
    }

    return (
      <div key={item.id} className={className} title={item.tooltip}>
        {content}
      </div>
    );
  };

  return (
    <footer className={styles.bottomBar}>
      <div className={styles.container}>
        {leftItems.map(renderItem)}
      </div>
      <div className={styles.container}>
        {rightItems.map(renderItem)}
      </div>
    </footer>
  );
};

export default Bottombar;
