import type { 
  Contribution, 
  ContributionComment, 
  Contributor
} from '../types/contributions';
import { sampleScientificTopics } from './sampleTopics';

// Sample contributors
export const sampleContributors: Contributor[] = [
  {
    id: 'contrib-1',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@stanford.edu',
    institution: 'Stanford University',
    orcid: '0000-0001-2345-6789',
    role: 'researcher',
    expertise: ['CRISPR', 'Gene Editing', 'Molecular Biology'],
    joinDate: new Date('2023-01-15'),
    contributionCount: 12,
    reputation: 4.8
  },
  {
    id: 'contrib-2',
    name: 'Prof. Michael Rodriguez',
    email: 'mrodriguez@mit.edu',
    institution: 'MIT',
    orcid: '0000-0002-3456-7890',
    role: 'researcher',
    expertise: ['Biochemistry', 'Protein Analysis', 'Western Blotting'],
    joinDate: new Date('2022-08-20'),
    contributionCount: 8,
    reputation: 4.6
  },
  {
    id: 'contrib-3',
    name: 'Dr. Emily Watson',
    email: 'ewatson@ucsd.edu',
    institution: 'UC San Diego',
    role: 'moderator',
    expertise: ['Cancer Biology', 'p53', 'Tumor Suppressors'],
    joinDate: new Date('2022-03-10'),
    contributionCount: 25,
    reputation: 4.9
  },
  {
    id: 'contrib-4',
    name: 'James Park',
    email: 'jpark@graduate.berkeley.edu',
    institution: 'UC Berkeley',
    role: 'researcher',
    expertise: ['Cell Biology', 'Signal Transduction'],
    joinDate: new Date('2023-06-01'),
    contributionCount: 3,
    reputation: 4.2
  }
];

// Sample contributions
export const sampleContributions: Contribution[] = [
  // Add Paper Contribution
  {
    id: 'contribution-1',
    type: 'add-paper',
    contributorId: 'contrib-1',
    contributor: sampleContributors[0],
    targetTopicId: sampleScientificTopics[0].id, // CRISPR topic
    targetTopic: sampleScientificTopics[0],
    status: 'pending',
    submittedAt: new Date('2024-01-15T10:30:00'),
    lastModified: new Date('2024-01-15T10:30:00'),
    tags: ['high-impact', 'methodology'],
    priority: 'high',
    data: {
      pmid: '38234567',
      title: 'Improved CRISPR-Cas9 efficiency through optimized guide RNA design in human embryonic kidney cells',
      authors: ['Zhang, L.', 'Kumar, R.', 'Thompson, A.', 'Williams, M.'],
      journal: 'Nature Biotechnology',
      year: 2024,
      doi: '10.1038/nbt.2024.001',
      abstract: 'We developed a machine learning approach to optimize guide RNA design, achieving 92% cutting efficiency in HEK293 cells compared to 65% with conventional methods.',
      rationale: 'This paper addresses the significant efficiency variations seen in CRISPR experiments by providing a systematic approach to guide RNA optimization. The 92% success rate is among the highest reported for HEK293 cells.',
      relevantFindings: [
        'Machine learning model improved guide RNA selection accuracy by 40%',
        'Optimized guides showed 92% cutting efficiency vs 65% for standard guides',
        'Method reduced off-target effects by 85%',
        'Validation across 200+ target sites in HEK293 cells'
      ],
      suggestedStrength: 'very-high',
      suggestedQuality: 'high',
      methodologyNotes: 'Large sample size (n=200+ targets), proper controls, validated ML model',
      limitations: ['Limited to HEK293 cells', 'Requires computational resources for guide design']
    }
  } as any,

  // Edit Summary Contribution
  {
    id: 'contribution-2',
    type: 'edit-summary',
    contributorId: 'contrib-2',
    contributor: sampleContributors[1],
    targetTopicId: sampleScientificTopics[1].id, // Western blot topic
    targetTopic: sampleScientificTopics[1],
    status: 'under-review',
    submittedAt: new Date('2024-01-12T14:20:00'),
    lastModified: new Date('2024-01-12T14:20:00'),
    tags: ['accuracy', 'methodology'],
    priority: 'medium',
    data: {
      section: 'key-insight',
      originalText: 'Loading controls are essential for Western blot normalization, but their reliability varies significantly.',
      proposedText: 'Loading controls are essential for Western blot normalization, but their reliability varies significantly across experimental conditions. GAPDH shows the most consistent expression across cell types and treatments, while β-actin can be affected by cytoskeletal changes and tubulin by cell cycle variations. For optimal results, use multiple loading controls or total protein staining when possible.',
      rationale: 'The current summary lacks specific guidance on which loading controls to use under different conditions. My proposed edit adds actionable information based on recent comparative studies.',
      supportingEvidence: [
        'PMID: 33445678 - Comparative analysis of loading controls',
        'PMID: 34567890 - GAPDH stability across conditions'
      ]
    }
  } as any,

  // Flag Methodology Contribution
  {
    id: 'contribution-3',
    type: 'flag-methodology',
    contributorId: 'contrib-4',
    contributor: sampleContributors[3],
    targetTopicId: sampleScientificTopics[2].id, // p53 topic
    targetTopic: sampleScientificTopics[2],
    status: 'pending',
    submittedAt: new Date('2024-01-18T09:15:00'),
    lastModified: new Date('2024-01-18T09:15:00'),
    tags: ['methodology', 'accuracy'],
    priority: 'medium',
    data: {
      targetSection: 'specific-paper',
      targetId: '32109876', // PMID from the p53 topic
      issueType: 'missing-details',
      description: 'The paper by Chen et al. claims p53 promotes metastasis, but the summary doesn\'t mention that this was only observed in cells with pre-existing mutations in DNA repair genes. This context is crucial for interpreting the findings.',
      suggestedCorrection: 'Add context that p53\'s metastasis-promoting effects were only observed in cells with compromised DNA repair pathways (BRCA1/2 deficient), not in wildtype cells.',
      severity: 'medium',
      supportingReferences: [
        'Original paper supplementary data',
        'PMID: 33456789 - Review of p53 context-dependent effects'
      ]
    }
  } as any,

  // Suggest New Topic Contribution
  {
    id: 'contribution-4',
    type: 'suggest-topic',
    contributorId: 'contrib-1',
    contributor: sampleContributors[0],
    status: 'approved',
    submittedAt: new Date('2023-12-20T16:45:00'),
    lastModified: new Date('2023-12-22T10:30:00'),
    reviewedAt: new Date('2023-12-22T10:30:00'),
    moderatorId: 'contrib-3',
    moderatorNotes: 'Excellent topic suggestion with strong rationale and initial paper set. Approved for development.',
    tags: ['new-topic', 'high-impact'],
    priority: 'high',
    data: {
      proposedTitle: 'Base editing vs Prime editing: Precision comparison in therapeutic applications',
      description: 'A systematic comparison of base editing and prime editing technologies for therapeutic genome editing, focusing on precision, efficiency, and off-target effects in disease-relevant cell types.',
      keywords: ['base editing', 'prime editing', 'therapeutic editing', 'precision medicine', 'off-targets'],
      knowledgeGap: 'While both base and prime editing offer improved precision over traditional CRISPR-Cas9, there\'s no comprehensive comparison of their performance in therapeutically relevant contexts.',
      initialPapers: [
        {
          title: 'Cytosine base editing of disease mutations in human cells',
          authors: ['Komor, A.C.', 'Kim, Y.B.', 'Packer, M.S.'],
          journal: 'Science',
          year: 2023,
          rationale: 'Establishes base editing efficiency in disease contexts',
          relevantFindings: ['85% editing efficiency', 'Low off-target rates'],
          suggestedStrength: 'high',
          suggestedQuality: 'very-high'
        },
        {
          title: 'Prime editing enables precise genome editing in patient-derived cells',
          authors: ['Anzalone, A.V.', 'Randolph, P.B.', 'Davis, J.R.'],
          journal: 'Nature',
          year: 2023,
          rationale: 'Demonstrates prime editing in patient cells',
          relevantFindings: ['Corrects 89% of disease mutations', 'Minimal off-targets'],
          suggestedStrength: 'very-high',
          suggestedQuality: 'very-high'
        }
      ],
      relevantExistingTopics: ['CRISPR-Cas9 cutting efficiency in HEK293 cells'],
      rationale: 'Therapeutic genome editing is rapidly advancing, but researchers need clear guidance on which editing modality to choose for specific applications. A head-to-head comparison would be invaluable.',
      urgency: 'high',
      scope: 'narrow'
    }
  } as any,

  // Another pending contribution
  {
    id: 'contribution-5',
    type: 'flag-methodology',
    contributorId: 'contrib-2',
    contributor: sampleContributors[1],
    targetTopicId: sampleScientificTopics[1].id,
    targetTopic: sampleScientificTopics[1],
    status: 'rejected',
    submittedAt: new Date('2024-01-10T11:30:00'),
    lastModified: new Date('2024-01-11T15:45:00'),
    reviewedAt: new Date('2024-01-11T15:45:00'),
    moderatorId: 'contrib-3',
    moderatorNotes: 'The concern raised about β-actin variability is already addressed in the current summary. The cited paper does not provide sufficient evidence to contradict existing conclusions.',
    tags: ['methodology'],
    priority: 'low',
    data: {
      targetSection: 'methods-outcomes',
      issueType: 'incorrect-interpretation',
      description: 'The summary states β-actin is variable, but recent studies show it\'s actually more stable than GAPDH in stress conditions.',
      suggestedCorrection: 'Update to reflect β-actin stability under stress.',
      severity: 'low',
      supportingReferences: ['PMID: 12345678']
    }
  } as any
];

// Sample comments
export const sampleComments: Record<string, ContributionComment[]> = {
  'contribution-1': [
    {
      id: 'comment-1',
      contributionId: 'contribution-1',
      contributorId: 'contrib-3',
      contributor: sampleContributors[2], // Dr. Emily Watson (moderator)
      content: 'This looks like a high-quality paper that would significantly improve our CRISPR efficiency section. The ML approach is novel and the results are impressive. I\'ll review the full paper before approval.',
      timestamp: new Date('2024-01-16T09:20:00'),
      isModeratorComment: true
    },
    {
      id: 'comment-2',
      contributionId: 'contribution-1',
      contributorId: 'contrib-2',
      contributor: sampleContributors[1],
      content: 'Great find! This addresses the efficiency variations we\'ve been seeing. Have you validated the ML model predictions in your own lab?',
      timestamp: new Date('2024-01-16T14:15:00'),
      isModeratorComment: false
    }
  ],
  'contribution-2': [
    {
      id: 'comment-3',
      contributionId: 'contribution-2',
      contributorId: 'contrib-1',
      contributor: sampleContributors[0],
      content: 'This addition would be really helpful. I\'ve struggled with loading control selection myself.',
      timestamp: new Date('2024-01-13T10:30:00'),
      isModeratorComment: false
    }
  ],
  'contribution-4': [
    {
      id: 'comment-4',
      contributionId: 'contribution-4',
      contributorId: 'contrib-3',
      contributor: sampleContributors[2],
      content: 'Approved! This is exactly the kind of comparative analysis our community needs. The initial paper set is strong and the knowledge gap is well-defined.',
      timestamp: new Date('2023-12-22T10:28:00'),
      isModeratorComment: true
    }
  ]
};

// Helper functions for managing contributions
export function getContributionsByStatus(status: string) {
  return sampleContributions.filter(c => c.status === status);
}

export function getContributionsByType(type: string) {
  return sampleContributions.filter(c => c.type === type);
}

export function getContributionsByTopic(topicId: string) {
  return sampleContributions.filter(c => c.targetTopicId === topicId);
}

export function getPendingContributions() {
  return sampleContributions.filter(c => c.status === 'pending');
}

export function getContributionStats() {
  const total = sampleContributions.length;
  const pending = sampleContributions.filter(c => c.status === 'pending').length;
  const approved = sampleContributions.filter(c => c.status === 'approved').length;
  const rejected = sampleContributions.filter(c => c.status === 'rejected').length;
  const underReview = sampleContributions.filter(c => c.status === 'under-review').length;

  return {
    total,
    pending,
    approved,
    rejected,
    underReview,
    byType: {
      'add-paper': sampleContributions.filter(c => c.type === 'add-paper').length,
      'edit-summary': sampleContributions.filter(c => c.type === 'edit-summary').length,
      'flag-methodology': sampleContributions.filter(c => c.type === 'flag-methodology').length,
      'suggest-topic': sampleContributions.filter(c => c.type === 'suggest-topic').length
    },
    byPriority: {
      high: sampleContributions.filter(c => c.priority === 'high').length,
      medium: sampleContributions.filter(c => c.priority === 'medium').length,
      low: sampleContributions.filter(c => c.priority === 'low').length
    }
  };
}