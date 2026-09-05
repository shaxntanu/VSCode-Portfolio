import { Circuit, CircuitCategory } from '@/types';

export type { Circuit, CircuitCategory };

export const circuitCategories = [
  { id: 'ALL', label: 'All' },
  { id: 'EMBEDDED', label: 'Embedded' },
  { id: 'ANALOG', label: 'Analog' },
  { id: 'DIGITAL_LOGIC', label: 'Digital Logic' },
  { id: 'SENSORS', label: 'Sensors' },
  { id: 'POWER_ELECTRONICS', label: 'Power Electronics' },
  { id: 'COMMUNICATION', label: 'Communication' },
  { id: 'PCB', label: 'PCB' },
  { id: 'EDUCATIONAL', label: 'Educational' },
] as const;

export const circuits: Circuit[] = [
  {
    title: 'Blind Stick Circuit Simulation',
    description: 'Smart mobility aid circuit with ultrasonic obstacle detection and buzzer alerts. Simulated using Tinkercad for proof-of-concept validation.',
    platform: 'Arduino',
    software: 'Tinkercad',
    technologies: ['Arduino', 'Tinkercad'],
    category: 'EMBEDDED',
    difficulty: 'BEGINNER',
    status: 'VERIFIED',
    link: 'https://www.tinkercad.com/things/eSt2stRF85u-blind-stick-circuit-simulation',
    embedUrl: 'https://www.tinkercad.com/embed/eSt2stRF85u',
    schematicLink: 'https://drive.google.com/file/d/1E_zLfBYrhrYC4G8KlEbl10jfzuxJiwEL/view?usp=sharing',
    hasBuzzer: true,
    fundedPrototype: true,
    code: `// Pins
const int trigPin = 9;
const int echoPin = 10;
const int buzzerPin = 11;
const int tempPin = A0;

// Variables
long duration;
float distance;
float temperature;

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(buzzerPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  // -------- Ultrasonic Sensor --------
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  duration = pulseIn(echoPin, HIGH);
  distance = duration * 0.0343 / 2;

  // -------- Temperature Sensor (TMP36) --------
  int sensorValue = analogRead(tempPin);
  float voltage = sensorValue * (5.0 / 1023.0);
  // TMP36 Formula
  temperature = (voltage - 0.5) * 100.0;

  // -------- Serial Monitor --------
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.print(" cm\\t");
  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.println(" °C");

  // -------- Alarm Logic --------
  if ((distance > 0 && distance <= 20) || temperature > 35) {
    tone(buzzerPin, 1000);      // Turn buzzer ON
  } else {
    noTone(buzzerPin);          // Turn buzzer OFF immediately
  }

  delay(50);    // Fast response
}`,
    slug: 'blind-stick-circuit',
    year: 2018,
    dateRange: 'Jul 2018 - Aug 2018',
    overview: 'This circuit simulates a smart blind stick that helps visually impaired individuals navigate safely. It uses an ultrasonic sensor to detect obstacles and provides audio feedback through a buzzer when objects are detected within a certain range.',
    workingPrinciple: 'The HC-SR04 ultrasonic sensor continuously measures the distance to nearby objects. When an obstacle is detected within the threshold distance (typically 50cm), the Arduino triggers the buzzer to alert the user. The closer the obstacle, the faster the buzzer beeps, providing intuitive distance feedback.',
    components: [
      {
        name: 'Arduino Uno R3',
        role: 'Main Controller',
        interface: 'USB',
        voltage: '5V',
        quantity: 1,
        notes: 'Processes sensor data and controls outputs',
        price: '₹450'
      },
      {
        name: 'Ultrasonic Distance Sensor (4-pin)',
        role: 'Obstacle Detection',
        interface: 'Digital (TRIG/ECHO)',
        voltage: '5V',
        quantity: 1,
        notes: 'HC-SR04 measures distance using ultrasonic waves',
        price: '₹80'
      },
      {
        name: 'Piezo Buzzer',
        role: 'Audio Alert',
        interface: 'Digital Output',
        voltage: '5V',
        quantity: 1,
        notes: 'Provides audible warnings for obstacles',
        price: '₹20'
      },
      {
        name: 'Vibration Motor',
        role: 'Haptic Feedback',
        interface: 'Digital Output',
        voltage: '5V',
        quantity: 1,
        notes: 'Provides tactile alerts for obstacles',
        price: '₹30'
      },
      {
        name: 'Breadboard & Wires',
        role: 'Prototyping',
        interface: 'N/A',
        voltage: 'N/A',
        quantity: 1,
        notes: 'For circuit connections and testing',
        price: '₹80'
      },
    ],
    totalCost: '₹660'
  },
  {
    title: 'LED Sequence Control Circuit',
    description: 'Arduino-based circuit demonstrating sequential LED control with digital output. Five LEDs connected through current-limiting resistors for basic I/O experiments.',
    platform: 'Arduino',
    software: 'Tinkercad',
    technologies: ['Arduino', 'Tinkercad'],
    category: 'EDUCATIONAL',
    difficulty: 'BEGINNER',
    status: 'VERIFIED',
    link: 'https://www.tinkercad.com/things/h4P9qGZ2TYe',
    embedUrl: 'https://www.tinkercad.com/embed/h4P9qGZ2TYe',
    schematicLink: 'https://drive.google.com/file/d/1DDgGYsS4s82P186a02RldWV0dseHsoDq/view?usp=sharing',
    collegeCourseProject: true,
    slug: 'led-sequence-control',
    year: 2026,
    dateRange: 'Aug 2026',
    code: `int ledPins[] = {2, 3, 4, 5, 6};

void setup()
{
  for(int i=0;i<5;i++)
  {
    pinMode(ledPins[i], OUTPUT);
  }
}

void loop()
{
  // Turn ON one by one
  for(int i=0;i<5;i++)
  {
    digitalWrite(ledPins[i], HIGH);
    delay(500);
  }
  // Turn OFF one by one
  for(int i=0;i<5;i++)
  {
    digitalWrite(ledPins[i], LOW);
    delay(500);
  }
}`,
    overview: 'This circuit consists of an Arduino Uno connected to a breadboard to perform two experiments. In the first experiment, five LEDs are connected to digital pins D2–D6 through 220 Ω current-limiting resistors. The Arduino sequentially turns each LED ON and OFF to demonstrate basic digital output control.',
    workingPrinciple: 'The Arduino uses digitalWrite() to sequentially turn each LED ON and OFF in a pattern. Each LED is connected to a digital pin through a 220Ω resistor for current limiting. The program cycles through pins D2-D6, creating a chasing light effect that demonstrates basic digital I/O operations.',
    components: [
      {
        name: 'Arduino Uno R3',
        role: 'Main Controller',
        interface: 'USB',
        voltage: '5V',
        quantity: 1,
        notes: 'Controls LED sequence through digital pins',
        price: '₹450'
      },
      {
        name: 'Blue LED',
        role: 'Visual Indicator',
        interface: 'Digital Output (D2)',
        voltage: '5V',
        quantity: 1,
        notes: 'First LED in sequence',
        price: '₹5'
      },
      {
        name: 'Orange LED',
        role: 'Visual Indicator',
        interface: 'Digital Output (D3)',
        voltage: '5V',
        quantity: 1,
        notes: 'Second LED in sequence',
        price: '₹5'
      },
      {
        name: 'White LED',
        role: 'Visual Indicator',
        interface: 'Digital Output (D4)',
        voltage: '5V',
        quantity: 1,
        notes: 'Third LED in sequence',
        price: '₹5'
      },
      {
        name: 'Red LED',
        role: 'Visual Indicator',
        interface: 'Digital Output (D5)',
        voltage: '5V',
        quantity: 1,
        notes: 'Fourth LED in sequence',
        price: '₹5'
      },
      {
        name: 'Green LED',
        role: 'Visual Indicator',
        interface: 'Digital Output (D6)',
        voltage: '5V',
        quantity: 1,
        notes: 'Fifth LED in sequence',
        price: '₹5'
      },
      {
        name: '220 Ω Resistor',
        role: 'Current Limiting',
        interface: 'Passive',
        voltage: 'N/A',
        quantity: 5,
        notes: 'Protects LEDs from excessive current',
        price: '₹10'
      },
      {
        name: 'Breadboard & Wires',
        role: 'Prototyping',
        interface: 'N/A',
        voltage: 'N/A',
        quantity: 1,
        notes: 'For circuit connections and testing',
        price: '₹80'
      },
    ],
    totalCost: '₹565'
  },
  {
    title: 'Logic Gates Simulator Circuit',
    description: 'Arduino-based logic gate implementation using push buttons and LED. Demonstrates OR, NOR, and XNOR gates using software-defined Boolean logic without dedicated logic ICs.',
    platform: 'Arduino',
    software: 'Tinkercad',
    technologies: ['Arduino', 'Tinkercad'],
    category: 'DIGITAL_LOGIC',
    difficulty: 'BEGINNER',
    status: 'VERIFIED',
    link: 'https://www.tinkercad.com/things/aiENaNPlch4',
    embedUrl: 'https://www.tinkercad.com/embed/aiENaNPlch4',
    schematicLink: 'https://drive.google.com/file/d/1PmNgFs6DdlL-yjWx3rv1YZ4U2Zmwp-Mc/view?usp=sharing',
    collegeCourseProject: true,
    slug: 'logic-gates-simulator',
    year: 2026,
    dateRange: 'Aug 2026',
    codeVariants: [
      {
        label: 'OR Gate',
        code: `int A = 2;
int B = 3;
int LED = 8;

void setup() {
  pinMode(A, INPUT);
  pinMode(B, INPUT);
  pinMode(LED, OUTPUT);
}

void loop() {
  digitalWrite(LED, digitalRead(A) || digitalRead(B));
}`
      },
      {
        label: 'NOR Gate',
        code: `int A = 2;
int B = 3;
int LED = 8;

void setup() {
  pinMode(A, INPUT);
  pinMode(B, INPUT);
  pinMode(LED, OUTPUT);
}

void loop() {
  digitalWrite(LED, !(digitalRead(A) || digitalRead(B)));
}`
      },
      {
        label: 'XNOR Gate',
        code: `int A = 2;
int B = 3;
int LED = 8;

void setup() {
  pinMode(A, INPUT);
  pinMode(B, INPUT);
  pinMode(LED, OUTPUT);
}

void loop() {
  digitalWrite(LED, !(digitalRead(A) ^ digitalRead(B)));
}`
      }
    ],
    overview: 'This circuit uses an Arduino Uno, two push buttons, and an LED to simulate basic logic gates without using logic ICs. The push buttons provide digital inputs, while the Arduino processes the selected logic function (OR, NOR, or XNOR) and controls the output LED accordingly. The circuit demonstrates the implementation of Boolean logic using software and simple electronic components.',
    workingPrinciple: 'Two push buttons act as digital inputs A and B. The Arduino reads these inputs and applies Boolean logic operations (OR, NOR, XNOR) to determine the LED output state. Pressing one or both buttons changes the inputs, and the LED illuminates based on the logic gate truth table. The code can be easily modified to test different logic functions.',
    components: [
      {
        name: 'Arduino Uno R3',
        role: 'Logic Processor',
        interface: 'USB',
        voltage: '5V',
        quantity: 1,
        notes: 'Implements Boolean logic in software',
        price: '₹450'
      },
      {
        name: 'Pushbutton',
        role: 'Digital Input A & B',
        interface: 'Digital Input (D2, D3)',
        voltage: '5V',
        quantity: 2,
        notes: 'Provides two logic gate inputs',
        price: '₹10'
      },
      {
        name: 'Red LED',
        role: 'Logic Output Indicator',
        interface: 'Digital Output (D8)',
        voltage: '5V',
        quantity: 1,
        notes: 'Shows result of logic operation',
        price: '₹5'
      },
      {
        name: '220 Ω Resistor',
        role: 'LED Current Limiting',
        interface: 'Passive',
        voltage: 'N/A',
        quantity: 1,
        notes: 'Protects LED from excessive current',
        price: '₹2'
      },
      {
        name: '10 kΩ Resistor',
        role: 'Button Pull-down',
        interface: 'Passive',
        voltage: 'N/A',
        quantity: 2,
        notes: 'Ensures stable LOW state for push buttons',
        price: '₹4'
      },
      {
        name: 'Breadboard & Wires',
        role: 'Prototyping',
        interface: 'N/A',
        voltage: 'N/A',
        quantity: 1,
        notes: 'For circuit connections and testing',
        price: '₹80'
      },
    ],
    totalCost: '₹551'
  },
  {
    title: '74HC08 IC Verification Circuit',
    description: 'Digital logic circuit to verify the functionality of 74HC08 Quad 2-input AND gate IC. Demonstrates IC testing using manual input switches and LED output indicators.',
    platform: 'Digital IC',
    software: 'Tinkercad',
    technologies: ['Tinkercad'],
    category: 'DIGITAL_LOGIC',
    difficulty: 'BEGINNER',
    status: 'VERIFIED',
    link: 'https://www.tinkercad.com/things/3Gh4dBVkqEK-verification-of-74hc08',
    embedUrl: 'https://www.tinkercad.com/embed/3Gh4dBVkqEK',
    schematicLink: 'https://drive.google.com/file/d/1-p4nFwHIFFKPi7f1j3umwKyTT47ETS2r/view?usp=sharing',
    collegeCourseProject: true,
    slug: '74hc08-ic-verification',
    year: 2026,
    dateRange: 'Aug 2026',
    overview: 'This circuit verifies the operation of the 74HC08 quad 2-input AND gate integrated circuit. Using switches to provide input combinations and LEDs to display outputs, students can manually verify the AND gate truth table for all four gates within the IC.',
    workingPrinciple: 'The 74HC08 IC contains four independent 2-input AND gates. Each gate has two input pins and one output pin. By toggling the input switches through all possible combinations (00, 01, 10, 11), the output LED illuminates only when both inputs are HIGH, demonstrating the AND gate logic function. This hands-on verification helps understand IC pinout and Boolean logic.',
    components: [
      {
        name: '74HC08 IC',
        role: 'Quad 2-Input AND Gate',
        interface: '14-pin DIP',
        voltage: '5V',
        quantity: 1,
        notes: 'Contains four independent AND gates',
        price: '₹15'
      },
      {
        name: 'Push Button Switch',
        role: 'Input Control',
        interface: 'Digital Input',
        voltage: '5V',
        quantity: 2,
        notes: 'Provides logic inputs A and B for testing',
        price: '₹10'
      },
      {
        name: 'LED',
        role: 'Output Indicator',
        interface: 'Digital Output',
        voltage: '5V',
        quantity: 1,
        notes: 'Displays AND gate output state',
        price: '₹5'
      },
      {
        name: '220 Ω Resistor',
        role: 'LED Current Limiting',
        interface: 'Passive',
        voltage: 'N/A',
        quantity: 1,
        notes: 'Limits current through LED',
        price: '₹2'
      },
      {
        name: '10 kΩ Resistor',
        role: 'Pull-down Resistor',
        interface: 'Passive',
        voltage: 'N/A',
        quantity: 2,
        notes: 'Ensures stable LOW state for switches',
        price: '₹4'
      },
      {
        name: '5V Power Supply',
        role: 'Power Source',
        interface: 'Power',
        voltage: '5V',
        quantity: 1,
        notes: 'Powers the IC and components',
        price: '₹0'
      },
      {
        name: 'Breadboard & Wires',
        role: 'Prototyping',
        interface: 'N/A',
        voltage: 'N/A',
        quantity: 1,
        notes: 'For circuit connections and testing',
        price: '₹80'
      },
    ],
    totalCost: '₹116'
  },
  {
    title: '74HC73 IC Verification Circuit',
    description: 'Digital sequential circuit to verify the functionality of 74HC73 Dual J-K Flip-Flop IC. Demonstrates flip-flop behavior using Arduino clock input, slide switches for J-K inputs, and LED output indicators.',
    platform: 'Arduino & Digital IC',
    software: 'Tinkercad',
    technologies: ['Arduino', 'Tinkercad'],
    category: 'DIGITAL_LOGIC',
    difficulty: 'INTERMEDIATE',
    status: 'VERIFIED',
    link: 'https://www.tinkercad.com/things/3k6pl1OnIPL-verification-of-74hc73',
    embedUrl: 'https://www.tinkercad.com/embed/3k6pl1OnIPL',
    schematicLink: 'https://drive.google.com/file/d/1KaWyD5SmmB60J_5D2lWYv1zuTrwjtZbO/view?usp=sharing',
    collegeCourseProject: true,
    slug: '74hc73-ic-verification',
    year: 2026,
    dateRange: 'Aug 2026',
    overview: 'This circuit verifies the operation of the 74HC73 dual negative-edge-triggered J-K flip-flop integrated circuit. Using an Arduino to generate clock pulses, slide switches for J and K inputs, and a pushbutton for reset, students can manually verify the flip-flop truth table and observe state transitions.',
    workingPrinciple: 'The 74HC73 IC contains two independent J-K flip-flops with clear inputs. The Arduino provides clock pulses, and slide switches control the J and K inputs. When the clock transitions from HIGH to LOW (negative edge), the flip-flop updates its output based on J-K input combinations: J=0 K=0 (hold), J=0 K=1 (reset), J=1 K=0 (set), J=1 K=1 (toggle). The LED displays the Q output state, demonstrating sequential logic behavior.',
    components: [
      {
        name: '74HC73 IC',
        role: 'Dual J-K Flip-Flop',
        interface: '14-pin DIP',
        voltage: '5V',
        quantity: 1,
        notes: 'Negative-edge-triggered flip-flop with clear',
        price: '₹20'
      },
      {
        name: 'Arduino Uno R3',
        role: 'Clock Generator',
        interface: 'USB',
        voltage: '5V',
        quantity: 1,
        notes: 'Generates clock pulses for flip-flop',
        price: '₹450'
      },
      {
        name: 'Yellow LED',
        role: 'Output Indicator',
        interface: 'Digital Output',
        voltage: '5V',
        quantity: 1,
        notes: 'Displays Q output state',
        price: '₹5'
      },
      {
        name: 'Slide Switch',
        role: 'J-K Input Control',
        interface: 'Digital Input',
        voltage: '5V',
        quantity: 2,
        notes: 'Controls J and K inputs for flip-flop',
        price: '₹15'
      },
      {
        name: '220 Ω Resistor',
        role: 'LED Current Limiting',
        interface: 'Passive',
        voltage: 'N/A',
        quantity: 1,
        notes: 'Limits current through LED',
        price: '₹2'
      },
      {
        name: 'Pushbutton',
        role: 'Clear/Reset Input',
        interface: 'Digital Input',
        voltage: '5V',
        quantity: 1,
        notes: 'Resets flip-flop to known state',
        price: '₹5'
      },
      {
        name: '10 kΩ Resistor',
        role: 'Pull-down Resistor',
        interface: 'Passive',
        voltage: 'N/A',
        quantity: 3,
        notes: 'Ensures stable LOW state for inputs',
        price: '₹6'
      },
      {
        name: 'Breadboard & Wires',
        role: 'Prototyping',
        interface: 'N/A',
        voltage: 'N/A',
        quantity: 1,
        notes: 'For circuit connections and testing',
        price: '₹80'
      },
    ],
    totalCost: '₹583'
  },
  {
    title: 'CD4511 BCD to 7-Segment Decoder Circuit',
    description: 'Arduino-controlled 7-segment display using CD4511 BCD decoder IC. Demonstrates BCD encoding and digit display with counter and single-digit modes.',
    platform: 'Arduino & Digital IC',
    software: 'Tinkercad',
    technologies: ['Arduino', 'Tinkercad'],
    category: 'DIGITAL_LOGIC',
    difficulty: 'INTERMEDIATE',
    status: 'VERIFIED',
    link: 'https://www.tinkercad.com/things/eygh0dbLKMC-cd4511-and-7-sd-ardunio-uno',
    embedUrl: 'https://www.tinkercad.com/embed/eygh0dbLKMC',
    schematicLink: 'https://drive.google.com/file/d/1syTCvV42XwFwDtunTlat8ZFnKUMCTjcX/view?usp=sharing',
    collegeCourseProject: true,
    slug: 'cd4511-7segment-decoder',
    year: 2026,
    dateRange: 'Aug 2026',
    codeVariants: [
      {
        label: 'Counter (0-9)',
        code: `// Arduino D2 -> CD4511 A
// Arduino D3 -> CD4511 B
// Arduino D4 -> CD4511 C
// Arduino D5 -> CD4511 D

const int A = 2;
const int B = 3;
const int C = 4;
const int D = 5;

void setup() {
  pinMode(A, OUTPUT);
  pinMode(B, OUTPUT);
  pinMode(C, OUTPUT);
  pinMode(D, OUTPUT);
}

void displayDigit(int digit) {
  // Send BCD value to CD4511
  digitalWrite(A, bitRead(digit, 0));
  digitalWrite(B, bitRead(digit, 1));
  digitalWrite(C, bitRead(digit, 2));
  digitalWrite(D, bitRead(digit, 3));
}

void loop() {
  for (int digit = 0; digit <= 9; digit++) {
    displayDigit(digit);
    delay(1000);
  }
}`
      },
      {
        label: 'Single Digit (6)',
        code: `// Arduino D2 -> CD4511 A
// Arduino D3 -> CD4511 B
// Arduino D4 -> CD4511 C
// Arduino D5 -> CD4511 D

void setup() {
  pinMode(2, OUTPUT);
  pinMode(3, OUTPUT);
  pinMode(4, OUTPUT);
  pinMode(5, OUTPUT);
  
  // 6 = BCD 0110 (DCBA)
  digitalWrite(2, LOW);   // A = 0
  digitalWrite(3, HIGH);  // B = 1
  digitalWrite(4, HIGH);  // C = 1
  digitalWrite(5, LOW);   // D = 0
}

void loop() {
  // Keep displaying 6
}`
      }
    ],
    overview: 'This circuit demonstrates BCD (Binary-Coded Decimal) to 7-segment decoding using the CD4511 IC. The Arduino sends 4-bit BCD values (0000-1001) to the decoder, which drives a common-cathode 7-segment display. Two modes showcase counting from 0-9 and displaying a fixed digit.',
    workingPrinciple: 'The CD4511 is a BCD-to-7-segment decoder/driver IC. The Arduino outputs a 4-bit binary number on pins D2-D5 (representing bits A-D). The CD4511 decodes this BCD input and activates the appropriate segments (a-g) on the 7-segment display through current-limiting resistors. The bitRead() function extracts individual bits from decimal numbers for BCD conversion.',
    components: [
      {
        name: 'Arduino Uno R3',
        role: 'BCD Generator',
        interface: 'USB',
        voltage: '5V',
        quantity: 1,
        notes: 'Generates BCD signals for decoder',
        price: '₹450'
      },
      {
        name: 'CD4511 IC',
        role: '7-Segment Decoder',
        interface: '16-pin DIP',
        voltage: '5V',
        quantity: 1,
        notes: 'BCD to 7-segment decoder/driver',
        price: '₹25'
      },
      {
        name: 'Common Cathode 7-Segment Display',
        role: 'Visual Output',
        interface: 'Digital Output',
        voltage: '5V',
        quantity: 1,
        notes: 'Displays decimal digits 0-9',
        price: '₹15'
      },
      {
        name: '220 Ω Resistor',
        role: 'Segment Current Limiting',
        interface: 'Passive',
        voltage: 'N/A',
        quantity: 7,
        notes: 'Limits current for each segment (a-g)',
        price: '₹14'
      },
      {
        name: 'Breadboard & Wires',
        role: 'Prototyping',
        interface: 'N/A',
        voltage: 'N/A',
        quantity: 1,
        notes: 'For circuit connections and testing',
        price: '₹80'
      },
    ],
    totalCost: '₹584'
  },
  {
    title: 'Distance Measurement Using Ultrasonic Sensor',
    description: 'Arduino-based distance measurement circuit using HC-SR04 ultrasonic sensor. Measures distance to objects and displays results in serial monitor.',
    platform: 'Arduino',
    software: 'Tinkercad',
    technologies: ['Arduino', 'Tinkercad'],
    category: 'SENSORS',
    difficulty: 'BEGINNER',
    status: 'VERIFIED',
    link: 'https://www.tinkercad.com/embed/krpqMRencWc',
    embedUrl: 'https://www.tinkercad.com/embed/krpqMRencWc',
    schematicLink: 'https://drive.google.com/file/d/1q5TnV-tQk6ouVmCX_CbtMMjDwf3n_awo/view?usp=sharing',
    collegeCourseProject: true,
    slug: 'distance-measurement-ultrasonic',
    year: 2026,
    dateRange: 'Aug 2026',
    code: `const int trigPin = 9;
const int echoPin = 10;

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  Serial.begin(9600);
}

void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);

  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH);

  float distance = duration * 0.0343 / 2;

  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");

  delay(500);
}`,
    overview: 'This circuit demonstrates distance measurement using an HC-SR04 ultrasonic sensor connected to an Arduino. The sensor emits ultrasonic waves and measures the time it takes for the echo to return, calculating the distance to objects.',
    workingPrinciple: 'The HC-SR04 ultrasonic sensor works by sending a 10μs trigger pulse from the Arduino. The sensor then emits 8 cycles of ultrasonic bursts at 40kHz and detects the echo. The Arduino measures the time between trigger and echo using pulseIn(), then calculates distance using the formula: distance = (duration × speed of sound) / 2. The speed of sound is approximately 0.0343 cm/μs.',
    components: [
      {
        name: 'Arduino Uno R3',
        role: 'Main Controller',
        interface: 'USB',
        voltage: '5V',
        quantity: 1,
        notes: 'Processes ultrasonic sensor data and calculates distance',
        price: '₹450'
      },
      {
        name: 'HC-SR04 Ultrasonic Sensor',
        role: 'Distance Measurement',
        interface: 'Digital (TRIG/ECHO)',
        voltage: '5V',
        quantity: 1,
        notes: 'Emits ultrasonic waves and measures echo return time',
        price: '₹80'
      },
      {
        name: 'Breadboard & Wires',
        role: 'Prototyping',
        interface: 'N/A',
        voltage: 'N/A',
        quantity: 1,
        notes: 'For circuit connections and testing',
        price: '₹80'
      },
    ],
    totalCost: '₹610'
  },
  {
    title: 'IR Sensor Operation Using Arduino',
    description: 'Arduino-based IR sensor circuit for object detection using infrared technology. Detects objects and provides visual feedback through LED.',
    platform: 'Arduino',
    software: 'Tinkercad',
    technologies: ['Arduino', 'Tinkercad'],
    category: 'SENSORS',
    difficulty: 'BEGINNER',
    status: 'VERIFIED',
    link: 'https://www.tinkercad.com/embed/a0syYJ6pHPV',
    embedUrl: 'https://www.tinkercad.com/embed/a0syYJ6pHPV',
    schematicLink: 'https://drive.google.com/file/d/1q5TnV-tQk6ouVmCX_CbtMMjDwf3n_awo/view?usp=sharing',
    collegeCourseProject: true,
    slug: 'ir-sensor-operation',
    year: 2026,
    dateRange: 'Aug 2026',
    code: `const int irPin = 2;
const int ledPin = 13;

void setup() {
  pinMode(irPin, INPUT);
  pinMode(ledPin, OUTPUT);

  Serial.begin(9600);
}

void loop() {
  int sensorState = digitalRead(irPin);

  if (sensorState == LOW) {
    digitalWrite(ledPin, HIGH);
    Serial.println("Object Detected");
  } else {
    digitalWrite(ledPin, LOW);
    Serial.println("No Object");
  }

  delay(200);
}`,
    overview: 'This circuit demonstrates object detection using an IR (Infrared) sensor connected to an Arduino. The IR sensor detects objects by emitting and receiving infrared light, providing digital output that indicates object presence.',
    workingPrinciple: 'The IR sensor consists of an IR LED and a photodetector. When an object is in front of the sensor, the IR light from the LED reflects off the object and is detected by the photodetector. The sensor outputs a LOW signal when an object is detected and HIGH when no object is present. The Arduino reads this digital signal and controls an LED to provide visual feedback of detection status.',
    components: [
      {
        name: 'Arduino Uno R3',
        role: 'Main Controller',
        interface: 'USB',
        voltage: '5V',
        quantity: 1,
        notes: 'Processes IR sensor data and controls LED output',
        price: '₹450'
      },
      {
        name: 'IR Sensor',
        role: 'Object Detection',
        interface: 'Digital Input',
        voltage: '5V',
        quantity: 1,
        notes: 'Detects objects using infrared reflection',
        price: '₹40'
      },
      {
        name: 'LED',
        role: 'Visual Indicator',
        interface: 'Digital Output',
        voltage: '5V',
        quantity: 1,
        notes: 'Indicates object detection status',
        price: '₹5'
      },
      {
        name: '220 Ω Resistor',
        role: 'LED Current Limiting',
        interface: 'Passive',
        voltage: 'N/A',
        quantity: 1,
        notes: 'Protects LED from excessive current',
        price: '₹2'
      },
      {
        name: 'Breadboard & Wires',
        role: 'Prototyping',
        interface: 'N/A',
        voltage: 'N/A',
        quantity: 1,
        notes: 'For circuit connections and testing',
        price: '₹80'
      },
    ],
    totalCost: '₹577'
  },
];
