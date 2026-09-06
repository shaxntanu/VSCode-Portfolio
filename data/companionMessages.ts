export type AnimationKey = 'idle' | 'happy' | 'excited' | 'curious' | 'bored' | 'skeptical' | 'annoyed';

export interface RouteMessage {
  message: string;
  animation: AnimationKey;
}

export const routeMessages: Record<string, RouteMessage> = {
  '/': {
    message: "Welcome to the workspace. Let's see what we're building here.",
    animation: 'happy'
  },
  '/about': {
    message: "Time to meet the engineer behind all this.",
    animation: 'curious'
  },
  '/projects': {
    message: "Now we're getting to the good stuff. Hardware and software experiments.",
    animation: 'excited'
  },
  '/circuits': {
    message: "Circuit designs and schematics. The blueprints behind the hardware.",
    animation: 'curious'
  },
  '/github': {
    message: "Inspecting the codebase. Where all the magic happens.",
    animation: 'curious'
  },
  '/experience': {
    message: "Professional work. Where theory meets reality.",
    animation: 'happy'
  },
  '/certificates': {
    message: "Learning credentials. Always shipping, always learning.",
    animation: 'happy'
  },
  '/coursework': {
    message: "Academic foundations. Building from the ground up.",
    animation: 'curious'
  },
  '/publications': {
    message: "Research work. The deeper technical contributions.",
    animation: 'curious'
  },
  '/skillmatrix': {
    message: "Skill breakdown across the tech stack.",
    animation: 'curious'
  },
  '/techstack': {
    message: "The tools and technologies that power everything.",
    animation: 'excited'
  },
  '/resume': {
    message: "The compressed version. Everything in one document.",
    animation: 'happy'
  },
  '/contact': {
    message: "Communication channels. Reach out if you need something built.",
    animation: 'happy'
  },
  '/settings': {
    message: "Configuration panel. Customize your experience.",
    animation: 'curious'
  },
  '/keysprint': {
    message: "Testing typing speed. Developer productivity matters.",
    animation: 'curious'
  }
};

export const clickMessages: string[] = [
  "Yep, still here.",
  "Clicking the guide? Bold move.",
  "There's more stuff in the Explorer on the left.",
  "I take my job very seriously. Mostly.",
  "Try opening another section.",
  "The projects section is where it gets interesting.",
  "You can navigate with the sidebar or tabs up top.",
  "This portfolio runs entirely client-side.",
  "The terminal at the bottom actually works.",
  "Zen mode hides everything. Including me.",
  "Built with Next.js and way too much attention to detail."
];

export const portfolioFacts: string[] = [
  "This portfolio contains 16 hardware and software projects spanning 2018-2026.",
  "The flagship project is Zephyr Station - an ESP32 environmental monitoring system.",
  "Most projects use ESP32/ESP8266 microcontrollers with various sensors.",
  "The tech stack focuses heavily on embedded systems and IoT development.",
  "Multiple projects feature real-time data visualization with OLED displays.",
  "The portfolio includes both funded college projects and community work.",
  "Several projects integrate I2C, SPI, UART, and 1-Wire communication protocols.",
  "Projects include RFID attendance systems, GPS navigation, and air quality monitoring.",
  "Hardware costs range from ₹1,103 to ₹6,080 per project with full BOM documentation.",
  "The portfolio website itself is styled as VS Code and built with React/Next.js."
];

export const inactivityMessages: Record<string, string> = {
  bored: "Still here. Take your time exploring.",
  skeptical: "No rush. I'll just be here... waiting...",
  annoyed: "I'm starting to think you forgot about me."
};
