import { useState } from 'react';
import type { 
  Contribution, 
  ContributionStatus, 
  ContributionType, 
  ContributionFilters,
  ContributionComment,
  PaperContributionType,
  TopicContributionType
} from '../types/contributions';

interface ContributionsDisplayProps {
  contributions: Contribution[];
  onApprove: (contributionId: string, moderatorNotes?: string) => void;
  onReject: (contributionId: string, moderatorNotes: string) => void;
  onAddComment: (contributionId: string, content: string) => void;
  comments: Record<string, ContributionComment[]>;
  userRole: 'researcher' | 'moderator' | 'admin';
}

// Design tokens consistent with other components
const DISPLAY_TOKENS = {
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.25rem',
    xxl: '1.5rem'
  },
  colors: {
    primary: '#4a90e2',
    success: '#38a169',
    danger: '#e53e3e',
    warning: '#dd6b20',
    neutral: '#8b9dc3',
    text: {
      primary: '#2c3e50',
      secondary: '#4a5568',
      tertiary: '#8b9dc3'
    },
    background: {
      card: 'linear-gradient(135deg, #ffffff 0%, #faf8f3 100%)',
      section: 'linear-gradient(135deg, #f8f9fa 0%, #f1f3f4 100%)'
    },
    border: '#e8e2d5'
  }
};

function StatusBadge({ status }: { status: ContributionStatus }) {
  const getStatusConfig = () => {
    switch (status) {
      case 'approved':
        return {
          bg: 'rgba(56, 161, 105, 0.1)',
          color: DISPLAY_TOKENS.colors.success,
          border: 'rgba(56, 161, 105, 0.2)',
          icon: '✓'
        };
      case 'rejected':
        return {
          bg: 'rgba(229, 62, 62, 0.1)',
          color: DISPLAY_TOKENS.colors.danger,
          border: 'rgba(229, 62, 62, 0.2)',
          icon: '✗'
        };
      case 'under-review':
        return {
          bg: 'rgba(221, 107, 32, 0.1)',
          color: DISPLAY_TOKENS.colors.warning,
          border: 'rgba(221, 107, 32, 0.2)',
          icon: '👁'
        };
      default: // pending
        return {
          bg: 'rgba(139, 157, 195, 0.1)',
          color: DISPLAY_TOKENS.colors.neutral,
          border: 'rgba(139, 157, 195, 0.2)',
          icon: '⏳'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: DISPLAY_TOKENS.spacing.xs,
      padding: `${DISPLAY_TOKENS.spacing.xs} ${DISPLAY_TOKENS.spacing.sm}`,
      background: config.bg,
      color: config.color,
      border: `1px solid ${config.border}`,
      borderRadius: '12px',
      fontSize: '0.75rem',
      fontWeight: '600',
      textTransform: 'capitalize'
    }}>
      <span>{config.icon}</span>
      {status.replace('-', ' ')}
    </span>
  );
}

function TypeBadge({ type }: { type: PaperContributionType | TopicContributionType }) {
  const getTypeConfig = () => {
    switch (type) {
      case 'add-paper':
        return { icon: '📄', label: 'Add Paper', color: DISPLAY_TOKENS.colors.primary };
      case 'edit-summary':
        return { icon: '✏️', label: 'Edit Summary', color: DISPLAY_TOKENS.colors.success };
      case 'flag-methodology':
        return { icon: '⚠️', label: 'Flag Issue', color: DISPLAY_TOKENS.colors.warning };
      case 'suggest-topic':
        return { icon: '💡', label: 'New Topic', color: DISPLAY_TOKENS.colors.neutral };
      case 'add-methodology-details':
        return { icon: '🔬', label: 'Add Methods', color: DISPLAY_TOKENS.colors.primary };
      case 'correct-paper-info':
        return { icon: '✏️', label: 'Paper Corrections', color: DISPLAY_TOKENS.colors.warning };
      case 'suggest-paper-topics':
        return { icon: '🏷️', label: 'Suggest Topics', color: DISPLAY_TOKENS.colors.success };
    }
  };

  const config = getTypeConfig();

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: DISPLAY_TOKENS.spacing.xs,
      padding: `${DISPLAY_TOKENS.spacing.xs} ${DISPLAY_TOKENS.spacing.sm}`,
      background: `${config?.color || '#4a90e2'}15`,
      color: config?.color || '#4a90e2',
      border: `1px solid ${config?.color || '#4a90e2'}30`,
      borderRadius: '8px',
      fontSize: '0.75rem',
      fontWeight: '500'
    }}>
      <span>{config?.icon || '📄'}</span>
      {config?.label || 'Unknown'}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: 'low' | 'medium' | 'high' }) {
  const getColor = () => {
    switch (priority) {
      case 'high': return DISPLAY_TOKENS.colors.danger;
      case 'medium': return DISPLAY_TOKENS.colors.warning;
      default: return DISPLAY_TOKENS.colors.neutral;
    }
  };

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: `${DISPLAY_TOKENS.spacing.xs} ${DISPLAY_TOKENS.spacing.sm}`,
      background: `${getColor()}10`,
      color: getColor(),
      border: `1px solid ${getColor()}20`,
      borderRadius: '6px',
      fontSize: '0.7rem',
      fontWeight: '600',
      textTransform: 'uppercase'
    }}>
      {priority}
    </span>
  );
}

function ContributionCard({ 
  contribution, 
  onApprove, 
  onReject, 
  onAddComment, 
  comments,
  userRole 
}: {
  contribution: Contribution;
  onApprove: (id: string, notes?: string) => void;
  onReject: (id: string, notes: string) => void;
  onAddComment: (id: string, content: string) => void;
  comments: ContributionComment[];
  userRole: 'researcher' | 'moderator' | 'admin';
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [moderatorNotes, setModeratorNotes] = useState('');
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const canModerate = userRole === 'moderator' || userRole === 'admin';
  const isPending = contribution.status === 'pending';

  const renderContributionData = () => {
    switch (contribution.type) {
      case 'add-paper':
        const paperData = contribution.data;
        return (
          <div style={{ display: 'grid', gap: DISPLAY_TOKENS.spacing.md }}>
            <div>
              <strong>Paper:</strong> {paperData.title}
            </div>
            <div>
              <strong>Journal:</strong> {paperData.journal} ({paperData.year})
            </div>
            <div>
              <strong>Authors:</strong> {paperData.authors.slice(0, 3).join(', ')}
              {paperData.authors.length > 3 && ` +${paperData.authors.length - 3} more`}
            </div>
            <div>
              <strong>Rationale:</strong> {paperData.rationale}
            </div>
            <div>
              <strong>Key Findings:</strong>
              <ul style={{ margin: `${DISPLAY_TOKENS.spacing.sm} 0`, paddingLeft: DISPLAY_TOKENS.spacing.xl }}>
                {paperData.relevantFindings.map((finding: any, i: number) => (
                  <li key={i} style={{ marginBottom: DISPLAY_TOKENS.spacing.xs }}>{finding}</li>
                ))}
              </ul>
            </div>
            <div style={{ display: 'flex', gap: DISPLAY_TOKENS.spacing.md }}>
              <span><strong>Suggested Strength:</strong> {paperData.suggestedStrength}</span>
              <span><strong>Quality:</strong> {paperData.suggestedQuality}</span>
            </div>
          </div>
        );

      case 'edit-summary':
        const editData = contribution.data;
        return (
          <div style={{ display: 'grid', gap: DISPLAY_TOKENS.spacing.md }}>
            <div>
              <strong>Section:</strong> {editData.section.replace('-', ' ')}
            </div>
            <div>
              <strong>Current Text:</strong>
              <div style={{
                padding: DISPLAY_TOKENS.spacing.md,
                background: '#ffebee',
                borderRadius: '4px',
                marginTop: DISPLAY_TOKENS.spacing.xs,
                fontStyle: 'italic'
              }}>
                {editData.originalText || 'No current text provided'}
              </div>
            </div>
            <div>
              <strong>Proposed Text:</strong>
              <div style={{
                padding: DISPLAY_TOKENS.spacing.md,
                background: '#e8f5e8',
                borderRadius: '4px',
                marginTop: DISPLAY_TOKENS.spacing.xs
              }}>
                {editData.proposedText}
              </div>
            </div>
            <div>
              <strong>Rationale:</strong> {editData.rationale}
            </div>
          </div>
        );

      case 'flag-methodology':
        const flagData = contribution.data;
        return (
          <div style={{ display: 'grid', gap: DISPLAY_TOKENS.spacing.md }}>
            <div>
              <strong>Target:</strong> {flagData.targetSection.replace('-', ' ')}
              {flagData.targetId && ` (${flagData.targetId})`}
            </div>
            <div>
              <strong>Issue Type:</strong> {flagData.issueType.replace('-', ' ')}
              <span style={{ marginLeft: DISPLAY_TOKENS.spacing.md }}>
                <PriorityBadge priority={flagData.severity as any} />
              </span>
            </div>
            <div>
              <strong>Description:</strong> {flagData.description}
            </div>
            {flagData.suggestedCorrection && (
              <div>
                <strong>Suggested Correction:</strong> {flagData.suggestedCorrection}
              </div>
            )}
          </div>
        );

      case 'suggest-topic':
        const topicData = contribution.data;
        return (
          <div style={{ display: 'grid', gap: DISPLAY_TOKENS.spacing.md }}>
            <div>
              <strong>Proposed Title:</strong> {topicData.proposedTitle}
            </div>
            <div>
              <strong>Description:</strong> {topicData.description}
            </div>
            <div>
              <strong>Keywords:</strong> {topicData.keywords.join(', ')}
            </div>
            <div>
              <strong>Knowledge Gap:</strong> {topicData.knowledgeGap}
            </div>
            <div>
              <strong>Rationale:</strong> {topicData.rationale}
            </div>
            <div style={{ display: 'flex', gap: DISPLAY_TOKENS.spacing.md }}>
              <span><strong>Urgency:</strong> {topicData.urgency}</span>
              <span><strong>Scope:</strong> {topicData.scope}</span>
            </div>
          </div>
        );

      case 'add-methodology-details':
        const methodsData = contribution.data;
        return (
          <div style={{ display: 'grid', gap: DISPLAY_TOKENS.spacing.md }}>
            <div>
              <strong>Target Paper:</strong> {methodsData.targetPaperTitle}
            </div>
            <div>
              <strong>Missing Details:</strong>
              {methodsData.missingDetails.map((detail: any, i: number) => (
                <div key={i} style={{ 
                  marginTop: DISPLAY_TOKENS.spacing.sm,
                  padding: DISPLAY_TOKENS.spacing.md,
                  background: '#f8f9fa',
                  borderRadius: '6px',
                  border: '1px solid #e9ecef'
                }}>
                  <div><strong>Section:</strong> {detail.section}</div>
                  <div><strong>Current:</strong> {detail.currentDescription}</div>
                  <div><strong>Suggested Addition:</strong> {detail.suggestedAddition}</div>
                  <div><strong>Importance:</strong> {detail.importance}</div>
                </div>
              ))}
            </div>
            <div>
              <strong>Sources:</strong> {methodsData.sourcesForDetails.join(', ') || 'Personal knowledge'}
            </div>
            <div>
              <strong>Rationale:</strong> {methodsData.rationale}
            </div>
          </div>
        );

      case 'correct-paper-info':
        const correctionData = contribution.data;
        return (
          <div style={{ display: 'grid', gap: DISPLAY_TOKENS.spacing.md }}>
            <div>
              <strong>Target Paper:</strong> {correctionData.targetPaperTitle}
            </div>
            <div>
              <strong>Corrections:</strong>
              {correctionData.corrections.map((correction: any, i: number) => (
                <div key={i} style={{ 
                  marginTop: DISPLAY_TOKENS.spacing.sm,
                  padding: DISPLAY_TOKENS.spacing.md,
                  background: '#fff3cd',
                  borderRadius: '6px',
                  border: '1px solid #ffeaa7'
                }}>
                  <div><strong>Field:</strong> {correction.field}</div>
                  <div><strong>Current:</strong> {correction.currentValue}</div>
                  <div><strong>Corrected:</strong> {correction.correctedValue}</div>
                  <div><strong>Evidence:</strong> {correction.evidence}</div>
                </div>
              ))}
            </div>
            <div>
              <strong>Urgency:</strong> {correctionData.urgency}
            </div>
            <div>
              <strong>Rationale:</strong> {correctionData.rationale}
            </div>
          </div>
        );

      case 'suggest-paper-topics':
        const paperTopicsData = contribution.data;
        return (
          <div style={{ display: 'grid', gap: DISPLAY_TOKENS.spacing.md }}>
            <div>
              <strong>Target Paper:</strong> {paperTopicsData.targetPaperTitle}
            </div>
            <div>
              <strong>Suggested Topics:</strong>
              {paperTopicsData.suggestedTopics.map((topic: any, i: number) => (
                <div key={i} style={{ 
                  marginTop: DISPLAY_TOKENS.spacing.sm,
                  padding: DISPLAY_TOKENS.spacing.md,
                  background: '#e8f5e8',
                  borderRadius: '6px',
                  border: '1px solid #c3e6cb'
                }}>
                  <div><strong>Topic:</strong> {topic.topicTitle}</div>
                  <div><strong>Relevance:</strong> {topic.relevance}</div>
                  <div><strong>Key Findings:</strong> {topic.keyFindings.join(', ')}</div>
                  <div><strong>Rationale:</strong> {topic.rationale}</div>
                </div>
              ))}
            </div>
            {paperTopicsData.newTopicSuggestions && paperTopicsData.newTopicSuggestions.length > 0 && (
              <div>
                <strong>New Topic Suggestions:</strong>
                {paperTopicsData.newTopicSuggestions.map((newTopic: any, i: number) => (
                  <div key={i} style={{ 
                    marginTop: DISPLAY_TOKENS.spacing.sm,
                    padding: DISPLAY_TOKENS.spacing.md,
                    background: '#e3f2fd',
                    borderRadius: '6px',
                    border: '1px solid #bbdefb'
                  }}>
                    <div><strong>Title:</strong> {newTopic.proposedTitle}</div>
                    <div><strong>Description:</strong> {newTopic.description}</div>
                    <div><strong>Keywords:</strong> {newTopic.keywords.join(', ')}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div style={{
      background: DISPLAY_TOKENS.colors.background.card,
      border: `1px solid ${DISPLAY_TOKENS.colors.border}`,
      borderRadius: '12px',
      padding: DISPLAY_TOKENS.spacing.xl,
      marginBottom: DISPLAY_TOKENS.spacing.xl
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: DISPLAY_TOKENS.spacing.lg
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: DISPLAY_TOKENS.spacing.md,
            marginBottom: DISPLAY_TOKENS.spacing.sm
          }}>
            <TypeBadge type={contribution.type} />
            <StatusBadge status={contribution.status} />
            <PriorityBadge priority={contribution.priority || 'medium'} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: DISPLAY_TOKENS.spacing.xs }}>
            <div style={{
              fontSize: '0.9rem',
              color: DISPLAY_TOKENS.colors.text.secondary
            }}>
              <strong>By:</strong> {contribution.contributor?.name || 'Unknown'}
              {contribution.contributor?.institution && ` (${contribution.contributor.institution})`}
            </div>
            
            {contribution.targetTopic && (
              <div style={{
                fontSize: '0.9rem',
                color: DISPLAY_TOKENS.colors.text.secondary
              }}>
                <strong>Topic:</strong> {contribution.targetTopic.title}
              </div>
            )}

            <div style={{
              fontSize: '0.8rem',
              color: DISPLAY_TOKENS.colors.text.tertiary
            }}>
              Submitted: {contribution.submittedAt?.toLocaleDateString() || 'Unknown'} at {contribution.submittedAt?.toLocaleTimeString() || 'Unknown'}
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            padding: `${DISPLAY_TOKENS.spacing.sm} ${DISPLAY_TOKENS.spacing.md}`,
            background: 'transparent',
            border: `1px solid ${DISPLAY_TOKENS.colors.border}`,
            borderRadius: '6px',
            fontSize: '0.8rem',
            color: DISPLAY_TOKENS.colors.text.secondary,
            cursor: 'pointer'
          }}
        >
          {isExpanded ? '▲ Collapse' : '▼ Expand'}
        </button>
      </div>

      {/* Content */}
      {isExpanded && (
        <>
          <div style={{
            padding: DISPLAY_TOKENS.spacing.lg,
            background: DISPLAY_TOKENS.colors.background.section,
            borderRadius: '8px',
            marginBottom: DISPLAY_TOKENS.spacing.lg
          }}>
            {renderContributionData()}
          </div>

          {/* Contributor Expertise */}
          {contribution.contributor?.expertise && contribution.contributor.expertise.length > 0 && (
            <div style={{ marginBottom: DISPLAY_TOKENS.spacing.lg }}>
              <strong style={{ fontSize: '0.9rem', color: DISPLAY_TOKENS.colors.text.primary }}>
                Contributor Expertise:
              </strong>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: DISPLAY_TOKENS.spacing.xs,
                marginTop: DISPLAY_TOKENS.spacing.sm
              }}>
                {contribution.contributor?.expertise?.map((area: any, i: number) => (
                  <span
                    key={i}
                    style={{
                      padding: `${DISPLAY_TOKENS.spacing.xs} ${DISPLAY_TOKENS.spacing.sm}`,
                      background: 'rgba(74, 144, 226, 0.1)',
                      color: DISPLAY_TOKENS.colors.primary,
                      borderRadius: '10px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div style={{ marginBottom: DISPLAY_TOKENS.spacing.lg }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: DISPLAY_TOKENS.spacing.md,
              marginBottom: DISPLAY_TOKENS.spacing.md
            }}>
              <button
                onClick={() => setShowComments(!showComments)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: DISPLAY_TOKENS.colors.primary,
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: DISPLAY_TOKENS.spacing.xs
                }}
              >
                💬 Comments ({comments.length})
                <span style={{ fontSize: '0.7rem' }}>
                  {showComments ? '▲' : '▼'}
                </span>
              </button>
            </div>

            {showComments && (
              <>
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    style={{
                      padding: DISPLAY_TOKENS.spacing.md,
                      background: comment.isModeratorComment 
                        ? 'rgba(74, 144, 226, 0.05)' 
                        : 'rgba(139, 157, 195, 0.05)',
                      borderRadius: '6px',
                      marginBottom: DISPLAY_TOKENS.spacing.sm,
                      borderLeft: comment.isModeratorComment 
                        ? `3px solid ${DISPLAY_TOKENS.colors.primary}` 
                        : `3px solid ${DISPLAY_TOKENS.colors.neutral}`
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: DISPLAY_TOKENS.spacing.xs
                    }}>
                      <span style={{
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color: DISPLAY_TOKENS.colors.text.primary
                      }}>
                        {comment.contributor.name}
                        {comment.isModeratorComment && (
                          <span style={{
                            marginLeft: DISPLAY_TOKENS.spacing.xs,
                            padding: `2px ${DISPLAY_TOKENS.spacing.xs}`,
                            background: DISPLAY_TOKENS.colors.primary,
                            color: '#ffffff',
                            borderRadius: '4px',
                            fontSize: '0.7rem'
                          }}>
                            MOD
                          </span>
                        )}
                      </span>
                      <span style={{
                        fontSize: '0.7rem',
                        color: DISPLAY_TOKENS.colors.text.tertiary
                      }}>
                        {comment.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                    <div style={{
                      fontSize: '0.85rem',
                      color: DISPLAY_TOKENS.colors.text.secondary,
                      lineHeight: '1.4'
                    }}>
                      {comment.content}
                    </div>
                  </div>
                ))}

                {/* Add Comment */}
                <div style={{ display: 'flex', gap: DISPLAY_TOKENS.spacing.sm }}>
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    style={{
                      flex: 1,
                      padding: DISPLAY_TOKENS.spacing.sm,
                      border: `1px solid ${DISPLAY_TOKENS.colors.border}`,
                      borderRadius: '6px',
                      fontSize: '0.85rem'
                    }}
                  />
                  <button
                    onClick={() => {
                      if (newComment.trim()) {
                        onAddComment(contribution.id, newComment.trim());
                        setNewComment('');
                      }
                    }}
                    style={{
                      padding: `${DISPLAY_TOKENS.spacing.sm} ${DISPLAY_TOKENS.spacing.md}`,
                      background: DISPLAY_TOKENS.colors.primary,
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Comment
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Moderation Actions */}
          {canModerate && isPending && (
            <div style={{
              padding: DISPLAY_TOKENS.spacing.lg,
              background: 'rgba(74, 144, 226, 0.05)',
              borderRadius: '8px',
              border: `1px solid rgba(74, 144, 226, 0.1)`
            }}>
              <h4 style={{
                margin: `0 0 ${DISPLAY_TOKENS.spacing.md} 0`,
                fontSize: '0.9rem',
                fontWeight: '600',
                color: DISPLAY_TOKENS.colors.text.primary
              }}>
                🛡️ Moderation Actions
              </h4>

              <textarea
                value={moderatorNotes}
                onChange={(e) => setModeratorNotes(e.target.value)}
                placeholder="Add moderator notes (optional for approval, required for rejection)..."
                style={{
                  width: '100%',
                  padding: DISPLAY_TOKENS.spacing.sm,
                  border: `1px solid ${DISPLAY_TOKENS.colors.border}`,
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  resize: 'vertical',
                  marginBottom: DISPLAY_TOKENS.spacing.md,
                  minHeight: '80px'
                }}
              />

              <div style={{ display: 'flex', gap: DISPLAY_TOKENS.spacing.md }}>
                <button
                  onClick={() => onApprove(contribution.id, moderatorNotes || undefined)}
                  style={{
                    padding: `${DISPLAY_TOKENS.spacing.sm} ${DISPLAY_TOKENS.spacing.lg}`,
                    background: DISPLAY_TOKENS.colors.success,
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  ✓ Approve
                </button>
                <button
                  onClick={() => {
                    if (!moderatorNotes.trim()) {
                      alert('Please provide notes when rejecting a contribution.');
                      return;
                    }
                    onReject(contribution.id, moderatorNotes);
                  }}
                  style={{
                    padding: `${DISPLAY_TOKENS.spacing.sm} ${DISPLAY_TOKENS.spacing.lg}`,
                    background: DISPLAY_TOKENS.colors.danger,
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  ✗ Reject
                </button>
              </div>
            </div>
          )}

          {/* Show moderator notes if any */}
          {contribution.moderatorNotes && (
            <div style={{
              marginTop: DISPLAY_TOKENS.spacing.lg,
              padding: DISPLAY_TOKENS.spacing.lg,
              background: contribution.status === 'approved' ? 'rgba(56, 161, 105, 0.05)' : 'rgba(229, 62, 62, 0.05)',
              borderRadius: '8px',
              border: contribution.status === 'approved' ? 
                `1px solid rgba(56, 161, 105, 0.1)` : 
                `1px solid rgba(229, 62, 62, 0.1)`
            }}>
              <strong style={{ fontSize: '0.9rem' }}>Moderator Notes:</strong>
              <div style={{
                marginTop: DISPLAY_TOKENS.spacing.sm,
                fontSize: '0.85rem',
                color: DISPLAY_TOKENS.colors.text.secondary
              }}>
                {contribution.moderatorNotes}
              </div>
              {contribution.reviewedAt && (
                <div style={{
                  fontSize: '0.7rem',
                  color: DISPLAY_TOKENS.colors.text.tertiary,
                  marginTop: DISPLAY_TOKENS.spacing.sm
                }}>
                  Reviewed: {contribution.reviewedAt.toLocaleDateString()}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function FilterBar({ 
  filters, 
  onFilterChange 
}: { 
  filters: ContributionFilters; 
  onFilterChange: (filters: ContributionFilters) => void;
}) {
  return (
    <div style={{
      background: DISPLAY_TOKENS.colors.background.section,
      padding: DISPLAY_TOKENS.spacing.lg,
      borderRadius: '12px',
      marginBottom: DISPLAY_TOKENS.spacing.xl,
      border: `1px solid ${DISPLAY_TOKENS.colors.border}`
    }}>
      <h3 style={{
        margin: `0 0 ${DISPLAY_TOKENS.spacing.lg} 0`,
        fontSize: '1rem',
        fontWeight: '600',
        color: DISPLAY_TOKENS.colors.text.primary
      }}>
        🔍 Filter Contributions
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: DISPLAY_TOKENS.spacing.lg
      }}>
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: '600',
            color: DISPLAY_TOKENS.colors.text.secondary,
            marginBottom: DISPLAY_TOKENS.spacing.xs
          }}>
            Status
          </label>
          <select
            multiple
            value={filters.status || []}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map(option => option.value as ContributionStatus);
              onFilterChange({ ...filters, status: selected });
            }}
            style={{
              width: '100%',
              padding: DISPLAY_TOKENS.spacing.sm,
              border: `1px solid ${DISPLAY_TOKENS.colors.border}`,
              borderRadius: '6px',
              fontSize: '0.85rem'
            }}
          >
            <option value="pending">Pending</option>
            <option value="under-review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div>
          <label style={{
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: '600',
            color: DISPLAY_TOKENS.colors.text.secondary,
            marginBottom: DISPLAY_TOKENS.spacing.xs
          }}>
            Type
          </label>
          <select
            multiple
            value={filters.type || []}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map(option => option.value as ContributionType);
              onFilterChange({ ...filters, type: selected });
            }}
            style={{
              width: '100%',
              padding: DISPLAY_TOKENS.spacing.sm,
              border: `1px solid ${DISPLAY_TOKENS.colors.border}`,
              borderRadius: '6px',
              fontSize: '0.85rem'
            }}
          >
            <option value="add-paper">Add Paper</option>
            <option value="edit-summary">Edit Summary</option>
            <option value="flag-methodology">Flag Issue</option>
            <option value="suggest-topic">New Topic</option>
          </select>
        </div>

        <div>
          <label style={{
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: '600',
            color: DISPLAY_TOKENS.colors.text.secondary,
            marginBottom: DISPLAY_TOKENS.spacing.xs
          }}>
            Priority
          </label>
          <select
            multiple
            value={filters.priority || []}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map(option => option.value as 'low' | 'medium' | 'high');
              onFilterChange({ ...filters, priority: selected });
            }}
            style={{
              width: '100%',
              padding: DISPLAY_TOKENS.spacing.sm,
              border: `1px solid ${DISPLAY_TOKENS.colors.border}`,
              borderRadius: '6px',
              fontSize: '0.85rem'
            }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default function ContributionsDisplay({ 
  contributions, 
  onApprove, 
  onReject, 
  onAddComment, 
  comments,
  userRole 
}: ContributionsDisplayProps) {
  const [filters, setFilters] = useState<ContributionFilters>({});
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'status'>('date');

  // Apply filters
  const filteredContributions = contributions.filter(contribution => {
    if (filters.status && filters.status.length > 0 && !filters.status.includes(contribution.status)) {
      return false;
    }
    if (filters.type && filters.type.length > 0 && !filters.type.includes(contribution.type as any)) {
      return false;
    }
    if (filters.priority && filters.priority.length > 0 && !filters.priority.includes(contribution.priority || 'medium')) {
      return false;
    }
    if (filters.contributorId && contribution.contributorId !== filters.contributorId) {
      return false;
    }
    if (filters.topicId && contribution.targetTopicId !== filters.topicId) {
      return false;
    }
    return true;
  });

  // Sort contributions
  const sortedContributions = [...filteredContributions].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority || 'medium'] - priorityOrder[a.priority || 'medium'];
      case 'status':
        const statusOrder = { pending: 4, 'under-review': 3, approved: 2, rejected: 1 };
        return (statusOrder as any)[b.status] - (statusOrder as any)[a.status];
      default: // date
        return (b.submittedAt?.getTime() || 0) - (a.submittedAt?.getTime() || 0);
    }
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: DISPLAY_TOKENS.spacing.xl }}>
      <div style={{ marginBottom: DISPLAY_TOKENS.spacing.xxl }}>
        <h2 style={{
          margin: `0 0 ${DISPLAY_TOKENS.spacing.lg} 0`,
          fontSize: '1.75rem',
          fontWeight: '700',
          color: DISPLAY_TOKENS.colors.text.primary
        }}>
          🤝 Community Contributions
        </h2>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: DISPLAY_TOKENS.spacing.lg
        }}>
          <p style={{
            margin: 0,
            fontSize: '1rem',
            color: DISPLAY_TOKENS.colors.text.secondary
          }}>
            {filteredContributions.length} contribution{filteredContributions.length !== 1 ? 's' : ''}
            {filteredContributions.length !== contributions.length && 
              ` (filtered from ${contributions.length})`}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: DISPLAY_TOKENS.spacing.md }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: DISPLAY_TOKENS.colors.text.secondary }}>
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                padding: DISPLAY_TOKENS.spacing.sm,
                border: `1px solid ${DISPLAY_TOKENS.colors.border}`,
                borderRadius: '6px',
                fontSize: '0.85rem'
              }}
            >
              <option value="date">Date</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      </div>

      <FilterBar filters={filters} onFilterChange={setFilters} />

      {sortedContributions.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: `${DISPLAY_TOKENS.spacing.xxl} ${DISPLAY_TOKENS.spacing.xl}`,
          background: DISPLAY_TOKENS.colors.background.card,
          borderRadius: '12px',
          border: `1px solid ${DISPLAY_TOKENS.colors.border}`
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: DISPLAY_TOKENS.spacing.lg }}>📭</div>
          <h3 style={{
            margin: `0 0 ${DISPLAY_TOKENS.spacing.sm} 0`,
            fontSize: '1.25rem',
            fontWeight: '600',
            color: DISPLAY_TOKENS.colors.text.primary
          }}>
            No contributions found
          </h3>
          <p style={{
            margin: 0,
            fontSize: '1rem',
            color: DISPLAY_TOKENS.colors.text.secondary
          }}>
            {contributions.length === 0 
              ? 'No contributions have been submitted yet.'
              : 'Try adjusting your filters to see more contributions.'}
          </p>
        </div>
      ) : (
        <div>
          {sortedContributions.map(contribution => (
            <ContributionCard
              key={contribution.id}
              contribution={contribution}
              onApprove={onApprove}
              onReject={onReject}
              onAddComment={onAddComment}
              comments={comments[contribution.id] || []}
              userRole={userRole}
            />
          ))}
        </div>
      )}
    </div>
  );
}