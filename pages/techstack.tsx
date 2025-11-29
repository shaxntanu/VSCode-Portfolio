import styles from '@/styles/TechstackPage.module.css';

const csvData = `ID,COMPONENT,CATEGORY,PROFICIENCY,STATUS
001,C++ (Arduino),Language,Intermediate,Daily Driver
002,JavaScript,Language,Functional,Project-Based
003,Notion,Documentation,Advanced,Daily Driver
004,Obsidian,Documentation,Advanced,Daily Driver
005,Python,Language,Basic,Automation
006,ESP32,Hardware,Intermediate,Deployed
007,Arduino Uno,Hardware,Intermediate,Prototyping
008,KiCad,PCB Design,Basic,Schematic Only
009,Multimeter,Hardware,Intermediate,Active
010,Tinkercad,Tools,Intermediate,Prototyping
011,Wokwi,Tools,Intermediate,Prototyping
012,MQTT,Protocol,Applied,Library Use
013,I2C / SPI,Protocol,Applied,Learning
014,Git / GitHub,Tools,Intermediate,Version Control
015,VS Code,IDE,Advanced,Daily Driver`;

const TechStackPage = () => {
  // Parse CSV
  const lines = csvData.trim().split('\n');
  const headers = lines[0].split(',');
  const rows = lines.slice(1).map(line => line.split(','));

  const getStatusColor = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (['daily driver', 'deployed', 'active', 'version control'].includes(lowerStatus)) {
      return styles.statusGreen;
    }
    if (['learning', 'project-based', 'assisted', 'automation', 'prototyping', 'schematic only', 'library use', 'entry-level'].includes(lowerStatus)) {
      return styles.statusYellow;
    }
    return '';
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}># SM_TECHSTACK.CSV</h1>
        <p className={styles.subtitle}>Skill Matrix: Technical Component Inventory</p>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index} className={styles.th}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={styles.tr}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`${styles.td} ${
                      cellIndex === 4 ? getStatusColor(cell) : ''
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>


    </div>
  );
};

export async function getStaticProps() {
  return {
    props: { title: 'Tech Stack' },
  };
}

export default TechStackPage;
