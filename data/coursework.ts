import { CourseworkItem, CourseworkYear, CourseworkType } from '@/types';

export type { CourseworkItem, CourseworkYear, CourseworkType };

export const courseworkData: CourseworkItem[] = [
  // Year 1 Coursework
  {
    id: 'CW-001',
    title: 'Android Studio Apps Collection',
    description: 'Collection of Android applications built with Android Studio including EncoderDecoderApp and Twitter App. Demonstrates mobile app development fundamentals and UI/UX design principles.',
    year: 1,
    type: 'College Project',
    area: 'Software Development',
    technologies: ['Android Studio', 'Java', 'Kotlin', 'XML'],
    repositoryUrl: 'https://github.com/shaxntanu/Android-Studio-Apps_Shantanu',
    projectReference: 'android-studio-apps', // Will be created in Projects
    slug: 'android-studio-apps-coursework',
    logo: '/logos/android_icon.svg'
  },
  {
    id: 'CW-002',
    title: 'Geometrical Shape Detection and Recognition',
    description: 'Six-module image analysis project using OpenCV for shape detection including geometric shapes, cookies, traffic cones, ice cream cones, trees, and watch displays. Features contour detection, color segmentation, and morphological operations.',
    year: 1,
    type: 'College Project',
    area: 'Image Processing',
    technologies: ['Python', 'OpenCV', 'NumPy', 'Matplotlib', 'Jupyter'],
    repositoryUrl: 'https://github.com/shaxntanu/Geometrical-Shape-Detection-and-Recognition-using-Python-in-Image-Processing-ELC-TIET-2029-ECE',
    projectReference: 'shape-detection-system', // Exists in Projects
    slug: 'shape-detection-coursework',
    logo: ['/logos/python_icon.svg', '/logos/jupyter_icon.svg']
  },
  {
    id: 'CW-003',
    title: 'Malus and Maglev Simulation',
    description: 'Interactive physics simulations demonstrating Malus\'s Law for light polarization and magnetic levitation dynamics. Features mathematical modeling of electromagnetic wave polarization and force equilibrium in magnetic systems.',
    year: 1,
    type: 'Academic Simulation',
    area: 'Scientific Computing',
    technologies: ['Python', 'Matplotlib', 'NumPy', 'Physics Simulation'],
    repositoryUrl: 'https://github.com/shaxntanu/Malus-and-Maglev-Simulation-in-Python',
    slug: 'malus-maglev-simulation',
    logo: '/logos/python_icon.svg'
  },

  // Year 2 Coursework
  {
    id: 'CW-004',
    title: 'Optimization Techniques Lab',
    description: 'MATLAB implementations for optimization algorithms including linear programming and plotting techniques. Covers mathematical optimization methods used in engineering problem-solving.',
    year: 2,
    type: 'Course Repository',
    subject: 'UMA035 - Optimization Techniques',
    area: 'Mathematical Optimization',
    technologies: ['MATLAB', 'Linear Programming', 'Optimization'],
    repositoryUrl: 'https://github.com/shaxntanu/UMA035-Optimization-Techniques-MATLAB',
    slug: 'optimization-techniques',
    logo: '/logos/matlab_icon.svg'
  },
  {
    id: 'CW-005',
    title: 'AI for Engineers Lab',
    description: 'Python programming labs covering AI and machine learning fundamentals. Includes Python basics, data preprocessing, missing value handling, linear regression implementation, and data science techniques.',
    year: 2,
    type: 'Course Repository',
    subject: 'UCS321 - AI For Engineers',
    area: 'Artificial Intelligence',
    technologies: ['Python', 'Pandas', 'Machine Learning', 'Data Science'],
    repositoryUrl: 'https://github.com/shaxntanu/UCS321-AI-For-Engineers',
    slug: 'ai-for-engineers',
    logo: '/logos/python_icon.svg'
  },
  {
    id: 'CW-006',
    title: 'Digital System Design Lab',
    description: 'Hardware design experiments covering digital logic fundamentals including Half Adder, 4:1 MUX, Ripple Carry Adder (RCA), ALU, and Shift Register (SIPO) implementations.',
    year: 2,
    type: 'Course Repository',
    subject: 'UEC612 - Digital System Design',
    area: 'Digital Logic Design',
    technologies: ['Verilog', 'Digital Logic', 'HDL', 'Hardware Design'],
    repositoryUrl: 'https://github.com/shaxntanu/UEC612-Digital-System-Design',
    slug: 'digital-system-design',
    logo: '/logos/verilog_icon.svg'
  }
];

// Helper functions for filtering
export const getCourseworkByYear = (year: CourseworkYear | 'ALL'): CourseworkItem[] => {
  if (year === 'ALL') return courseworkData;
  return courseworkData.filter(item => item.year === year);
};

export const searchCoursework = (query: string): CourseworkItem[] => {
  const searchTerm = query.toLowerCase();
  return courseworkData.filter(item =>
    item.title.toLowerCase().includes(searchTerm) ||
    item.description.toLowerCase().includes(searchTerm) ||
    item.area.toLowerCase().includes(searchTerm) ||
    item.subject?.toLowerCase().includes(searchTerm) ||
    item.type.toLowerCase().includes(searchTerm) ||
    item.technologies.some(tech => tech.toLowerCase().includes(searchTerm))
  );
};