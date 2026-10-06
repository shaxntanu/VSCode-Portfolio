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
  id: string;
  title: string;
  author: string;
  genres?: string[];
  cover: string;
  year: number;
  blurb: string;
  rating: number;
  finished: string;
  recommender?: string;
  publisher: string;
  binding: "hardcover" | "paperback" | "mass";
  finish: "cloth" | "gloss" | "matte";
  spine: string;
  band?: string;
  ink: string;
  face: "serif" | "sans" | "mono";
  caps?: boolean;
  width: number;
  height: number;
  lean: number;
  depth: number;
  wear: number;
  spineImage?: string;
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
