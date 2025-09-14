import { useState } from 'react';
import TopicCard from './TopicCard';
import { sampleScientificTopics } from '../data/sampleTopics';
import type { ScientificTopic, EvidencePaper } from '../types/scientificTopic';
import type { ContributionType } from '../types/contributions';

interface TopicsPageProps {
  searchTerm?: string;
  onContribute?: (type: ContributionType, topicId: string) => void;
}

export default function TopicsPage({ searchTerm = '', onContribute }: TopicsPageProps) {
  const [selectedTopic, setSelectedTopic] = useState<ScientificTopic | null>(null);

  // Filter topics based on search term
  const filteredTopics = searchTerm.trim() === '' 
    ? sampleScientificTopics 
    : sampleScientificTopics.filter(topic =>
        topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
      );

  const handlePaperClick = (paper: EvidencePaper) => {
    console.log('Paper clicked:', paper.article.title);
    // Here you could navigate to a detailed paper view or show a modal
    // For now, we'll just scroll to the paper in the current topic
  };

  const handleTopicSelect = (topic: ScientificTopic) => {
    setSelectedTopic(topic);
    // Scroll to top when selecting a topic
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (selectedTopic) {
    return (
      <div>
        {/* Back button */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => setSelectedTopic(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              background: 'linear-gradient(135deg, #f8f9fa 0%, #f1f3f4 100%)',
              border: '1px solid #e8e2d5',
              borderRadius: '12px',
              fontSize: '0.95rem',
              fontWeight: '600',
              color: '#2c3e50',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(44, 62, 80, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            ← Back to Topics
          </button>
        </div>

        {/* Selected topic detail */}
        <TopicCard 
          topic={selectedTopic} 
          onPaperClick={handlePaperClick}
          onContribute={onContribute}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Topics overview header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{
          margin: '0 0 1rem 0',
          fontSize: '2rem',
          fontWeight: '700',
          color: '#2c3e50',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          🧬 Scientific Topics
        </h2>
        <p style={{
          margin: 0,
          fontSize: '1.1rem',
          color: '#4a5568',
          lineHeight: '1.6'
        }}>
          Explore evidence-based summaries of key scientific topics with aggregated research findings, 
          methodological controversies, and research gaps.
        </p>
      </div>

      {/* Search results info */}
      {searchTerm.trim() !== '' && (
        <div style={{
          background: 'linear-gradient(135deg, #e8f4f8 0%, #d1e7dd 100%)',
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          border: '1px solid #bee3f8',
          marginBottom: '2rem',
          fontSize: '0.95rem',
          color: '#2c5282'
        }}>
          <strong>🔍 Search Results:</strong> Found {filteredTopics.length} topic{filteredTopics.length !== 1 ? 's' : ''} 
          matching "{searchTerm}"
        </div>
      )}

      {/* Topics grid */}
      {filteredTopics.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'linear-gradient(135deg, #ffffff 0%, #faf8f3 100%)',
          borderRadius: '20px',
          border: '1px solid #e8e2d5'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h3 style={{ 
            margin: '0 0 0.5rem 0', 
            fontSize: '1.5rem', 
            color: '#2c3e50',
            fontWeight: '600'
          }}>
            No topics found
          </h3>
          <p style={{ 
            margin: 0, 
            fontSize: '1rem', 
            color: '#8b9dc3' 
          }}>
            Try searching for "CRISPR", "Western blot", or "p53" to see available topics.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          gap: '2rem'
        }}>
          {filteredTopics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => handleTopicSelect(topic)}
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #faf8f3 100%)',
                border: '1px solid #e8e2d5',
                borderRadius: '20px',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(44, 62, 80, 0.05)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(44, 62, 80, 0.15)';
                e.currentTarget.style.borderColor = '#4a90e2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(44, 62, 80, 0.05)';
                e.currentTarget.style.borderColor = '#e8e2d5';
              }}
            >
              {/* Topic preview card */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{
                    margin: 0,
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: '#2c3e50',
                    lineHeight: '1.3',
                    flex: 1
                  }}>
                    {topic.title}
                  </h3>
                  
                  {/* Mini assessment badge */}
                  <div style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginLeft: '1rem',
                    background: topic.overallAssessment === 'very-strong' ? '#c6f6d5' :
                               topic.overallAssessment === 'strong' ? '#bee3f8' :
                               topic.overallAssessment === 'moderate' ? '#feebc8' :
                               topic.overallAssessment === 'limited' ? '#fed7e2' :
                               topic.overallAssessment === 'conflicting' ? '#e2e8f0' : '#fed7d7',
                    color: topic.overallAssessment === 'very-strong' ? '#22543d' :
                           topic.overallAssessment === 'strong' ? '#2c5282' :
                           topic.overallAssessment === 'moderate' ? '#c05621' :
                           topic.overallAssessment === 'limited' ? '#97266d' :
                           topic.overallAssessment === 'conflicting' ? '#4a5568' : '#742a2a'
                  }}>
                    {topic.overallAssessment.replace('-', ' ')}
                  </div>
                </div>

                <p style={{
                  margin: '0 0 1rem 0',
                  fontSize: '0.95rem',
                  color: '#4a5568',
                  lineHeight: '1.5',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {topic.description}
                </p>

                {/* Keywords preview */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                  {topic.keywords.slice(0, 4).map((keyword) => (
                    <span
                      key={keyword}
                      style={{
                        padding: '0.2rem 0.5rem',
                        background: 'linear-gradient(135deg, #e8f4f8 0%, #d1e7dd 100%)',
                        color: '#2c5282',
                        borderRadius: '10px',
                        fontSize: '0.7rem',
                        fontWeight: '500'
                      }}
                    >
                      {keyword}
                    </span>
                  ))}
                  {topic.keywords.length > 4 && (
                    <span style={{
                      padding: '0.2rem 0.5rem',
                      color: '#8b9dc3',
                      fontSize: '0.7rem'
                    }}>
                      +{topic.keywords.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Topic stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid #e8e2d5'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#2c5282' }}>
                    {topic.evidencePapers.length}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#8b9dc3', fontWeight: '600' }}>
                    Papers
                  </div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#22543d' }}>
                    {Math.round(topic.confidenceLevel * 100)}%
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#8b9dc3', fontWeight: '600' }}>
                    Confidence
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#c05621' }}>
                    {topic.controversies.length}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#8b9dc3', fontWeight: '600' }}>
                    Issues
                  </div>
                </div>
              </div>

              {/* Click indicator */}
              <div style={{
                marginTop: '1rem',
                textAlign: 'center',
                fontSize: '0.8rem',
                color: '#8b9dc3',
                fontWeight: '500'
              }}>
                Click to explore topic in detail →
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Topic stats summary */}
      {filteredTopics.length > 0 && searchTerm.trim() === '' && (
        <div style={{
          marginTop: '3rem',
          padding: '2rem',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #f1f3f4 100%)',
          borderRadius: '16px',
          border: '1px solid #e8e2d5'
        }}>
          <h3 style={{
            margin: '0 0 1.5rem 0',
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#2c3e50',
            textAlign: 'center'
          }}>
            📊 Topic Collection Summary
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#2c5282', marginBottom: '0.5rem' }}>
                {filteredTopics.length}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#4a5568', fontWeight: '600' }}>
                Scientific Topics
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#22543d', marginBottom: '0.5rem' }}>
                {filteredTopics.reduce((sum, topic) => sum + topic.evidencePapers.length, 0)}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#4a5568', fontWeight: '600' }}>
                Total Research Papers
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#c05621', marginBottom: '0.5rem' }}>
                {Math.round(filteredTopics.reduce((sum, topic) => sum + topic.confidenceLevel, 0) / filteredTopics.length * 100)}%
              </div>
              <div style={{ fontSize: '0.9rem', color: '#4a5568', fontWeight: '600' }}>
                Average Confidence
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#b83280', marginBottom: '0.5rem' }}>
                {filteredTopics.reduce((sum, topic) => sum + topic.controversies.length, 0)}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#4a5568', fontWeight: '600' }}>
                Active Controversies
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}