import { CourseworkItem, CourseworkYear, CourseworkType } from '@/types';

export type { CourseworkItem, CourseworkYear, CourseworkType };

export const courseworkData: CourseworkItem[] = [
  // Year 1 Coursework
  {
    id: 'CW-001',
    title: 'Android Studio Apps Collection',
    description: 'Year 1 college event project containing two Android Studio apps: EncoderDecoderApp and a Twitter-style social app.',
    year: 1,
    type: 'College Event Project',
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
    description: 'Six Python image-analysis exercises using OpenCV: contour-based geometric shape classification plus image analyses for cookies, cones, trees, and smartwatch displays using thresholding, color segmentation, and circle detection.',
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
    description: 'Two interactive Python simulations: a slider-controlled Malus’s Law polarization display and an animated magnetic-levitation model with adjustable magnet strength and mass.',
    year: 1,
    type: 'Academic Simulation',
    area: 'Scientific Computing',
    technologies: ['Python', 'Matplotlib', 'NumPy', 'Physics Simulation'],
    repositoryUrl: 'https://github.com/shaxntanu/Malus-and-Maglev-Simulation-in-Python',
    slug: 'malus-maglev-simulation',
    logo: '/logos/python_icon.svg'
  },
  {
    id: 'CW-004',
    title: 'C Mini Projects',
    description: 'Standalone C console exercises including calculators, a number-guessing game, password-attempt logic, prime and parity checks, BMI and age tools, quadratic roots, and ASCII conversion.',
    year: 1,
    type: 'Course Repository',
    area: 'Programming Fundamentals',
    technologies: ['C', 'Programming', 'Algorithms'],
    repositoryUrl: 'https://github.com/shaxntanu/C-Mini-Projects',
    slug: 'c-mini-projects',
    logo: '/logos/c_icon.svg'
  },

  // Year 2 Coursework
  {
    id: 'CW-005',
    title: 'Optimization Techniques Lab',
    description: 'MATLAB lab scripts exploring linear programming, including a basic-feasible-solution search and plots of constraints and corner points to compare objective values.',
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
    id: 'CW-006',
    title: 'AI for Engineers Lab',
    description: 'Python labs progressing from fundamentals and house-price linear regression to missing-data preprocessing, list operations, and McCulloch–Pitts neuron models for logic gates.',
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
    id: 'CW-007',
    title: 'Digital System Design Lab',
    description: 'UEC612 Verilog collection with a Boolean-logic module, behavioral and structural 4:1 multiplexers, a 4-bit ripple-carry adder, ALU, and SIPO shift registers, plus testbenches and FPGA files.',
    year: 2,
    type: 'Course Repository',
    subject: 'UEC612 - Digital System Design',
    area: 'Digital Logic Design',
    technologies: ['Verilog', 'Digital Logic', 'HDL', 'Hardware Design'],
    repositoryUrl: 'https://github.com/shaxntanu/UEC612-Digital-System-Design',
    circuitReference: 'digital-system-design',
    slug: 'digital-system-design',
    logo: '/logos/verilog_icon.svg'
  },
  {
    id: 'CW-007A',
    title: 'Energy Consumption Pattern Analysis',
    description: 'Python research pipeline for shape-first segmentation of synthetic household load profiles: engineers 51 scale-invariant behavior features, applies PCA and stability-informed K-means, and includes validation, explainability, and interactive dashboards.',
    year: 2,
    type: 'College Project',
    subject: 'UCS321 - AI For Engineers Mini Project',
    area: 'Machine Learning',
    technologies: ['Python', 'Scikit-Learn', 'PCA', 'K-Means', 'SHAP', 'Pandas', 'React', 'Vercel'],
    repositoryUrl: 'https://github.com/shaxntanu/Energy-Consumption-Pattern-Analysis-using-PCA-and-K-Means',
    streamlitLink: 'https://energy-pattern-analysis.streamlit.app/',
    notebookLink: 'https://www.kaggle.com/code/shaxntanu/energy-consumption-pattern-analysis-pca-k-means',
    datasetLink: 'https://www.kaggle.com/datasets/shaxntanu/energy-consumption-pattern-analysis-dataset',
    projectReference: 'energy-consumption-analysis',
    slug: 'energy-consumption-analysis-coursework',
    logo: '/logos/claude_icon.svg'
  },
  {
    id: 'CW-010',
    title: 'Mangonel Engineering Design Project',
    description: 'Engineering Design Project resource repository containing the Lab 0 Mangonel spreadsheet workbook.',
    year: 2,
    type: 'College Project',
    area: 'Engineering Design',
    technologies: ['Engineering Design', 'Mechanical Systems', 'Spreadsheet Modeling'],
    repositoryUrl: 'https://github.com/shaxntanu/Mangonel-EDP',
    slug: 'mangonel-edp',
    logo: '/logos/circuit_icon.svg'
  },
  {
    id: 'CW-008',
    title: 'Operating System Shell Commands',
    description: 'Lab-wise Linux shell notes and runnable shell/C examples covering navigation, file operations and redirection, process system calls, and pthread-based concurrency.',
    year: 2,
    type: 'Course Repository',
    subject: 'UCM002 - Operating Systems',
    area: 'System Administration',
    technologies: ['Bash', 'Shell Scripting', 'Linux', 'Unix'],
    repositoryUrl: 'https://github.com/shaxntanu/Operating-System-Shell-Commands-UCM002',
    slug: 'os-shell-commands-ucm002',
    logo: '/logos/linux_icon.svg',
    csMinorSemester: 1
  },
  {
    id: 'CW-009',
    title: 'Data Structures Implementation',
    description: 'Data Structures coursework repository containing an array-backed C++ queue exercise and a PDF assignment focused on arrays.',
    year: 2,
    type: 'Course Repository',
    subject: 'UCM004 - Data Structures',
    area: 'Data Structures & Algorithms',
    technologies: ['C', 'C++', 'Data Structures', 'Algorithms'],
    repositoryUrl: 'https://github.com/shaxntanu/Data-Structures-UCM004',
    slug: 'data-structures-ucm004',
    logo: '/logos/cpp_icon.svg',
    csMinorSemester: 1
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
