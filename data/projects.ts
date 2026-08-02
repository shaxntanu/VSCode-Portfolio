import { Project, ProjectCategory, CategoryConfig } from '@/types';

export type { Project, ProjectCategory, CategoryConfig };

export const categoryConfig: Record<ProjectCategory, CategoryConfig> = {
  HARDWARE_MODULES: {
    title: '// ',
    titleHighlight: 'HARDWARE_MODULES (Flagship Projects)',
    color: '#ff8c50', // Red/Orange - Hardware
  },
  SOFTWARE_SYSTEMS: {
    title: '// ',
    titleHighlight: 'SOFTWARE_SYSTEMS',
    color: '#2196f3', // Blue - Software (swapped)
  },
  MISC_LABS: {
    title: '// ',
    titleHighlight: 'MISC_LABS',
    color: '#a078ff', // Purple - Misc
  },
  COMMUNITY_PROJECT: {
    title: '// ',
    titleHighlight: 'ARCEUS_LABS',
    color: '#00dc8c', // Green - Arceus Labs (swapped)
    link: 'https://arceuslabs.carrd.co',
  },
  RAGASTRA_PROJECT: {
    title: '// ',
    titleHighlight: 'RAGASTRA',
    color: '#a078ff', // Purple - Ragastra
    link: 'https://github.com/Ragastra',
  },
};

export const projects: Project[] = [
  // 2018
  {
    title: 'Blind Stick',
    description: 'Smart mobility aid with obstacle detection and voice alerts.',
    logo: '/logos/notion_icon.svg',
    link: 'https://crocus-zenobia-863.notion.site/Smart-Blind-Stick-Report-2a01ebfe2064802580bcd52932677de4',
    slug: 'blind-stick',
    category: 'COMMUNITY_PROJECT',
    dateRange: 'Jul 2018 - Aug 2018',
    year: 2018,
    fundedPrototype: true,
    badgeType: 'funded'
  },
  // 2025
  {
    title: 'Marcus Omega',
    description: 'Philosophical AI chatbot powered by Gemini API.',
    logo: '/logos/vercel_icon.svg',
    link: 'https://glyphthoughts.github.io/Marcus-Landing-Page',
    slug: 'marcus-omega',
    category: 'SOFTWARE_SYSTEMS',
    dateRange: 'Jul 2025 - Sep 2025',
    year: 2025,
  },
  {
    title: 'VS Code Portfolio',
    description: 'Portfolio website styled as VS Code editor.',
    logo: '/logos/vscode_icon.svg',
    link: 'https://vs-code-portfolio-one.vercel.app',
    slug: 'vs-code-portfolio',
    category: 'SOFTWARE_SYSTEMS',
    dateRange: 'Jul 2025 - Present (Regular Maintenance)',
    year: 2025,
  },
  {
    title: 'Zephyr Station',
    description: 'ESP32-based IoT station for environmental monitoring.',
    logo: '/logos/espressif_icon.svg',
    link: 'https://github.com/shaxntanu/Zephyr-Station',
    slug: 'zephyr-station',
    category: 'HARDWARE_MODULES',
    dateRange: 'Aug 2025 - Nov 2025',
    year: 2025,
    reportLink: 'https://crocus-zenobia-863.notion.site/Zephyr-Station-Technical-Report-de41e9c0afd3444195afbac904fe2edc',
    components: [
      {
        name: 'ESP32 DevKit V1',
        role: 'Main Controller & WiFi',
        interface: 'WiFi/Bluetooth',
        voltage: '3.3V/5V',
        quantity: 1,
        notes: 'Dual-core Xtensa processor, built-in WiFi and Bluetooth',
        price: '₹300'
      },
      {
        name: 'SSD1306 OLED Display',
        role: 'Real-time Visualization',
        interface: 'I2C (0x3C)',
        voltage: '3.3V',
        quantity: 1,
        notes: '0.96" 128x64 monochrome display on I2C Bus 0',
        price: '₹150'
      },
      {
        name: 'BME280',
        role: 'Environmental Sensor',
        interface: 'I2C (0x76/0x77)',
        voltage: '3.3V',
        quantity: 1,
        notes: 'Temperature, humidity & pressure sensor on I2C Bus 1',
        price: '₹200'
      },
      {
        name: 'DS18B20',
        role: 'Backup Temperature Sensor',
        interface: '1-Wire',
        voltage: '3.3V-5V',
        quantity: 1,
        notes: 'Waterproof digital temperature sensor with 4.7kΩ pull-up',
        price: '₹120'
      },
      {
        name: 'DS3231 RTC Module',
        role: 'Real-Time Clock',
        interface: 'I2C',
        voltage: '3.3V-5V',
        quantity: 1,
        notes: 'High precision RTC with battery backup on I2C Bus 2',
        price: '₹80'
      },
      {
        name: 'MicroSD Card Module',
        role: 'Data Logging Storage',
        interface: 'SPI',
        voltage: '3.3V-5V',
        quantity: 1,
        notes: 'SD card reader for CSV data logging via SPI interface',
        price: '₹50'
      },
      {
        name: 'MQ-135 Gas Sensor',
        role: 'Air Quality Monitor',
        interface: 'Analog',
        voltage: '5V',
        quantity: 1,
        notes: 'Detects NH3, NOx, alcohol, benzene, smoke, CO2',
        price: '₹100'
      },
      {
        name: 'Active Buzzer 5V',
        role: 'Audio Alerts',
        interface: 'Digital Output',
        voltage: '5V',
        quantity: 1,
        notes: 'Alert buzzer for threshold violations',
        price: '₹20'
      },
      {
        name: '4.7kΩ Resistor',
        role: 'DS18B20 Pull-up',
        interface: 'Passive',
        voltage: 'N/A',
        quantity: 1,
        notes: 'Pull-up resistor for 1-Wire communication',
        price: '₹2'
      },
      {
        name: 'Breadboard & Jumper Wires',
        role: 'Prototyping',
        interface: 'N/A',
        voltage: 'N/A',
        quantity: 1,
        notes: 'For circuit connections and testing',
        price: '₹80'
      },
      {
        name: '5V 2A USB Power Supply',
        role: 'System Power',
        interface: 'USB',
        voltage: '5V',
        quantity: 1,
        notes: 'Powers ESP32 and all peripherals',
        price: '₹100'
      },
    ],
    architecture: 'ESP32 → [I2C Bus 0: OLED] → [I2C Bus 1: BME280] → [I2C Bus 2: RTC] → [SPI: SD Card] → [1-Wire: DS18B20] → [Analog: MQ-135] → [Digital: Buzzer] → WiFi Cloud Upload',
    totalCost: '₹1,202'
  },
  {
    title: 'Jolt Locator',
    description: 'Offline GPS navigation device with compass guidance.',
    logo: '/logos/espressif_icon.svg',
    link: 'https://github.com/Arceus-Labs/Jolt-Locator',
    slug: 'jolt-locator',
    category: 'COMMUNITY_PROJECT',
    dateRange: 'Nov 2025 - Dec 2025',
    year: 2025,
    reportLink: 'https://crocus-zenobia-863.notion.site/Jolt-Locator-Technical-Report-2d61ebfe20648069a6e1c0589107c909?pvs=73',
    components: [
      {
        name: 'ESP32 DevKit V1',
        role: 'Main Controller',
        interface: 'WiFi/Bluetooth',
        voltage: '3.3V/5V',
        quantity: 1,
        notes: 'Dual-core processor with WiFi/Bluetooth',
        price: '₹475'
      },
      {
        name: 'NEO-6M GPS Module',
        role: 'GPS Tracking',
        interface: 'UART2',
        voltage: '3.3V-5V',
        quantity: 1,
        notes: 'GPS receiver on GPIO 16/17',
        price: '₹760'
      },
      {
        name: 'QMC5883L Magnetometer',
        role: 'Digital Compass',
        interface: 'I2C',
        voltage: '3.3V',
        quantity: 1,
        notes: '3-axis magnetic sensor for heading',
        price: '₹238'
      },
      {
        name: 'SSD1306 OLED Display',
        role: 'Real-time Visualization',
        interface: 'I2C',
        voltage: '3.3V',
        quantity: 1,
        notes: '0.96" 128x64 monochrome display',
        price: '₹380'
      },
      {
        name: 'RGB LED (Common Cathode)',
        role: 'Status Indicator',
        interface: 'Digital Output',
        voltage: '3.3V',
        quantity: 1,
        notes: 'GPS lock & movement status on GPIO 25/26/27',
        price: '₹48'
      },
      {
        name: '6mm Tactile Buttons',
        role: 'User Input',
        interface: 'Digital Input',
        voltage: '3.3V',
        quantity: 2,
        notes: 'Mode switch & calibration on GPIO 32/33',
        price: '₹19'
      },
      {
        name: '330Ω Resistor',
        role: 'LED Current Limiting',
        interface: 'Passive',
        voltage: 'N/A',
        quantity: 3,
        notes: 'For RGB LED protection',
        price: '₹10'
      },
      {
        name: '4.7kΩ Resistor',
        role: 'I2C Pull-up',
        interface: 'Passive',
        voltage: 'N/A',
        quantity: 2,
        notes: 'Pull-up resistors for I2C bus',
        price: '₹5'
      },
      {
        name: '100nF Capacitor',
        role: 'Decoupling',
        interface: 'Passive',
        voltage: 'N/A',
        quantity: 3,
        notes: 'Power supply filtering',
        price: '₹10'
      },
      {
        name: '10µF Capacitor',
        role: 'Power Filtering',
        interface: 'Passive',
        voltage: '16V',
        quantity: 1,
        notes: 'Main power supply smoothing',
        price: '₹5'
      },
      {
        name: 'Breadboard & Wires',
        role: 'Prototyping',
        interface: 'N/A',
        voltage: 'N/A',
        quantity: 1,
        notes: 'For circuit connections',
        price: '₹475'
      },
    ],
    architecture: 'ESP32 → [UART2: NEO-6M GPS] → [I2C: QMC5883L + OLED] → [GPIO: RGB LED + Buttons] → Display coordinates & heading',
    totalCost: '₹2,470'
  },
  {
    title: 'The Ruin Machine',
    description: 'ESP32 device that proves gambling always leads to loss through math.',
    logo: '/logos/espressif_icon.svg',
    link: 'https://github.com/Arceus-Labs/The-Ruin-Machine',
    slug: 'the-ruin-machine',
    category: 'COMMUNITY_PROJECT',
    dateRange: 'Dec 2025 - Jan 2026',
    year: 2025,
    reportLink: 'https://crocus-zenobia-863.notion.site/The-Ruin-Machine-Technical-Report-2dc1ebfe2064806a9625f49a9871aaf3?pvs=73',
    components: [
      {
        name: 'ESP32 DevKit V1',
        role: 'Main Controller & RNG',
        interface: 'WiFi/Bluetooth',
        voltage: '3.3V/5V',
        quantity: 1,
        notes: 'Hardware random number generator for true randomness',
        price: '₹475'
      },
      {
        name: 'SSD1306 OLED Display',
        role: 'Real-time Visualization',
        interface: 'I2C (0x3C)',
        voltage: '3.3V',
        quantity: 1,
        notes: '0.96" 128x64 display on GPIO 21/22',
        price: '₹380'
      },
      {
        name: 'Active Buzzer 5V',
        role: 'Audio Feedback',
        interface: 'Digital Output',
        voltage: '5V',
        quantity: 1,
        notes: 'Win/loss alerts on GPIO 4',
        price: '₹48'
      },
      {
        name: '6mm Tactile Buttons',
        role: 'User Input',
        interface: 'Digital Input',
        voltage: '3.3V',
        quantity: 2,
        notes: 'BET button (GPIO 13) & MODE button (GPIO 12)',
        price: '₹19'
      },
      {
        name: '10kΩ Resistor',
        role: 'Button Pull-up',
        interface: 'Passive',
        voltage: 'N/A',
        quantity: 2,
        notes: 'Optional external pull-ups for buttons',
        price: '₹5'
      },
      {
        name: 'Breadboard & Wires',
        role: 'Prototyping',
        interface: 'N/A',
        voltage: 'N/A',
        quantity: 1,
        notes: 'For circuit connections',
        price: '₹285'
      },
    ],
    architecture: 'ESP32 [Hardware RNG] → [I2C: OLED] → [GPIO: Buzzer + Buttons] → Gambling simulation & statistics display',
    totalCost: '₹1,237'
  },
  // 2026
  {
    title: 'Electromagnet Controller',
    description: 'Arduino-based electromagnet turns controller for precise coil winding.',
    logo: '/logos/arduino_icon.svg',
    link: 'https://github.com/Arceus-Labs/Arduino-Electromagnet-Turns-Controller',
    slug: 'electromagnet-controller',
    category: 'RAGASTRA_PROJECT',
    dateRange: 'Jan 2026 - Feb 2026',
    year: 2026,
    components: [
      {
        name: 'Arduino UNO',
        role: 'Main Controller',
        interface: 'USB',
        voltage: '5V',
        quantity: 1,
        notes: 'Controls stepper motor drivers',
        price: '₹1,900'
      },
      {
        name: 'CNC Shield V3',
        role: 'Stepper Driver Interface',
        interface: 'Digital I/O',
        voltage: '12V-24V',
        quantity: 1,
        notes: 'Shields for easy stepper connection',
        price: '₹475'
      },
      {
        name: 'A4988/DRV8825 Stepper Drivers',
        role: 'Motor Control',
        interface: 'Step/Dir',
        voltage: '12V-24V',
        quantity: 2,
        notes: 'X-axis and Y-axis motor drivers',
        price: '₹380'
      },
      {
        name: 'Stepper Motors',
        role: 'Winding Mechanism',
        interface: '4-wire',
        voltage: '12V',
        quantity: 2,
        notes: 'Synchronous rotation for even coil winding',
        price: '₹1,900'
      },
      {
        name: 'Power Supply 12V-24V',
        role: 'Motor Power',
        interface: 'DC',
        voltage: '12V-24V',
        quantity: 1,
        notes: 'Powers stepper drivers and motors',
        price: '₹1,425'
      },
    ],
    architecture: 'Arduino UNO → [CNC Shield V3] → [Step/Dir: A4988 Drivers] → [Stepper Motors X & Y] → Synchronous coil winding',
    totalCost: '₹6,080',
    fundedPrototype: true,
    badgeType: 'funded'
  },
  {
    title: 'Inductance Meter',
    description: 'ESP8266-based inductance measurement tool with OLED display using RL time constant method.',
    logo: '/logos/espressif_icon.svg',
    link: 'https://github.com/Arceus-Labs/esp8266-inductance-meter',
    slug: 'inductance-meter',
    category: 'RAGASTRA_PROJECT',
    dateRange: 'Jan 2026 - Jan 2026',
    year: 2026,
    components: [
      {
        name: 'ESP8266 NodeMCU',
        role: 'Main Controller & ADC',
        interface: 'WiFi',
        voltage: '3.3V',
        quantity: 1,
        notes: 'Measures time constant via analog pin A0',
        price: '₹380'
      },
      {
        name: 'SSD1306 OLED Display',
        role: 'Real-time Display',
        interface: 'I2C',
        voltage: '3.3V',
        quantity: 1,
        notes: '128x64 display on GPIO4/5 (D2/D1)',
        price: '₹380'
      },
      {
        name: '10kΩ Potentiometer',
        role: 'Variable Resistance',
        interface: 'Analog',
        voltage: 'N/A',
        quantity: 1,
        notes: 'Adjusts total resistance for measurement',
        price: '₹48'
      },
      {
        name: '330Ω Fixed Resistor',
        role: 'Known Resistance',
        interface: 'Passive',
        voltage: 'N/A',
        quantity: 1,
        notes: 'Series resistance with potentiometer',
        price: '₹5'
      },
      {
        name: '0.1µF Capacitor',
        role: 'ADC Smoothing',
        interface: 'Passive',
        voltage: '16V',
        quantity: 1,
        notes: 'Stabilizes analog readings on A0',
        price: '₹5'
      },
      {
        name: 'Air-core Inductor (Test coil)',
        role: 'Device Under Test',
        interface: 'Passive',
        voltage: 'N/A',
        quantity: 1,
        notes: 'Coil being measured',
        price: 'Variable'
      },
      {
        name: 'Breadboard & Wires',
        role: 'Prototyping',
        interface: 'N/A',
        voltage: 'N/A',
        quantity: 1,
        notes: 'For circuit connections',
        price: '₹285'
      },
    ],
    architecture: 'ESP8266 [GPIO D5] → [Fixed Resistor + Potentiometer] → [Inductor] → GND; A0 measures voltage rise → Calculate τ → Display L = R×τ',
    totalCost: '₹1,103'
  },
  {
    title: 'Servo Light Switch',
    description: 'Bluetooth-controlled servo automation for physical light switches via ESP8266 and HC-06.',
    logo: '/logos/espressif_icon.svg',
    link: 'https://github.com/Arceus-Labs/Servo-Light-Switch-Control-ESP8266-and-HC06',
    slug: 'servo-light-switch',
    category: 'COMMUNITY_PROJECT',
    dateRange: 'Jan 2026 - Jan 2026',
    year: 2026,
    components: [
      {
        name: 'ESP8266 NodeMCU',
        role: 'Main Controller',
        interface: 'WiFi/UART',
        voltage: '3.3V',
        quantity: 1,
        notes: 'Receives Bluetooth commands and controls servos',
        price: '₹380'
      },
      {
        name: 'HC-06 Bluetooth Module',
        role: 'Wireless Communication',
        interface: 'UART',
        voltage: '3.3V',
        quantity: 1,
        notes: 'Bluetooth serial interface for remote control',
        price: '₹285'
      },
      {
        name: 'SG90/MG90S Servo Motors',
        role: 'Switch Actuation',
        interface: 'PWM',
        voltage: '5V',
        quantity: 2,
        notes: 'Physical switch togglers on GPIO14/12 (D5/D6)',
        price: '₹380'
      },
      {
        name: '5V External Power Supply',
        role: 'Servo Power',
        interface: 'DC',
        voltage: '5V',
        quantity: 1,
        notes: 'Powers servos independently from ESP',
        price: '₹475'
      },
      {
        name: 'Breadboard & Wires',
        role: 'Prototyping',
        interface: 'N/A',
        voltage: 'N/A',
        quantity: 1,
        notes: 'For circuit connections',
        price: '₹285'
      },
    ],
    architecture: 'Bluetooth App → [HC-06] → [UART: ESP8266] → [PWM GPIO14/12: Servos] → Physical switch toggle',
    totalCost: '₹1,805'
  },
  {
    title: 'RFID Attendance System',
    description: 'Automated attendance tracking with RFID cards, ESP32 and Arduino.',
    logo: ['/logos/arduino_icon.svg', '/logos/espressif_icon.svg'],
    link: 'https://github.com/Arceus-Labs/RFID-Attendance-System',
    slug: 'rfid-attendance-system',
    category: 'COMMUNITY_PROJECT',
    dateRange: 'Jan 2026 - Feb 2026',
    year: 2026,
    components: [
      {
        name: 'Arduino Nano',
        role: 'RFID & RTC Handler',
        interface: 'UART/I2C/SPI',
        voltage: '5V',
        quantity: 1,
        notes: 'Handles RFID reading and timekeeping',
        price: '₹950'
      },
      {
        name: 'ESP32 Development Board',
        role: 'Display & Storage Logic',
        interface: 'UART/I2C/SPI',
        voltage: '3.3V/5V',
        quantity: 1,
        notes: 'Manages OLED, SD card, and attendance logic',
        price: '₹475'
      },
      {
        name: 'MFRC522 RFID Reader',
        role: 'Card Scanner',
        interface: 'SPI',
        voltage: '3.3V',
        quantity: 1,
        notes: 'Reads RFID cards on Arduino SPI pins',
        price: '₹285'
      },
      {
        name: 'DS3231 RTC Module',
        role: 'Real-Time Clock',
        interface: 'I2C',
        voltage: '5V',
        quantity: 1,
        notes: 'Accurate timestamps with battery backup',
        price: '₹190'
      },
      {
        name: 'SSD1306 OLED Display',
        role: 'Visual Feedback',
        interface: 'I2C',
        voltage: '3.3V',
        quantity: 1,
        notes: '128x64 display on ESP32 GPIO21/22',
        price: '₹380'
      },
      {
        name: 'SD Card Module',
        role: 'Data Storage',
        interface: 'SPI',
        voltage: '3.3V-5V',
        quantity: 1,
        notes: 'Stores student and attendance CSV files',
        price: '₹190'
      },
      {
        name: 'RGB LED (Common Cathode)',
        role: 'Status Indicator',
        interface: 'Digital Output',
        voltage: '3.3V',
        quantity: 1,
        notes: 'Visual feedback on ESP32 GPIO25/26/27',
        price: '₹48'
      },
      {
        name: 'Active Buzzer',
        role: 'Audio Feedback',
        interface: 'Digital Output',
        voltage: '5V',
        quantity: 1,
        notes: 'Attendance confirmation on ESP32 GPIO33',
        price: '₹48'
      },
      {
        name: '6mm Tactile Button',
        role: 'User Input',
        interface: 'Digital Input',
        voltage: '3.3V',
        quantity: 1,
        notes: 'Add user & reset functions on ESP32 GPIO14',
        price: '₹10'
      },
      {
        name: 'Resistors (330Ω, 10kΩ)',
        role: 'Current Limiting & Pull-ups',
        interface: 'Passive',
        voltage: 'N/A',
        quantity: 5,
        notes: 'For LED protection and button pull-ups',
        price: '₹19'
      },
      {
        name: 'Breadboard & Wires',
        role: 'Prototyping',
        interface: 'N/A',
        voltage: 'N/A',
        quantity: 1,
        notes: 'For circuit connections',
        price: '₹475'
      },
      {
        name: 'RFID Cards',
        role: 'Student IDs',
        interface: '13.56MHz',
        voltage: 'N/A',
        quantity: 10,
        notes: 'For attendance tracking',
        price: '₹475'
      },
      {
        name: 'MicroSD Card',
        role: 'Storage Medium',
        interface: 'FAT32',
        voltage: 'N/A',
        quantity: 1,
        notes: 'Stores CSV data files',
        price: '₹285'
      },
    ],
    architecture: 'Arduino Nano [MFRC522 RFID + DS3231 RTC] → [UART: ESP32] → [I2C: OLED] → [SPI: SD Card] → [GPIO: RGB LED + Buzzer + Button] → Attendance logging',
    totalCost: '₹3,829'
  },
  {
    title: 'Shape Detection System',
    description: 'OpenCV-based geometric shape detection and recognition.',
    logo: ['/logos/python_icon.svg', '/logos/jupyter_icon.svg'],
    link: 'https://github.com/shaxntanu/Geometrical-Shape-Detection-and-Recognition-using-Python-in-Image-Processing-ELC-TIET-2029-ECE',
    slug: 'shape-detection-system',
    category: 'SOFTWARE_SYSTEMS',
    dateRange: 'Feb 2026 - Feb 2026',
    year: 2026,
    fundedPrototype: true,
    badgeType: 'college'
  },
];
