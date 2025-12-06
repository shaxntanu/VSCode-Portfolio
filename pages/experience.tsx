import Head from '@/components/Head';
import styles from '@/styles/ExperiencePage.module.css';
import RotatingText from '@/components/RotatingText';
import { JSX } from 'react';

const ExperiencePage = () => {
  const rotatingTexts = ['LOG', 'Product', 'IoT', 'Embedded Systems', 'Circuits', 'Sketch', 'Design'];

  const markdownContent = `# EXPERIENCE LOG

---

## [Work Experience] Product Developer • Chief Technology Officer @ Grosity
**Timeline:** October 2025 - Present  
**Status:** Active

### KEY CONTRIBUTIONS
*   **System Architecture:** Designed core logic for AI-assisted product development.
*   **Frontend Engineering:** Built responsive interfaces using **React.js** and **Tailwind CSS**.
*   **IoT Integration:** Worked on an IoT-enabled quality assessment prototype for fresh produce, utilizing Sensors and ML to detect spoilage biomarkers.
*   **IoT Integration:** Bridged hardware logic with user-facing software.

---

## [PROJECT] Zephyr Station
**Role:** Lead Engineer  
**Timeline:** 2025

### KEY DELIVERABLES
*   Engineered an **ESP32-based** environmental monitoring system.
*   Integrated BME280 & MQ135 sensors for real-time air quality data.
*   Designed power management circuits for off-grid reliability.

---

## [EDUCATION] Thapar Institute (TIET)
**Degree:** B.E. Electrical Engineering  
**Focus:** Embedded Systems, Circuit Analysis`;

  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let key = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // H1 Headers
      if (line.startsWith('# ')) {
        elements.push(
          <div key={key++} className={styles.h1Wrapper}>
            <div className={styles.h1Border}></div>
            <h1 className={styles.h1}>
              EXPERIENCE{' '}
              <RotatingText
                texts={rotatingTexts}
                rotationInterval={2000}
                staggerFrom="last"
                staggerDuration={0.025}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '-120%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                mainClassName={styles.rotatingTextBox}
                splitLevelClassName={styles.rotatingTextOverflow}
              />
            </h1>
          </div>
        );
      }
      // H2 Headers
      else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={key++} className={styles.h2}>
            {parseBold(line.substring(3))}
          </h2>
        );
      }
      // H3 Headers
      else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={key++} className={styles.h3}>
            {line.substring(4)}
          </h3>
        );
      }
      // Horizontal Rule
      else if (line.trim() === '---') {
        elements.push(<hr key={key++} className={styles.hr} />);
      }
      // List Items
      else if (line.startsWith('*   ')) {
        elements.push(
          <li key={key++} className={styles.li}>
            {parseBold(line.substring(4))}
          </li>
        );
      }
      // Regular paragraphs with bold
      else if (line.trim() !== '') {
        elements.push(
          <p key={key++} className={styles.p}>
            {parseBold(line)}
          </p>
        );
      }
      // Empty lines
      else {
        elements.push(<br key={key++} />);
      }
    }

    return elements;
  };

  const parseBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className={styles.bold}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <>
      <Head title="Experience Log" />
      <div className={styles.content}>{parseMarkdown(markdownContent)}</div>
    </>
  );
};

export default ExperiencePage;
