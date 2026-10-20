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
      'Zephyr Station is an ESP32 indoor monitor combining environmental sensors, OLED feedback, RTC timestamping, SD-card CSV logging, and buzzer alerts. Its initialization logic keeps the monitor running when an individual sensor is unavailable.',
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
      'Jolt Locator is an ESP32 GPS-and-compass prototype that displays coordinates and heading on an OLED and guides users toward a configured Jolt store location.',
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
          'One tactile button starts navigation and another stops it. The GPS, compass, OLED, status LED, and buttons connect directly to the ESP32.',
      },
    ],
  },
};
