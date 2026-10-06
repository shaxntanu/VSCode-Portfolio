import { Book } from '@/data/journal';

export interface OpenLibrarySearchResult {
  key: string;
  title: string;
  author_name: string[];
  first_publish_year: number;
  cover_i: number;
  number_of_pages_median: number;
  publisher: string[];
}

export interface OpenLibraryResponse {
  docs: OpenLibrarySearchResult[];
}

// Search Open Library for books
export async function searchBooks(
  query: string,
  signal?: AbortSignal
): Promise<OpenLibrarySearchResult[]> {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(
    query
  )}&limit=12&fields=key,title,author_name,first_publish_year,cover_i,number_of_pages_median,publisher`;
  
  const response = await fetch(url, { signal });
  const data: OpenLibraryResponse = await response.json();
  
  // Filter for results with title and cover
  return data.docs.filter(doc => doc.title && doc.cover_i);
}

// Read cover palette - sample colors from cover image
export async function readCoverPalette(src: string): Promise<{
  spine: string;
  band: string;
  ink: string;
}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        const w = 80;
        const h = Math.round((img.height / img.width) * w);
        canvas.width = w;
        canvas.height = h;
        
        ctx.drawImage(img, 0, 0, w, h);
        
        // Sample left edge for spine color
        const edgeW = Math.round(w * 0.06);
        let r = 0, g = 0, b = 0, count = 0;
        
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < edgeW; x++) {
            const pixel = ctx.getImageData(x, y, 1, 1).data;
            r += pixel[0];
            g += pixel[1];
            b += pixel[2];
            count++;
          }
        }
        
        const spineR = Math.round(r / count);
        const spineG = Math.round(g / count);
        const spineB = Math.round(b / count);
        const spine = `rgb(${spineR}, ${spineG}, ${spineB})`;
        
        // Find most saturated mid-luminance pixel for band
        let maxSat = 0;
        let band = '#584f46';
        
        for (let y = 0; y < h; y += 2) {
          for (let x = edgeW; x < w; x += 2) {
            const pixel = ctx.getImageData(x, y, 1, 1).data;
            const [pr, pg, pb] = pixel;
            
            // Convert to HSL for saturation
            const max = Math.max(pr, pg, pb) / 255;
            const min = Math.min(pr, pg, pb) / 255;
            const lum = (max + min) / 2;
            const sat = lum === 0 ? 0 : (max - min) / (1 - Math.abs(2 * lum - 1));
            
            // Mid-luminance (0.3-0.7) and high saturation
            if (lum > 0.3 && lum < 0.7 && sat > maxSat) {
              maxSat = sat;
              band = `rgb(${pr}, ${pg}, ${pb})`;
            }
          }
        }
        
        // Determine ink color based on spine luminance
        const spineLum = (spineR * 0.299 + spineG * 0.587 + spineB * 0.114) / 255;
        const ink = spineLum > 0.55 ? '#241f19' : '#faf7f0';
        
        resolve({ spine, band, ink });
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load cover image'));
    img.src = src;
  });
}

// Simple hash function for deterministic variation
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Build a Book object from Open Library result
export async function buildBook(result: OpenLibrarySearchResult): Promise<Book> {
  const pages = result.number_of_pages_median || 300;
  const key = result.key;
  
  // Derive binding from page count
  const binding: 'hardcover' | 'paperback' | 'mass' = 
    pages > 420 ? 'hardcover' : pages < 260 ? 'mass' : 'paperback';
  
  // Derive finish from binding
  const finish: 'cloth' | 'gloss' | 'matte' = 
    binding === 'hardcover' ? 'cloth' : (simpleHash(key) % 2 === 0 ? 'gloss' : 'matte');
  
  // Derive height from binding
  const height = binding === 'hardcover' 
    ? 236 + (simpleHash(key) % 18) 
    : binding === 'mass' 
      ? 196 + (simpleHash(key) % 14) 
      : 214 + (simpleHash(key) % 16);
  
  // Derive width from page count with jitter
  const baseWidth = pages * 0.055;
  const jitter = (simpleHash(key) % 5) - 2;
  const width = Math.max(16, Math.min(58, Math.round(baseWidth + jitter)));
  
  // Deterministic variation for physical properties
  const lean = -5 + (simpleHash(key) % 6);
  const depth = -7 + (simpleHash(key) % 15);
  const wear = (simpleHash(key) % 35) / 100;
  
  const faceOptions: ('serif' | 'sans' | 'mono')[] = ['serif', 'sans', 'mono'];
  const face = faceOptions[simpleHash(key) % 3];
  const caps = simpleHash(key) % 2 === 0;
  
  // Get cover URL
  const cover = `https://covers.openlibrary.org/b/id/${result.cover_i}-L.jpg`;
  
  // Sample palette from cover
  let spine = '#584f46';
  let band: string | undefined;
  let ink = '#faf7f0';
  
  try {
    const palette = await readCoverPalette(cover);
    spine = palette.spine;
    band = palette.band;
    ink = palette.ink;
  } catch {
    // Fallback to HSL palette
    const hue = simpleHash(key) % 360;
    spine = `hsl(${hue}, 40%, 35%)`;
    band = `hsl(${hue}, 60%, 50%)`;
    ink = '#faf7f0';
  }
  
  return {
    id: key.replace('/works/', ''),
    title: result.title,
    author: result.author_name?.join(', ') || 'Unknown',
    genres: [],
    cover,
    year: result.first_publish_year || new Date().getFullYear(),
    blurb: '',
    rating: 0,
    finished: '',
    publisher: result.publisher?.[0] || '',
    binding,
    finish,
    spine,
    band,
    ink,
    face,
    caps,
    width,
    height,
    lean,
    depth,
    wear,
  };
}
