import { useState } from 'react';
import type { 
  ContributionType, 
  AnyContributionFormData,
  AddPaperFormData,
  EditSummaryFormData,
  FlagMethodologyFormData,
  SuggestTopicFormData,
  AddMethodologyDetailsFormData,
  CorrectPaperInfoFormData,
  SuggestPaperTopicsFormData,
  ScientificTopic
} from '../types/contributions';

interface ContributionFormProps {
  initialType?: ContributionType;
  initialTopicId?: string;
  targetTopic?: ScientificTopic;
  onSubmit: (data: AnyContributionFormData) => void;
  onCancel: () => void;
}

// Design tokens consistent with TopicCard
const FORM_TOKENS = {
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

// Reusable form components
function FormField({ 
  label, 
  children, 
  required = false, 
  error,
  description 
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  error?: string;
  description?: string;
}) {
  return (
    <div style={{ marginBottom: FORM_TOKENS.spacing.xl }}>
      <label style={{
        display: 'block',
        fontSize: '0.9rem',
        fontWeight: '600',
        color: FORM_TOKENS.colors.text.primary,
        marginBottom: FORM_TOKENS.spacing.sm
      }}>
        {label} {required && <span style={{ color: FORM_TOKENS.colors.danger }}>*</span>}
      </label>
      {description && (
        <p style={{
          fontSize: '0.8rem',
          color: FORM_TOKENS.colors.text.tertiary,
          marginBottom: FORM_TOKENS.spacing.sm,
          lineHeight: '1.4'
        }}>
          {description}
        </p>
      )}
      {children}
      {error && (
        <p style={{
          fontSize: '0.8rem',
          color: FORM_TOKENS.colors.danger,
          marginTop: FORM_TOKENS.spacing.sm,
          fontWeight: '500'
        }}>
          {error}
        </p>
      )}
    </div>
  );
}

function Input({ 
  value, 
  onChange, 
  placeholder, 
  type = 'text',
  required = false 
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      style={{
        width: '100%',
        padding: FORM_TOKENS.spacing.md,
        border: `1px solid ${FORM_TOKENS.colors.border}`,
        borderRadius: '8px',
        fontSize: '0.9rem',
        background: '#ffffff',
        transition: 'border-color 0.2s ease',
        outline: 'none'
      }}
      onFocus={(e) => {
        e.target.style.borderColor = FORM_TOKENS.colors.primary;
      }}
      onBlur={(e) => {
        e.target.style.borderColor = FORM_TOKENS.colors.border;
      }}
    />
  );
}

function Textarea({ 
  value, 
  onChange, 
  placeholder, 
  rows = 4,
  required = false 
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      required={required}
      style={{
        width: '100%',
        padding: FORM_TOKENS.spacing.md,
        border: `1px solid ${FORM_TOKENS.colors.border}`,
        borderRadius: '8px',
        fontSize: '0.9rem',
        background: '#ffffff',
        transition: 'border-color 0.2s ease',
        outline: 'none',
        resize: 'vertical',
        fontFamily: 'inherit'
      }}
      onFocus={(e) => {
        e.target.style.borderColor = FORM_TOKENS.colors.primary;
      }}
      onBlur={(e) => {
        e.target.style.borderColor = FORM_TOKENS.colors.border;
      }}
    />
  );
}

function Select({ 
  value, 
  onChange, 
  options, 
  placeholder,
  required = false 
}: {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      style={{
        width: '100%',
        padding: FORM_TOKENS.spacing.md,
        border: `1px solid ${FORM_TOKENS.colors.border}`,
        borderRadius: '8px',
        fontSize: '0.9rem',
        background: '#ffffff',
        transition: 'border-color 0.2s ease',
        outline: 'none'
      }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function TagInput({ 
  values, 
  onChange, 
  placeholder 
}: {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}) {
  const [inputValue, setInputValue] = useState('');

  const addTag = () => {
    if (inputValue.trim() && !values.includes(inputValue.trim())) {
      onChange([...values, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeTag = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: FORM_TOKENS.spacing.sm,
        marginBottom: FORM_TOKENS.spacing.sm
      }}>
        {values.map((tag, index) => (
          <span
            key={index}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: FORM_TOKENS.spacing.xs,
              padding: `${FORM_TOKENS.spacing.xs} ${FORM_TOKENS.spacing.sm}`,
              background: `rgba(74, 144, 226, 0.1)`,
              color: FORM_TOKENS.colors.primary,
              borderRadius: '12px',
              fontSize: '0.8rem',
              fontWeight: '500'
            }}
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              style={{
                background: 'none',
                border: 'none',
                color: FORM_TOKENS.colors.primary,
                cursor: 'pointer',
                padding: 0,
                fontSize: '0.7rem'
              }}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: FORM_TOKENS.spacing.sm }}>
        <Input
          value={inputValue}
          onChange={setInputValue}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={addTag}
          style={{
            padding: `${FORM_TOKENS.spacing.sm} ${FORM_TOKENS.spacing.lg}`,
            background: FORM_TOKENS.colors.primary,
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: '600',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}

// Main contribution form component
export default function ContributionForm({ 
  initialType, 
  initialTopicId, 
  targetTopic, 
  onSubmit, 
  onCancel 
}: ContributionFormProps) {
  const [contributionType, setContributionType] = useState<ContributionType>(
    initialType || (targetTopic ? 'add-paper' : 'suggest-topic')
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Common contributor info
  const [contributorInfo, setContributorInfo] = useState({
    name: '',
    email: '',
    institution: '',
    orcid: '',
    expertise: [] as string[]
  });

  // Add paper form data
  const [paperData, setPaperData] = useState({
    pmid: '',
    title: '',
    authors: [] as string[],
    journal: '',
    year: new Date().getFullYear(),
    doi: '',
    abstract: '',
    rationale: '',
    relevantFindings: [] as string[],
    suggestedStrength: '',
    suggestedQuality: '',
    methodologyNotes: '',
    limitations: [] as string[]
  });

  // Edit summary form data
  const [summaryEdit, setSummaryEdit] = useState({
    section: '',
    originalText: '',
    proposedText: '',
    rationale: '',
    supportingEvidence: [] as string[]
  });

  // Flag methodology form data
  const [methodologyFlag, setMethodologyFlag] = useState({
    targetSection: '',
    targetId: '',
    issueType: '',
    description: '',
    suggestedCorrection: '',
    severity: '',
    supportingReferences: [] as string[]
  });

  // Suggest topic form data
  const [topicSuggestion, setTopicSuggestion] = useState({
    proposedTitle: '',
    description: '',
    keywords: [] as string[],
    knowledgeGap: '',
    initialPapers: [] as any[],
    relevantExistingTopics: [] as string[],
    rationale: '',
    urgency: '',
    scope: ''
  });

  // Paper-specific contribution states
  const [methodologyDetails] = useState({
    targetPaperId: initialTopicId || '',
    targetPaperTitle: '',
    missingDetails: [{
      section: 'methods' as const,
      currentDescription: '',
      suggestedAddition: '',
      importance: 'medium' as const
    }],
    additionalProtocols: [] as string[],
    sourcesForDetails: [] as string[],
    rationale: ''
  });

  const [paperCorrection] = useState({
    targetPaperId: initialTopicId || '',
    targetPaperTitle: '',
    corrections: [{
      field: 'title' as const,
      currentValue: '',
      correctedValue: '',
      evidence: ''
    }],
    rationale: '',
    urgency: 'medium' as const
  });

  const [paperTopicSuggestion] = useState({
    targetPaperId: initialTopicId || '',
    targetPaperTitle: '',
    suggestedTopics: [{
      topicTitle: '',
      relevance: 'medium' as const,
      keyFindings: [] as string[],
      rationale: ''
    }],
    newTopicSuggestions: [] as any[]
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate contributor info
    if (!contributorInfo.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!contributorInfo.email.trim()) {
      newErrors.email = 'Email is required';
    }
    if (contributorInfo.expertise.length === 0) {
      newErrors.expertise = 'Please add at least one area of expertise';
    }

    // Type-specific validation
    if (contributionType === 'add-paper') {
      if (!paperData.title.trim()) newErrors.paperTitle = 'Paper title is required';
      if (paperData.authors.length === 0) newErrors.authors = 'At least one author is required';
      if (!paperData.journal.trim()) newErrors.journal = 'Journal is required';
      if (!paperData.rationale.trim()) newErrors.rationale = 'Rationale is required';
      if (paperData.relevantFindings.length === 0) newErrors.findings = 'At least one relevant finding is required';
      if (!paperData.suggestedStrength) newErrors.strength = 'Suggested strength is required';
      if (!paperData.suggestedQuality) newErrors.quality = 'Suggested quality is required';
    }

    if (contributionType === 'edit-summary') {
      if (!summaryEdit.section) newErrors.section = 'Section to edit is required';
      if (!summaryEdit.proposedText.trim()) newErrors.proposedText = 'Proposed text is required';
      if (!summaryEdit.rationale.trim()) newErrors.editRationale = 'Rationale for edit is required';
    }

    if (contributionType === 'flag-methodology') {
      if (!methodologyFlag.targetSection) newErrors.targetSection = 'Target section is required';
      if (!methodologyFlag.issueType) newErrors.issueType = 'Issue type is required';
      if (!methodologyFlag.description.trim()) newErrors.description = 'Description is required';
      if (!methodologyFlag.severity) newErrors.severity = 'Severity is required';
    }

    if (contributionType === 'suggest-topic') {
      if (!topicSuggestion.proposedTitle.trim()) newErrors.topicTitle = 'Topic title is required';
      if (!topicSuggestion.description.trim()) newErrors.topicDescription = 'Description is required';
      if (topicSuggestion.keywords.length === 0) newErrors.keywords = 'At least one keyword is required';
      if (!topicSuggestion.knowledgeGap.trim()) newErrors.knowledgeGap = 'Knowledge gap description is required';
      if (!topicSuggestion.rationale.trim()) newErrors.topicRationale = 'Rationale is required';
      if (!topicSuggestion.urgency) newErrors.urgency = 'Urgency is required';
      if (!topicSuggestion.scope) newErrors.scope = 'Scope is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    let formData: AnyContributionFormData;

    switch (contributionType) {
      case 'add-paper':
        formData = {
          type: 'add-paper',
          targetTopicId: targetTopic?.id || initialTopicId,
          contributorInfo,
          paper: paperData
        } as AddPaperFormData;
        break;
      case 'edit-summary':
        formData = {
          type: 'edit-summary',
          targetTopicId: targetTopic?.id || initialTopicId,
          contributorInfo,
          edit: summaryEdit
        } as EditSummaryFormData;
        break;
      case 'flag-methodology':
        formData = {
          type: 'flag-methodology',
          targetTopicId: targetTopic?.id || initialTopicId,
          contributorInfo,
          flag: methodologyFlag
        } as FlagMethodologyFormData;
        break;
      case 'suggest-topic':
        formData = {
          type: 'suggest-topic',
          contributorInfo,
          topic: topicSuggestion
        } as SuggestTopicFormData;
        break;
      case 'add-methodology-details':
        formData = {
          type: 'add-methodology-details',
          targetPaperId: initialTopicId || '',
          contributorInfo,
          methodologyDetails
        } as AddMethodologyDetailsFormData;
        break;
      case 'correct-paper-info':
        formData = {
          type: 'correct-paper-info',
          targetPaperId: initialTopicId || '',
          contributorInfo,
          paperCorrection
        } as CorrectPaperInfoFormData;
        break;
      case 'suggest-paper-topics':
        formData = {
          type: 'suggest-paper-topics',
          targetPaperId: initialTopicId || '',
          contributorInfo,
          paperTopicSuggestion
        } as SuggestPaperTopicsFormData;
        break;
    }

    onSubmit(formData);
  };

  return (
    <div style={{
      background: FORM_TOKENS.colors.background.card,
      border: `1px solid ${FORM_TOKENS.colors.border}`,
      borderRadius: '16px',
      padding: FORM_TOKENS.spacing.xxl,
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div style={{ marginBottom: FORM_TOKENS.spacing.xxl }}>
        <h2 style={{
          margin: `0 0 ${FORM_TOKENS.spacing.lg} 0`,
          fontSize: '1.5rem',
          fontWeight: '700',
          color: FORM_TOKENS.colors.text.primary
        }}>
          🤝 Contribute to Scientific Knowledge
        </h2>
        
        {targetTopic && (
          <div style={{
            padding: FORM_TOKENS.spacing.lg,
            background: FORM_TOKENS.colors.background.section,
            borderRadius: '8px',
            marginBottom: FORM_TOKENS.spacing.xl
          }}>
            <p style={{
              margin: 0,
              fontSize: '0.9rem',
              color: FORM_TOKENS.colors.text.secondary
            }}>
              <strong>Contributing to:</strong> {targetTopic.title}
            </p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Contribution Type Selection */}
        <FormField 
          label="Contribution Type" 
          required
          description="What type of contribution would you like to make?"
        >
          <Select
            value={contributionType}
            onChange={(value) => setContributionType(value as ContributionType)}
            options={[
              { value: 'add-paper', label: '📄 Suggest New Paper' },
              { value: 'edit-summary', label: '✏️ Edit Topic Summary' },
              { value: 'flag-methodology', label: '⚠️ Flag Methodology Issue' },
              { value: 'suggest-topic', label: '💡 Suggest New Topic' }
            ].filter(option => {
              // Only show topic-specific options if we have a target topic
              if (!targetTopic) {
                return option.value === 'suggest-topic';
              }
              return option.value !== 'suggest-topic';
            })}
            required
          />
        </FormField>

        {/* Contributor Information */}
        <div style={{ marginBottom: FORM_TOKENS.spacing.xxl }}>
          <h3 style={{
            margin: `0 0 ${FORM_TOKENS.spacing.xl} 0`,
            fontSize: '1.1rem',
            fontWeight: '600',
            color: FORM_TOKENS.colors.text.primary,
            borderBottom: `1px solid ${FORM_TOKENS.colors.border}`,
            paddingBottom: FORM_TOKENS.spacing.sm
          }}>
            👤 Contributor Information
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: FORM_TOKENS.spacing.lg }}>
            <FormField label="Name" required error={errors.name}>
              <Input
                value={contributorInfo.name}
                onChange={(value) => setContributorInfo(prev => ({ ...prev, name: value }))}
                placeholder="Your full name"
                required
              />
            </FormField>

            <FormField label="Email" required error={errors.email}>
              <Input
                type="email"
                value={contributorInfo.email}
                onChange={(value) => setContributorInfo(prev => ({ ...prev, email: value }))}
                placeholder="your.email@institution.edu"
                required
              />
            </FormField>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: FORM_TOKENS.spacing.lg }}>
            <FormField label="Institution" description="Your academic or research institution">
              <Input
                value={contributorInfo.institution}
                onChange={(value) => setContributorInfo(prev => ({ ...prev, institution: value }))}
                placeholder="University of Science"
              />
            </FormField>

            <FormField label="ORCID" description="Your ORCID identifier (optional)">
              <Input
                value={contributorInfo.orcid}
                onChange={(value) => setContributorInfo(prev => ({ ...prev, orcid: value }))}
                placeholder="0000-0000-0000-0000"
              />
            </FormField>
          </div>

          <FormField 
            label="Areas of Expertise" 
            required 
            error={errors.expertise}
            description="Add your research areas and scientific expertise"
          >
            <TagInput
              values={contributorInfo.expertise}
              onChange={(values) => setContributorInfo(prev => ({ ...prev, expertise: values }))}
              placeholder="e.g., Molecular Biology, CRISPR, Cancer Research"
            />
          </FormField>
        </div>

        {/* Type-specific form sections */}
        {contributionType === 'add-paper' && (
          <div style={{ marginBottom: FORM_TOKENS.spacing.xxl }}>
            <h3 style={{
              margin: `0 0 ${FORM_TOKENS.spacing.xl} 0`,
              fontSize: '1.1rem',
              fontWeight: '600',
              color: FORM_TOKENS.colors.text.primary,
              borderBottom: `1px solid ${FORM_TOKENS.colors.border}`,
              paddingBottom: FORM_TOKENS.spacing.sm
            }}>
              📄 Paper Information
            </h3>

            <FormField label="PMID" description="PubMed ID if available">
              <Input
                value={paperData.pmid}
                onChange={(value) => setPaperData(prev => ({ ...prev, pmid: value }))}
                placeholder="12345678"
              />
            </FormField>

            <FormField label="Paper Title" required error={errors.paperTitle}>
              <Input
                value={paperData.title}
                onChange={(value) => setPaperData(prev => ({ ...prev, title: value }))}
                placeholder="Full title of the research paper"
                required
              />
            </FormField>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: FORM_TOKENS.spacing.lg }}>
              <FormField label="Journal" required error={errors.journal}>
                <Input
                  value={paperData.journal}
                  onChange={(value) => setPaperData(prev => ({ ...prev, journal: value }))}
                  placeholder="Nature, Science, Cell, etc."
                  required
                />
              </FormField>

              <FormField label="Year" required>
                <Input
                  type="number"
                  value={paperData.year.toString()}
                  onChange={(value) => setPaperData(prev => ({ ...prev, year: parseInt(value) || new Date().getFullYear() }))}
                  placeholder="2023"
                  required
                />
              </FormField>
            </div>

            <FormField label="Authors" required error={errors.authors} description="Add author names one by one">
              <TagInput
                values={paperData.authors}
                onChange={(values) => setPaperData(prev => ({ ...prev, authors: values }))}
                placeholder="Author Name"
              />
            </FormField>

            <FormField label="DOI" description="Digital Object Identifier (optional)">
              <Input
                value={paperData.doi}
                onChange={(value) => setPaperData(prev => ({ ...prev, doi: value }))}
                placeholder="10.1038/nature12345"
              />
            </FormField>

            <FormField label="Abstract" description="Full abstract if available">
              <Textarea
                value={paperData.abstract}
                onChange={(value) => setPaperData(prev => ({ ...prev, abstract: value }))}
                placeholder="Paste the full abstract here..."
                rows={6}
              />
            </FormField>

            <FormField label="Rationale" required error={errors.rationale} description="Why should this paper be added to the topic?">
              <Textarea
                value={paperData.rationale}
                onChange={(value) => setPaperData(prev => ({ ...prev, rationale: value }))}
                placeholder="Explain why this paper is relevant and what new insights it provides..."
                rows={4}
                required
              />
            </FormField>

            <FormField label="Relevant Findings" required error={errors.findings} description="Key findings from this paper">
              <TagInput
                values={paperData.relevantFindings}
                onChange={(values) => setPaperData(prev => ({ ...prev, relevantFindings: values }))}
                placeholder="Key finding or result"
              />
            </FormField>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: FORM_TOKENS.spacing.lg }}>
              <FormField label="Suggested Evidence Strength" required error={errors.strength}>
                <Select
                  value={paperData.suggestedStrength}
                  onChange={(value) => setPaperData(prev => ({ ...prev, suggestedStrength: value }))}
                  options={[
                    { value: 'very-low', label: 'Very Low' },
                    { value: 'low', label: 'Low' },
                    { value: 'moderate', label: 'Moderate' },
                    { value: 'high', label: 'High' },
                    { value: 'very-high', label: 'Very High' }
                  ]}
                  placeholder="Select strength..."
                  required
                />
              </FormField>

              <FormField label="Suggested Evidence Quality" required error={errors.quality}>
                <Select
                  value={paperData.suggestedQuality}
                  onChange={(value) => setPaperData(prev => ({ ...prev, suggestedQuality: value }))}
                  options={[
                    { value: 'very-low', label: 'Very Low' },
                    { value: 'low', label: 'Low' },
                    { value: 'moderate', label: 'Moderate' },
                    { value: 'high', label: 'High' },
                    { value: 'very-high', label: 'Very High' }
                  ]}
                  placeholder="Select quality..."
                  required
                />
              </FormField>
            </div>

            <FormField label="Methodology Notes" description="Important methodological details">
              <Textarea
                value={paperData.methodologyNotes}
                onChange={(value) => setPaperData(prev => ({ ...prev, methodologyNotes: value }))}
                placeholder="Sample sizes, experimental conditions, statistical methods..."
                rows={3}
              />
            </FormField>

            <FormField label="Limitations" description="Study limitations to note">
              <TagInput
                values={paperData.limitations}
                onChange={(values) => setPaperData(prev => ({ ...prev, limitations: values }))}
                placeholder="e.g., Small sample size, Single cell line"
              />
            </FormField>
          </div>
        )}

        {contributionType === 'edit-summary' && (
          <div style={{ marginBottom: FORM_TOKENS.spacing.xxl }}>
            <h3 style={{
              margin: `0 0 ${FORM_TOKENS.spacing.xl} 0`,
              fontSize: '1.1rem',
              fontWeight: '600',
              color: FORM_TOKENS.colors.text.primary,
              borderBottom: `1px solid ${FORM_TOKENS.colors.border}`,
              paddingBottom: FORM_TOKENS.spacing.sm
            }}>
              ✏️ Summary Edit
            </h3>

            <FormField label="Section to Edit" required error={errors.section}>
              <Select
                value={summaryEdit.section}
                onChange={(value) => setSummaryEdit(prev => ({ ...prev, section: value }))}
                options={[
                  { value: 'title', label: 'Topic Title' },
                  { value: 'description', label: 'Description' },
                  { value: 'key-insight', label: 'Key Insight' },
                  { value: 'research-gaps', label: 'Research Gaps' },
                  { value: 'future-directions', label: 'Future Directions' }
                ]}
                placeholder="Select section..."
                required
              />
            </FormField>

            <FormField label="Current Text" description="Copy the current text you want to edit">
              <Textarea
                value={summaryEdit.originalText}
                onChange={(value) => setSummaryEdit(prev => ({ ...prev, originalText: value }))}
                placeholder="Paste the current text here..."
                rows={4}
              />
            </FormField>

            <FormField label="Proposed Text" required error={errors.proposedText}>
              <Textarea
                value={summaryEdit.proposedText}
                onChange={(value) => setSummaryEdit(prev => ({ ...prev, proposedText: value }))}
                placeholder="Enter your improved version..."
                rows={4}
                required
              />
            </FormField>

            <FormField label="Rationale" required error={errors.editRationale} description="Why is this edit needed?">
              <Textarea
                value={summaryEdit.rationale}
                onChange={(value) => setSummaryEdit(prev => ({ ...prev, rationale: value }))}
                placeholder="Explain the reasoning behind your edit..."
                rows={3}
                required
              />
            </FormField>

            <FormField label="Supporting Evidence" description="References that support your edit">
              <TagInput
                values={summaryEdit.supportingEvidence}
                onChange={(values) => setSummaryEdit(prev => ({ ...prev, supportingEvidence: values }))}
                placeholder="PMID, DOI, or citation"
              />
            </FormField>
          </div>
        )}

        {contributionType === 'flag-methodology' && (
          <div style={{ marginBottom: FORM_TOKENS.spacing.xxl }}>
            <h3 style={{
              margin: `0 0 ${FORM_TOKENS.spacing.xl} 0`,
              fontSize: '1.1rem',
              fontWeight: '600',
              color: FORM_TOKENS.colors.text.primary,
              borderBottom: `1px solid ${FORM_TOKENS.colors.border}`,
              paddingBottom: FORM_TOKENS.spacing.sm
            }}>
              ⚠️ Methodology Issue
            </h3>

            <FormField label="Target Section" required error={errors.targetSection}>
              <Select
                value={methodologyFlag.targetSection}
                onChange={(value) => setMethodologyFlag(prev => ({ ...prev, targetSection: value }))}
                options={[
                  { value: 'methods-outcomes', label: 'Methods → Outcomes' },
                  { value: 'evidence-alignment', label: 'Evidence Alignment' },
                  { value: 'specific-paper', label: 'Specific Paper' }
                ]}
                placeholder="Select target..."
                required
              />
            </FormField>

            {methodologyFlag.targetSection === 'specific-paper' && (
              <FormField label="Paper ID" description="PMID or identifier of the specific paper">
                <Input
                  value={methodologyFlag.targetId}
                  onChange={(value) => setMethodologyFlag(prev => ({ ...prev, targetId: value }))}
                  placeholder="12345678"
                />
              </FormField>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: FORM_TOKENS.spacing.lg }}>
              <FormField label="Issue Type" required error={errors.issueType}>
                <Select
                  value={methodologyFlag.issueType}
                  onChange={(value) => setMethodologyFlag(prev => ({ ...prev, issueType: value }))}
                  options={[
                    { value: 'missing-details', label: 'Missing Details' },
                    { value: 'incorrect-interpretation', label: 'Incorrect Interpretation' },
                    { value: 'outdated-info', label: 'Outdated Information' },
                    { value: 'bias-concern', label: 'Bias Concern' },
                    { value: 'replication-issue', label: 'Replication Issue' }
                  ]}
                  placeholder="Select issue type..."
                  required
                />
              </FormField>

              <FormField label="Severity" required error={errors.severity}>
                <Select
                  value={methodologyFlag.severity}
                  onChange={(value) => setMethodologyFlag(prev => ({ ...prev, severity: value }))}
                  options={[
                    { value: 'low', label: 'Low' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'high', label: 'High' },
                    { value: 'critical', label: 'Critical' }
                  ]}
                  placeholder="Select severity..."
                  required
                />
              </FormField>
            </div>

            <FormField label="Description" required error={errors.description}>
              <Textarea
                value={methodologyFlag.description}
                onChange={(value) => setMethodologyFlag(prev => ({ ...prev, description: value }))}
                placeholder="Describe the methodology issue in detail..."
                rows={4}
                required
              />
            </FormField>

            <FormField label="Suggested Correction" description="How should this be corrected?">
              <Textarea
                value={methodologyFlag.suggestedCorrection}
                onChange={(value) => setMethodologyFlag(prev => ({ ...prev, suggestedCorrection: value }))}
                placeholder="Suggest how to fix this issue..."
                rows={3}
              />
            </FormField>

            <FormField label="Supporting References" description="References that support your concern">
              <TagInput
                values={methodologyFlag.supportingReferences}
                onChange={(values) => setMethodologyFlag(prev => ({ ...prev, supportingReferences: values }))}
                placeholder="PMID, DOI, or citation"
              />
            </FormField>
          </div>
        )}

        {contributionType === 'suggest-topic' && (
          <div style={{ marginBottom: FORM_TOKENS.spacing.xxl }}>
            <h3 style={{
              margin: `0 0 ${FORM_TOKENS.spacing.xl} 0`,
              fontSize: '1.1rem',
              fontWeight: '600',
              color: FORM_TOKENS.colors.text.primary,
              borderBottom: `1px solid ${FORM_TOKENS.colors.border}`,
              paddingBottom: FORM_TOKENS.spacing.sm
            }}>
              💡 New Topic Suggestion
            </h3>

            <FormField label="Proposed Title" required error={errors.topicTitle}>
              <Input
                value={topicSuggestion.proposedTitle}
                onChange={(value) => setTopicSuggestion(prev => ({ ...prev, proposedTitle: value }))}
                placeholder="Concise, descriptive title for the new topic"
                required
              />
            </FormField>

            <FormField label="Description" required error={errors.topicDescription}>
              <Textarea
                value={topicSuggestion.description}
                onChange={(value) => setTopicSuggestion(prev => ({ ...prev, description: value }))}
                placeholder="Detailed description of what this topic would cover..."
                rows={4}
                required
              />
            </FormField>

            <FormField label="Keywords" required error={errors.keywords}>
              <TagInput
                values={topicSuggestion.keywords}
                onChange={(values) => setTopicSuggestion(prev => ({ ...prev, keywords: values }))}
                placeholder="Topic keyword"
              />
            </FormField>

            <FormField label="Knowledge Gap" required error={errors.knowledgeGap} description="What knowledge gap does this topic address?">
              <Textarea
                value={topicSuggestion.knowledgeGap}
                onChange={(value) => setTopicSuggestion(prev => ({ ...prev, knowledgeGap: value }))}
                placeholder="Describe the current gap in knowledge or understanding..."
                rows={3}
                required
              />
            </FormField>

            <FormField label="Rationale" required error={errors.topicRationale} description="Why is this topic important?">
              <Textarea
                value={topicSuggestion.rationale}
                onChange={(value) => setTopicSuggestion(prev => ({ ...prev, rationale: value }))}
                placeholder="Explain the importance and relevance of this topic..."
                rows={3}
                required
              />
            </FormField>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: FORM_TOKENS.spacing.lg }}>
              <FormField label="Urgency" required error={errors.urgency}>
                <Select
                  value={topicSuggestion.urgency}
                  onChange={(value) => setTopicSuggestion(prev => ({ ...prev, urgency: value }))}
                  options={[
                    { value: 'low', label: 'Low - Can wait' },
                    { value: 'medium', label: 'Medium - Moderately important' },
                    { value: 'high', label: 'High - Urgent need' }
                  ]}
                  placeholder="Select urgency..."
                  required
                />
              </FormField>

              <FormField label="Scope" required error={errors.scope}>
                <Select
                  value={topicSuggestion.scope}
                  onChange={(value) => setTopicSuggestion(prev => ({ ...prev, scope: value }))}
                  options={[
                    { value: 'narrow', label: 'Narrow - Focused area' },
                    { value: 'broad', label: 'Broad - Wide coverage' },
                    { value: 'interdisciplinary', label: 'Interdisciplinary' }
                  ]}
                  placeholder="Select scope..."
                  required
                />
              </FormField>
            </div>

            <FormField label="Relevant Existing Topics" description="Topics that relate to your suggestion">
              <TagInput
                values={topicSuggestion.relevantExistingTopics}
                onChange={(values) => setTopicSuggestion(prev => ({ ...prev, relevantExistingTopics: values }))}
                placeholder="Related topic name"
              />
            </FormField>
          </div>
        )}

        {/* Form Actions */}
        <div style={{
          display: 'flex',
          gap: FORM_TOKENS.spacing.lg,
          justifyContent: 'flex-end',
          paddingTop: FORM_TOKENS.spacing.xl,
          borderTop: `1px solid ${FORM_TOKENS.colors.border}`
        }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: `${FORM_TOKENS.spacing.md} ${FORM_TOKENS.spacing.xl}`,
              border: `1px solid ${FORM_TOKENS.colors.border}`,
              background: '#ffffff',
              color: FORM_TOKENS.colors.text.secondary,
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
            style={{
              padding: `${FORM_TOKENS.spacing.md} ${FORM_TOKENS.spacing.xl}`,
              border: 'none',
              background: FORM_TOKENS.colors.primary,
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Submit Contribution
          </button>
        </div>
      </form>
    </div>
  );
}