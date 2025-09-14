import { useState } from 'react';
import ContributionsDisplay from './ContributionsDisplay';
import ContributionForm from './ContributionForm';
import { sampleContributions, sampleComments } from '../data/sampleContributions';
import { sampleScientificTopics } from '../data/sampleTopics';
import type { 
  Contribution, 
  ContributionComment,
  ContributionType,
  AnyContributionFormData
} from '../types/contributions';

interface ContributionsPageProps {
  contributionType?: ContributionType;
  targetTopicId?: string;
}

export default function ContributionsPage({ 
  contributionType, 
  targetTopicId 
}: ContributionsPageProps) {
  const [contributions, setContributions] = useState<Contribution[]>(sampleContributions);
  const [comments, setComments] = useState<Record<string, ContributionComment[]>>(sampleComments);
  const [showForm, setShowForm] = useState<ContributionType | null>(contributionType || null);
  const [currentUserRole] = useState<'researcher' | 'moderator' | 'admin'>('moderator'); // For demo

  const handleApprove = (contributionId: string, moderatorNotes?: string) => {
    setContributions(prev => 
      prev.map(c => 
        c.id === contributionId 
          ? { 
              ...c, 
              status: 'approved' as const,
              moderatorNotes,
              reviewedAt: new Date(),
              moderatorId: 'current-user'
            }
          : c
      )
    );
  };

  const handleReject = (contributionId: string, moderatorNotes: string) => {
    setContributions(prev => 
      prev.map(c => 
        c.id === contributionId 
          ? { 
              ...c, 
              status: 'rejected' as const,
              moderatorNotes,
              reviewedAt: new Date(),
              moderatorId: 'current-user'
            }
          : c
      )
    );
  };

  const handleAddComment = (contributionId: string, content: string) => {
    const newComment: ContributionComment = {
      id: `comment-${Date.now()}`,
      contributionId,
      contributorId: 'current-user',
      contributor: {
        id: 'current-user',
        name: 'Current User',
        email: 'user@example.com',
        role: currentUserRole,
        expertise: ['General'],
        joinDate: new Date(),
        contributionCount: 0,
        reputation: 4.5
      },
      content,
      timestamp: new Date(),
      isModeratorComment: currentUserRole === 'moderator' || currentUserRole === 'admin'
    };

    setComments(prev => ({
      ...prev,
      [contributionId]: [...(prev[contributionId] || []), newComment]
    }));
  };

  const handleFormSubmit = (formData: AnyContributionFormData) => {
    // Create a new contribution from form data
    const baseContribution = {
      id: `contribution-${Date.now()}`,
      scope: 'paper' as const,
      paperId: 'paper-1',
      contributorId: 'current-user',
      contributor: {
        id: 'current-user',
        name: formData.contributorInfo.name,
        email: formData.contributorInfo.email,
        institution: formData.contributorInfo.institution,
        orcid: formData.contributorInfo.orcid,
        role: 'researcher',
        expertise: formData.contributorInfo.expertise,
        joinDate: new Date(),
        contributionCount: 1,
        reputation: 4.0
      },
      targetTopicId: formData.targetTopicId,
      targetTopic: formData.targetTopicId ? 
        sampleScientificTopics.find(t => t.id === formData.targetTopicId) : 
        undefined,
      status: 'pending' as const,
      submittedAt: new Date(),
      lastModified: new Date(),
      createdAt: new Date(),
      tags: [],
      priority: 'medium' as const
    };

    let newContribution: Contribution;

    switch (formData.type) {
      case 'add-paper':
        newContribution = {
          ...baseContribution,
          type: 'add-paper',
          data: formData.paper
        } as any;
        break;
      case 'edit-summary':
        newContribution = {
          ...baseContribution,
          type: 'edit-summary',
          data: formData.edit
        } as any;
        break;
      case 'flag-methodology':
        newContribution = {
          ...baseContribution,
          type: 'flag-methodology',
          data: formData.flag
        } as any;
        break;
      case 'suggest-topic':
        newContribution = {
          ...baseContribution,
          type: 'suggest-topic',
          data: formData.topic
        } as any;
        break;
      case 'add-methodology-details':
        newContribution = {
          ...baseContribution,
          type: 'add-methodology-details',
          data: formData.methodologyDetails
        } as any;
        break;
      case 'correct-paper-info':
        newContribution = {
          ...baseContribution,
          type: 'correct-paper-info',
          data: formData.paperCorrection
        } as any;
        break;
      case 'suggest-paper-topics':
        newContribution = {
          ...baseContribution,
          type: 'suggest-paper-topics',
          data: formData.paperTopicSuggestion
        } as any;
        break;
      default:
        return;
    }

    setContributions(prev => [newContribution, ...prev]);
    setShowForm(null);
    
    // Show success message
    alert(`Your ${formData.type.replace('-', ' ')} contribution has been submitted and is pending review.`);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '2rem',
            fontWeight: '700',
            color: '#2c3e50',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            🤝 Community Contributions
          </h1>
          
          {!showForm && (
            <button
              onClick={() => setShowForm('add-paper')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                background: '#4a90e2',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#357abd';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#4a90e2';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              ➕ New Contribution
            </button>
          )}
        </div>

        <p style={{
          margin: 0,
          fontSize: '1.1rem',
          color: '#4a5568',
          lineHeight: '1.6'
        }}>
          {showForm ? (
            'Submit a new contribution to help improve our scientific knowledge base.'
          ) : (
            'Review and manage community contributions to scientific topics. Help researchers collaborate and improve evidence quality.'
          )}
        </p>
      </div>

      {/* Quick Stats */}
      {!showForm && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {[
            { label: 'Pending', value: contributions.filter(c => c.status === 'pending').length, color: '#8b9dc3' },
            { label: 'Under Review', value: contributions.filter(c => c.status === 'under-review').length, color: '#dd6b20' },
            { label: 'Approved', value: contributions.filter(c => c.status === 'approved').length, color: '#38a169' },
            { label: 'Rejected', value: contributions.filter(c => c.status === 'rejected').length, color: '#e53e3e' }
          ].map(stat => (
            <div
              key={stat.label}
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #faf8f3 100%)',
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
      )}

      {/* Form or Display */}
      {showForm ? (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <button
              onClick={() => setShowForm(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'transparent',
                border: '1px solid #e8e2d5',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#4a5568',
                cursor: 'pointer'
              }}
            >
              ← Back to Contributions
            </button>
          </div>

          <ContributionForm
            initialType={showForm}
            initialTopicId={targetTopicId}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(null)}
          />
        </div>
      ) : (
        <>
          {/* Contribution Type Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            padding: '1rem',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #f1f3f4 100%)',
            borderRadius: '12px',
            border: '1px solid #e8e2d5'
          }}>
            <span style={{
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#2c3e50',
              display: 'flex',
              alignItems: 'center'
            }}>
              Quick Actions:
            </span>
            {[
              { type: 'add-paper' as ContributionType, icon: '📄', label: 'Suggest Paper' },
              { type: 'edit-summary' as ContributionType, icon: '✏️', label: 'Edit Summary' },
              { type: 'flag-methodology' as ContributionType, icon: '⚠️', label: 'Flag Issue' },
              { type: 'suggest-topic' as ContributionType, icon: '💡', label: 'New Topic' },
              { type: 'add-methodology-details' as ContributionType, icon: '🔬', label: 'Add Methods' },
              { type: 'correct-paper-info' as ContributionType, icon: '✏️', label: 'Correct Paper' },
              { type: 'suggest-paper-topics' as ContributionType, icon: '🏷️', label: 'Paper Topics' }
            ].map(({ type, icon, label }) => (
              <button
                key={type}
                onClick={() => setShowForm(type)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: '#ffffff',
                  border: '1px solid #e8e2d5',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  color: '#4a5568',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#4a90e2';
                  e.currentTarget.style.color = '#4a90e2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e8e2d5';
                  e.currentTarget.style.color = '#4a5568';
                }}
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </div>

          <ContributionsDisplay
            contributions={contributions}
            onApprove={handleApprove}
            onReject={handleReject}
            onAddComment={handleAddComment}
            comments={comments}
            userRole={currentUserRole}
          />
        </>
      )}
    </div>
  );
}