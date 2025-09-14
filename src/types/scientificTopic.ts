import type { PubMedArticle } from '../services/pubmed';

export type EvidenceStrength = 'very-low' | 'low' | 'moderate' | 'high' | 'very-high';

export type EvidenceQuality = 'very-low' | 'low' | 'moderate' | 'high' | 'very-high';

export type OverallAssessment = 'insufficient' | 'conflicting' | 'limited' | 'moderate' | 'strong' | 'very-strong';

export interface EvidencePaper {
  article: PubMedArticle;
  strengthScore: EvidenceStrength;
  qualityScore: EvidenceQuality;
  relevanceScore: number;
  keyFindings: string[];
  studyType?: 'observational' | 'experimental' | 'review' | 'meta-analysis' | 'case-study' | 'clinical-trial';
  sampleSize?: number;
  methodologyNotes?: string;
  limitations?: string[];
  conflictsOfInterest?: boolean;
  dateAssessed: Date;
}

export interface EvidenceSummary {
  totalPapers: number;
  strengthDistribution: Record<EvidenceStrength, number>;
  qualityDistribution: Record<EvidenceQuality, number>;
  averageRelevanceScore: number;
  studyTypeDistribution: Record<string, number>;
  totalSampleSize?: number;
  consistencyScore: number;
  lastUpdated: Date;
}

export interface ScientificTopic {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  relatedTerms: string[];
  evidencePapers: EvidencePaper[];
  evidenceSummary: EvidenceSummary;
  overallAssessment: OverallAssessment;
  confidenceLevel: number;
  researchGaps: string[];
  controversies: string[];
  futureDirections: string[];
  lastReviewed: Date;
  createdBy?: string;
  reviewedBy?: string[];
  version: number;
  parentTopics?: string[];
  childTopics?: string[];
}

export interface TopicSearchCriteria {
  keywords: string[];
  timeRange?: {
    start: Date;
    end: Date;
  };
  studyTypes?: string[];
  minQualityThreshold?: EvidenceQuality;
  minStrengthThreshold?: EvidenceStrength;
  maxPapers?: number;
}

export function createEvidenceSummary(papers: EvidencePaper[]): EvidenceSummary {
  const strengthDistribution: Record<EvidenceStrength, number> = {
    'very-low': 0,
    'low': 0,
    'moderate': 0,
    'high': 0,
    'very-high': 0
  };

  const qualityDistribution: Record<EvidenceQuality, number> = {
    'very-low': 0,
    'low': 0,
    'moderate': 0,
    'high': 0,
    'very-high': 0
  };

  const studyTypeDistribution: Record<string, number> = {};
  let totalRelevanceScore = 0;
  let totalSampleSize = 0;
  let samplesWithSize = 0;

  papers.forEach(paper => {
    strengthDistribution[paper.strengthScore]++;
    qualityDistribution[paper.qualityScore]++;
    totalRelevanceScore += paper.relevanceScore;

    if (paper.studyType) {
      studyTypeDistribution[paper.studyType] = (studyTypeDistribution[paper.studyType] || 0) + 1;
    }

    if (paper.sampleSize) {
      totalSampleSize += paper.sampleSize;
      samplesWithSize++;
    }
  });

  const averageRelevanceScore = papers.length > 0 ? totalRelevanceScore / papers.length : 0;
  const consistencyScore = calculateConsistencyScore(papers);

  return {
    totalPapers: papers.length,
    strengthDistribution,
    qualityDistribution,
    averageRelevanceScore,
    studyTypeDistribution,
    totalSampleSize: samplesWithSize > 0 ? totalSampleSize : undefined,
    consistencyScore,
    lastUpdated: new Date()
  };
}

export function calculateOverallAssessment(summary: EvidenceSummary): OverallAssessment {
  const { totalPapers, strengthDistribution, qualityDistribution, consistencyScore, averageRelevanceScore } = summary;

  if (totalPapers === 0) {
    return 'insufficient';
  }

  const highQualityCount = qualityDistribution['high'] + qualityDistribution['very-high'];
  const highStrengthCount = strengthDistribution['high'] + strengthDistribution['very-high'];
  const highQualityRatio = highQualityCount / totalPapers;
  const highStrengthRatio = highStrengthCount / totalPapers;

  if (consistencyScore < 0.3) {
    return 'conflicting';
  }

  if (totalPapers < 3 || averageRelevanceScore < 0.5) {
    return 'insufficient';
  }

  if (totalPapers >= 3 && totalPapers < 10) {
    if (highQualityRatio >= 0.5 && highStrengthRatio >= 0.5 && consistencyScore >= 0.7) {
      return 'moderate';
    }
    return 'limited';
  }

  if (totalPapers >= 10) {
    if (highQualityRatio >= 0.7 && highStrengthRatio >= 0.7 && consistencyScore >= 0.8) {
      return 'very-strong';
    }
    if (highQualityRatio >= 0.6 && highStrengthRatio >= 0.6 && consistencyScore >= 0.7) {
      return 'strong';
    }
    if (highQualityRatio >= 0.4 && highStrengthRatio >= 0.4 && consistencyScore >= 0.6) {
      return 'moderate';
    }
  }

  return 'limited';
}

function calculateConsistencyScore(papers: EvidencePaper[]): number {
  if (papers.length < 2) {
    return 1.0;
  }

  const findingsSimilarities: number[] = [];
  
  for (let i = 0; i < papers.length - 1; i++) {
    for (let j = i + 1; j < papers.length; j++) {
      const similarity = calculateFindingsSimilarity(papers[i].keyFindings, papers[j].keyFindings);
      findingsSimilarities.push(similarity);
    }
  }

  const averageSimilarity = findingsSimilarities.reduce((sum, sim) => sum + sim, 0) / findingsSimilarities.length;
  return Math.max(0, Math.min(1, averageSimilarity));
}

function calculateFindingsSimilarity(findings1: string[], findings2: string[]): number {
  if (findings1.length === 0 && findings2.length === 0) {
    return 1.0;
  }
  if (findings1.length === 0 || findings2.length === 0) {
    return 0.0;
  }

  const set1 = new Set(findings1.map(f => f.toLowerCase().trim()));
  const set2 = new Set(findings2.map(f => f.toLowerCase().trim()));
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}