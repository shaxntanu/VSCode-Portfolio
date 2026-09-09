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
      { name: 'minibuilds.cfg', path: '/projects#minibuilds', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPgoJPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIgLz4KCTxnIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS13aWR0aD0iMiI+CgkJPHBhdGggZD0iTTMgNWg0bTE0IDBIMTFtLTggN2gxMm02IDBoLTJNMyAxOWgybTE2IDBIOSIgLz4KCQk8Y2lyY2xlIGN4PSI5IiBjeT0iNSIgcj0iMiIgLz4KCQk8Y2lyY2xlIGN4PSIxNyIgY3k9IjEyIiByPSIyIiAvPgoJCTxjaXJjbGUgY3g9IjciIGN5PSIxOSIgcj0iMiIgLz4KCTwvZz4KPC9zdmc+Cg==' },
      { name: 'circuits.sch', path: '/circuits', icon: '/logos/circuit_icon.svg' },
      { name: 'coursework.log', path: '/coursework', icon: '/logos/log_icon.svg' },
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
    id: 'publications',
    label: 'PUBLICATIONS',
    files: [
      { name: 'whitepapers.pdf', path: '/publications', icon: '/logos/pdf_icon.svg' },
    ],
  },
  {
    id: 'resume',
    label: 'RESUME',
    files: [
      { name: 'sysdrive_cv.iso', path: '/resume', icon: '/logos/iso_icon.svg' },
    ],
  },
];