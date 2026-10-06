// Journal data structure for Medium articles, Library project, and reading list

export interface MediumArticle {
  id: string;
  title: string;
  type: string;
  date: string;
  status: string;
  url: string;
}

export interface LibraryProject {
  title: string;
  description: string;
  url: string;
  demoUrl?: string;
}

export interface Book {
  title: string;
  author?: string;
  category?: 'CHILDHOOD' | 'GENERAL';
  series?: string;
}

export const mediumArticles: MediumArticle[] = [
  {
    id: 'BLG-001',
    title: 'How a Robotics Class Shaped My Engineering Journey',
    type: 'Personal Article',
    date: '2026-05-31',
    status: 'PUBLISHED',
    url: 'https://medium.com/@shaxntanu/how-a-robotics-class-shaped-my-engineering-journey-19acd8f99bb4',
  },
  {
    id: 'BLG-002',
    title: 'Qwen CLI has a sense of humour',
    type: 'Personal Article',
    date: '2026-09-29',
    status: 'PUBLISHED',
    url: 'https://shaxntanu.medium.com/qwen-cli-has-a-sense-of-humour-159506bd0840',
  },
];

export const libraryProject: LibraryProject = {
  title: 'Virtual Library Guide',
  description: 'A guide you can give your vibe coding platform of choice (lovable, replit, claude code, etc.) to walk you through how to build a virtual library.',
  url: 'https://github.com/carollia99/virtual-library-guide',
  demoUrl: 'https://carollia-library.lovable.app/',
};

export const readingList: Book[] = [
  // Childhood / Series
  {
    title: 'Harry Potter — Complete Series',
    category: 'CHILDHOOD',
  },
  {
    title: 'Geronimo Stilton',
    category: 'CHILDHOOD',
  },
  {
    title: 'Kingdom of Fantasy',
    series: 'Geronimo Stilton Series',
    category: 'CHILDHOOD',
  },
  // Recent / General Reading
  {
    title: 'The Silent Patient',
    category: 'GENERAL',
  },
  {
    title: 'Atomic Habits',
    category: 'GENERAL',
  },
  {
    title: 'The Subtle Art of Not Giving a F*ck',
    category: 'GENERAL',
  },
  {
    title: 'Punk 57',
    category: 'GENERAL',
  },
  {
    title: 'Meditations',
    author: 'Marcus Aurelius',
    category: 'GENERAL',
  },
];
