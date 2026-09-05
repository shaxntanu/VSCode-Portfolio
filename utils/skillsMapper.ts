// Skills data extracted from techstack.tsx and SkillMatrix.tsx
export interface SkillInfo {
  name: string;
  category: string;
  proficiency: 'Advanced' | 'Intermediate' | 'Basic' | 'Beginner';
  color: string;
}

// Extract skills from existing tech stack
const skillsData: SkillInfo[] = [
  // Hardware & Microcontrollers
  { name: 'ESP32', category: 'Microcontroller', proficiency: 'Advanced', color: '#ff8c50' },
  { name: 'Arduino', category: 'Microcontroller', proficiency: 'Advanced', color: '#ff8c50' },
  { name: 'KiCAD', category: 'PCB Design', proficiency: 'Intermediate', color: '#ff8c50' },
  { name: 'BME280', category: 'Sensors', proficiency: 'Advanced', color: '#ff8c50' },
  { name: 'GPS', category: 'Sensors', proficiency: 'Advanced', color: '#ff8c50' },
  { name: 'OLED', category: 'Sensors', proficiency: 'Advanced', color: '#ff8c50' },
  { name: 'Ultrasonic', category: 'Sensors', proficiency: 'Advanced', color: '#ff8c50' },
  { name: 'SD Card', category: 'Sensors', proficiency: 'Advanced', color: '#ff8c50' },
  { name: 'I2C', category: 'Protocol', proficiency: 'Intermediate', color: '#ff8c50' },
  { name: 'SPI', category: 'Protocol', proficiency: 'Intermediate', color: '#ff8c50' },
  { name: 'UART', category: 'Protocol', proficiency: 'Intermediate', color: '#ff8c50' },
  { name: 'MQTT', category: 'Protocol', proficiency: 'Intermediate', color: '#ff8c50' },

  // Programming Languages & HDL
  { name: 'C (Embedded)', category: 'Language', proficiency: 'Advanced', color: '#00dc8c' },
  { name: 'C++', category: 'Language', proficiency: 'Intermediate', color: '#00dc8c' },
  { name: 'Verilog', category: 'HDL', proficiency: 'Beginner', color: '#00dc8c' },
  { name: 'Python', category: 'Language', proficiency: 'Advanced', color: '#00dc8c' },
  { name: 'Java', category: 'Language', proficiency: 'Intermediate', color: '#00dc8c' },
  { name: 'Kotlin', category: 'Language', proficiency: 'Basic', color: '#00dc8c' },
  { name: 'MATLAB', category: 'Language', proficiency: 'Beginner', color: '#ffc107' },

  // Development Tools & IDEs
  { name: 'Arduino IDE', category: 'IDE', proficiency: 'Advanced', color: '#a078ff' },
  { name: 'Android Studio', category: 'IDE', proficiency: 'Intermediate', color: '#a078ff' },
  { name: 'Tinkercad', category: 'Simulation', proficiency: 'Advanced', color: '#a078ff' },
  { name: 'Wokwi', category: 'Simulation', proficiency: 'Advanced', color: '#a078ff' },
  { name: 'Git', category: 'Version Control', proficiency: 'Advanced', color: '#a078ff' },
  { name: 'GitHub', category: 'Version Control', proficiency: 'Advanced', color: '#a078ff' },
  { name: 'Notion', category: 'Documentation', proficiency: 'Advanced', color: '#a078ff' },

  // Web Technologies
  { name: 'HTML', category: 'Web Frontend', proficiency: 'Basic', color: '#2196f3' },
  { name: 'CSS', category: 'Web Frontend', proficiency: 'Basic', color: '#2196f3' },
  { name: 'JavaScript', category: 'Web Frontend', proficiency: 'Basic', color: '#2196f3' },
  { name: 'React', category: 'Web Framework', proficiency: 'Basic', color: '#2196f3' },
  { name: 'Next.js', category: 'Web Framework', proficiency: 'Basic', color: '#2196f3' },
  { name: 'Tailwind CSS', category: 'Web Framework', proficiency: 'Basic', color: '#2196f3' },
  { name: 'Firebase', category: 'Database', proficiency: 'Basic', color: '#2196f3' },
  { name: 'Vercel', category: 'Deployment', proficiency: 'Advanced', color: '#2196f3' },

  // CAD & Design
  { name: 'SolidWorks', category: 'CAD Design', proficiency: 'Intermediate', color: '#ff8c50' },
  { name: 'AutoCAD', category: 'CAD Design', proficiency: 'Intermediate', color: '#ff8c50' },

  // Libraries & Frameworks
  { name: 'OpenCV', category: 'Image Processing', proficiency: 'Intermediate', color: '#2196f3' },
  { name: 'NumPy', category: 'Data Science', proficiency: 'Intermediate', color: '#2196f3' },
  { name: 'Matplotlib', category: 'Data Science', proficiency: 'Intermediate', color: '#2196f3' },
  { name: 'Pandas', category: 'Data Science', proficiency: 'Basic', color: '#2196f3' },
  { name: 'Machine Learning', category: 'AI/ML', proficiency: 'Basic', color: '#a078ff' },
  { name: 'Linear Programming', category: 'Optimization', proficiency: 'Beginner', color: '#ffc107' },
  { name: 'Digital Logic', category: 'Hardware Design', proficiency: 'Intermediate', color: '#00dc8c' },
];

// Create lookup maps for quick access
const skillsByName = new Map(skillsData.map(skill => [skill.name.toLowerCase(), skill]));

// Project-specific skill mappings based on analysis
export const projectSkillMappings: Record<string, string[]> = {
  'zephyr-station': ['ESP32', 'BME280', 'OLED', 'I2C', 'SPI', 'MQTT', 'C (Embedded)'],
  'jolt-locator': ['ESP32', 'GPS', 'OLED', 'I2C', 'UART', 'C (Embedded)'],
  'the-ruin-machine': ['ESP32', 'OLED', 'I2C', 'C (Embedded)'],
  'electromagnet-controller': ['Arduino', 'C (Embedded)'],
  'inductance-meter': ['ESP32', 'OLED', 'I2C', 'C (Embedded)'],
  'servo-light-switch': ['ESP32', 'C (Embedded)'],
  'rfid-attendance-system': ['Arduino', 'ESP32', 'OLED', 'SPI', 'I2C', 'C (Embedded)'],
  'shape-detection-system': ['Python', 'OpenCV', 'NumPy', 'Matplotlib'],
  'vs-code-portfolio': ['React', 'Next.js', 'TypeScript', 'Vercel', 'CSS'],
  'marcus-omega': ['React', 'Next.js', 'JavaScript', 'Vercel'],
  'blind-stick': ['Arduino', 'Ultrasonic', 'C (Embedded)'],
  'android-studio-apps': ['Android Studio', 'Java', 'Kotlin']
};

/**
 * Get skill information by name (case-insensitive)
 */
export const getSkillInfo = (skillName: string): SkillInfo | undefined => {
  return skillsByName.get(skillName.toLowerCase());
};

/**
 * Get relevant skills for a project based on its slug
 */
export const getProjectSkills = (projectSlug: string): SkillInfo[] => {
  const skillNames = projectSkillMappings[projectSlug] || [];
  return skillNames
    .map(name => getSkillInfo(name))
    .filter((skill): skill is SkillInfo => skill !== undefined)
    .slice(0, 5); // Limit to 5 skills max for clean display
};

/**
 * Get skill color by proficiency level
 */
export const getSkillColorByProficiency = (proficiency: string): string => {
  const colors = {
    'Advanced': '#4caf50',
    'Intermediate': '#ff9800', 
    'Basic': '#2196f3',
    'Beginner': '#9e9e9e'
  };
  return colors[proficiency as keyof typeof colors] || '#64748b';
};

/**
 * Normalize skill names for consistent display
 */
export const normalizeSkillName = (skillName: string): string => {
  const normalizations: Record<string, string> = {
    'c (embedded)': 'C',
    'c++': 'C++',
    'html / css / javascript': 'Web Stack',
    'react / tailwind css': 'React',
    'git / github': 'Git',
    'i2c / spi / uart': 'Protocols',
    'bme280 / gps / oled / ultrasonic / sd': 'Sensors'
  };
  
  return normalizations[skillName.toLowerCase()] || skillName;
};