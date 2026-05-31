export interface NavFile {
  name: string;
  path: string;
  icon: string;
  external?: boolean;
}

export interface NavFolder {
  id: string;
  label: string;
  files: NavFile[];
}

export const rootFile: NavFile = {
  name: 'main.cpp',
  path: '/',
  icon: '/logos/cpp_icon.svg',
};

export const portfolioFiles: NavFile[] = [
  { name: 'about_datasheet.pdf', path: '/about', icon: '/logos/pdf_icon.svg' },
  { name: 'pinout_socials.json', path: '/contact', icon: '/logos/json_icon.svg' },
];

export const navFolders: NavFolder[] = [
  {
    id: 'development',
    label: 'DEVELOPMENT',
    files: [
      { name: 'firmware.ino', path: '/projects', icon: '/logos/arduino_icon.svg' },
      { name: 'github.md', path: '/github', icon: '/logos/markdown_icon.svg' },
    ],
  },
  {
    id: 'skills',
    label: 'SKILLS',
    files: [
      { name: 'sm_techstack.csv', path: '/techstack', icon: '/logos/csv_icon.svg' },
      { name: 'skillmatrix.ipynb', path: '/skillmatrix', icon: '/logos/jupyter_icon.svg' },
      { name: 'keysprint.env', path: '/keysprint', icon: '/logos/env_icon.svg' },
    ],
  },
  {
    id: 'career',
    label: 'CAREER',
    files: [
      { name: 'experience_log.md', path: '/experience', icon: '/logos/markdown_icon.svg' },
      { name: 'upgrades.yaml', path: '/certificates', icon: '/logos/yaml_icon.svg' },
    ],
  },
  {
    id: 'research',
    label: 'RESEARCH',
    files: [
      { name: 'whitepapers.pdf', path: '/research', icon: '/logos/pdf_icon.svg' },
    ],
  },
  {
    id: 'resume',
    label: 'RESUME',
    files: [
      { name: 'sysdrive_cv.iso', path: '/resume', icon: '/logos/iso_icon.svg' },
    ],
  },
  {
    id: 'articles',
    label: 'ARTICLES',
    files: [
      { name: 'blog_posts.md', path: '/articles', icon: '/logos/markdown_icon.svg' },
    ],
  },
];