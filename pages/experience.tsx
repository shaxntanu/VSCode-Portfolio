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

## [Project / Research Initiative] Ragastra
**Timeline:** September 2025 - Present · ${calculateDuration('2025-09-01', 'Present')}  
**Location:** Patiala, Punjab  
**Roles:** Project Engineer (Sep 2025 - Present) • Project Manager (May 2026 - Present)

### WHAT WE'RE BUILDING
**Ragastra** is a modular maglev-inspired mobility system for controlled environments—campuses, industrial zones, and urban corridors. We're translating high-level transportation concepts into buildable subsystems with clear mechanical, electrical, and control boundaries.

### TECHNICAL FOCUS
*   **Electromagnetic Suspension (EMS)** - Levitation force modeling, safety wheel integration, and fault-tolerant mechanical load paths.
*   **Wireless Power Transfer (WPT)** - TX/RX coil design, power flow modeling, and inductive coupling optimization for moving vehicles.
*   **Embedded Systems** - Real-time control logic, sensor fusion, and fail-safe mechanisms.
*   **System Architecture** - Integrating levitation, propulsion, power delivery, and safety subsystems.

### ENGINEERING CONTRIBUTIONS
*   Designed **WPT coil geometries** and power delivery circuits for contactless charging during motion.
*   Built system-level models for **cost breakdowns**, power efficiency, and deployment feasibility on short-track prototypes.
*   Owned **repository architecture** and documentation—maintaining codebases, schematics, and research notes created by team members.
*   Led **technical justification** for competition pitches, balancing innovation with engineering constraints.

### PROJECT MANAGEMENT
*   Maintain source repository including all **firmware, hardware files, and research documentation**.
*   Coordinate cross-functional work between electronics, mechanical, and software subsystems.
*   Ensure technical decisions are documented, reproducible, and aligned with project milestones.

### ACHIEVEMENTS
*   **🏆 1st Prize – Ideastorm Prelims (Punjab Zonals)**, E-Summit '26, IIT Roorkee (hosted at TIET).
*   Selected as **National Finalist** for Ideastorm IIT Roorkee based on technical feasibility and system design clarity.

**Tech Stack:** Embedded C, Electromagnetics, WPT Circuit Design, Git, Technical Documentation, System Modeling

---

## [Open Source Organization] Founder @ Arceus Labs
**Timeline:** December 2025 - Present · ${calculateDuration('2025-12-01', 'Present')}  
**Location:** Remote

### MISSION
**Arceus Labs** is an open-source hardware community for developers who want to go beyond tutorials and actually ship hardware. A collaborative space where schematics are shared, firmware is open sourced, and documentation is written for real-world use.

### WHAT WE BUILD
*   **IoT devices** - ESP32-based environmental sensors, GPS navigation systems, and smart automation.
*   **Custom PCB designs** - Schematics and layouts shared publicly for learning and iteration.
*   **Embedded firmware** - Production-ready code for microcontroller projects.
*   **Technical documentation** - Build guides, architecture docs, and component selection rationale.

### PHILOSOPHY
*   **By developers, for developers** - Building real hardware, writing real firmware, sharing everything.
*   **Transparent development** - Schematics, firmware, and documentation are publicly accessible for learning and iteration.
*   **Public iteration** - Making mistakes in public, learning from them, and building something real.
*   **Open hardware** - Every project designed to be forked, learned from, and improved upon.

### PROJECTS UNDER ARCEUS LABS
*   [Jolt Locator](https://github.com/Arceus-Labs/Jolt-Locator) - Offline GPS navigation with compass guidance
*   [The Ruin Machine](https://github.com/Arceus-Labs/The-Ruin-Machine) - Probability simulator proving gambling math
*   [Servo Light Switch](https://github.com/Arceus-Labs/Servo-Light-Switch-Control-ESP8266-and-HC06) - Bluetooth home automation
*   [RFID Attendance System](https://github.com/Arceus-Labs/RFID-Attendance-System) - Smart tracking with Arduino + ESP32
*   [Electromagnet Controller](https://github.com/Arceus-Labs/Arduino-Electromagnet-Turns-Controller) - Coil winding automation
*   [Inductance Meter](https://github.com/Arceus-Labs/esp8266-inductance-meter) - ESP8266-based measurement tool

**Tech Stack:** ESP32, ESP8266, Arduino, Embedded C/C++, IoT Protocols, PCB Design, Git, Open Source Hardware

---

## [Work Experience] Grosity • Early-Stage Agritech Startup
**Timeline:** October 2025 - February 2026 · ${calculateDuration('2025-10-01', '2026-02-28')}  
**Location:** Patiala, Punjab

### ROLE PROGRESSION
**Product Development Team Lead** (Dec 2025 - Feb 2026)  
**Product Developer** (Nov 2025 - Feb 2026)  
**Frontend Developer** (Oct 2025 - Nov 2025)

### WHAT I BUILT
*   **Company Website** - Developed and deployed the full public-facing website using AI-assisted workflows (Claude, GitHub Copilot, Kiro IDE).
*   **Product Strategy** - Contributed to defining digital product roadmap for fresh produce marketplace connecting farmers, vendors, and customers.
*   **Marketing Systems** - Built social media presence and executed digital campaigns for B2C and B2B channels.

### ENGINEERING WORK
*   Explored **IoT and embedded systems integration** for autonomous payload-delivery drone systems.
*   Designed electronics logic and sensor integration for agricultural automation.
*   Balanced hardware feasibility with business model constraints (B2B distribution + D2C direct sales).

### PRODUCT DEVELOPMENT
*   Worked on **business-to-consumer systems** understanding market fit and user-centric design.
*   Led product development initiatives combining web technologies with hardware automation concepts.
*   Bridged technical decisions with business strategy in early-stage startup environment.

**Tech Stack:** React, Next.js, TypeScript, AI-Assisted Development (Claude, Copilot), IoT Architecture, Embedded Systems, Product Strategy

---

## [Community & Technical Leadership]

### GirlScript Summer of Code (GSSoC)
**Role:** Contributor & Mentee  
**Timeline:** May 2026 - Present · ${calculateDuration('2026-05-01', 'Present')}  
**Location:** Remote

Selected for GirlScript Summer of Code, an open-source program focused on collaborative development and learning. Contributing to open-source projects by working on issues, improving codebases, and collaborating with maintainers and fellow contributors.

**Focus Areas:**
*   Open-source collaboration and GitHub workflows
*   Code reviews, issue resolution, and documentation
*   IoT, embedded systems, and AI-related projects

**Tech Stack:** Git, GitHub, Open Source Contribution, Software Development Workflows

---

### IETE Students' Forum, TIET
**Role:** Mentor  
**Timeline:** July 2026 - Present · ${calculateDuration('2026-07-01', 'Present')}  
**Location:** Patiala, Punjab

Mentoring students in electronics and embedded systems at the Institution of Electronics and Telecommunication Engineers (IETE) student chapter at Thapar Institute.

**Responsibilities:**
*   Technical mentorship for electronics and embedded systems projects
*   Guiding students through hardware design and firmware development
*   Knowledge sharing on industry practices and engineering workflows

**Tech Stack:** Electronics, Embedded Systems, Technical Mentoring, Circuit Design

---

### ElectroFusion TIET
**Role:** Executive Member  
**Timeline:** December 2025 - Present · ${calculateDuration('2025-12-01', 'Present')}  
**Location:** Patiala, Punjab

Executive member of TIET's technical society focused on electronics and innovation. Assisting core members in organizing events, research work, and technical activities.

**Contributions:**
*   Event coordination, logistics, and technical engagement
*   Documentation and communication for society initiatives
*   Brainstorming sessions and innovative project ideation
*   Representing the society in technical competitions and outreach

**Focus:** Event Management, Technical Activities, Research Collaboration, Student Engagement

---

### Team Oorja
**Role:** Member  
**Timeline:** April 2026 - Present · ${calculateDuration('2026-04-01', 'Present')}  
**Location:** Patiala, Punjab

Learning and contributing in **Electronics and Data Acquisition (DAQ)** systems as part of a student-driven technical team.

**Tech Stack:** Electronics, Data Acquisition Systems, Sensor Integration

---

## [Non-Technical Leadership]

### Thapar Institute Counselling Cell (TICC)
**Role:** Mental Health Student Ambassador (MHSA)  
**Timeline:** November 2025 - Present · ${calculateDuration('2025-11-01', 'Present')}  
**Location:** Patiala, Punjab

Dedicated to promoting a culture of mental well-being and psychological safety across the TIET campus. Serving as a crucial bridge between the student body and professional counselling services.

**Responsibilities:**
*   Peer support and empathetic communication with students
*   Managing sensitive interactions with strict confidentiality
*   Promoting mental health awareness and psychological safety on campus
*   Leveraging specialized training to connect students with professional resources

**Focus:** Peer Support, Mental Health Advocacy, Campus Well-being, Confidential Communication

---

## [HARDWARE PROJECT] Smart Blind Stick | Arceus Labs
**Role:** Lead Engineer  
**Timeline:** Jul 2018 - Aug 2018  

### KEY DELIVERABLES
*   Developed a **smart mobility aid** for visually impaired individuals with obstacle detection capabilities.
*   Integrated **ultrasonic sensors** for real-time distance measurement and collision avoidance.
*   Implemented multi-modal alerts with **buzzer** and **voice prompts** for enhanced user safety and navigation.

**Tech Stack:** Arduino, C++, Ultrasonic Sensors (HC-SR04), Audio Output, Embedded Systems

## [HARDWARE PROJECT] Zephyr-Station | Arceus Labs
**Role:** Lead Engineer  
**Timeline:** Aug 2025 - Nov 2025  

### KEY DELIVERABLES
*   **ESP32-based environmental monitoring system** with real-time sensor acquisition, **OLED display**, **SD card data logging**, and threshold-based alerts.
*   Integrated **BME280** (temperature, humidity, pressure) & **MQ135** (air quality) sensors for comprehensive environmental monitoring.
*   Designed custom power management circuits for off-grid reliability and low-power operation.

**Tech Stack:** C++, ESP32, BME280, MQ-135, SSD1306 OLED, I2C, SPI, SD Card Logging, IoT Architecture

## [HARDWARE PROJECT] Jolt-Locator | Arceus Labs
**Role:** Lead Engineer  
**Timeline:** Nov 2025 - Dec 2025  

### KEY DELIVERABLES
*   **GPS-based true-north navigation system** running on **ESP32** with real-time heading and location processing.
*   Implemented accurate compass functionality with magnetic declination correction for offline navigation.
*   Designed for outdoor navigation and location tracking applications with intuitive display interface.

**Tech Stack:** C++, ESP32, NEO-6M GPS, QMC5883L Magnetometer, I2C, UART, OLED Display, Offline Navigation

## [HARDWARE PROJECT] The-Ruin-Machine | Arceus Labs
**Role:** Lead Engineer  
**Timeline:** Jan 2026  

### KEY DELIVERABLES
*   **Probability and stochastic-model simulator** implemented on **ESP32** with physical I/O (**OLED + buzzer**).
*   Mathematical demonstration proving gambling always leads to loss through interactive simulations.
*   Designed intuitive user interface for educational purposes showing betting strategy failures.

**Tech Stack:** C++, ESP32, Probability Theory, Stochastic Modeling, OLED Display, Hardware RNG, Interactive Systems

---

## [EDUCATION] Thapar Institute (TIET)
**Degree:** '29 B.E. Electronics and Communication Engineering  
**Minor:** Computer Science Engineering (Aug 2026 - Dec 2027)  
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
