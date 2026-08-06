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
    slug: 'blind-stick-circuit',
    year: 2018,
    dateRange: 'Jul 2018',
    overview: 'This circuit simulates a smart blind stick that helps visually impaired individuals navigate safely. It uses an ultrasonic sensor to detect obstacles and provides audio feedback through a buzzer when objects are detected within a certain range.',
    workingPrinciple: 'The HC-SR04 ultrasonic sensor continuously measures the distance to nearby objects. When an obstacle is detected within the threshold distance (typically 50cm), the Arduino triggers the buzzer to alert the user. The closer the obstacle, the faster the buzzer beeps, providing intuitive distance feedback.',
    components: [
      {
        name: 'Arduino UNO',
        role: 'Main Controller',
        interface: 'USB',
        voltage: '5V',
        quantity: 1,
        notes: 'Processes sensor data and controls buzzer',
      },
      {
        name: 'HC-SR04 Ultrasonic Sensor',
        role: 'Obstacle Detection',
        interface: 'Digital',
        voltage: '5V',
        quantity: 1,
        notes: 'Measures distance using ultrasonic waves',
      },
      {
        name: 'Active Buzzer',
        role: 'Audio Alert',
        interface: 'Digital Output',
        voltage: '5V',
        quantity: 1,
        notes: 'Provides audible warnings',
      },
      {
        name: 'Breadboard & Wires',
        role: 'Prototyping',
        interface: 'N/A',
        voltage: 'N/A',
        quantity: 1,
        notes: 'For circuit connections',
      },
    ],
  },
];
