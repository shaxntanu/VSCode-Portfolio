import Head from '@/components/Head';
import styles from '@/styles/ExperiencePage.module.css';
import RotatingText from '@/components/RotatingText';
import { JSX } from 'react';

const ExperiencePage = () => {
  const rotatingTexts = ['LOG', 'Product', 'IoT', 'Embedded Systems', 'Circuits', 'Sketch', 'Design'];

  const markdownContent = `# EXPERIENCE LOG

---

## [Work Experience] Early-Stage Founding Engineer @ Grosity
**Timeline:** October 2025 - Present  
**Location:** Patiala, Punjab

### KEY CONTRIBUTIONS
*   Developed and deployed the company's public website using **AI-assisted workflows** (Claude, GitHub Copilot, Kiro IDE).
*   Contributed to early-stage **R&D for autonomous payload-delivery drone systems**, including embedded electronics and logic.
*   Worked with **B2B and D2C product models**, helping align engineering decisions with business strategy.

---

## [HARDWARE PROJECT] Zephyr-Station
**Role:** Lead Engineer  
**Timeline:** Aug 2025 - Nov 2025  
**Tech Stack:** C++, ESP32

### KEY DELIVERABLES
*   **ESP32-based environmental monitoring system** with real-time sensor acquisition, **OLED display**, **SD card data logging**, and threshold-based alerts.
*   Integrated **BME280** (temperature, humidity, pressure) & **MQ135** (air quality) sensors for comprehensive environmental monitoring.
*   Designed custom power management circuits for off-grid reliability and low-power operation.

---

## [HARDWARE PROJECT] Jolt-Locator | Arceus Labs
**Role:** Lead Engineer  
**Timeline:** Nov 2025 - Dec 2025  
**Tech Stack:** C++, ESP32

### KEY DELIVERABLES
*   **GPS-based true-north navigation system** running on **ESP32** with real-time heading and location processing.
*   Implemented accurate compass functionality with magnetic declination correction for offline navigation.
*   Designed for outdoor navigation and location tracking applications with intuitive display interface.

---

## [HARDWARE PROJECT] The-Ruin-Machine | Arceus Labs
**Role:** Lead Engineer  
**Timeline:** Jan 2026  
**Tech Stack:** C++, ESP32

### KEY DELIVERABLES
*   **Probability and stochastic-model simulator** implemented on **ESP32** with physical I/O (**OLED + buzzer**).
*   Mathematical demonstration proving gambling always leads to loss through interactive simulations.
*   Designed intuitive user interface for educational purposes showing betting strategy failures.

---

## [HARDWARE PROJECT] Smart Blind Stick
**Role:** Lead Engineer  
**Timeline:** Jul 2018 - Aug 2018  
**Tech Stack:** Arduino, C++

### KEY DELIVERABLES
*   Developed a **smart mobility aid** for visually impaired individuals with obstacle detection capabilities.
*   Integrated **ultrasonic sensors** for real-time distance measurement and collision avoidance.
*   Implemented multi-modal alerts with **buzzer** and **voice prompts** for enhanced user safety and navigation.

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
