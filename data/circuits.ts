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
    code: `const int trigPin = 9;
const int echoPin = 10;
const int buzzer = 11;
const int tempPin = A0;

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(buzzer, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  // Distance
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  long duration = pulseIn(echoPin, HIGH);
  float distance = duration * 0.034 / 2;

  // Temperature (TMP36)
  int reading = analogRead(tempPin);
  float voltage = reading * (5.0 / 1023.0);
  float temperature = (voltage - 0.5) * 100.0;

  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.print(" cm\\t");
  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.println(" C");

  // Alarm
  if (distance < 20 || temperature > 35) {
    tone(buzzer, 1000);
  } else {
    noTone(buzzer);
  }

  delay(500);
}`,
    slug: 'blind-stick-circuit',
    year: 2018,
    dateRange: 'Jul 2018',
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
];
