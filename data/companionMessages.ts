export interface RouteMessage {
  message: string;
  animation: string;
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
    message: "Long project descriptions scroll inside their own text area. Scroll over the description to keep reading; the scrollbar stays hidden.",
    animation: 'excited'
  },
  '/minibuilds': {
    message: "Small experiments and quick builds. The learning ground for bigger projects.",
    animation: 'curious'
  },
  '/creativelab': {
    message: "A little different from the usual builds. This is where the creative experiments live.",
    animation: 'curious'
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
    message: "Long coursework descriptions scroll inside their own text area. Scroll over the description to read the rest.",
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
  '/languages': {
    message: "Let's see what languages are actually showing up across the codebase.",
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
  },
  '/leetcode': {
    message: "LeetCode stats. Problem-solving skills across Easy, Medium, and Hard challenges. Real data from the LeetCode platform.",
    animation: 'curious'
  },
  '/journal': {
    message: "Personal writing and reflections. The creative side of engineering.",
    animation: 'curious'
  },
  '/journal/library': {
    message: "A virtual library of books. 3D book spines with real cover art.",
    animation: 'excited'
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
  "Built with Next.js and way too much attention to detail.",
  "Lite mode disables my animations. Toggle it off in Settings to see me move!",
  "My name is Byte. Watch me track your cursor.",
  "If a project description is cut off, scroll inside its text to read the rest. The scrollbar is hidden!",
  "Long coursework descriptions scroll inside their own card area too.",
  "Use the links at the bottom of a card to open its project page or GitHub repository.",
  "Try the filters to narrow down the project list.",
  "Some cards have a case study with more details than the card preview.",
  "Hardware project cards can include a bill of materials.",
  "You can click me again for another tip.",
  "The hidden scrollbar keeps the card tidy, but the description is still scrollable."
];

export const portfolioFacts: string[] = [
  "Long project descriptions scroll inside the card, even though the scrollbar is hidden.",
  "Some project cards link to both a project page and the source repository.",
  "Project cards use category colors to distinguish different kinds of work.",
  "Zephyr Station is an ESP32 environmental monitoring project.",
  "Marcus Omega offers 23 philosophical conversation modes.",
  "Marcus Omega keeps conversations in the browser session and supports text export.",
  "Marcus Omega uses a 10-turn context window to keep a conversation coherent.",
  "Skill tags on project cards show technologies used in each project.",
  "Some hardware project cards include a bill of materials.",
  "The portfolio is built with Next.js and styled like a VS Code workspace.",
  "The project list includes hardware builds as well as software projects.",
  "Open a project card's GitHub link to inspect its source code."
];

export const inactivityMessages: Record<string, string> = {
  bored: "Go on, keep exploring."
};
