import { useState, useEffect } from 'react';
import Link from 'next/link';

import styles from '@/styles/HomePage.module.css';
import DecryptedText from '@/components/DecryptedText';

export default function HomePage() {
  const [activeLineIndex, setActiveLineIndex] = useState(0);

  const codeLines = [
    { code: '/*', type: 'comment' },
    { code: '* Firmware: consciousness_v1.8.3', type: 'comment' },
    { code: '* Target: Human/ESP32 hybrid system', type: 'comment' },
    { code: '* Compiler: Life experience + 3AM decisions', type: 'comment' },
    { code: '* Last stable build: Unknown', type: 'comment' },
    { code: '*/', type: 'comment' },
    { code: '', type: 'blank' },
    { code: '#include <ESP32.h>', type: 'function' },
    { code: '#include <WiFi.h>', type: 'function' },
    { code: '#include <Wire.h>', type: 'function' },
    { code: '#include <Curiosity.h>        // Abstract dependency', type: 'function' },
    { code: '#include <Obsession.h>        // Warning: causes infinite loops', type: 'function' },
    { code: '', type: 'blank' },
    { code: '// Pin assignments', type: 'comment' },
    { code: '#define SENSOR_INPUT 34       // ADC1_CH6 - observing reality', type: 'function' },
    { code: '#define DEBUG_LED 2           // Built-in LED - sanity indicator', type: 'function' },
    { code: '#define INTERRUPT_PIN 15      // Random ideas at 2AM', type: 'function' },
    { code: '#define BURNOUT_THRESHOLD 85  // Celsius', type: 'function' },
    { code: '', type: 'blank' },
    { code: '// System config', type: 'comment' },
    { code: 'const char* IDENTITY = "Shantanu Maratha";', type: 'variable' },
    { code: 'const char* ARCHITECTURE = "IoT/Embedded";', type: 'variable' },
    { code: 'volatile bool STABLE_STATE = false;', type: 'variable' },
    { code: 'float MOTIVATION_VOLTAGE = 3.3;  // Fluctuates', type: 'variable' },
    { code: 'int RETRY_LIMIT = -1;            // Infinite', type: 'variable' },
    { code: '', type: 'blank' },
    { code: '// Hardware state', type: 'comment' },
    { code: 'struct SystemState {', type: 'function' },
    { code: '  float signal_noise;', type: 'variable' },
    { code: '  bool wifi_connected;', type: 'variable' },
    { code: '  int failed_attempts;', type: 'variable' },
    { code: '  bool docs_open;', type: 'variable' },
    { code: '  uint32_t uptime_hours;', type: 'variable' },
    { code: '} state;', type: 'close' },
    { code: '', type: 'blank' },
    { code: 'void setup() {', type: 'function' },
    { code: '  Serial.begin(115200);', type: 'function-call' },
    { code: '  delay(100);', type: 'function-call' },
    { code: '', type: 'blank' },
    { code: '  // Pin initialization', type: 'comment' },
    { code: '  pinMode(DEBUG_LED, OUTPUT);', type: 'function-call' },
    { code: '  pinMode(SENSOR_INPUT, INPUT);', type: 'function-call' },
    { code: '  pinMode(INTERRUPT_PIN, INPUT_PULLUP);', type: 'function-call' },
    { code: '', type: 'blank' },
    { code: '  Serial.println("\\n[BOOT] Initializing system...");', type: 'function-call' },
    { code: '', type: 'blank' },
    { code: '  // Check power supply', type: 'comment' },
    { code: '  float vcc = analogRead(SENSOR_INPUT) * (3.3 / 4095.0);', type: 'variable' },
    { code: '  if (vcc < 2.8) {', type: 'nested-function' },
    { code: '    Serial.println("[WARN] Low voltage detected");', type: 'function-call' },
    { code: '    Serial.println("[WARN] Caffeine circuit unstable");', type: 'function-call' },
    { code: '    // Continue anyway', type: 'comment' },
    { code: '  }', type: 'close' },
    { code: '', type: 'blank' },
    { code: '  // Attempt WiFi connection to reality', type: 'comment' },
    { code: '  Serial.print("[NET] Connecting to real world");', type: 'function-call' },
    { code: '  int attempts = 0;', type: 'variable' },
    { code: '  while (!WiFi.isConnected() && attempts < 20) {', type: 'nested-function' },
    { code: '    Serial.print(".");', type: 'function-call' },
    { code: '    delay(300);', type: 'function-call' },
    { code: '    attempts++;', type: 'variable' },
    { code: '    // Simulate connection instability', type: 'comment' },
    { code: '    if (random(0, 10) > 7) break;', type: 'nested-function' },
    { code: '  }', type: 'close' },
    { code: '', type: 'blank' },
    { code: '  if (attempts >= 20) {', type: 'nested-function' },
    { code: '    Serial.println(" [TIMEOUT]");', type: 'function-call' },
    { code: '    Serial.println("[INFO] Operating in offline mode");', type: 'function-call' },
    { code: '  } else {', type: 'nested-function' },
    { code: '    Serial.println(" [CONNECTED]");', type: 'function-call' },
    { code: '  }', type: 'close' },
    { code: '', type: 'blank' },
    { code: '  // Load previous state from EEPROM (memory)', type: 'comment' },
    { code: '  Serial.println("[MEM] Loading experience from flash...");', type: 'function-call' },
    { code: '  state.failed_attempts = 847;  // Accumulated failures', type: 'variable' },
    { code: '  state.uptime_hours = 0;', type: 'variable' },
    { code: '  state.signal_noise = 0.3;', type: 'variable' },
    { code: '', type: 'blank' },
    { code: '  // Dependency check', type: 'comment' },
    { code: '  if (!checkDependency("Patience")) {', type: 'nested-function' },
    { code: '    Serial.println("[ERROR] Missing critical library");', type: 'function-call' },
    { code: '    Serial.println("[WARN] Proceeding with bruteforce mode");', type: 'function-call' },
    { code: '  }', type: 'close' },
    { code: '', type: 'blank' },
    { code: '  // Interrupt handler for random ideas', type: 'comment' },
    { code: '  attachInterrupt(digitalPinToInterrupt(INTERRUPT_PIN),', type: 'function-call' },
    { code: '                  handleRandomIdea, FALLING);', type: 'function-call' },
    { code: '', type: 'blank' },
    { code: '  Serial.println("[READY] System operational\\n");', type: 'function-call' },
    { code: '  digitalWrite(DEBUG_LED, HIGH);', type: 'function-call' },
    { code: '}', type: 'close' },
    { code: '', type: 'blank' },
    { code: 'void loop() {', type: 'function' },
    { code: '  state.uptime_hours++;', type: 'variable' },
    { code: '', type: 'blank' },
    { code: '  // INPUT: Read sensors (reality signals)', type: 'comment' },
    { code: '  float raw_signal = analogRead(SENSOR_INPUT);', type: 'variable' },
    { code: '  float filtered = raw_signal + (random(-50, 50) * state.signal_noise);', type: 'variable' },
    { code: '', type: 'blank' },
    { code: '  // Check for undefined behavior', type: 'comment' },
    { code: '  if (isnan(filtered) || filtered < 0) {', type: 'nested-function' },
    { code: '    Serial.println("[FAULT] Signal corruption detected");', type: 'function-call' },
    { code: '    rewireEverythingAgain();', type: 'function-call' },
    { code: '    return;', type: 'function-call' },
    { code: '  }', type: 'close' },
    { code: '', type: 'blank' },
    { code: '  // PROCESS: Main logic', type: 'comment' },
    { code: '  if (filtered > 2048) {  // Threshold crossed', type: 'nested-function' },
    { code: '    Serial.println("[EVENT] New problem detected");', type: 'function-call' },
    { code: '', type: 'blank' },
    { code: '    // Debug loop - keep trying until it works', type: 'comment' },
    { code: '    bool solved = false;', type: 'variable' },
    { code: '    int iterations = 0;', type: 'variable' },
    { code: '', type: 'blank' },
    { code: '    while (!solved && iterations < RETRY_LIMIT) {', type: 'nested-function' },
    { code: '      solved = attemptSolution();', type: 'function-call' },
    { code: '', type: 'blank' },
    { code: '      if (!solved) {', type: 'nested-function' },
    { code: '        Serial.print("[DEBUG] Attempt ");', type: 'function-call' },
    { code: '        Serial.print(iterations);', type: 'function-call' },
    { code: '        Serial.println(" failed");', type: 'function-call' },
    { code: '', type: 'blank' },
    { code: '        // Escalating debug strategy', type: 'comment' },
    { code: '        if (iterations < 5) {', type: 'nested-function' },
    { code: '          checkWiring();', type: 'function-call' },
    { code: '        } else if (iterations < 15) {', type: 'nested-function' },
    { code: '          readDocsAt2AM();', type: 'function-call' },
    { code: '        } else if (iterations < 30) {', type: 'nested-function' },
    { code: '          rewriteFromScratch();', type: 'function-call' },
    { code: '        } else {', type: 'nested-function' },
    { code: '          // Desperation mode', type: 'comment' },
    { code: '          applyRandomFix();', type: 'function-call' },
    { code: '        }', type: 'close' },
    { code: '', type: 'blank' },
    { code: '        iterations++;', type: 'variable' },
    { code: '        delay(random(100, 500));', type: 'function-call' },
    { code: '      }', type: 'close' },
    { code: '    }', type: 'close' },
    { code: '', type: 'blank' },
    { code: '    if (solved) {', type: 'nested-function' },
    { code: '      Serial.println("[SUCCESS] Something works now");', type: 'function-call' },
    { code: '      digitalWrite(DEBUG_LED, HIGH);', type: 'function-call' },
    { code: '    } else {', type: 'nested-function' },
    { code: '      Serial.println("[ACCEPT] Shipping with known issues");', type: 'function-call' },
    { code: '      // Ship it anyway', type: 'comment' },
    { code: '    }', type: 'close' },
    { code: '  }', type: 'close' },
    { code: '', type: 'blank' },
    { code: '  // OUTPUT: Build and deploy', type: 'comment' },
    { code: '  if (state.uptime_hours % 24 == 0) {', type: 'nested-function' },
    { code: '    Serial.println("[BUILD] Compiling project...");', type: 'function-call' },
    { code: '', type: 'blank' },
    { code: '    bool compiled = (random(0, 10) > 3);', type: 'variable' },
    { code: '    if (compiled) {', type: 'nested-function' },
    { code: '      deployToHardware();', type: 'function-call' },
    { code: '    } else {', type: 'nested-function' },
    { code: '      Serial.println("[ERROR] Undefined reference to \'motivation\'");', type: 'function-call' },
    { code: '      Serial.println("[FIX] Adding delay(1000) and trying again");', type: 'function-call' },
    { code: '    }', type: 'close' },
    { code: '  }', type: 'close' },
    { code: '', type: 'blank' },
    { code: '  // System health check', type: 'comment' },
    { code: '  float temp = readInternalTemp();', type: 'variable' },
    { code: '  if (temp > BURNOUT_THRESHOLD) {', type: 'nested-function' },
    { code: '    Serial.println("[CRITICAL] Thermal shutdown imminent");', type: 'function-call' },
    { code: '    Serial.println("[ACTION] Forcing cooldown period");', type: 'function-call' },
    { code: '    touchGrass();', type: 'function-call' },
    { code: '    delay(3600000);  // 1 hour', type: 'function-call' },
    { code: '  }', type: 'close' },
    { code: '', type: 'blank' },
    { code: '  // Check for loose connections (mental state)', type: 'comment' },
    { code: '  if (MOTIVATION_VOLTAGE < 2.5) {', type: 'nested-function' },
    { code: '    Serial.println("[WARN] Unstable power rail");', type: 'function-call' },
    { code: '    Serial.println("[INFO] Checking breadboard connections");', type: 'function-call' },
    { code: '    MOTIVATION_VOLTAGE = 3.3;  // Reset', type: 'variable' },
    { code: '  }', type: 'close' },
    { code: '', type: 'blank' },
    { code: '  // Watchdog behavior - prevent infinite hang', type: 'comment' },
    { code: '  if (state.uptime_hours > 72) {', type: 'nested-function' },
    { code: '    Serial.println("[WARN] Extended uptime detected");', type: 'function-call' },
    { code: '    Serial.println("[SUGGEST] Consider system reset (sleep)");', type: 'function-call' },
    { code: '  }', type: 'close' },
    { code: '', type: 'blank' },
    { code: '  delay(100);  // Yield to scheduler', type: 'function-call' },
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

          <div className={styles.developerRole}>Embedded Systems & IoT Developer</div>

          <p className={styles.bio}>
            ESP32 • Custom PCBs • End-to-End Hardware Integration
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
