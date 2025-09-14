import { useState, useEffect } from 'react';
import { useContributionsStore, submitContribution } from '../../store/contributionsStore';
import type { 
  PaperContribution, 
  TopicContribution, 
  PaperContributionType, 
  TopicContributionType 
} from '../../types/contributions';

interface ContributionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: {
    scope: 'paper' | 'topic';
    paperId?: string;
    topicId?: string;
    paperTitle?: string;
    topicTitle?: string;
    type?: string;
  };
}

interface FormData {
  // Common fields
  description: string;
  tags: string[];
  
  // Paper-specific fields
  type?: string;
  proposedTopicTitle?: string;
  
  // Topic-specific fields
  title?: string;
  rationale?: string;
}

const initialFormData: FormData = {
  description: '',
  tags: [],
  type: undefined,
  proposedTopicTitle: '',
  title: '',
  rationale: ''
};

export default function ContributionDrawer({ isOpen, onClose, config }: ContributionDrawerProps) {
  const { addContribution } = useContributionsStore();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState('');

  // Reset form when drawer opens/closes or config changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...initialFormData,
        type: config.type || (config.scope === 'paper' ? 'methodology-detail' : 'new-topic')
      });
      setErrors({});
      setTagInput('');
    }
  }, [isOpen, config]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (config.scope === 'paper') {
      if (!formData.type) {
        newErrors.type = 'Contribution type is required';
      }
      if (formData.type === 'proposed-topic' && !formData.proposedTopicTitle?.trim()) {
        newErrors.proposedTopicTitle = 'Proposed topic title is required';
      }
    } else {
      if (!formData.title?.trim()) {
        newErrors.title = 'Topic title is required';
      }
      if (!formData.rationale?.trim()) {
        newErrors.rationale = 'Rationale is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      let contribution: PaperContribution | TopicContribution;

      if (config.scope === 'paper') {
        contribution = {
          scope: 'paper',
          paperId: config.paperId!,
          type: formData.type! as PaperContributionType,
          description: formData.description,
          tags: formData.tags,
          proposedTopicTitle: formData.proposedTopicTitle
        } as PaperContribution;
      } else {
        contribution = {
          scope: 'topic',
          topicId: config.topicId,
          type: formData.type as TopicContributionType,
          title: formData.title,
          rationale: formData.rationale!,
          tags: formData.tags
        } as TopicContribution;
      }

      const submittedContribution = await submitContribution(contribution);
      addContribution(submittedContribution);
      
      // Show success toast (in a real app, you'd use a proper toast library)
      alert('Contribution submitted successfully!');
      
      onClose();
    } catch (error) {
      console.error('Error submitting contribution:', error);
      setErrors({ submit: 'Failed to submit contribution. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      handleTagAdd();
    }
  };

  if (!isOpen) return null;

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
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: '1px solid #e8e2d5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#2c3e50'
            }}>
              {config.scope === 'paper' ? '🤝 Contribute to Paper' : '💡 Suggest New Topic'}
            </h2>
            <div style={{
              marginTop: '0.5rem',
              fontSize: '0.9rem',
              color: '#4a5568'
            }}>
              {config.scope === 'paper' ? (
                <span style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: 'rgba(74, 144, 226, 0.1)',
                  color: '#4a90e2',
                  borderRadius: '12px',
                  fontWeight: '500'
                }}>
                  📄 {config.paperTitle || `Paper #${config.paperId}`}
                </span>
              ) : config.topicId ? (
                <span style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: 'rgba(56, 161, 105, 0.1)',
                  color: '#38a169',
                  borderRadius: '12px',
                  fontWeight: '500'
                }}>
                  🧬 {config.topicTitle || `Topic #${config.topicId}`}
                </span>
              ) : (
                <span style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: 'rgba(139, 157, 195, 0.1)',
                  color: '#8b9dc3',
                  borderRadius: '12px',
                  fontWeight: '500'
                }}>
                  💡 New Topic Suggestion
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              color: '#8b9dc3',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(139, 157, 195, 0.1)';
              e.currentTarget.style.color = '#4a5568';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#8b9dc3';
            }}
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{
          padding: '2rem',
          flex: 1,
          overflow: 'auto'
        }}>
          {config.scope === 'paper' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#2c3e50',
                marginBottom: '0.5rem'
              }}>
                Contribution Type *
              </label>
              <select
                value={formData.type || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e8e2d5',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  backgroundColor: '#ffffff',
                  color: '#2c3e50'
                }}
              >
                <option value="">Select contribution type</option>
                <option value="methodology-detail">🔬 Add Methodology Details</option>
                <option value="correction">✏️ Suggest Corrections</option>
                <option value="proposed-topic">🏷️ Propose New Topic</option>
              </select>
              {errors.type && (
                <div style={{ color: '#e53e3e', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  {errors.type}
                </div>
              )}
            </div>
          )}

          {config.scope === 'topic' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#2c3e50',
                marginBottom: '0.5rem'
              }}>
                Topic Title *
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter a clear, descriptive title for the topic"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e8e2d5',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  backgroundColor: '#ffffff',
                  color: '#2c3e50'
                }}
              />
              {errors.title && (
                <div style={{ color: '#e53e3e', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  {errors.title}
                </div>
              )}
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#2c3e50',
              marginBottom: '0.5rem'
            }}>
              {config.scope === 'paper' ? 'Description *' : 'Rationale *'}
            </label>
            <textarea
              value={config.scope === 'paper' ? formData.description : formData.rationale || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                [config.scope === 'paper' ? 'description' : 'rationale']: e.target.value 
              }))}
              placeholder={
                config.scope === 'paper' 
                  ? 'Describe the methodology details, corrections, or proposed topic...'
                  : 'Explain why this topic is important and what knowledge gap it addresses...'
              }
              rows={4}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e8e2d5',
                borderRadius: '8px',
                fontSize: '0.9rem',
                backgroundColor: '#ffffff',
                color: '#2c3e50',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
            {errors.description && (
              <div style={{ color: '#e53e3e', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {errors.description}
              </div>
            )}
            {errors.rationale && (
              <div style={{ color: '#e53e3e', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {errors.rationale}
              </div>
            )}
          </div>

          {formData.type === 'proposed-topic' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#2c3e50',
                marginBottom: '0.5rem'
              }}>
                Proposed Topic Title *
              </label>
              <input
                type="text"
                value={formData.proposedTopicTitle || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, proposedTopicTitle: e.target.value }))}
                placeholder="Enter the title for the proposed topic"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e8e2d5',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  backgroundColor: '#ffffff',
                  color: '#2c3e50'
                }}
              />
              {errors.proposedTopicTitle && (
                <div style={{ color: '#e53e3e', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  {errors.proposedTopicTitle}
                </div>
              )}
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#2c3e50',
              marginBottom: '0.5rem'
            }}>
              Tags (optional)
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a tag and press Enter"
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '2px solid #e8e2d5',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  backgroundColor: '#ffffff',
                  color: '#2c3e50'
                }}
              />
              <button
                type="button"
                onClick={handleTagAdd}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#4a90e2',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Add
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.25rem 0.75rem',
                      backgroundColor: 'rgba(74, 144, 226, 0.1)',
                      color: '#4a90e2',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '500'
                    }}
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#4a90e2',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        padding: '0',
                        marginLeft: '0.25rem'
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {errors.submit && (
            <div style={{
              padding: '0.75rem',
              backgroundColor: '#fed7d7',
              color: '#c53030',
              borderRadius: '8px',
              fontSize: '0.9rem',
              marginBottom: '1.5rem'
            }}>
              {errors.submit}
            </div>
          )}

          {/* Footer */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
            paddingTop: '1.5rem',
            borderTop: '1px solid #e8e2d5'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'transparent',
                color: '#4a5568',
                border: '1px solid #e8e2d5',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: isSubmitting ? '#8b9dc3' : '#4a90e2',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Contribution'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
