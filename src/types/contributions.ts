import type { ScientificTopic } from './scientificTopic';

// Re-export for convenience
export type { ScientificTopic };

// Unified contribution system types
export type ContributionScope = 'paper' | 'topic';
export type PaperContributionType =
  | 'methodology-detail'
  | 'correction'
  | 'proposed-topic'
  // legacy/types seen in code:
  | 'add-methodology-details'
  | 'correct-paper-info'
  | 'suggest-paper-topics'
  | 'add-paper'
  | 'edit-summary'
  | 'flag-methodology'
  | 'suggest-topic';
export type TopicContributionType =
  | 'new-topic'
  | 'topic-correction';
export type ContributionStatus =
  | 'pending'
  | 'accepted'
  | 'needs-more-info'
  | 'rejected'
  // legacy:
  | 'approved'
  | 'under-review';

export type ContributionPriority = 'high' | 'medium' | 'low';

export interface ContributorMeta {
  id: string;
  name?: string;
  email?: string;
  orcid?: string;
  role?: string;
  joinDate?: Date;
  contributionCount?: number;
  reputation?: number;
  institution?: string;
  expertise?: string[];
}

export interface BaseContribution {
  id: string;
  scope: ContributionScope;
  status: ContributionStatus;
  createdAt: Date;
  createdBy?: ContributorMeta;

  // optional UI metadata used around the app
  submittedAt?: Date;
  lastModified?: Date;
  reviewedAt?: Date;
  moderatorNotes?: string;
  priority?: ContributionPriority;
  targetTopicId?: string;
  targetTopic?: { id: string; title: string };
  contributorId?: string; // legacy alias used in filters
  contributor?: ContributorMeta; // legacy alias used in UI
}

export interface PaperContribution extends BaseContribution {
  scope: 'paper';
  paperId: string;
  type: PaperContributionType;
  description?: string;
  tags?: string[];
  proposedTopicTitle?: string;
  // allow legacy blobs:
  data?: any;
}

export interface TopicContribution extends BaseContribution {
  scope: 'topic';
  type: TopicContributionType;
  topicId?: string;
  title?: string;
  rationale?: string;
  tags?: string[];
  // allow legacy blobs:
  data?: any;
}

export type Contribution = PaperContribution | TopicContribution;

// API stub implementation
export async function submitContribution(
  input: Omit<Contribution, 'id' | 'status' | 'createdAt'>
): Promise<Contribution> {
  return {
    ...input,
    id: `c_${Math.random().toString(36).slice(2, 9)}`,
    status: 'pending',
    createdAt: new Date(),
  } as Contribution;
}

// Legacy types for backward compatibility
export type ContributionType = 
  | 'add-paper' 
  | 'edit-summary' 
  | 'flag-methodology' 
  | 'suggest-topic'
  | 'add-methodology-details'  // New: add missing methodology details to a paper
  | 'correct-paper-info'       // New: suggest corrections to paper information
  | 'suggest-paper-topics';    // New: suggest topics this paper should be added to

// Legacy ContributionStatus type - use the unified one above

export type ContributorRole = 'researcher' | 'moderator' | 'admin';

export interface Contributor {
  id: string;
  name: string;
  email: string;
  institution?: string;
  orcid?: string;
  role: ContributorRole;
  expertise: string[];
  joinDate: Date;
  contributionCount: number;
  reputation: number;
}

export interface PaperSuggestion {
  pmid?: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi?: string;
  abstract?: string;
  rationale: string;
  relevantFindings: string[];
  suggestedStrength: 'very-low' | 'low' | 'moderate' | 'high' | 'very-high';
  suggestedQuality: 'very-low' | 'low' | 'moderate' | 'high' | 'very-high';
  methodologyNotes?: string;
  limitations?: string[];
}

export interface SummaryEdit {
  section: 'title' | 'description' | 'key-insight' | 'research-gaps' | 'future-directions';
  originalText: string;
  proposedText: string;
  rationale: string;
  supportingEvidence?: string[];
}

export interface MethodologyFlag {
  targetSection: 'methods-outcomes' | 'evidence-alignment' | 'specific-paper';
  targetId?: string; // paper PMID if specific paper
  issueType: 'missing-details' | 'incorrect-interpretation' | 'outdated-info' | 'bias-concern' | 'replication-issue';
  description: string;
  suggestedCorrection?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  supportingReferences?: string[];
}

export interface TopicSuggestion {
  proposedTitle: string;
  description: string;
  keywords: string[];
  knowledgeGap: string;
  initialPapers: PaperSuggestion[];
  relevantExistingTopics?: string[];
  rationale: string;
  urgency: 'low' | 'medium' | 'high';
  scope: 'narrow' | 'broad' | 'interdisciplinary';
}

// New paper-specific contribution types
export interface MethodologyDetails {
  targetPaperId: string;
  targetPaperTitle: string;
  missingDetails: {
    section: 'methods' | 'materials' | 'data-analysis' | 'statistics' | 'protocols';
    currentDescription: string;
    suggestedAddition: string;
    importance: 'low' | 'medium' | 'high' | 'critical';
  }[];
  additionalProtocols?: string[];
  sourcesForDetails: string[]; // References or personal knowledge
  rationale: string;
}

export interface PaperCorrection {
  targetPaperId: string;
  targetPaperTitle: string;
  corrections: {
    field: 'title' | 'authors' | 'journal' | 'year' | 'doi' | 'abstract' | 'other';
    currentValue: string;
    correctedValue: string;
    evidence: string; // Evidence for the correction
  }[];
  rationale: string;
  urgency: 'low' | 'medium' | 'high';
}

export interface PaperTopicSuggestion {
  targetPaperId: string;
  targetPaperTitle: string;
  suggestedTopics: {
    topicId?: string; // Existing topic ID
    topicTitle: string;
    relevance: 'low' | 'medium' | 'high' | 'very-high';
    keyFindings: string[]; // What findings from this paper are relevant
    rationale: string;
  }[];
  newTopicSuggestions?: {
    proposedTitle: string;
    description: string;
    keywords: string[];
    rationale: string;
  }[];
}

// Legacy contribution types for backward compatibility
export interface LegacyBaseContribution {
  id: string;
  type: ContributionType;
  contributorId: string;
  contributor: Contributor;
  targetTopicId?: string;
  targetTopic?: ScientificTopic;
  status: ContributionStatus;
  submittedAt: Date;
  lastModified: Date;
  moderatorId?: string;
  moderatorNotes?: string;
  reviewedAt?: Date;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
}

export interface AddPaperContribution extends LegacyBaseContribution {
  type: 'add-paper';
  data: PaperSuggestion;
}

export interface EditSummaryContribution extends LegacyBaseContribution {
  type: 'edit-summary';
  data: SummaryEdit;
}

export interface FlagMethodologyContribution extends LegacyBaseContribution {
  type: 'flag-methodology';
  data: MethodologyFlag;
}

export interface SuggestTopicContribution extends LegacyBaseContribution {
  type: 'suggest-topic';
  data: TopicSuggestion;
}

export interface AddMethodologyDetailsContribution extends LegacyBaseContribution {
  type: 'add-methodology-details';
  data: MethodologyDetails;
}

export interface CorrectPaperInfoContribution extends LegacyBaseContribution {
  type: 'correct-paper-info';
  data: PaperCorrection;
}

export interface SuggestPaperTopicsContribution extends LegacyBaseContribution {
  type: 'suggest-paper-topics';
  data: PaperTopicSuggestion;
}

export type LegacyContribution = 
  | AddPaperContribution 
  | EditSummaryContribution 
  | FlagMethodologyContribution 
  | SuggestTopicContribution
  | AddMethodologyDetailsContribution
  | CorrectPaperInfoContribution
  | SuggestPaperTopicsContribution;

export interface ContributionComment {
  id: string;
  contributionId: string;
  contributorId: string;
  contributor: Contributor;
  content: string;
  timestamp: Date;
  isModeratorComment: boolean;
}

export interface ContributionFilters {
  status?: ContributionStatus[];
  type?: ContributionType[];
  contributorId?: string;
  topicId?: string;
  priority?: ('low' | 'medium' | 'high')[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
}

export interface ContributionStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  underReview: number;
  byType: Record<ContributionType, number>;
  byPriority: Record<'low' | 'medium' | 'high', number>;
  avgReviewTime: number; // in hours
  topContributors: Array<{
    contributor: Contributor;
    contributionCount: number;
    approvalRate: number;
  }>;
}

// Form data types for the contribution forms
export interface ContributionFormData {
  type: ContributionType;
  targetTopicId?: string;
  contributorInfo: {
    name: string;
    email: string;
    institution?: string;
    orcid?: string;
    expertise: string[];
  };
}

export interface AddPaperFormData extends ContributionFormData {
  type: 'add-paper';
  paper: Omit<PaperSuggestion, 'rationale' | 'relevantFindings' | 'suggestedStrength' | 'suggestedQuality'> & {
    rationale: string;
    relevantFindings: string[];
    suggestedStrength: string;
    suggestedQuality: string;
  };
}

export interface EditSummaryFormData extends ContributionFormData {
  type: 'edit-summary';
  edit: SummaryEdit;
}

export interface FlagMethodologyFormData extends ContributionFormData {
  type: 'flag-methodology';
  flag: MethodologyFlag;
}

export interface SuggestTopicFormData extends ContributionFormData {
  type: 'suggest-topic';
  topic: TopicSuggestion;
}

export interface AddMethodologyDetailsFormData extends ContributionFormData {
  type: 'add-methodology-details';
  targetPaperId: string;
  methodologyDetails: MethodologyDetails;
}

export interface CorrectPaperInfoFormData extends ContributionFormData {
  type: 'correct-paper-info';
  targetPaperId: string;
  paperCorrection: PaperCorrection;
}

export interface SuggestPaperTopicsFormData extends ContributionFormData {
  type: 'suggest-paper-topics';
  targetPaperId: string;
  paperTopicSuggestion: PaperTopicSuggestion;
}

export type AnyContributionFormData = 
  | AddPaperFormData 
  | EditSummaryFormData 
  | FlagMethodologyFormData 
  | SuggestTopicFormData
  | AddMethodologyDetailsFormData
  | CorrectPaperInfoFormData
  | SuggestPaperTopicsFormData;