export interface Article {
  id: string;
  title: string;
  description: string;
  cover_image: string;
  url: string;
  page_views_count: number;
  public_reactions_count: number;
  comments_count: number;
}

export type ProjectCategory = 'HARDWARE_MODULES' | 'SOFTWARE_SYSTEMS' | 'MISC_LABS' | 'COMMUNITY_PROJECT' | 'RAGASTRA_PROJECT' | 'CIRCUITS';

export type CircuitCategory = 'EMBEDDED' | 'ANALOG' | 'DIGITAL_LOGIC' | 'SENSORS' | 'POWER_ELECTRONICS' | 'COMMUNICATION' | 'PCB' | 'EDUCATIONAL';

export type CircuitDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export type CircuitStatus = 'VERIFIED' | 'IN_PROGRESS' | 'EXPERIMENTAL';

export interface Component {
  name: string;
  role: string;
  interface: string;
  voltage: string;
  quantity: number;
  notes?: string;
  price?: string; // Component price
}

export interface Project {
  title: string;
  description: string;
  logo: string | string[]; // Support single or multiple logos
  link: string;
  slug: string;
  category: ProjectCategory;
  dateRange: string;
  year: number;
  background?: string;
  reportLink?: string; // Optional link to technical report/article
  certificateLink?: string; // Optional link to certificate
  components?: Component[]; // BOM components
  architecture?: string; // Architecture description
  totalCost?: string; // Total project cost
  fundedPrototype?: boolean; // Whether this is a funded prototype
  badgeType?: 'funded' | 'college'; // Type of badge to display
}

export interface CategoryConfig {
  title: string;
  titleHighlight: string;
  color: string;
  link?: string;
}

export interface Circuit {
  title: string;
  description: string;
  platform: string; // Arduino, ESP32, etc.
  software: string; // Tinkercad, KiCad, LTspice, etc.
  technologies: string[]; // List of technologies used
  category: CircuitCategory;
  difficulty: CircuitDifficulty;
  status: CircuitStatus;
  link: string; // External link to simulation/design
  embedUrl?: string; // Optional embed URL for inline viewing
  schematicLink?: string; // Optional link to schematic PDF/image
  code?: string; // Optional Arduino/firmware code
  codeVariants?: { label: string; code: string }[]; // Multiple code implementations
  hasBuzzer?: boolean; // Whether circuit includes a buzzer component
  fundedPrototype?: boolean; // Whether this is a funded prototype
  collegeCourseProject?: boolean; // Whether this is a college course project
  slug: string;
  year: number;
  dateRange?: string;
  components?: Component[]; // Optional BOM
  totalCost?: string; // Total project cost
  schematicImages?: string[]; // Optional circuit images
  workingPrinciple?: string; // How it works
  overview?: string; // Detailed overview
}

export interface Repo {
  id: number;
  name: string;
  description: string;
  language: string;
  watchers: number;
  forks: number;
  stargazers_count: number;
  html_url: string;
  homepage: string;
}

export interface User {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

// Status Bar and Activity Badge types
export interface StatusBarItem {
  id: string;
  text: string;
  icon?: React.ComponentType<any>;
  tooltip?: string;
  link?: string;
  priority: number;
  side: 'left' | 'right';
}

export interface ActivityBadge {
  path: string;
  count: number;
  show: boolean;
}
