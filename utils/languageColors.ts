export const languageColors: Record<string, string> = {
  // Existing colors from the portfolio
  'C++': '#f34b7d',
  'C': '#555555',
  'Python': '#3776ab',
  'JavaScript': '#f7df1e',
  'TypeScript': '#2b7489',
  'Java': '#f89820',
  'Kotlin': '#7f52ff',
  'Verilog': '#00dc8c',
  'VHDL': '#adb2cb',
  'HTML': '#e34c26',
  'CSS': '#563d7c',
  'SCSS': '#c6538c',
  'Shell': '#89e051',
  'Makefile': '#427819',
  'CMake': '#da3434',
  'Arduino': '#00979d',
  'Jupyter Notebook': '#f37626',
  'MATLAB': '#e16737',
  'Objective-C': '#438eff',
  'Swift': '#ffac45',
  'Go': '#00add8',
  'Rust': '#dea584',
  'Ruby': '#701516',
  'PHP': '#4f5d95',
  'Dart': '#00b4ab',
  'Lua': '#000080',
  'Assembly': '#6e4c13',
  'Batchfile': '#c1f12e',
  'PowerShell': '#012456',
  'Default': '#64748b',
};

export function getLanguageColor(language: string): string {
  return languageColors[language] || languageColors['Default'];
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
