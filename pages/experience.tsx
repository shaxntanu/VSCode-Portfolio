import Head from '@/components/Head';
import styles from '@/styles/ExperiencePage.module.css';
import RotatingText from '@/components/RotatingText';
import { JSX } from 'react';

const ExperiencePage = () => {
  const rotatingTexts = ['LOG', 'Product', 'IoT', 'Embedded Systems', 'Circuits', 'Sketch', 'Design'];

  const markdownContent = `# EXPERIENCE LOG

---

## [Work Experience] Product Developer @ Grosity
**Timeline:** October 2024 - Present  
**Status:** Active

### KEY CONTRIBUTIONS
*   **System Architecture:** Designed core logic for AI-assisted product development platform.
*   **Frontend Engineering:** Built responsive interfaces using **React.js** and **Tailwind CSS**.
*   **IoT Integration:** Developed IoT-enabled quality assessment prototype for fresh produce, utilizing sensors and ML to detect spoilage biomarkers.
*   **Full-Stack Development:** Implemented end-to-end features from database design to user interface.

---

## [HARDWARE PROJECT] Zephyr Station
**Role:** Lead Engineer  
**Timeline:** 2025

### KEY DELIVERABLES
*   Engineered an **ESP32-based** environmental monitoring system with real-time data logging.
*   Integrated **BME280** (temperature, humidity, pressure) & **MQ135** (air quality) sensors.
*   Designed custom power management circuits for off-grid reliability and low-power operation.
*   Implemented wireless data transmission and cloud integration for remote monitoring.

---

## [HARDWARE PROJECT] Smart Blind Stick
**Role:** Lead Engineer  
**Timeline:** 2018

### KEY DELIVERABLES
*   Developed an assistive mobility device for visually impaired individuals using **Arduino**.
*   Integrated **ultrasonic sensors** (HC-SR04) for real-time obstacle detection (up to 3 meters).
*   Implemented multi-modal alerts: **buzzer** for proximity warnings and **voice prompts** for navigation.
*   Designed ergonomic form factor with rechargeable battery system.

---

## [HARDWARE PROJECT] IoT Weather Station
**Role:** Hardware Engineer  
**Timeline:** 2024

### KEY DELIVERABLES
*   Built a multi-sensor weather monitoring system using **ESP8266** and **DHT22** sensors.
*   Implemented real-time data visualization dashboard with **ThingSpeak** cloud integration.
*   Designed PCB layout for compact, weatherproof enclosure.
*   Achieved 24/7 operation with solar panel charging system.

---

## [EDUCATION] Thapar Institute (TIET)
**Degree:** B.E. Electronics and Communication Engineering  
**Focus:** Embedded Systems, IoT, Circuit Design, Signal Processing`;

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
