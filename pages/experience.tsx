import Head from '@/components/Head';
import styles from '@/styles/ExperiencePage.module.css';
import RotatingText from '@/components/RotatingText';
import { JSX } from 'react';

const ExperiencePage = () => {
  const rotatingTexts = ['LOG', 'Product', 'IoT', 'Embedded Systems', 'Circuits', 'Sketch', 'Design'];

  // Function to calculate duration between two dates
  const calculateDuration = (startDate: string, endDate: string | 'Present') => {
    const start = new Date(startDate);
    const end = endDate === 'Present' ? new Date() : new Date(endDate);
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years > 0 && remainingMonths > 0) {
      return `${years} yr${years > 1 ? 's' : ''} ${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}`;
    } else if (years > 0) {
      return `${years} yr${years > 1 ? 's' : ''}`;
    } else {
      return `${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}`;
    }
  };

  const markdownContent = `# EXPERIENCE LOG

---

## [Project / Research Initiative] Core Engineer: Wireless Power Transfer @ Ragastra
**Timeline:** September 2025 - Present · ${calculateDuration('2025-09-01', 'Present')}  
**Location:** Patiala, Punjab

### KEY FOCUS
*   Working on **Ragastra**, a modular maglev-inspired mobility system designed for controlled environments such as campuses and industrial zones.
*   Exploring the practical scaling-down of maglev principles, focusing on **electromagnetic suspension (EMS)**, **contactless power delivery (WPT)**, and system-level cost optimization.
*   Translating high-level transportation concepts into buildable subsystems with clear mechanical, electrical, and control boundaries.

### KEY CONTRIBUTIONS
*   Designed the system architecture covering **levitation**, **propulsion**, **power delivery**, and **fail-safe mechanisms**.
*   Worked on **WPT TX/RX coil design**, power flow modeling, and cost breakdowns for short-track deployments.
*   Analyzed levitation force requirements, safety wheel integration, and mechanical load paths for fault-tolerant operation.
*   Contributed to pitch preparation, technical justification, and feasibility analysis for early-stage evaluations and competitions.

### CORE THEMES
*   **Systems thinking** over isolated components.
*   **Engineering-first decision making**, prioritizing safety, controllability, and scalability.
*   Balancing ambitious ideas with realistic prototyping constraints.

### ACHIEVEMENTS
*   **1st Prize – Ideastorm Prelims (Punjab Zonals)**, E-Summit '26, IIT Roorkee (hosted at Thapar Institute of Engineering & Technology).
*   Project selected through zonal-level evaluation based on technical feasibility, system design clarity, and cost rationale.

---

## [Open Source Organization] Founder @ Arceus Labs
**Timeline:** December 2025 - Present · ${calculateDuration('2025-12-01', 'Present')}  
**Location:** Remote

### MISSION
*   Created **Arceus Labs** as an open-source hardware organization for developers who want to go beyond tutorials and actually ship hardware.
*   Built a collaborative space where **schematics are shared**, **firmware is open sourced**, and **documentation is written for real-world use**.
*   Focused on making hardware development **accessible, collaborative, and educational** through public iteration and shared learning.

### KEY PRINCIPLES
*   **By developers, for developers** - Building real hardware, writing real firmware, sharing everything.
*   **Open hardware philosophy** - Every project designed to be forked, learned from, and improved upon.
*   **Public iteration** - Making mistakes in public, learning from them, and building something real.
*   Covering **IoT devices**, **custom PCB design**, **firmware development**, and **hardware-level understanding**.

---

## [Work Experience] Early-Stage Founding Engineer @ Grosity
**Timeline:** October 2025 - February 2026 · ${calculateDuration('2025-10-01', '2026-02-28')}  
**Location:** Patiala, Punjab

### KEY CONTRIBUTIONS
*   Developed and deployed the company's public website using **AI-assisted workflows** (Claude, GitHub Copilot, Kiro IDE).
*   Contributed to early-stage **R&D for autonomous payload-delivery drone systems**, including embedded electronics and logic.
*   Worked with **B2B and D2C product models**, helping align engineering decisions with business strategy.

---

## [HARDWARE PROJECT] Smart Blind Stick
**Role:** Lead Engineer  
**Timeline:** Jul 2018 - Aug 2018 · ${calculateDuration('2018-07-01', '2018-08-31')}  
**Tech Stack:** Arduino, C++

### KEY DELIVERABLES
*   Developed a **smart mobility aid** for visually impaired individuals with obstacle detection capabilities.
*   Integrated **ultrasonic sensors** for real-time distance measurement and collision avoidance.
*   Implemented multi-modal alerts with **buzzer** and **voice prompts** for enhanced user safety and navigation.

## [HARDWARE PROJECT] Zephyr-Station
**Role:** Lead Engineer  
**Timeline:** Aug 2025 - Nov 2025 · ${calculateDuration('2025-08-01', '2025-11-30')}  
**Tech Stack:** C++, ESP32

### KEY DELIVERABLES
*   **ESP32-based environmental monitoring system** with real-time sensor acquisition, **OLED display**, **SD card data logging**, and threshold-based alerts.
*   Integrated **BME280** (temperature, humidity, pressure) & **MQ135** (air quality) sensors for comprehensive environmental monitoring.
*   Designed custom power management circuits for off-grid reliability and low-power operation.

## [HARDWARE PROJECT] Jolt-Locator | Arceus Labs
**Role:** Lead Engineer  
**Timeline:** Nov 2025 - Dec 2025 · ${calculateDuration('2025-11-01', '2025-12-31')}  
**Tech Stack:** C++, ESP32

### KEY DELIVERABLES
*   **GPS-based true-north navigation system** running on **ESP32** with real-time heading and location processing.
*   Implemented accurate compass functionality with magnetic declination correction for offline navigation.
*   Designed for outdoor navigation and location tracking applications with intuitive display interface.

## [HARDWARE PROJECT] The-Ruin-Machine | Arceus Labs
**Role:** Lead Engineer  
**Timeline:** Jan 2026 · ${calculateDuration('2026-01-01', '2026-01-31')}  
**Tech Stack:** C++, ESP32

### KEY DELIVERABLES
*   **Probability and stochastic-model simulator** implemented on **ESP32** with physical I/O (**OLED + buzzer**).
*   Mathematical demonstration proving gambling always leads to loss through interactive simulations.
*   Designed intuitive user interface for educational purposes showing betting strategy failures.

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
      // Check for "Arceus Labs" and make it a link
      if (part.includes('Arceus Labs')) {
        const segments = part.split('Arceus Labs');
        return (
          <span key={index}>
            {segments[0]}
            <a
              href="https://arceuslabs.carrd.co"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Arceus Labs
            </a>
            {segments[1]}
          </span>
        );
      }
      // Check for "Ragastra" and make it a link
      if (part.includes('Ragastra')) {
        const segments = part.split('Ragastra');
        return (
          <span key={index}>
            {segments[0]}
            <a
              href="https://github.com/Ragastra"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Ragastra
            </a>
            {segments[1]}
          </span>
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
