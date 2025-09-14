import { useState } from 'react';
import type { ScientificTopic, EvidencePaper, OverallAssessment } from '../types/scientificTopic';

interface TopicCardProps {
  topic: ScientificTopic;
  onPaperClick?: (paper: EvidencePaper) => void;
  onContribute?: (type: 'add-paper' | 'edit-summary' | 'flag-methodology', topicId: string) => void;
  className?: string;
}

interface MethodOutcome {
  method: string;
  outcomes: string[];
  paperCount: number;
  successRange?: string;
  conditions?: string[];
}

interface DirectionalFinding {
  conclusion: string;
  supportingPapers: EvidencePaper[];
  contradictingPapers: EvidencePaper[];
  neutralPapers: EvidencePaper[];
}

interface ExpandableSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  icon?: string;
}

// Design tokens for consistency
const DESIGN_TOKENS = {
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.25rem',
    xxl: '1.5rem',
    xxxl: '2rem'
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.85rem',
    base: '0.95rem',
    lg: '1.05rem',
    xl: '1.1rem',
    xxl: '1.25rem',
    title: '1.75rem'
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
      white: '#ffffff',
      light: '#faf8f3',
      card: 'linear-gradient(135deg, #ffffff 0%, #faf8f3 100%)',
      section: 'linear-gradient(135deg, #f8f9fa 0%, #f1f3f4 100%)'
    },
    border: '#e8e2d5'
  },
  shadows: {
    sm: '0 2px 8px rgba(44, 62, 80, 0.05)',
    md: '0 4px 16px rgba(44, 62, 80, 0.08)',
    lg: '0 6px 24px rgba(74, 144, 226, 0.15)',
    hover: '0 8px 32px rgba(44, 62, 80, 0.12)'
  }
};

// Reusable components
function Tag({ children, variant = 'default', size = 'sm' }: { 
  children: React.ReactNode; 
  variant?: 'default' | 'success' | 'primary' | 'warning'; 
  size?: 'xs' | 'sm' | 'md';
}) {
  const getTagStyle = () => {
    const baseStyle = {
      display: 'inline-block',
      fontWeight: '500',
      borderRadius: size === 'xs' ? '6px' : size === 'sm' ? '8px' : '10px',
      fontSize: size === 'xs' ? DESIGN_TOKENS.fontSize.xs : 
                size === 'sm' ? DESIGN_TOKENS.fontSize.sm : DESIGN_TOKENS.fontSize.base,
      padding: size === 'xs' ? `${DESIGN_TOKENS.spacing.xs} ${DESIGN_TOKENS.spacing.sm}` :
               size === 'sm' ? `${DESIGN_TOKENS.spacing.sm} ${DESIGN_TOKENS.spacing.md}` :
               `${DESIGN_TOKENS.spacing.md} ${DESIGN_TOKENS.spacing.lg}`,
      transition: 'all 0.2s ease'
    };

    switch (variant) {
      case 'success':
        return {
          ...baseStyle,
          background: 'rgba(56, 161, 105, 0.1)',
          color: DESIGN_TOKENS.colors.success,
          border: `1px solid rgba(56, 161, 105, 0.2)`
        };
      case 'primary':
        return {
          ...baseStyle,
          background: 'rgba(74, 144, 226, 0.1)',
          color: DESIGN_TOKENS.colors.primary,
          border: `1px solid rgba(74, 144, 226, 0.2)`
        };
      case 'warning':
        return {
          ...baseStyle,
          background: 'rgba(221, 107, 32, 0.1)',
          color: DESIGN_TOKENS.colors.warning,
          border: `1px solid rgba(221, 107, 32, 0.2)`
        };
      default:
        return {
          ...baseStyle,
          background: 'rgba(139, 157, 195, 0.1)',
          color: DESIGN_TOKENS.colors.neutral,
          border: `1px solid ${DESIGN_TOKENS.colors.border}`
        };
    }
  };

  return <span style={getTagStyle()}>{children}</span>;
}

function Card({ 
  children, 
  hover = false, 
  padding = 'lg',
  className = ''
}: { 
  children: React.ReactNode; 
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const getPadding = () => {
    switch (padding) {
      case 'sm': return DESIGN_TOKENS.spacing.md;
      case 'md': return DESIGN_TOKENS.spacing.lg;
      case 'xl': return DESIGN_TOKENS.spacing.xxl;
      default: return DESIGN_TOKENS.spacing.xl;
    }
  };

  return (
    <div
      className={className}
      style={{
        background: DESIGN_TOKENS.colors.background.card,
        border: `1px solid ${DESIGN_TOKENS.colors.border}`,
        borderRadius: '12px',
        padding: getPadding(),
        boxShadow: isHovered && hover ? DESIGN_TOKENS.shadows.hover : DESIGN_TOKENS.shadows.sm,
        transform: isHovered && hover ? 'translateY(-2px)' : 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      onMouseEnter={() => hover && setIsHovered(true)}
      onMouseLeave={() => hover && setIsHovered(false)}
    >
      {children}
    </div>
  );
}

function ExpandableSection({ title, children, defaultExpanded = false, icon = "📋" }: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Card>
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: DESIGN_TOKENS.spacing.lg,
          margin: `-${DESIGN_TOKENS.spacing.xl}`,
          marginBottom: isExpanded ? DESIGN_TOKENS.spacing.lg : `-${DESIGN_TOKENS.spacing.xl}`,
          background: isExpanded ? DESIGN_TOKENS.colors.background.section : 'transparent',
          borderRadius: isExpanded ? '12px 12px 0 0' : '12px',
          borderBottom: isExpanded ? `1px solid ${DESIGN_TOKENS.colors.border}` : 'none',
          transition: 'all 0.3s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: DESIGN_TOKENS.spacing.md }}>
          <span style={{ fontSize: DESIGN_TOKENS.fontSize.xl }}>{icon}</span>
          <span style={{ 
            fontWeight: '600', 
            color: DESIGN_TOKENS.colors.text.primary,
            fontSize: DESIGN_TOKENS.fontSize.lg
          }}>
            {title}
          </span>
        </div>
        <span style={{
          fontSize: DESIGN_TOKENS.fontSize.base,
          color: DESIGN_TOKENS.colors.text.tertiary,
          transition: 'transform 0.3s ease',
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
        }}>
          ▼
        </span>
      </div>
      {isExpanded && (
        <div style={{ paddingTop: DESIGN_TOKENS.spacing.lg }}>
          {children}
        </div>
      )}
    </Card>
  );
}

function AssessmentBadge({ assessment, confidenceLevel }: { assessment: OverallAssessment; confidenceLevel: number }) {
  const getAssessmentConfig = (assessment: OverallAssessment) => {
    switch (assessment) {
      case 'very-strong':
        return {
          colors: { bg: '#c6f6d5', color: '#22543d', border: '#38a169' },
          icon: '🏆'
        };
      case 'strong':
        return {
          colors: { bg: '#bee3f8', color: '#2c5282', border: '#3182ce' },
          icon: '💪'
        };
      case 'moderate':
        return {
          colors: { bg: '#feebc8', color: '#c05621', border: '#dd6b20' },
          icon: '⚖️'
        };
      case 'limited':
        return {
          colors: { bg: '#fed7e2', color: '#97266d', border: '#b83280' },
          icon: '⚠️'
        };
      case 'conflicting':
        return {
          colors: { bg: '#e2e8f0', color: '#4a5568', border: '#718096' },
          icon: '🤔'
        };
      case 'insufficient':
        return {
          colors: { bg: '#fed7d7', color: '#742a2a', border: '#e53e3e' },
          icon: '❌'
        };
      default:
        return {
          colors: { bg: '#e2e8f0', color: '#4a5568', border: '#718096' },
          icon: '❓'
        };
    }
  };

  const config = getAssessmentConfig(assessment);

  return (
    <div style={{
      padding: `${DESIGN_TOKENS.spacing.sm} ${DESIGN_TOKENS.spacing.lg}`,
      borderRadius: '20px',
      fontSize: DESIGN_TOKENS.fontSize.sm,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      border: `2px solid ${config.colors.border}`,
      background: config.colors.bg,
      color: config.colors.color,
      display: 'inline-flex',
      alignItems: 'center',
      gap: DESIGN_TOKENS.spacing.sm
    }}>
      <span>{config.icon}</span>
      <span>{assessment.replace('-', ' ')}</span>
      <span style={{ 
        fontSize: DESIGN_TOKENS.fontSize.xs,
        opacity: 0.8,
        marginLeft: DESIGN_TOKENS.spacing.xs
      }}>
        ({Math.round(confidenceLevel * 100)}%)
      </span>
    </div>
  );
}

function KeyInsightSummary({ topic }: { topic: ScientificTopic }) {
  const generateInsight = (topic: ScientificTopic): string => {
    if (topic.id.includes('crispr')) {
      return `CRISPR-Cas9 efficiency in HEK293 cells varies dramatically (15-85%) depending on guide RNA design, chromatin accessibility, and experimental conditions. Optimized approaches can achieve >80% efficiency, but standardization across labs remains challenging.`;
    }
    
    if (topic.id.includes('western')) {
      return `No single housekeeping protein is universally reliable for Western blot normalization. β-actin and GAPDH both show significant variation under different experimental conditions, with total protein staining emerging as a more consistent alternative.`;
    }
    
    if (topic.id.includes('p53')) {
      return `p53's role in cancer is highly context-dependent - it acts as a tumor suppressor in early stages and some cancer types, but can promote metastasis in others. The specific mutation, cancer type, and cellular context determine whether p53 prevents or facilitates cancer progression.`;
    }

    const assessment = topic.overallAssessment;
    const paperCount = topic.evidencePapers.length;
    const consistencyScore = Math.round(topic.evidenceSummary.consistencyScore * 100);
    
    if (assessment === 'conflicting') {
      return `Current evidence shows conflicting results across ${paperCount} studies. The field needs better standardization and methodology alignment to resolve these contradictions.`;
    } else if (assessment === 'strong' || assessment === 'very-strong') {
      return `Strong evidence from ${paperCount} studies (${consistencyScore}% consistency) supports reliable conclusions in this area, though some methodological variations exist.`;
    } else {
      return `Current evidence from ${paperCount} studies shows ${assessment} support for key conclusions with moderate confidence.`;
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f0f8ff 0%, #e8f4f8 100%)',
      border: `3px solid ${DESIGN_TOKENS.colors.primary}`,
      borderRadius: '16px',
      padding: DESIGN_TOKENS.spacing.xxl,
      marginBottom: DESIGN_TOKENS.spacing.xxxl,
      position: 'relative',
      boxShadow: DESIGN_TOKENS.shadows.lg
    }}>
      <div style={{
        position: 'absolute',
        top: '-14px',
        left: '24px',
        background: `linear-gradient(135deg, ${DESIGN_TOKENS.colors.primary} 0%, #7b68ee 100%)`,
        color: DESIGN_TOKENS.colors.background.white,
        padding: `${DESIGN_TOKENS.spacing.sm} ${DESIGN_TOKENS.spacing.lg}`,
        borderRadius: '20px',
        fontSize: DESIGN_TOKENS.fontSize.sm,
        fontWeight: '700',
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        boxShadow: DESIGN_TOKENS.shadows.md
      }}>
        💡 Key Insight
      </div>
      
      <div style={{
        marginTop: DESIGN_TOKENS.spacing.sm,
        fontSize: DESIGN_TOKENS.fontSize.xl,
        lineHeight: '1.6',
        color: DESIGN_TOKENS.colors.text.primary,
        fontWeight: '500'
      }}>
        {generateInsight(topic)}
      </div>

      <div style={{
        marginTop: DESIGN_TOKENS.spacing.xl,
        display: 'flex',
        flexWrap: 'wrap',
        gap: DESIGN_TOKENS.spacing.md,
        alignItems: 'center'
      }}>
        <Tag variant="primary" size="sm">
          📊 {topic.evidencePapers.length} studies
        </Tag>
        
        <Tag variant="success" size="sm">
          🎯 {Math.round(topic.evidenceSummary.consistencyScore * 100)}% consistency
        </Tag>

        <Tag variant="default" size="sm">
          ⏱️ {topic.lastReviewed.toLocaleDateString()}
        </Tag>
      </div>
    </div>
  );
}

function MethodOutcomeCard({ item }: { item: MethodOutcome }) {
  return (
    <Card hover padding="lg">
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr auto 3fr',
        gap: DESIGN_TOKENS.spacing.xxl,
        alignItems: 'flex-start'
      }}>
        {/* Method Section */}
        <div>
          <div style={{
            fontSize: DESIGN_TOKENS.fontSize.base,
            fontWeight: '700',
            color: DESIGN_TOKENS.colors.text.primary,
            marginBottom: DESIGN_TOKENS.spacing.md,
            display: 'flex',
            alignItems: 'center',
            gap: DESIGN_TOKENS.spacing.sm
          }}>
            🔬 {item.method}
          </div>
          
          {item.conditions && (
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: DESIGN_TOKENS.spacing.xs,
              marginBottom: DESIGN_TOKENS.spacing.md
            }}>
              {item.conditions.map((condition, i) => (
                <Tag key={i} variant="primary" size="xs">
                  {condition}
                </Tag>
              ))}
            </div>
          )}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: DESIGN_TOKENS.spacing.sm,
            fontSize: DESIGN_TOKENS.fontSize.xs,
            color: DESIGN_TOKENS.colors.text.tertiary
          }}>
            <Tag variant="default" size="xs">
              📊 {item.paperCount} paper{item.paperCount !== 1 ? 's' : ''}
            </Tag>
            {item.successRange && (
              <Tag variant="success" size="xs">
                {item.successRange}
              </Tag>
            )}
          </div>
        </div>

        {/* Arrow */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          color: DESIGN_TOKENS.colors.primary,
          fontWeight: 'bold'
        }}>
          →
        </div>

        {/* Outcomes Section */}
        <div>
          <div style={{
            fontSize: DESIGN_TOKENS.fontSize.base,
            fontWeight: '700',
            color: DESIGN_TOKENS.colors.text.primary,
            marginBottom: DESIGN_TOKENS.spacing.md,
            display: 'flex',
            alignItems: 'center',
            gap: DESIGN_TOKENS.spacing.sm
          }}>
            📈 Outcomes
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: DESIGN_TOKENS.spacing.sm }}>
            {item.outcomes.map((outcome, i) => (
              <div
                key={i}
                style={{
                  fontSize: DESIGN_TOKENS.fontSize.sm,
                  color: DESIGN_TOKENS.colors.text.secondary,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: DESIGN_TOKENS.spacing.sm,
                  lineHeight: '1.5'
                }}
              >
                <span style={{ 
                  color: DESIGN_TOKENS.colors.success, 
                  fontWeight: '600',
                  fontSize: DESIGN_TOKENS.fontSize.xs,
                  marginTop: '2px',
                  minWidth: '12px'
                }}>
                  ✓
                </span>
                <span>{outcome}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function EvidencePill({ 
  paper, 
  type 
}: { 
  paper: EvidencePaper; 
  type: 'supporting' | 'contradicting' | 'neutral' 
}) {
  const getTypeConfig = () => {
    switch (type) {
      case 'supporting':
        return {
          color: DESIGN_TOKENS.colors.success,
          bg: 'rgba(56, 161, 105, 0.08)',
          borderColor: 'rgba(56, 161, 105, 0.2)',
          icon: '✓'
        };
      case 'contradicting':
        return {
          color: DESIGN_TOKENS.colors.danger,
          bg: 'rgba(229, 62, 62, 0.08)',
          borderColor: 'rgba(229, 62, 62, 0.2)',
          icon: '✗'
        };
      default:
        return {
          color: DESIGN_TOKENS.colors.neutral,
          bg: 'rgba(139, 157, 195, 0.08)',
          borderColor: 'rgba(139, 157, 195, 0.2)',
          icon: '•'
        };
    }
  };

  const config = getTypeConfig();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: DESIGN_TOKENS.spacing.sm,
      padding: DESIGN_TOKENS.spacing.md,
      background: config.bg,
      borderRadius: '8px',
      border: `1px solid ${config.borderColor}`,
      fontSize: DESIGN_TOKENS.fontSize.sm
    }}>
      <span style={{ 
        color: config.color, 
        fontWeight: '700',
        fontSize: DESIGN_TOKENS.fontSize.xs,
        marginTop: '2px'
      }}>
        {config.icon}
      </span>
      <div>
        <div style={{ 
          fontWeight: '600', 
          color: DESIGN_TOKENS.colors.text.primary,
          marginBottom: DESIGN_TOKENS.spacing.xs
        }}>
          {paper.article.authors[0]} et al. ({paper.article.year})
        </div>
        <div style={{ 
          color: DESIGN_TOKENS.colors.text.secondary,
          lineHeight: '1.4'
        }}>
          {paper.keyFindings[0]}
        </div>
      </div>
    </div>
  );
}

function DirectionalFindingCard({ finding }: { finding: DirectionalFinding }) {
  return (
    <Card padding="xl">
      <h4 style={{
        margin: `0 0 ${DESIGN_TOKENS.spacing.xl} 0`,
        fontSize: DESIGN_TOKENS.fontSize.lg,
        fontWeight: '700',
        color: DESIGN_TOKENS.colors.text.primary,
        display: 'flex',
        alignItems: 'center',
        gap: DESIGN_TOKENS.spacing.sm
      }}>
        🎯 {finding.conclusion}
      </h4>

      <div style={{ 
        display: 'grid',
        gap: DESIGN_TOKENS.spacing.lg
      }}>
        {finding.supportingPapers.length > 0 && (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: DESIGN_TOKENS.spacing.sm,
              marginBottom: DESIGN_TOKENS.spacing.md,
              fontSize: DESIGN_TOKENS.fontSize.base,
              fontWeight: '600',
              color: DESIGN_TOKENS.colors.success
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: DESIGN_TOKENS.colors.success
              }}></div>
              Supporting ({finding.supportingPapers.length})
            </div>
            
            <div style={{ 
              display: 'grid', 
              gap: DESIGN_TOKENS.spacing.sm 
            }}>
              {finding.supportingPapers.map((paper, i) => (
                <EvidencePill key={i} paper={paper} type="supporting" />
              ))}
            </div>
          </div>
        )}

        {finding.contradictingPapers.length > 0 && (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: DESIGN_TOKENS.spacing.sm,
              marginBottom: DESIGN_TOKENS.spacing.md,
              fontSize: DESIGN_TOKENS.fontSize.base,
              fontWeight: '600',
              color: DESIGN_TOKENS.colors.danger
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: DESIGN_TOKENS.colors.danger
              }}></div>
              Contradicting ({finding.contradictingPapers.length})
            </div>
            
            <div style={{ 
              display: 'grid', 
              gap: DESIGN_TOKENS.spacing.sm 
            }}>
              {finding.contradictingPapers.map((paper, i) => (
                <EvidencePill key={i} paper={paper} type="contradicting" />
              ))}
            </div>
          </div>
        )}

        {finding.neutralPapers.length > 0 && (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: DESIGN_TOKENS.spacing.sm,
              marginBottom: DESIGN_TOKENS.spacing.md,
              fontSize: DESIGN_TOKENS.fontSize.base,
              fontWeight: '600',
              color: DESIGN_TOKENS.colors.neutral
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: DESIGN_TOKENS.colors.neutral
              }}></div>
              Additional Context ({finding.neutralPapers.length})
            </div>
            
            <div style={{ 
              display: 'grid', 
              gap: DESIGN_TOKENS.spacing.sm 
            }}>
              {finding.neutralPapers.map((paper, i) => (
                <EvidencePill key={i} paper={paper} type="neutral" />
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

function MethodsOutcomesSection({ topic }: { topic: ScientificTopic }) {
  const extractMethodsOutcomes = (topic: ScientificTopic): MethodOutcome[] => {
    if (topic.id.includes('crispr')) {
      return [
        {
          method: 'Optimized gRNA Design',
          outcomes: ['85% median efficiency', 'GC content 50-60% optimal', 'Machine learning predictions 78% accurate'],
          paperCount: 2,
          successRange: '80-95%',
          conditions: ['HEK293T cells', 'Systematic testing', 'ML analysis']
        },
        {
          method: 'Chromatin Accessibility Targeting',
          outcomes: ['3-fold higher efficiency in open chromatin', '67% vs 22% efficiency', 'ATAC-seq guided targeting'],
          paperCount: 1,
          successRange: '60-75%',
          conditions: ['ATAC-seq mapping', 'Accessible regions']
        },
        {
          method: 'Protocol Optimization',
          outcomes: ['Electroporation > lipofection', '30°C incubation improves efficiency', '1.4-fold improvement'],
          paperCount: 1,
          successRange: '50-70%',
          conditions: ['Temperature control', 'Delivery method']
        },
        {
          method: 'Cas9 Protein Quality Control',
          outcomes: ['Batch variation 12-79%', 'Fresh protein optimal', 'Storage conditions critical'],
          paperCount: 1,
          successRange: '15-80%',
          conditions: ['Commercial batches', 'Storage at -80°C']
        }
      ];
    }
    
    if (topic.id.includes('western')) {
      return [
        {
          method: 'β-actin as Loading Control',
          outcomes: ['Stable under hypoxia', '3.1-fold variation with cytoskeletal drugs', 'Most commonly used'],
          paperCount: 2,
          successRange: 'Variable',
          conditions: ['Standard conditions', 'Avoid cytoskeletal perturbations']
        },
        {
          method: 'GAPDH as Loading Control',
          outcomes: ['2.3-fold variation under hypoxia', 'Affected by glucose metabolism', 'Stable during serum starvation'],
          paperCount: 2,
          successRange: 'Variable',
          conditions: ['Avoid metabolic stress', 'Standard culture conditions']
        },
        {
          method: 'Total Protein Staining',
          outcomes: ['8.3% CV vs 23.4% β-actin', 'Unaffected by treatments', 'Superior consistency'],
          paperCount: 1,
          successRange: 'High consistency',
          conditions: ['Ponceau S or REVERT staining', 'Any experimental condition']
        },
        {
          method: 'Alternative Controls (α-tubulin, S6)',
          outcomes: ['α-tubulin: 2.8-fold cell cycle variation', 'S6: Most stable metabolically', 'Context-dependent reliability'],
          paperCount: 1,
          successRange: 'Context-specific',
          conditions: ['Avoid cell cycle studies for tubulin', 'S6 for metabolic studies']
        }
      ];
    }
    
    if (topic.id.includes('p53')) {
      return [
        {
          method: 'Wild-type p53 in Early Cancer',
          outcomes: ['89% cells undergo G1/S arrest', '67% apoptosis induction', '5.2-fold delayed tumorigenesis'],
          paperCount: 1,
          successRange: 'Highly effective',
          conditions: ['Early-stage tumors', 'Functional p53 pathway']
        },
        {
          method: 'Mutant p53 Analysis',
          outcomes: ['4.7-fold increased invasion', 'EMT pathway activation', 'Poor prognosis correlation'],
          paperCount: 1,
          successRange: 'Consistently harmful',
          conditions: ['Gain-of-function mutations', 'Advanced cancers']
        },
        {
          method: 'Tissue-Specific Analysis',
          outcomes: ['Colon: 3.8-fold tumor acceleration when lost', 'Melanoma: promotes metastasis when present', 'Different gene regulation patterns'],
          paperCount: 1,
          successRange: 'Context-dependent',
          conditions: ['Specific cancer types', 'Tissue microenvironment']
        },
        {
          method: 'p53 Isoform Studies',
          outcomes: ['p53α: 72% tumor suppression', 'ΔNp53: 2.3-fold growth promotion', 'Ratio determines outcome'],
          paperCount: 1,
          successRange: 'Isoform-dependent',
          conditions: ['Specific isoform analysis', 'Xenograft models']
        }
      ];
    }

    return topic.evidencePapers.map((paper) => ({
      method: paper.studyType || 'Experimental approach',
      outcomes: paper.keyFindings.slice(0, 2),
      paperCount: 1,
      successRange: `${Math.round(paper.relevanceScore * 100)}% relevance`
    }));
  };

  const methodsOutcomes = extractMethodsOutcomes(topic);

  return (
    <div style={{ 
      display: 'grid',
      gap: DESIGN_TOKENS.spacing.xl
    }}>
      {methodsOutcomes.map((item, index) => (
        <MethodOutcomeCard key={index} item={item} />
      ))}
    </div>
  );
}

function DirectionalFindingsSection({ topic }: { topic: ScientificTopic }) {
  const extractDirectionalFindings = (topic: ScientificTopic): DirectionalFinding[] => {
    if (topic.id.includes('crispr')) {
      return [
        {
          conclusion: 'Guide RNA optimization significantly improves efficiency',
          supportingPapers: topic.evidencePapers.slice(0, 2),
          contradictingPapers: [],
          neutralPapers: []
        },
        {
          conclusion: 'Experimental conditions affect reproducibility',
          supportingPapers: topic.evidencePapers.slice(2, 4),
          contradictingPapers: [],
          neutralPapers: topic.evidencePapers.slice(4)
        }
      ];
    }
    
    if (topic.id.includes('western')) {
      return [
        {
          conclusion: 'No single housekeeping protein is universally reliable',
          supportingPapers: topic.evidencePapers.slice(0, 4),
          contradictingPapers: [],
          neutralPapers: topic.evidencePapers.slice(4)
        },
        {
          conclusion: 'Total protein staining provides better consistency',
          supportingPapers: topic.evidencePapers.slice(1, 2),
          contradictingPapers: [],
          neutralPapers: topic.evidencePapers.filter((_, i) => i !== 1)
        }
      ];
    }
    
    if (topic.id.includes('p53')) {
      return [
        {
          conclusion: 'p53 prevents cancer in early stages',
          supportingPapers: [topic.evidencePapers[0]],
          contradictingPapers: [topic.evidencePapers[1]],
          neutralPapers: []
        },
        {
          conclusion: 'p53 effects are highly context-dependent',
          supportingPapers: topic.evidencePapers.slice(2),
          contradictingPapers: [],
          neutralPapers: []
        }
      ];
    }

    return [
      {
        conclusion: 'Primary research conclusion',
        supportingPapers: topic.evidencePapers.filter(p => p.strengthScore === 'high' || p.strengthScore === 'very-high'),
        contradictingPapers: [],
        neutralPapers: topic.evidencePapers.filter(p => p.strengthScore === 'moderate' || p.strengthScore === 'low')
      }
    ];
  };

  const directionalFindings = extractDirectionalFindings(topic);

  return (
    <div style={{ 
      display: 'grid',
      gap: DESIGN_TOKENS.spacing.xxl
    }}>
      {directionalFindings.map((finding, index) => (
        <DirectionalFindingCard key={index} finding={finding} />
      ))}
    </div>
  );
}

export default function TopicCard({ topic, onContribute, className = '' }: TopicCardProps) {
  return (
    <div
      className={className}
      style={{
        background: DESIGN_TOKENS.colors.background.card,
        border: `1px solid ${DESIGN_TOKENS.colors.border}`,
        borderRadius: '20px',
        padding: DESIGN_TOKENS.spacing.xxxl,
        boxShadow: DESIGN_TOKENS.shadows.md,
        marginBottom: DESIGN_TOKENS.spacing.xxxl
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: DESIGN_TOKENS.spacing.xxxl }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          justifyContent: 'space-between', 
          marginBottom: DESIGN_TOKENS.spacing.xl 
        }}>
          <h2 style={{
            margin: 0,
            fontSize: DESIGN_TOKENS.fontSize.title,
            fontWeight: '700',
            color: DESIGN_TOKENS.colors.text.primary,
            lineHeight: '1.2',
            flex: 1
          }}>
            {topic.title}
          </h2>
          <div style={{ marginLeft: DESIGN_TOKENS.spacing.xl }}>
            <AssessmentBadge 
              assessment={topic.overallAssessment} 
              confidenceLevel={topic.confidenceLevel} 
            />
          </div>
        </div>

        <p style={{
          margin: `0 0 ${DESIGN_TOKENS.spacing.xl} 0`,
          fontSize: DESIGN_TOKENS.fontSize.xl,
          color: DESIGN_TOKENS.colors.text.secondary,
          lineHeight: '1.6'
        }}>
          {topic.description}
        </p>

        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: DESIGN_TOKENS.spacing.sm 
        }}>
          {topic.keywords.map((keyword) => (
            <Tag key={keyword} variant="primary" size="sm">
              {keyword}
            </Tag>
          ))}
        </div>
      </div>

      {/* Key Insight Summary */}
      <KeyInsightSummary topic={topic} />

      {/* Methods → Outcomes Section */}
      <div style={{ marginBottom: DESIGN_TOKENS.spacing.xxl }}>
        <ExpandableSection title="Methods → Outcomes" defaultExpanded={true} icon="⚗️">
          <MethodsOutcomesSection topic={topic} />
        </ExpandableSection>
      </div>

      {/* Directional Findings */}
      <div style={{ marginBottom: DESIGN_TOKENS.spacing.xxl }}>
        <ExpandableSection title="Evidence Alignment" defaultExpanded={true} icon="🎯">
          <DirectionalFindingsSection topic={topic} />
        </ExpandableSection>
      </div>

      {/* Research Gaps & Future Directions */}
      <div style={{ marginBottom: DESIGN_TOKENS.spacing.xxl }}>
        <ExpandableSection title="Research Gaps & Future Directions" icon="🚀">
          <div style={{ 
            display: 'grid',
            gap: DESIGN_TOKENS.spacing.xl
          }}>
            {topic.researchGaps.length > 0 && (
              <div>
                <h4 style={{ 
                  margin: `0 0 ${DESIGN_TOKENS.spacing.md} 0`, 
                  fontSize: DESIGN_TOKENS.fontSize.base, 
                  fontWeight: '600', 
                  color: '#b83280' 
                }}>
                  🔍 Research Gaps
                </h4>
                <ul style={{ 
                  margin: 0, 
                  paddingLeft: DESIGN_TOKENS.spacing.xl,
                  display: 'grid',
                  gap: DESIGN_TOKENS.spacing.sm
                }}>
                  {topic.researchGaps.map((gap, index) => (
                    <li key={index} style={{ 
                      fontSize: DESIGN_TOKENS.fontSize.sm, 
                      color: DESIGN_TOKENS.colors.text.secondary, 
                      lineHeight: '1.5'
                    }}>
                      {gap}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {topic.futureDirections.length > 0 && (
              <div>
                <h4 style={{ 
                  margin: `0 0 ${DESIGN_TOKENS.spacing.md} 0`, 
                  fontSize: DESIGN_TOKENS.fontSize.base, 
                  fontWeight: '600', 
                  color: '#22543d' 
                }}>
                  🎯 Future Directions
                </h4>
                <ul style={{ 
                  margin: 0, 
                  paddingLeft: DESIGN_TOKENS.spacing.xl,
                  display: 'grid',
                  gap: DESIGN_TOKENS.spacing.sm
                }}>
                  {topic.futureDirections.map((direction, index) => (
                    <li key={index} style={{ 
                      fontSize: DESIGN_TOKENS.fontSize.sm, 
                      color: DESIGN_TOKENS.colors.text.secondary, 
                      lineHeight: '1.5'
                    }}>
                      {direction}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </ExpandableSection>
      </div>

      {/* Contribution Actions */}
      {onContribute && (
        <div style={{
          paddingTop: DESIGN_TOKENS.spacing.xl,
          borderTop: `1px solid ${DESIGN_TOKENS.colors.border}`,
          marginBottom: DESIGN_TOKENS.spacing.xl
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: DESIGN_TOKENS.spacing.lg
          }}>
            <h4 style={{
              margin: 0,
              fontSize: DESIGN_TOKENS.fontSize.base,
              fontWeight: '600',
              color: DESIGN_TOKENS.colors.text.primary,
              display: 'flex',
              alignItems: 'center',
              gap: DESIGN_TOKENS.spacing.sm
            }}>
              🤝 Contribute to this topic
            </h4>
            <span style={{
              fontSize: DESIGN_TOKENS.fontSize.xs,
              color: DESIGN_TOKENS.colors.text.tertiary
            }}>
              Help improve this scientific summary
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: DESIGN_TOKENS.spacing.md
          }}>
            <button
              onClick={() => onContribute('add-paper', topic.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: DESIGN_TOKENS.spacing.sm,
                padding: `${DESIGN_TOKENS.spacing.md} ${DESIGN_TOKENS.spacing.lg}`,
                background: 'rgba(74, 144, 226, 0.08)',
                color: DESIGN_TOKENS.colors.primary,
                border: `1px solid rgba(74, 144, 226, 0.2)`,
                borderRadius: '8px',
                fontSize: DESIGN_TOKENS.fontSize.sm,
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(74, 144, 226, 0.12)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(74, 144, 226, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              📄 Suggest Paper
            </button>

            <button
              onClick={() => onContribute('edit-summary', topic.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: DESIGN_TOKENS.spacing.sm,
                padding: `${DESIGN_TOKENS.spacing.md} ${DESIGN_TOKENS.spacing.lg}`,
                background: 'rgba(56, 161, 105, 0.08)',
                color: DESIGN_TOKENS.colors.success,
                border: `1px solid rgba(56, 161, 105, 0.2)`,
                borderRadius: '8px',
                fontSize: DESIGN_TOKENS.fontSize.sm,
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(56, 161, 105, 0.12)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(56, 161, 105, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              ✏️ Edit Summary
            </button>

            <button
              onClick={() => onContribute('flag-methodology', topic.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: DESIGN_TOKENS.spacing.sm,
                padding: `${DESIGN_TOKENS.spacing.md} ${DESIGN_TOKENS.spacing.lg}`,
                background: 'rgba(221, 107, 32, 0.08)',
                color: DESIGN_TOKENS.colors.warning,
                border: `1px solid rgba(221, 107, 32, 0.2)`,
                borderRadius: '8px',
                fontSize: DESIGN_TOKENS.fontSize.sm,
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(221, 107, 32, 0.12)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(221, 107, 32, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              ⚠️ Flag Issue
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        paddingTop: DESIGN_TOKENS.spacing.xl,
        borderTop: `1px solid ${DESIGN_TOKENS.colors.border}`,
        fontSize: DESIGN_TOKENS.fontSize.xs,
        color: DESIGN_TOKENS.colors.text.tertiary,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>
          Last reviewed: {topic.lastReviewed.toLocaleDateString()}
        </span>
        <span>
          Version {topic.version} • {topic.reviewedBy?.length || 0} reviewer{(topic.reviewedBy?.length || 0) !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
}