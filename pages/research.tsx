import { VscLinkExternal } from 'react-icons/vsc';
import { SiNotion } from 'react-icons/si';
import styles from '@/styles/ResearchPage.module.css';

const papers = [
  {
    id: 'DOC-SBS-001',
    title: 'Smart Blind Stick: Ultrasonic Navigation System',
    type: 'Technical Report',
    date: '2025-11-25',
    status: 'PUBLISHED',
    link: 'https://crocus-zenobia-863.notion.site/Smart-Blind-Stick-Report-2a01ebfe2064802580bcd52932677de4',
  },
  {
    id: 'DOC-ZPH-002',
    title: 'Zephyr Station: IoT Environmental Monitor',
    type: 'Technical Report',
    date: '2025-11-26',
    status: 'PUBLISHED',
    link: 'https://crocus-zenobia-863.notion.site/Zephyr-Station-Technical-Report-de41e9c0afd3444195afbac904fe2edc',
  },
  {
    id: 'DOC-JLT-003',
    title: 'Jolt Locator: Technical Report',
    type: 'Technical Report',
    date: '2025-12-27',
    status: 'PUBLISHED',
    link: 'https://crocus-zenobia-863.notion.site/Jolt-Locator-Technical-Report-2d61ebfe20648069a6e1c0589107c909?pvs=73',
  },
  {
    id: 'DOC-TRM-004',
    title: 'The Ruin Machine: Technical Report',
    type: 'Technical Report',
    date: '2026-01-02',
    status: 'PUBLISHED',
    link: 'https://crocus-zenobia-863.notion.site/The-Ruin-Machine-Technical-Report-2dc1ebfe2064806a9625f49a9871aaf3?pvs=73',
  },
];

const ResearchPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Reports & Research</h1>
      <p className={styles.pageSubtitle}>
        Technical documentation and research papers on my engineering projects.
      </p>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Technical Reports</h2>
        <div className={styles.grid}>
          {papers.map((paper) => (
            <a
              key={paper.id}
              href={paper.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
            >
              <div className={styles.cardIcon}>
                <SiNotion />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{paper.title}</h3>
                <div className={styles.cardMeta}>
                  <span className={styles.cardId}>{paper.id}</span>
                  <span className={styles.cardType}>{paper.type}</span>
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.cardDate}>{paper.date}</span>
                  <span className={styles.statusBadge}>{paper.status}</span>
                </div>
              </div>
              <div className={styles.cardLink}>
                <VscLinkExternal />
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Research Papers</h2>
        <div className={styles.comingSoon}>
          <p>Coming Soon</p>
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: { title: 'Research' },
  };
}

export default ResearchPage;
