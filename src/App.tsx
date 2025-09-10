import { useState, useEffect, useCallback } from 'react';
import { searchPubMed, getDefaultPapers } from './services/pubmed';
import { searchDemoPapers, getDemoDefaultPapers } from './services/demoData';
import { findSimilarPapers } from './services/similarity';

type SimilarityScore = {
  pmid: string;
  score: number;
};
type PubMedArticle = {
  pmid: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  abstract?: string;
  doi?: string;
};

type Paper = {
  pmid: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  abstract?: string;
  doi?: string;
  ratings: number[];
  averageRating: number;
};

type CommentsMap = {
  [paperId: string]: string[];
};

type NewCommentMap = {
  [paperId: string]: string;
};

type StarRatingProps = {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: number;
};

function StarRating({ rating, onRatingChange, readOnly = false, size = 20 }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (starRating: number) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleMouseEnter = (starRating: number) => {
    if (!readOnly) {
      setHoverRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div style={{ display: 'flex', gap: '3px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          style={{
            fontSize: `${size}px`,
            color: star <= displayRating 
              ? '#fbbf24' 
              : '#d1d5db',
            cursor: readOnly ? 'default' : 'pointer',
            userSelect: 'none',
            transition: 'all 0.3s ease',
            filter: star <= displayRating 
              ? 'drop-shadow(0 2px 4px rgba(251, 191, 36, 0.3))' 
              : 'none',
            transform: star <= displayRating ? 'scale(1.1)' : 'scale(1)'
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

type RelatedPapersProps = {
  currentPaper: Paper;
  allPapers: Paper[];
  onPaperSelect?: (paper: Paper) => void;
};

function RelatedPapers({ currentPaper, allPapers, onPaperSelect }: RelatedPapersProps) {
  const [similarPapers, setSimilarPapers] = useState<SimilarityScore[]>([]);
  const [isExpanded, setIsExpanded] = useState(true); // Expanded by default for debugging

  useEffect(() => {
    console.log('🔍 RelatedPapers: Calculating similarity for paper:', currentPaper.title);
    console.log('📊 RelatedPapers: Current paper has abstract:', !!currentPaper.abstract);
    console.log('📚 RelatedPapers: Total papers to compare against:', allPapers.length);
    console.log('📝 RelatedPapers: Papers with abstracts:', allPapers.filter(p => p.abstract).length);
    
    const similarities = findSimilarPapers(currentPaper, allPapers, 3);
    console.log('🎯 RelatedPapers: Found similar papers:', similarities.length);
    console.log('📈 RelatedPapers: Similarity scores:', similarities.map(s => ({ title: allPapers.find(p => p.pmid === s.pmid)?.title, score: s.score })));
    
    setSimilarPapers(similarities);
  }, [currentPaper, allPapers]);

  // Always show the section for debugging
  // if (similarPapers.length === 0) {
  //   return null;
  // }

  const handlePaperClick = (pmid: string) => {
    const paper = allPapers.find(p => p.pmid === pmid);
    if (paper && onPaperSelect) {
      onPaperSelect(paper);
    }
  };

  return (
    <div style={{
      marginTop: '1.5rem',
      padding: '1.5rem',
      background: 'linear-gradient(135deg, #f0f8ff 0%, #e8f4f8 100%)',
      borderRadius: '16px',
      border: '1px solid #d1e7dd',
      boxShadow: '0 4px 12px rgba(74, 144, 226, 0.08)'
    }}>
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          cursor: 'pointer',
          marginBottom: isExpanded ? '1rem' : '0',
          padding: '0.5rem',
          borderRadius: '8px',
          transition: 'background-color 0.3s ease'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(74, 144, 226, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <span style={{ 
          fontSize: '1rem', 
          fontWeight: '600', 
          color: '#4a90e2',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          🔗 Related Papers ({similarPapers.length})
          {similarPapers.length === 0 && <span style={{ color: '#e53e3e', fontSize: '0.85rem', fontWeight: '400' }}> - No similar papers found</span>}
        </span>
        <span style={{ 
          fontSize: '0.9rem', 
          color: '#8b9dc3',
          transition: 'transform 0.3s ease',
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
        }}>
          ▼
        </span>
      </div>

      {isExpanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {similarPapers.length === 0 ? (
            <div style={{ 
              padding: '1.25rem', 
              background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)', 
              borderRadius: '12px', 
              border: '1px solid #f6e05e',
              fontSize: '0.9rem',
              color: '#744210',
              fontWeight: '500'
            }}>
              No similar papers found. This could be because:
              <ul style={{ margin: '0.75rem 0 0 1.5rem', padding: 0, lineHeight: '1.6' }}>
                <li>Similarity scores are below the threshold (0.01)</li>
                <li>Papers don't have sufficient overlapping keywords</li>
                <li>Abstracts are missing or too short</li>
              </ul>
            </div>
          ) : (
            similarPapers.map((similarity) => {
            const paper = allPapers.find(p => p.pmid === similarity.pmid);
            if (!paper) return null;

            return (
              <div
                key={similarity.pmid}
                style={{
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #ffffff 0%, #faf8f3 100%)',
                  borderRadius: '12px',
                  border: '1px solid #e8e2d5',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(44, 62, 80, 0.05)'
                }}
                onClick={() => handlePaperClick(similarity.pmid)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(44, 62, 80, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'linear-gradient(135deg, #ffffff 0%, #faf8f3 100%)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(44, 62, 80, 0.05)';
                }}
              >
                <div style={{ 
                  fontSize: '0.95rem', 
                  fontWeight: '600', 
                  color: '#2c3e50', 
                  marginBottom: '0.5rem',
                  lineHeight: '1.4'
                }}>
                  {paper.title}
                </div>
                <div style={{ 
                  fontSize: '0.85rem', 
                  color: '#5a6c7d', 
                  marginBottom: '0.5rem',
                  fontWeight: '500'
                }}>
                  {paper.authors.slice(0, 3).join(', ')}
                  {paper.authors.length > 3 ? ' et al.' : ''} - {paper.journal} ({paper.year})
                </div>
                <div style={{ 
                  fontSize: '0.8rem', 
                  color: '#38a169',
                  fontWeight: '600',
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  background: 'linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%)',
                  borderRadius: '20px',
                  border: '1px solid #68d391'
                }}>
                  Similarity: {(similarity.score * 100).toFixed(1)}%
                </div>
              </div>
            );
          })
          )}
        </div>
      )}
    </div>
  );
}

type DataSourceToggleProps = {
  useLiveData: boolean;
  onToggle: (useLive: boolean) => void;
  disabled?: boolean;
};

function DataSourceToggle({ useLiveData, onToggle, disabled = false }: DataSourceToggleProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      padding: '1.5rem',
      background: 'linear-gradient(135deg, #ffffff 0%, #faf8f3 100%)',
      borderRadius: '16px',
      border: '1px solid #e8e2d5',
      marginBottom: '2rem',
      boxShadow: '0 4px 20px rgba(44, 62, 80, 0.08)',
      backdropFilter: 'blur(10px)'
    }}>
      <span style={{ 
        fontSize: '1rem', 
        fontWeight: '600', 
        color: '#2c3e50',
        letterSpacing: '0.01em'
      }}>
        Data Source:
      </span>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ 
          fontSize: '0.95rem', 
          color: useLiveData ? '#8b9dc3' : '#4a90e2',
          fontWeight: useLiveData ? '400' : '600',
          transition: 'all 0.3s ease'
        }}>
          📚 Demo Data
        </span>
        
        <div
          style={{
            position: 'relative',
            width: '52px',
            height: '28px',
            background: useLiveData 
              ? 'linear-gradient(135deg, #4a90e2 0%, #7b68ee 100%)' 
              : 'linear-gradient(135deg, #d1d9e0 0%, #b8c5d1 100%)',
            borderRadius: '14px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            opacity: disabled ? 0.6 : 1,
            boxShadow: useLiveData 
              ? '0 4px 12px rgba(74, 144, 226, 0.3)' 
              : '0 2px 8px rgba(44, 62, 80, 0.1)'
          }}
          onClick={() => !disabled && onToggle(!useLiveData)}
        >
          <div
            style={{
              position: 'absolute',
              top: '2px',
              left: useLiveData ? '26px' : '2px',
              width: '24px',
              height: '24px',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              borderRadius: '50%',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(44, 62, 80, 0.15)',
              border: '1px solid rgba(44, 62, 80, 0.1)'
            }}
          />
        </div>
        
        <span style={{ 
          fontSize: '0.95rem', 
          color: useLiveData ? '#4a90e2' : '#8b9dc3',
          fontWeight: useLiveData ? '600' : '400',
          transition: 'all 0.3s ease'
        }}>
          🌐 Live PubMed
        </span>
      </div>
      
      <div style={{ 
        fontSize: '0.85rem', 
        color: '#8b9dc3', 
        marginLeft: 'auto',
        fontWeight: '400',
        letterSpacing: '0.01em'
      }}>
        {useLiveData 
          ? 'Real data from PubMed API' 
          : 'Curated demo papers with abstracts'
        }
      </div>
    </div>
  );
}

function App() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [comments, setComments] = useState<CommentsMap>({});
  const [newComment, setNewComment] = useState<NewCommentMap>({});
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searching, setSearching] = useState<boolean>(false);
  const [highlightedPaper, setHighlightedPaper] = useState<string | null>(null);
  const [useLiveData, setUseLiveData] = useState<boolean>(false); // Default to demo data
  
  // Convert PubMed article to Paper with ratings
  const convertToPaper = (article: PubMedArticle): Paper => ({
    ...article,
    ratings: [], // Start with no ratings
    averageRating: 0
  });

  // Load default papers on component mount
  useEffect(() => {
    const loadDefaultPapers = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = useLiveData ? await getDefaultPapers() : await getDemoDefaultPapers();
        const papersWithRatings = result.articles.map(convertToPaper);
        setPapers(papersWithRatings);
      } catch (err) {
        const errorMessage = useLiveData 
          ? 'Failed to load papers from PubMed' 
          : 'Failed to load demo papers';
        setError(errorMessage);
        console.error('Error loading default papers:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDefaultPapers();
  }, [useLiveData]); // Re-load when data source changes

  // Handle search with debounce
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      // If search is cleared, reload default papers
      const result = useLiveData ? await getDefaultPapers() : await getDemoDefaultPapers();
      const papersWithRatings = result.articles.map(convertToPaper);
      setPapers(papersWithRatings);
      return;
    }

    try {
      setSearching(true);
      setError(null);
      const result = useLiveData 
        ? await searchPubMed(query, 20)
        : await searchDemoPapers(query, 20);
      const papersWithRatings = result.articles.map(convertToPaper);
      setPapers(papersWithRatings);
    } catch (err) {
      const errorMessage = useLiveData 
        ? 'Failed to search PubMed' 
        : 'Failed to search demo papers';
      setError(errorMessage);
      console.error('Error searching papers:', err);
    } finally {
      setSearching(false);
    }
  }, [useLiveData]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== "") {
        handleSearch(searchTerm);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, handleSearch]);

  const filteredPapers = searchTerm.trim() === "" ? papers : papers.filter(paper => 
    paper.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addComment = (paperId: string) => {
    if (newComment[paperId]?.trim()) {
      setComments(prev => ({
        ...prev,
        [paperId]: [...(prev[paperId] || []), newComment[paperId]]
      }));
      setNewComment(prev => ({ ...prev, [paperId]: "" }));
    }
  };

  const addRating = (paperId: string, rating: number) => {
    setPapers(prev => prev.map(paper => {
      if (paper.pmid === paperId) {
        const newRatings = [...paper.ratings, rating];
        const newAverage = Number((newRatings.reduce((sum, r) => sum + r, 0) / newRatings.length).toFixed(2));
        return {
          ...paper,
          ratings: newRatings,
          averageRating: newAverage
        };
      }
      return paper;
    }));
  };

  const handlePaperNavigation = (paper: Paper) => {
    setHighlightedPaper(paper.pmid);
    // Scroll to the paper
    setTimeout(() => {
      const element = document.getElementById(`paper-${paper.pmid}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
    // Remove highlight after animation
    setTimeout(() => {
      setHighlightedPaper(null);
    }, 2000);
  };

  const handleDataSourceToggle = (useLive: boolean) => {
    setUseLiveData(useLive);
    setSearchTerm(''); // Clear search when switching data sources
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #faf8f3 0%, #f5f2e8 100%)',
      fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif'
    }}>
      {/* Header Section */}
      <header style={{
        background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
        color: '#faf8f3',
        padding: '2rem 0',
        marginBottom: '2rem',
        boxShadow: '0 4px 20px rgba(44, 62, 80, 0.15)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            {/* Logo placeholder */}
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #4a90e2 0%, #7b68ee 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#faf8f3',
              boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)'
            }}>
              S
            </div>
            <div>
              <h1 style={{ 
                margin: 0, 
                fontSize: '2.5rem', 
                fontWeight: '700',
                background: 'linear-gradient(135deg, #faf8f3 0%, #e8f4f8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em'
              }}>
                Synapse
              </h1>
              <p style={{ 
                margin: 0, 
                fontSize: '1.1rem', 
                color: '#b8c5d1',
                fontWeight: '400',
                letterSpacing: '0.01em'
              }}>
                Scientific Knowledge Platform
              </p>
            </div>
          </div>
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#d1d9e0', 
            margin: 0,
            fontWeight: '300',
            lineHeight: '1.6'
          }}>
            Helping scientists find the knowledge that papers leave out
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 2rem 4rem 2rem' 
      }}>
      
      <DataSourceToggle 
        useLiveData={useLiveData}
        onToggle={handleDataSourceToggle}
        disabled={loading || searching}
      />
      
      <div style={{ position: 'relative', marginBottom: '2rem' }}>
        <input 
          type="text"
          placeholder={useLiveData 
            ? "Search biomedical papers from PubMed..." 
            : "Search demo papers (try: CRISPR, cancer, COVID, protein)..."
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
          style={{
            width: '100%',
            padding: '1.25rem 1.5rem 1.25rem 3.5rem',
            fontSize: '1.1rem',
            border: '2px solid #e8e2d5',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #ffffff 0%, #faf8f3 100%)',
            color: '#2c3e50',
            fontWeight: '400',
            letterSpacing: '0.01em',
            boxShadow: '0 4px 20px rgba(44, 62, 80, 0.08)',
            transition: 'all 0.3s ease',
            outline: 'none'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#4a90e2';
            e.target.style.boxShadow = '0 4px 20px rgba(74, 144, 226, 0.15)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e8e2d5';
            e.target.style.boxShadow = '0 4px 20px rgba(44, 62, 80, 0.08)';
          }}
        />
        <div style={{
          position: 'absolute',
          left: '1.25rem',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '1.25rem',
          color: '#8b9dc3'
        }}>
          🔍
        </div>
      </div>
      
      {error && (
        <div style={{
          background: 'linear-gradient(135deg, #ffeaea 0%, #ffd6d6 100%)',
          color: '#c53030',
          padding: '1.25rem 1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          border: '1px solid #feb2b2',
          boxShadow: '0 4px 12px rgba(197, 48, 48, 0.1)',
          fontSize: '1rem',
          fontWeight: '500'
        }}>
          ⚠️ {error}
        </div>
      )}
      
      {(loading || searching) && (
        <div style={{
          textAlign: 'center',
          padding: '3rem 2rem',
          color: '#8b9dc3',
          fontSize: '1.1rem',
          fontWeight: '500'
        }}>
          <div style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '3px solid #e8e2d5',
            borderTop: '3px solid #4a90e2',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '1rem'
          }}></div>
          <div>
            {searching ? 'Searching PubMed...' : 'Loading papers from PubMed...'}
          </div>
        </div>
      )}
      
      {filteredPapers.map(paper => (
        <div 
          id={`paper-${paper.pmid}`}
          key={paper.pmid} 
          style={{
            border: highlightedPaper === paper.pmid 
              ? '2px solid #4a90e2' 
              : '1px solid #e8e2d5',
            padding: '2rem',
            marginBottom: '2rem',
            borderRadius: '20px',
            background: highlightedPaper === paper.pmid 
              ? 'linear-gradient(135deg, #f0f8ff 0%, #e8f4f8 100%)' 
              : 'linear-gradient(135deg, #ffffff 0%, #faf8f3 100%)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: highlightedPaper === paper.pmid ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
            boxShadow: highlightedPaper === paper.pmid 
              ? '0 12px 40px rgba(74, 144, 226, 0.2)' 
              : '0 4px 20px rgba(44, 62, 80, 0.08)',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Paper Header */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ 
              margin: '0 0 0.75rem 0', 
              color: '#2c3e50',
              fontSize: '1.5rem',
              fontWeight: '700',
              lineHeight: '1.3',
              letterSpacing: '-0.01em'
            }}>
              {paper.title}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <p style={{ 
                margin: 0, 
                color: '#5a6c7d',
                fontSize: '1rem',
                fontWeight: '500'
              }}>
                {paper.authors.length > 0 ? paper.authors.join(', ') : 'Unknown authors'}
              </p>
              <div style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: '#8b9dc3'
              }}></div>
              <p style={{ 
                margin: 0, 
                color: '#8b9dc3',
                fontSize: '0.95rem',
                fontWeight: '500'
              }}>
                {paper.journal}
              </p>
              <div style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: '#8b9dc3'
              }}></div>
              <p style={{ 
                margin: 0, 
                color: '#8b9dc3',
                fontSize: '0.95rem',
                fontWeight: '500'
              }}>
                {paper.year}
              </p>
            </div>
            {paper.pmid && (
              <p style={{ 
                margin: 0, 
                fontSize: '0.85rem', 
                color: '#a0aec0',
                fontWeight: '400'
              }}>
                PMID: {paper.pmid}
              </p>
            )}
          </div>
          
          {/* Rating section */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '2rem', 
            marginBottom: '1.5rem', 
            padding: '1.25rem', 
            background: 'linear-gradient(135deg, #f8f9fa 0%, #f1f3f4 100%)', 
            borderRadius: '12px',
            border: '1px solid #e8e2d5'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ 
                fontSize: '0.95rem', 
                fontWeight: '600', 
                color: '#2c3e50' 
              }}>
                Average:
              </span>
              <StarRating rating={paper.averageRating} readOnly size={20} />
              <span style={{ 
                fontSize: '0.95rem', 
                color: '#5a6c7d',
                fontWeight: '500'
              }}>
                {paper.averageRating.toFixed(1)} ({paper.ratings.length} rating{paper.ratings.length !== 1 ? 's' : ''})
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ 
                fontSize: '0.95rem', 
                color: '#2c3e50',
                fontWeight: '600'
              }}>
                Rate this paper:
              </span>
              <StarRating 
                rating={0} 
                onRatingChange={(rating) => addRating(paper.pmid, rating)} 
                size={20}
              />
            </div>
          </div>
          
          {/* Comments section */}
          <div style={{ 
            borderTop: '1px solid #e8e2d5', 
            paddingTop: '1.5rem',
            marginTop: '1.5rem'
          }}>
            <h4 style={{ 
              margin: '0 0 1rem 0', 
              fontSize: '1.1rem', 
              color: '#2c3e50',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              💬 Community Notes {(comments[paper.pmid] || []).length > 0 ? `(${(comments[paper.pmid] || []).length})` : "(0)"}
            </h4>
            
            {(comments[paper.pmid] || []).map((comment: string, index: number) => (
              <div key={index} style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #faf8f3 100%)',
                padding: '1rem',
                margin: '0.75rem 0',
                borderRadius: '12px',
                fontSize: '0.95rem',
                border: '1px solid #e8e2d5',
                color: '#2c3e50',
                fontWeight: '400',
                lineHeight: '1.5',
                boxShadow: '0 2px 8px rgba(44, 62, 80, 0.05)'
              }}>
                {comment}
              </div>
            ))}
            
            <div style={{ 
              marginTop: '1rem', 
              display: 'flex', 
              gap: '0.75rem',
              alignItems: 'flex-end'
            }}>
              <input
                type="text"
                placeholder="Add your lab notes or replication tips..."
                value={newComment[paper.pmid] || ""}
                onChange={(e) => setNewComment(prev => ({ 
                  ...prev, 
                  [paper.pmid]: e.target.value 
                }))}
                style={{
                  flex: 1,
                  padding: '1rem',
                  border: '2px solid #e8e2d5',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  background: 'linear-gradient(135deg, #ffffff 0%, #faf8f3 100%)',
                  color: '#2c3e50',
                  fontWeight: '400',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4a90e2';
                  e.target.style.boxShadow = '0 4px 12px rgba(74, 144, 226, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e8e2d5';
                  e.target.style.boxShadow = 'none';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addComment(paper.pmid);
                  }
                }}
              />
              <button
                onClick={() => addComment(paper.pmid)}
                style={{
                  padding: '1rem 1.5rem',
                  background: 'linear-gradient(135deg, #4a90e2 0%, #7b68ee 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)',
                  minWidth: '120px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(74, 144, 226, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(74, 144, 226, 0.3)';
                }}
              >
                Add Note
              </button>
            </div>
          </div>

          {/* Related Papers section */}
          <RelatedPapers 
            currentPaper={paper}
            allPapers={filteredPapers}
            onPaperSelect={handlePaperNavigation}
          />
        </div>
      ))}
      </div>
    </div>
  );
}

export default App;