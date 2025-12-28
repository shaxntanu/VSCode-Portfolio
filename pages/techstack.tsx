import styles from '@/styles/TechstackPage.module.css';

const csvData = `ID,COMPONENT,CATEGORY,PROFICIENCY,STATUS
001,KiCAD,PCB Design,Intermediate,Schematic Only
002,ESP32,Microcontroller,Advanced,Daily Driver
003,Arduino,Microcontroller,Advanced,Daily Driver
004,BME280 / GPS / OLED / Ultrasonic / SD,Sensors,Advanced,Deployed
005,Multimeter,Measurement,Intermediate,Active
006,Vernier Caliper,Measurement,Advanced,Active
007,I2C / SPI / UART,Protocol,Intermediate,Applied
008,MQTT,Protocol,Intermediate,Library Use
009,C (Embedded),Language,Advanced,Firmware
010,C++ (Arduino/ESP32),Language,Intermediate,Daily Driver
011,Serial Monitor,Debugging,Advanced,Active
012,Arduino IDE,IDE,Advanced,Daily Driver
013,Kiro IDE,IDE,Advanced,Daily Driver
014,Tinkercad,Simulation,Advanced,Prototyping
015,Wokwi,Simulation,Advanced,Prototyping
016,Git / GitHub,Version Control,Advanced,Active
017,Notion,Documentation,Advanced,Daily Driver
018,Obsidian,Documentation,Advanced,Daily Driver
019,HTML / CSS / JavaScript,Web Frontend,Basic,AI-Assisted
020,React / Tailwind CSS,Web Framework,Basic,AI-Assisted
021,Firebase,Database,Basic,AI-Assisted
022,Vercel,Deployment,Advanced,Active`;

const TechStackPage = () => {
  // Parse CSV
  const lines = csvData.trim().split('\n');
  const headers = lines[0].split(',');
  const rows = lines.slice(1).map(line => line.split(','));

  const getStatusColor = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (['daily driver', 'deployed', 'active', 'firmware'].includes(lowerStatus)) {
      return styles.statusGreen;
    }
    if (['learning', 'project-based', 'prototyping', 'schematic only', 'library use', 'applied', 'ai-assisted'].includes(lowerStatus)) {
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
