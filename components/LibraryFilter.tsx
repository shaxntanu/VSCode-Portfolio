import { useState, useEffect, useRef, useCallback } from 'react';
import { Book } from '@/data/journal';

interface LibraryFilterProps {
  books: Book[];
  onChange: (filtered: Book[] | null) => void;
}

const LibraryFilter = ({ books, onChange }: LibraryFilterProps) => {
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<string[] | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const reqIdRef = useRef(0);
  
  // Extract unique genres from books
  const allGenres = Array.from(
    new Set(books.flatMap(book => book.genres || []))
  ).sort();
  
  // Get genre counts
  const genreCounts = allGenres.reduce((acc, genre) => {
    acc[genre] = books.filter(book => book.genres?.includes(genre)).length;
    return acc;
  }, {} as Record<string, number>);
  
  // Fallback client-side filtering
  const fallbackFilter = useCallback((searchQuery: string, genre: string | null) => {
    const lowerQuery = searchQuery.toLowerCase();
    
    const filtered = books.filter(book => {
      const matchesQuery =
        book.title.toLowerCase().includes(lowerQuery) ||
        book.author.toLowerCase().includes(lowerQuery) ||
        book.genres?.some(g => g.toLowerCase().includes(lowerQuery)) ||
        book.blurb.toLowerCase().includes(lowerQuery);
      
      const matchesGenre = !genre || book.genres?.includes(genre);
      
      return matchesQuery && matchesGenre;
    });
    
    onChange(filtered);
  }, [books, onChange]);
  
  // Apply filters (AI results + genre)
  const applyFilters = useCallback((aiIds: string[] | null, genre: string | null) => {
    if (!aiIds) {
      // No AI results, use all books with genre filter
      if (genre) {
        const filtered = books.filter(book => book.genres?.includes(genre));
        onChange(filtered);
      } else {
        onChange(null);
      }
      return;
    }
    
    // Apply AI results with genre filter
    const filtered = books.filter(book => {
      const inAiResults = aiIds.includes(book.id);
      const matchesGenre = !genre || book.genres?.includes(genre);
      return inAiResults && matchesGenre;
    });
    
    onChange(filtered);
  }, [books, onChange]);
  
  // Debounced AI search
  useEffect(() => {
    if (query.length < 2) {
      setSearchResults(null);
      setSearchError(null);
      onChange(null);
      return;
    }
    
    setIsSearching(true);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(async () => {
      const currentReqId = ++reqIdRef.current;
      
      try {
        const response = await fetch('/api/library-search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Search failed');
        }
        
        const data = await response.json();
        
        // Race guard - ignore if newer request started
        if (currentReqId !== reqIdRef.current) return;
        
        setSearchResults(data.ids);
        setSearchError(null);
        setIsSearching(false);
        
        // Apply AI results with genre filter
        applyFilters(data.ids, selectedGenre);
      } catch (error) {
        if (currentReqId !== reqIdRef.current) return;
        
        console.error('Search error:', error);
        setSearchError(error instanceof Error ? error.message : 'Search failed');
        setIsSearching(false);
        
        // Fall back to client-side filtering
        fallbackFilter(query, selectedGenre);
      }
    }, 600);
    
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, selectedGenre, books, fallbackFilter, applyFilters, onChange]);
  
  // Handle genre selection
  const handleGenreClick = (genre: string) => {
    const newGenre = selectedGenre === genre ? null : genre;
    setSelectedGenre(newGenre);
    applyFilters(searchResults, newGenre);
  };
  
  // Handle query change
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  
  return (
    <div className="library-filter">
      {/* Search input */}
      <div className="search-container" style={{ marginBottom: '16px' }}>
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          placeholder="What are you looking for?"
          style={{
            width: '100%',
            padding: '12px 16px',
            fontSize: '16px',
            fontFamily: "'Karla', sans-serif",
            backgroundColor: 'rgba(250, 247, 240, 0.5)',
            border: '1px solid rgba(36, 31, 25, 0.2)',
            borderRadius: '8px',
            color: '#241f19',
            outline: 'none',
          }}
        />
        {isSearching && (
          <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.6, fontFamily: "'Space Mono', monospace" }}>
            Reading the shelves…
          </div>
        )}
        {searchResults && !isSearching && (
          <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.6, fontFamily: "'Space Mono', monospace" }}>
            {searchResults.length} found
          </div>
        )}
        {searchError && (
          <div style={{ fontSize: '12px', marginTop: '4px', color: '#e71d36', fontFamily: "'Space Mono', monospace" }}>
            {searchError}
          </div>
        )}
      </div>
      
      {/* Genre pills */}
      {allGenres.length > 0 && (
        <div className="genre-pills" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
          {allGenres.map(genre => (
            <button
              key={genre}
              onClick={() => handleGenreClick(genre)}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontFamily: "'Space Mono', monospace",
                textTransform: 'uppercase',
                backgroundColor: selectedGenre === genre ? '#241f19' : 'rgba(250, 247, 240, 0.5)',
                color: selectedGenre === genre ? '#faf7f0' : '#241f19',
                border: selectedGenre === genre ? 'none' : '1px solid rgba(36, 31, 25, 0.2)',
                borderRadius: '20px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              {genre} ({genreCounts[genre]})
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryFilter;
