import { useState, useMemo } from 'react';
import { useContributionsStore } from '../../store/contributionsStore';
import type { Contribution, PaperContribution, TopicContribution } from '../../types/contributions';

interface ContributionsReviewProps {
  onClose?: () => void;
  isModal?: boolean;
}

type FilterScope = 'all' | 'paper' | 'topic';
type FilterStatus = 'all' | 'pending' | 'accepted' | 'needs-more-info' | 'rejected';
type FilterType = 'all' | 'methodology-detail' | 'correction' | 'proposed-topic' | 'new-topic' | 'topic-correction';

const statusColors = {
  pending: { bg: '#fef3c7', color: '#d97706', border: '#f59e0b' },
  accepted: { bg: '#d1fae5', color: '#059669', border: '#10b981' },
  'needs-more-info': { bg: '#dbeafe', color: '#2563eb', border: '#3b82f6' },
  rejected: { bg: '#fee2e2', color: '#dc2626', border: '#ef4444' },
  approved: { bg: '#d1fae5', color: '#059669', border: '#10b981' },
  'under-review': { bg: '#dbeafe', color: '#2563eb', border: '#3b82f6' }
};

const typeIcons = {
  'methodology-detail': '🔬',
  'correction': '✏️',
  'proposed-topic': '🏷️',
  'new-topic': '💡',
  'topic-correction': '✏️'
};

const typeLabels = {
  'methodology-detail': 'Methodology Details',
  'correction': 'Corrections',
  'proposed-topic': 'Proposed Topic',
  'new-topic': 'New Topic',
  'topic-correction': 'Topic Correction'
};

export default function ContributionsReview({ onClose, isModal = false }: ContributionsReviewProps) {
  const { 
    contributions, 
    updateContributionStatus, 
    getContributionsByStatus 
  } = useContributionsStore();

  const [filters, setFilters] = useState({
    scope: 'all' as FilterScope,
    status: 'all' as FilterStatus,
    type: 'all' as FilterType,
    search: ''
  });

  const filteredContributions = useMemo(() => {
    let filtered = contributions;

    // Filter by scope
    if (filters.scope !== 'all') {
      filtered = filtered.filter(contrib => contrib.scope === filters.scope);
    }

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(contrib => contrib.status === filters.status);
    }

    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(contrib => contrib.type === filters.type);
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(contrib => 
        (contrib.scope === 'paper' ? contrib.description?.toLowerCase().includes(searchLower) : false) ||
        (contrib.scope === 'topic' ? contrib.rationale?.toLowerCase().includes(searchLower) : false) ||
        (contrib.scope === 'topic' ? contrib.title?.toLowerCase().includes(searchLower) : false) ||
        contrib.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [contributions, filters]);

  const handleStatusUpdate = (id: string, status: Contribution['status']) => {
    updateContributionStatus(id, status);
  };

  const ContributionCard = ({ contribution }: { contribution: Contribution }) => {
    const statusStyle = statusColors[contribution.status];
    const typeIcon = typeIcons[contribution.type as keyof typeof typeIcons];
    const typeLabel = typeLabels[contribution.type as keyof typeof typeLabels];

    return (
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e8e2d5',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '1rem',
        boxShadow: '0 2px 8px rgba(44, 62, 80, 0.05)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '0.5rem'
            }}>
              <span style={{ fontSize: '1.2rem' }}>{typeIcon}</span>
              <span style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#2c3e50'
              }}>
                {typeLabel}
              </span>
              <span style={{
                padding: '0.25rem 0.75rem',
                backgroundColor: statusStyle.bg,
                color: statusStyle.color,
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: '600',
                border: `1px solid ${statusStyle.border}`
              }}>
                {contribution.status.replace('-', ' ')}
              </span>
            </div>
            
            <div style={{
              fontSize: '0.9rem',
              color: '#4a5568',
              marginBottom: '0.5rem'
            }}>
              {contribution.scope === 'paper' ? (
                <span style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: 'rgba(74, 144, 226, 0.1)',
                  color: '#4a90e2',
                  borderRadius: '12px',
                  fontWeight: '500'
                }}>
                  📄 Paper #{(contribution as PaperContribution).paperId}
                </span>
              ) : (
                <span style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: 'rgba(56, 161, 105, 0.1)',
                  color: '#38a169',
                  borderRadius: '12px',
                  fontWeight: '500'
                }}>
                  🧬 Topic {(contribution as TopicContribution).topicId || 'New'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ marginBottom: '1rem' }}>
          {(contribution as TopicContribution).title && (
            <div style={{ marginBottom: '0.75rem' }}>
              <h4 style={{
                margin: '0 0 0.25rem 0',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#2c3e50'
              }}>
                {(contribution as TopicContribution).title}
              </h4>
            </div>
          )}

          <div style={{
            fontSize: '0.9rem',
            color: '#4a5568',
            lineHeight: '1.5',
            marginBottom: '0.75rem'
          }}>
            {contribution.scope === 'paper' ? contribution.description : contribution.rationale}
          </div>

          {(contribution as PaperContribution).proposedTopicTitle && (
            <div style={{
              padding: '0.75rem',
              backgroundColor: 'rgba(74, 144, 226, 0.05)',
              borderRadius: '8px',
              marginBottom: '0.75rem'
            }}>
              <div style={{
                fontSize: '0.8rem',
                fontWeight: '600',
                color: '#4a90e2',
                marginBottom: '0.25rem'
              }}>
                Proposed Topic:
              </div>
              <div style={{
                fontSize: '0.9rem',
                color: '#2c3e50'
              }}>
                {(contribution as PaperContribution).proposedTopicTitle}
              </div>
            </div>
          )}

          {contribution.tags && contribution.tags.length > 0 && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginBottom: '0.75rem'
            }}>
              {contribution.tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: 'rgba(139, 157, 195, 0.1)',
                    color: '#8b9dc3',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '1rem',
          borderTop: '1px solid #e8e2d5'
        }}>
          <div style={{
            fontSize: '0.8rem',
            color: '#8b9dc3'
          }}>
            {new Date(contribution.createdAt).toLocaleDateString()} • 
            {contribution.createdBy?.name || 'Anonymous'}
          </div>

          {contribution.status === 'pending' && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => handleStatusUpdate(contribution.id, 'accepted')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Accept
              </button>
              <button
                onClick={() => handleStatusUpdate(contribution.id, 'needs-more-info')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Need Info
              </button>
              <button
                onClick={() => handleStatusUpdate(contribution.id, 'rejected')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const content = (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{
            margin: 0,
            fontSize: '2rem',
            fontWeight: '700',
            color: '#2c3e50',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            🔍 Contributions Review
          </h1>
          <p style={{
            margin: '0.5rem 0 0 0',
            fontSize: '1.1rem',
            color: '#4a5568'
          }}>
            Review and manage community contributions
          </p>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#4a90e2',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        )}
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {[
          { label: 'Total', value: contributions.length, color: '#4a5568' },
          { label: 'Pending', value: getContributionsByStatus('pending').length, color: '#d97706' },
          { label: 'Accepted', value: getContributionsByStatus('accepted').length, color: '#059669' },
          { label: 'Rejected', value: getContributionsByStatus('rejected').length, color: '#dc2626' }
        ].map(stat => (
          <div
            key={stat.label}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e8e2d5',
              borderRadius: '12px',
              padding: '1rem',
              textAlign: 'center'
            }}
          >
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: stat.color,
              marginBottom: '0.5rem'
            }}>
              {stat.value}
            </div>
            <div style={{
              fontSize: '0.85rem',
              color: '#4a5568',
              fontWeight: '600'
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{
        backgroundColor: '#f8f9fa',
        border: '1px solid #e8e2d5',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#2c3e50',
              marginBottom: '0.5rem'
            }}>
              Scope
            </label>
            <select
              value={filters.scope}
              onChange={(e) => setFilters(prev => ({ ...prev, scope: e.target.value as FilterScope }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e8e2d5',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}
            >
              <option value="all">All Scopes</option>
              <option value="paper">Papers</option>
              <option value="topic">Topics</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#2c3e50',
              marginBottom: '0.5rem'
            }}>
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as FilterStatus }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e8e2d5',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="needs-more-info">Needs More Info</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#2c3e50',
              marginBottom: '0.5rem'
            }}>
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as FilterType }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e8e2d5',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}
            >
              <option value="all">All Types</option>
              <option value="methodology-detail">Methodology Details</option>
              <option value="correction">Corrections</option>
              <option value="proposed-topic">Proposed Topic</option>
              <option value="new-topic">New Topic</option>
              <option value="topic-correction">Topic Correction</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{
            display: 'block',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#2c3e50',
            marginBottom: '0.5rem'
          }}>
            Search
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            placeholder="Search contributions..."
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #e8e2d5',
              borderRadius: '8px',
              fontSize: '0.9rem'
            }}
          />
        </div>
      </div>

      {/* Contributions List */}
      <div>
        {filteredContributions.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#8b9dc3',
            fontSize: '1.1rem'
          }}>
            No contributions found matching your filters.
          </div>
        ) : (
          filteredContributions.map(contribution => (
            <ContributionCard key={contribution.id} contribution={contribution} />
          ))
        )}
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          width: '100%',
          maxWidth: '1200px',
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          {content}
        </div>
      </div>
    );
  }

  return content;
}
