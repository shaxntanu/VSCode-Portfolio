import { useState, useEffect } from 'react';
import Link from 'next/link';

import styles from '@/styles/HomePage.module.css';
import DecryptedText from '@/components/DecryptedText';

export default function HomePage() {
  const [activeLineIndex, setActiveLineIndex] = useState(0);

  const codeLines = [
    { code: '/*\n* Project: Portfolio_System_v2.0', type: 'comment' },
    { code: '* Author:  Shantanu', type: 'comment' },
    { code: '* Status:  WIP (Coffee fueled)', type: 'comment' },
    { code: '* Last Edit: 3 AM', type: 'comment' },
    { code: '*/', type: 'comment' },
    { code: '', type: 'blank' },
    { code: '// #include <Smart_Agriculture.h> //TODO: Fix library conflict later', type: 'comment' },
    { code: '#include <Life.h>', type: 'function' },
    { code: '#include <Passion.h>', type: 'function' },
    { code: '', type: 'blank' },
    { code: '//Config', type: 'comment' },
    { code: 'const char* USER = "Shantanu Maratha";', type: 'variable' },
    { code: '//const char* ROLE = "Product Developer"; // Boring', type: 'comment' },
    { code: 'const char* ROLE = "Breaking things until they work";', type: 'variable' },
    { code: 'const int MAX_RETRIES = 9999;', type: 'variable' },
    { code: '', type: 'blank' },
    { code: '//Hardware Definitions', type: 'comment' },
    { code: '#define SENSOR_PIN 34', type: 'function' },
    { code: '#define LED_STATUS 2', type: 'function' },
    { code: '', type: 'blank' },
    { code: 'void setup() {', type: 'function' },
    { code: '  Serial.begin(115200);', type: 'function-call' },
    { code: '', type: 'blank' },
    { code: '  //Check if I\'m awake', type: 'comment' },
    { code: '  if (!coffeeIntake()) {', type: 'nested-function' },
    { code: '    Serial.println("Error: Caffeine level critically low");', type: 'function-call' },
    { code: '    sleep(3600);', type: 'function-call' },
    { code: '  }', type: 'close' },
    { code: '', type: 'blank' },
    { code: '  Serial.println("\\n--- SYSTEM INIT ---");', type: 'function-call' },
    { code: '  Serial.println("Loading skills...");', type: 'function-call' },
    { code: '', type: 'blank' },
    { code: '  //Initializing "Brain"', type: 'comment' },
    { code: '  //pinMode(ESP32, OUTPUT);', type: 'comment' },
    { code: '  //pinMode(PCB_DESIGN, OUTPUT);', type: 'comment' },
    { code: '', type: 'blank' },
    { code: '  //Try to connect to the internet', type: 'comment' },
    { code: '  Serial.print("Connecting to Real World...");', type: 'function-call' },
    { code: '  while (!WiFi.isConnected()) {', type: 'nested-function' },
    { code: '    Serial.print(".");', type: 'function-call' },
    { code: '    delay(500);', type: 'function-call' },
    { code: '  }', type: 'close' },
    { code: '  Serial.println(" [CONNECTED]");', type: 'function-call' },
    { code: '', type: 'blank' },
    { code: '  //Just force everything to work', type: 'comment' },
    { code: '  int attempts = 0;', type: 'variable' },
    { code: '  while(!isProjectWorking() && attempts < MAX_RETRIES) {', type: 'nested-function' },
    { code: '    debug();', type: 'function-call' },
    { code: '    //cry(); //deprecated', type: 'comment' },
    { code: '    googleStackOverflow();', type: 'function-call' },
    { code: '    retry();', type: 'function-call' },
    { code: '    attempts++;', type: 'variable' },
    { code: '  }', type: 'close' },
    { code: '', type: 'blank' },
    { code: '  if (isProjectWorking()) {', type: 'nested-function' },
    { code: '    Serial.println("[SUCCESS] We are live!");', type: 'function-call' },
    { code: '  } else {', type: 'nested-function' },
    { code: '    Serial.println("[ERROR] It works on my machine...");', type: 'function-call' },
    { code: '  }', type: 'close' },
    { code: '}', type: 'close' },
    { code: '', type: 'blank' },
    { code: 'void loop() {', type: 'function' },
    { code: '  //Main Logic Loop', type: 'comment' },
    { code: '  //1. Read Sensors (Input)', type: 'comment' },
    { code: '  //float data = analogRead(SENSOR_PIN);', type: 'comment' },
    { code: '  learnNewTech();', type: 'function-call' },
    { code: '', type: 'blank' },
    { code: '  //2. Process (Logic)', type: 'comment' },
    { code: '  buildCoolStuff();', type: 'function-call' },
    { code: '', type: 'blank' },
    { code: '  //3. Output', type: 'comment' },
    { code: '  //Serial.println(data);', type: 'comment' },
    { code: '  shipIt();', type: 'function-call' },
    { code: '', type: 'blank' },
    { code: '  //Prevent burnout logic', type: 'comment' },
    { code: '  if (stressLevel > 9000) {', type: 'nested-function' },
    { code: '    touchGrass();', type: 'function-call' },
    { code: '    //playVideoGames();', type: 'comment' },
    { code: '  }', type: 'close' },
    { code: '', type: 'blank' },
    { code: '  //Did I push to GitHub?', type: 'comment' },
    { code: '  if (forgotToCommit) {', type: 'nested-function' },
    { code: '    gitPushForce();', type: 'function-call' },
    { code: '  }', type: 'close' },
    { code: '', type: 'blank' },
    { code: '  delay(100); ', type: 'function-call', comment: '//Yield to OS' },
    { code: '}', type: 'close' },
    { code: '', type: 'blank' },
    { code: '//Custom Functions', type: 'comment' },
    { code: 'void debug() {', type: 'function' },
    { code: '  //printf("Why is this null??\\n");', type: 'comment' },
    { code: '}', type: 'close' },
  ];

  const handleCopyCode = async () => {
    const fullCode = codeLines.map(line => line.code).join('\n');
    try {
      await navigator.clipboard.writeText(fullCode);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLineIndex((prev) => (prev + 1) % codeLines.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [codeLines.length]);

  return (
    <div className={styles.heroLayout}>
      <div className={styles.container}>
        <div className={styles.codeSection}>
          <div className={styles.codeContainer}>
            <button className={styles.copyButton} onClick={handleCopyCode}>
              <span data-text-end="Copied!" data-text-initial="Copy to clipboard" className={styles.tooltip}></span>
              <span>
                <svg className={styles.clipboard} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6.35 6.35" height="20" width="20">
                  <path fill="currentColor" d="M2.43.265c-.3 0-.548.236-.573.53h-.328a.74.74 0 0 0-.735.734v3.822a.74.74 0 0 0 .735.734H4.82a.74.74 0 0 0 .735-.734V1.529a.74.74 0 0 0-.735-.735h-.328a.58.58 0 0 0-.573-.53zm0 .529h1.49c.032 0 .049.017.049.049v.431c0 .032-.017.049-.049.049H2.43c-.032 0-.05-.017-.05-.049V.843c0-.032.018-.05.05-.05zm-.901.53h.328c.026.292.274.528.573.528h1.49a.58.58 0 0 0 .573-.529h.328a.2.2 0 0 1 .206.206v3.822a.2.2 0 0 1-.206.205H1.53a.2.2 0 0 1-.206-.205V1.529a.2.2 0 0 1 .206-.206z"></path>
                </svg>
                <svg className={styles.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="18" width="18">
                  <path fill="currentColor" d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"></path>
                </svg>
              </span>
            </button>
            <div className={styles.editorContent}>
              {codeLines.map((line, index) => (
                <div
                  key={index}
                  className={`${styles.codeRow} ${
                    index === activeLineIndex ? styles.highlightedLine : ''
                  }`}
                >
                  <span
                    className={`${styles.lineNumber} ${
                      index === activeLineIndex ? styles.activeLine : ''
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className={`${styles.codeText} ${styles[line.type]}`}>
                    {line.code}
                    {line.comment && <span className={styles.comment}>{line.comment}</span>}
                  </span>
                </div>
              ))}
              <div className={styles.overlayGlow}></div>
            </div>
          </div>
        </div>

        <div className={styles.infoSection}>
          <h1 className={styles.developerName}>
            <DecryptedText
              text="Shantanu"
              speed={50}
              maxIterations={15}
              animateOn="view"
            />{' '}
            <span className={styles.accentText}>
              <DecryptedText
                text="Maratha"
                speed={50}
                maxIterations={15}
                animateOn="view"
              />
            </span>
          </h1>

          <div className={styles.developerRole}>Product Developer & IoT/Embedded Systems Engineer</div>

          <p className={styles.bio}>
            Building the physical internet. Specialized in ESP32, custom PCB design, and end-to-end IoT integration, along with product development.
          </p>

          <div className={styles.actionLinks}>
            <Link href="/projects">
              <button className={styles.button}>
                <span className={styles.shadow}></span>
                <span className={styles.edge}></span>
                <div className={styles.front}>
                  <span>View Projects</span>
                </div>
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.decorElements}>
        <div className={styles.codeFlare}></div>
        <div className={styles.gridLines}></div>
        <div className={styles.codeBlock1}>{'{'}</div>
        <div className={styles.codeBlock2}>{'}'}</div>
        <div className={styles.codeBlock3}>{'<>'}</div>
        <div className={styles.codeBlock4}>{'/>'}</div>
        <div className={styles.orb1}></div>
        <div className={styles.orb2}></div>
        <div className={styles.orb3}></div>
        <div className={styles.codeSymbol1}>{'()'}</div>
        <div className={styles.codeSymbol2}>{'[]'}</div>
        <div className={styles.codeSymbol3}>{'=>'}</div>
        <div className={styles.dotPattern}></div>
        <div className={styles.mobileAccent}></div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: { title: 'Home' },
  };
}
