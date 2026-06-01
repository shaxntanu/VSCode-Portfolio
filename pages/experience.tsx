import styles from '@/styles/ExperiencePage.module.css';
import RotatingText from '@/components/RotatingText';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ExperiencePage = () => {
  const rotatingTexts = ['LOG', 'Product', 'IoT', 'Embedded', 'Circuits'];

  // Function to calculate duration between two dates
  const calculateDuration = (startDate: string, endDate: string | 'Present') => {
    const start = new Date(startDate);
    const end = endDate === 'Present' ? new Date() : new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 'N/A';
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    
    if (months <= 0) return '< 1 mo';
    
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

## [HARDWARE PROJECT] Smart Blind Stick | Arceus Labs
**Role:** Lead Engineer  
**Timeline:** Jul 2018 - Aug 2018  
**Tech Stack:** Arduino, C++

### KEY DELIVERABLES
*   Developed a **smart mobility aid** for visually impaired individuals with obstacle detection capabilities.
*   Integrated **ultrasonic sensors** for real-time distance measurement and collision avoidance.
*   Implemented multi-modal alerts with **buzzer** and **voice prompts** for enhanced user safety and navigation.

## [HARDWARE PROJECT] Zephyr-Station
**Role:** Lead Engineer  
**Timeline:** Aug 2025 - Nov 2025  
**Tech Stack:** C++, ESP32

### KEY DELIVERABLES
*   **ESP32-based environmental monitoring system** with real-time sensor acquisition, **OLED display**, **SD card data logging**, and threshold-based alerts.
*   Integrated **BME280** (temperature, humidity, pressure) & **MQ135** (air quality) sensors for comprehensive environmental monitoring.
*   Designed custom power management circuits for off-grid reliability and low-power operation.

## [HARDWARE PROJECT] Jolt-Locator | Arceus Labs
**Role:** Lead Engineer  
**Timeline:** Nov 2025 - Dec 2025  
**Tech Stack:** C++, ESP32

### KEY DELIVERABLES
*   **GPS-based true-north navigation system** running on **ESP32** with real-time heading and location processing.
*   Implemented accurate compass functionality with magnetic declination correction for offline navigation.
*   Designed for outdoor navigation and location tracking applications with intuitive display interface.

## [HARDWARE PROJECT] The-Ruin-Machine | Arceus Labs
**Role:** Lead Engineer  
**Timeline:** Jan 2026  
**Tech Stack:** C++, ESP32

### KEY DELIVERABLES
*   **Probability and stochastic-model simulator** implemented on **ESP32** with physical I/O (**OLED + buzzer**).
*   Mathematical demonstration proving gambling always leads to loss through interactive simulations.
*   Designed intuitive user interface for educational purposes showing betting strategy failures.

## [UNDER DEVELOPMENT] ARC-4
**Timeline:** Jan 2026

## [UNDER DEVELOPMENT] NOEMA
**Timeline:** Feb 2026

## [UNDER DEVELOPMENT] Aether
**Timeline:** Apr 2026

---

## [EDUCATION] Thapar Institute (TIET)
**Degree:** '29 B.E. Electronics and Communication Engineering  
**Focus:** Embedded Systems, IoT, Circuit Design, Signal Processing`;

  return (
    <>
      <div className={styles.content}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: () => (
              <div className={styles.h1Wrapper}>
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
            ),
            h2: ({ children }) => <h2 className={styles.h2}>{children}</h2>,
            h3: ({ children }) => <h3 className={styles.h3}>{children}</h3>,
            p: ({ children }) => <p className={styles.p}>{children}</p>,
            li: ({ children }) => <li className={styles.li}>{children}</li>,
            hr: () => <hr className={styles.hr} />,
            strong: ({ children }) => <strong className={styles.bold}>{children}</strong>,
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                {children}
              </a>
            ),
          }}
        >
          {markdownContent}
        </ReactMarkdown>
      </div>
    </>
  );
};

export async function getStaticProps() {
  return {
    props: { 
      title: 'Experience',
      ogDescription: 'Work experience as Core Engineer at Ragastra, Founder of Arceus Labs, and Early-Stage Engineer at Grosity.'
    },
  };
}

export default ExperiencePage;
