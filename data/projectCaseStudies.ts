export interface ProjectCaseStudy {
  overview: string;
  designSections: {
    title: string;
    description: string;
  }[];
}

export const projectCaseStudies: Record<string, ProjectCaseStudy> = {
  'zephyr-station': {
    overview:
      'Zephyr Station brings environmental sensing, on-device feedback, local logging, and Wi-Fi cloud upload together around an ESP32. Its component map documents the sensors and peripherals alongside the buses used to connect them.',
    designSections: [
      {
        title: 'Environmental sensing',
        description:
          'The BME280 measures temperature, humidity, and pressure. A DS18B20 is listed as a backup temperature sensor, while an MQ-135 monitors air-quality gases.',
      },
      {
        title: 'Local records and feedback',
        description:
          'A DS3231 real-time clock and MicroSD module support timestamped CSV logging. An SSD1306 OLED provides a local readout, and an active buzzer is listed for threshold alerts.',
      },
      {
        title: 'Peripheral integration',
        description:
          'The documented design assigns the OLED, BME280, and RTC to separate I²C buses, with SPI for the SD card, 1-Wire for the DS18B20, analog input for the MQ-135, and a digital output for the buzzer.',
      },
    ],
  },
  'jolt-locator': {
    overview:
      'Jolt Locator is an offline GPS navigation device that combines satellite positioning and compass guidance with a small on-device display and physical controls.',
    designSections: [
      {
        title: 'Position and heading',
        description:
          'A NEO-6M GPS receiver supplies location over UART2, while a QMC5883L magnetometer supplies compass heading over I²C.',
      },
      {
        title: 'On-device guidance',
        description:
          'The SSD1306 OLED is used to display coordinates and heading. An RGB LED indicates GPS lock and movement status, according to the component notes.',
      },
      {
        title: 'Physical controls',
        description:
          'Two tactile buttons are assigned to mode switching and calibration. The architecture connects GPS, compass, display, status LED, and buttons directly to the ESP32.',
      },
    ],
  },
};
