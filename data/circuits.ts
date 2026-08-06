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
    slug: 'led-sequence-control',
    year: 2026,
    dateRange: 'Aug 2026',
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
];
