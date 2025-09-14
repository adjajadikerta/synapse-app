import type { ScientificTopic, EvidencePaper } from '../types/scientificTopic';
import { createEvidenceSummary, calculateOverallAssessment } from '../types/scientificTopic';
import type { PubMedArticle } from '../services/pubmed';

// Sample PubMed articles for CRISPR-Cas9 cutting efficiency
const crisprPapers: PubMedArticle[] = [
  {
    pmid: "34567890",
    title: "Optimized guide RNA design improves CRISPR-Cas9 cutting efficiency in HEK293T cells: A systematic analysis of 200 targets",
    authors: ["Chen L", "Rodriguez M", "Thompson JK", "Williams AS"],
    journal: "Nucleic Acids Research",
    year: 2023,
    abstract: "CRISPR-Cas9 cutting efficiency varies dramatically based on guide RNA (gRNA) design parameters. We systematically tested 200 gRNAs targeting different genomic loci in HEK293T cells and found cutting efficiencies ranging from 5% to 95%. Machine learning analysis identified GC content (50-60%), lack of secondary structure, and distance from transcription start sites as key predictors. Optimized gRNAs achieved 85% median cutting efficiency compared to 35% for randomly selected guides.",
    doi: "10.1093/nar/gkad456"
  },
  {
    pmid: "34567891",
    title: "Impact of chromatin accessibility on CRISPR-Cas9 editing efficiency in human embryonic kidney cells",
    authors: ["Park SH", "Kumar R", "Lee JY", "Zhang W"],
    journal: "Cell Reports",
    year: 2023,
    abstract: "Chromatin structure significantly affects CRISPR-Cas9 accessibility and cutting efficiency. Using ATAC-seq and targeted editing in HEK293 cells, we demonstrate that guides targeting open chromatin regions show 3-fold higher efficiency (mean 67%) compared to heterochromatin targets (mean 22%). Pre-treatment with HDAC inhibitors improved efficiency in closed chromatin by 2.1-fold but introduced off-target effects.",
    doi: "10.1016/j.celrep.2023.112234"
  },
  {
    pmid: "34567892", 
    title: "Temperature and transfection method effects on CRISPR-Cas9 performance: A multi-laboratory comparison",
    authors: ["Johnson P", "Martinez-Santos C", "Brown K", "Ahmed N", "Taylor R"],
    journal: "Methods in Molecular Biology",
    year: 2022,
    abstract: "We compared CRISPR-Cas9 cutting efficiency across 8 laboratories using standardized gRNAs in HEK293 cells. Cutting efficiency varied from 15-73% for identical gRNAs, with electroporation showing superior results (mean 58%) compared to lipofection (mean 41%). Temperature during incubation (37°C vs 30°C) significantly affected efficiency, with 30°C showing 1.4-fold improvement for most targets.",
    doi: "10.1007/978-1-0716-2301-5_12"
  },
  {
    pmid: "34567893",
    title: "Cas9 protein quality and storage conditions critically determine editing outcomes in mammalian cell culture",
    authors: ["Smith DA", "Wilson JL", "Chen X", "Anderson M"],
    journal: "CRISPR Journal", 
    year: 2022,
    abstract: "Commercial Cas9 protein batches show significant variation in activity. Testing 15 different Cas9 preparations in HEK293 cells revealed cutting efficiencies ranging from 12% to 79% using identical gRNAs. Protein storage at -80°C maintained activity, while repeated freeze-thaw cycles reduced efficiency by up to 50%. Freshly prepared Cas9 showed optimal performance.",
    doi: "10.1089/crispr.2022.0045"
  },
  {
    pmid: "34567894",
    title: "High-throughput screening reveals sequence-dependent CRISPR-Cas9 efficiency patterns in HEK293 cells",
    authors: ["Liu H", "Garcia-Rodriguez A", "Thompson B", "Davis CL"],
    journal: "Nature Biotechnology",
    year: 2021,
    abstract: "Analysis of 5,000 gRNAs in HEK293 cells identified sequence motifs affecting cutting efficiency. PAM-proximal nucleotides (positions 17-20) most strongly influenced outcomes. Guides with specific dinucleotide patterns showed consistently high efficiency (>80%), while certain motifs predicted poor performance (<20%). Machine learning models achieved 78% accuracy in predicting cutting efficiency.",
    doi: "10.1038/s41587-021-00987-x"
  }
];

// Sample papers for Western blot loading controls
const westernBlotPapers: PubMedArticle[] = [
  {
    pmid: "35678901",
    title: "β-actin versus GAPDH: A comprehensive comparison of loading control reliability across cell lines and experimental conditions",
    authors: ["Anderson KC", "Peterson RL", "Chang M", "Roberts JA"],
    journal: "Journal of Biological Chemistry",
    year: 2023,
    abstract: "We compared β-actin and GAPDH as loading controls across 12 cell lines and various stress conditions. GAPDH showed 2.3-fold variation under hypoxic conditions while β-actin remained stable (1.2-fold variation). However, β-actin was affected by cytoskeletal disrupting agents (3.1-fold change) while GAPDH was unaffected. Neither control was universally reliable across all conditions tested.",
    doi: "10.1074/jbc.M123.456789"
  },
  {
    pmid: "35678902",
    title: "Total protein staining as an alternative to housekeeping genes for Western blot normalization: A systematic evaluation",
    authors: ["Kumar S", "Mitchell AB", "Taylor JK", "Brown PL", "Wilson D"],
    journal: "Analytical Biochemistry",
    year: 2023,
    abstract: "Total protein staining (Ponceau S, REVERT) showed superior consistency compared to traditional housekeeping proteins across 200 samples. Coefficient of variation was 8.3% for total protein versus 23.4% for β-actin and 19.7% for GAPDH. Total protein normalization was unaffected by drug treatments that altered housekeeping gene expression by up to 4-fold.",
    doi: "10.1016/j.ab.2023.114567"
  },
  {
    pmid: "35678903",
    title: "α-tubulin stability as a loading control: Cell cycle and drug treatment effects in cancer cell lines",
    authors: ["Zhang L", "Rodriguez C", "Johnson MK", "Lee S"],
    journal: "Cell Biology International", 
    year: 2022,
    abstract: "α-tubulin expression varies significantly during cell cycle progression (2.8-fold from G1 to M phase) and is dramatically altered by microtubule-targeting drugs. In cancer cell lines, α-tubulin showed high stability under most conditions (CV 12.1%) but was unreliable for studies involving cell cycle synchronization or cytoskeletal perturbations. GAPDH proved more stable in these contexts.",
    doi: "10.1002/cbin.11789"
  },
  {
    pmid: "35678904",
    title: "Housekeeping gene expression varies with metabolic state: Implications for Western blot loading controls",
    authors: ["Thompson R", "Davis AL", "Martinez E", "Kim J"],
    journal: "Methods",
    year: 2022,
    abstract: "Glucose deprivation, serum starvation, and metabolic inhibitors significantly altered expression of common loading controls. GAPDH increased 3.2-fold during glucose deprivation, reflecting its role in glycolysis. β-actin decreased 40% during serum starvation. Ribosomal protein S6 showed the greatest stability across metabolic perturbations (CV 9.8%), suggesting it as an alternative loading control.",
    doi: "10.1016/j.ymeth.2022.03.012"
  },
  {
    pmid: "35678905",
    title: "Multi-laboratory assessment reveals systematic biases in Western blot loading control selection",
    authors: ["Clark NM", "Weber J", "Singh R", "Adams PK", "Foster CM"],
    journal: "PLOS ONE",
    year: 2021,
    abstract: "Survey of 150 laboratories revealed 67% use β-actin, 28% use GAPDH, and 5% use other controls. However, 43% never validated their chosen control for their specific experimental conditions. Inter-laboratory comparison using identical samples showed 2.8-fold variation in normalized protein levels depending on loading control choice, highlighting the need for experimental validation.",
    doi: "10.1371/journal.pone.0234567"
  }
];

// Sample papers for p53 tumor suppressor function
const p53Papers: PubMedArticle[] = [
  {
    pmid: "36789012", 
    title: "Wild-type p53 prevents early-stage tumorigenesis through cell cycle checkpoint activation and apoptosis induction",
    authors: ["Wang Y", "Sullivan KR", "Chen D", "Moore JL"],
    journal: "Nature",
    year: 2023,
    abstract: "In early-stage breast cancer models, wild-type p53 activation led to G1/S checkpoint arrest in 89% of DNA-damaged cells and apoptosis in 67% of severely damaged cells. p53 knockout mice developed tumors 5.2-fold faster than wild-type controls. Transcriptomic analysis revealed upregulation of 156 tumor suppressor genes downstream of p53, confirming its central role in preventing malignant transformation.",
    doi: "10.1038/s41586-023-05432-1"
  },
  {
    pmid: "36789013",
    title: "Mutant p53 promotes cancer cell invasion and metastasis through EMT pathway activation",
    authors: ["Rivera M", "Jackson AL", "Kumar P", "Thompson CJ", "Lee K"],
    journal: "Cell",
    year: 2023,
    abstract: "Gain-of-function p53 mutations (R175H, R273H) in pancreatic cancer cells enhanced invasive capacity 4.7-fold compared to p53-null cells. Mutant p53 directly activated EMT transcription factors TWIST1 and ZEB1, leading to E-cadherin downregulation and increased metastatic potential. In patient samples, specific p53 mutations correlated with poor prognosis and distant metastasis.",
    doi: "10.1016/j.cell.2023.02.034"
  },
  {
    pmid: "36789014",
    title: "Context-dependent p53 function: tumor suppressor in colon cancer but metastasis promoter in melanoma",
    authors: ["Adams JR", "Foster B", "Yang L", "Mitchell K"],
    journal: "Cancer Cell",
    year: 2022,
    abstract: "Comparative analysis across cancer types revealed tissue-specific p53 functions. In colon cancer, p53 loss accelerated tumor growth 3.8-fold. However, in melanoma, p53 expression correlated with increased metastatic spread (r=0.67, p<0.001). RNA-seq analysis showed p53 regulates different gene sets in different cancer types, explaining its paradoxical roles.",
    doi: "10.1016/j.ccell.2022.08.015"
  },
  {
    pmid: "36789015",
    title: "p53 isoforms exhibit opposing functions in cancer progression: TP53α suppresses while ΔNp53 promotes tumorigenesis",
    authors: ["Chen S", "Rodriguez F", "Park H", "Wilson R", "Taylor M"],
    journal: "Proceedings of the National Academy of Sciences",
    year: 2022,
    abstract: "Different p53 isoforms showed contradictory effects on tumor progression. Full-length p53α suppressed tumor growth by 72% in xenograft models, while dominant-negative ΔNp53 isoform promoted growth by 2.3-fold. Isoform ratios varied significantly between cancer types, with high ΔNp53/p53α ratios correlating with poor patient outcomes in glioblastoma but not breast cancer.",
    doi: "10.1073/pnas.2201234567"
  },
  {
    pmid: "36789016",
    title: "MDM2-p53 axis regulation determines cancer cell fate: therapeutic implications and resistance mechanisms",
    authors: ["Miller AB", "Chang W", "Davis R", "Anderson L"],
    journal: "Nature Reviews Cancer",
    year: 2021,
    abstract: "Review of 47 studies reveals that MDM2 levels critically determine p53 tumor suppressor function. High MDM2 expression (>3-fold above normal) effectively inactivates wild-type p53 in 34% of cancers with intact TP53. MDM2 inhibitors restored p53 function in vitro but showed limited clinical efficacy due to rapid resistance development through MDM4 upregulation.",
    doi: "10.1038/s41568-021-00345-2"
  }
];

// Create evidence papers for CRISPR topic
function createCrisprEvidencePapers(): EvidencePaper[] {
  return [
    {
      article: crisprPapers[0],
      strengthScore: 'high',
      qualityScore: 'high', 
      relevanceScore: 0.95,
      keyFindings: [
        "85% median cutting efficiency with optimized gRNAs vs 35% with random guides",
        "GC content 50-60% optimal for efficiency",
        "Distance from TSS affects cutting success",
        "Machine learning can predict gRNA performance"
      ],
      studyType: 'experimental',
      sampleSize: 200,
      methodologyNotes: "Systematic testing of 200 gRNAs with machine learning analysis",
      limitations: ["Single cell line tested", "Limited to specific genomic contexts"],
      conflictsOfInterest: false,
      dateAssessed: new Date('2023-08-15')
    },
    {
      article: crisprPapers[1],
      strengthScore: 'high',
      qualityScore: 'high',
      relevanceScore: 0.88,
      keyFindings: [
        "3-fold higher efficiency in open vs closed chromatin",
        "67% efficiency in accessible regions vs 22% in heterochromatin", 
        "HDAC inhibitors improve efficiency but increase off-targets",
        "Chromatin state is key determinant of CRISPR success"
      ],
      studyType: 'experimental',
      sampleSize: 150,
      methodologyNotes: "ATAC-seq combined with targeted editing analysis",
      limitations: ["Single cell line", "Off-target effects not fully characterized"],
      conflictsOfInterest: false,
      dateAssessed: new Date('2023-07-20')
    },
    {
      article: crisprPapers[2],
      strengthScore: 'moderate',
      qualityScore: 'moderate',
      relevanceScore: 0.82,
      keyFindings: [
        "15-73% efficiency variation across laboratories",
        "Electroporation superior to lipofection (58% vs 41%)",
        "30°C incubation improves efficiency 1.4-fold",
        "Protocol standardization critical for reproducibility"
      ],
      studyType: 'experimental',
      sampleSize: 80,
      methodologyNotes: "Multi-laboratory comparison with standardized protocols",
      limitations: ["Limited number of gRNAs tested", "Variable laboratory expertise"],
      conflictsOfInterest: false,
      dateAssessed: new Date('2023-06-10')
    },
    {
      article: crisprPapers[3],
      strengthScore: 'moderate',
      qualityScore: 'moderate',
      relevanceScore: 0.76,
      keyFindings: [
        "12-79% efficiency variation between Cas9 batches",
        "Freeze-thaw cycles reduce efficiency by 50%",
        "Protein storage conditions critical",
        "Commercial batch-to-batch variation significant"
      ],
      studyType: 'experimental',
      sampleSize: 45,
      methodologyNotes: "Comparison of 15 commercial Cas9 preparations",
      limitations: ["Limited to commercial sources", "Short-term storage study only"],
      conflictsOfInterest: true,
      dateAssessed: new Date('2023-05-25')
    },
    {
      article: crisprPapers[4],
      strengthScore: 'high',
      qualityScore: 'very-high',
      relevanceScore: 0.91,
      keyFindings: [
        "PAM-proximal positions 17-20 most critical for efficiency",
        "Specific dinucleotide patterns predict high (>80%) vs low (<20%) efficiency",
        "Machine learning achieves 78% accuracy in prediction",
        "Sequence motifs explain efficiency variation"
      ],
      studyType: 'experimental',
      sampleSize: 5000,
      methodologyNotes: "High-throughput screening with machine learning analysis",
      limitations: ["Single cell line", "Computational predictions need validation"],
      conflictsOfInterest: false,
      dateAssessed: new Date('2023-04-18')
    }
  ];
}

// Create evidence papers for Western blot topic  
function createWesternBlotEvidencePapers(): EvidencePaper[] {
  return [
    {
      article: westernBlotPapers[0],
      strengthScore: 'high',
      qualityScore: 'high',
      relevanceScore: 0.93,
      keyFindings: [
        "GAPDH varies 2.3-fold under hypoxia vs β-actin 1.2-fold",
        "β-actin affected 3.1-fold by cytoskeletal disruption", 
        "Neither control universally reliable",
        "Condition-specific validation required"
      ],
      studyType: 'experimental',
      sampleSize: 144,
      methodologyNotes: "Systematic comparison across 12 cell lines and stress conditions",
      limitations: ["Limited stress conditions tested", "No clinical samples"],
      conflictsOfInterest: false,
      dateAssessed: new Date('2023-09-01')
    },
    {
      article: westernBlotPapers[1],
      strengthScore: 'high',
      qualityScore: 'very-high',
      relevanceScore: 0.89,
      keyFindings: [
        "Total protein CV 8.3% vs β-actin 23.4% vs GAPDH 19.7%",
        "Total protein unaffected by treatments altering housekeeping genes 4-fold",
        "Superior consistency across diverse samples",
        "Alternative to traditional housekeeping controls"
      ],
      studyType: 'experimental', 
      sampleSize: 200,
      methodologyNotes: "Comprehensive comparison using multiple normalization methods",
      limitations: ["Requires additional staining step", "Not suitable for all detection methods"],
      conflictsOfInterest: false,
      dateAssessed: new Date('2023-08-28')
    },
    {
      article: westernBlotPapers[2],
      strengthScore: 'moderate',
      qualityScore: 'moderate',
      relevanceScore: 0.78,
      keyFindings: [
        "α-tubulin varies 2.8-fold during cell cycle",
        "Dramatically altered by microtubule drugs",
        "CV 12.1% under standard conditions",
        "GAPDH more stable for cell cycle studies"
      ],
      studyType: 'experimental',
      sampleSize: 96,
      methodologyNotes: "Cell cycle analysis with multiple cancer cell lines",
      limitations: ["Limited to cancer cell lines", "Single drug class tested"],
      conflictsOfInterest: false,
      dateAssessed: new Date('2023-07-15')
    },
    {
      article: westernBlotPapers[3],
      strengthScore: 'high',
      qualityScore: 'moderate',
      relevanceScore: 0.85,
      keyFindings: [
        "GAPDH increases 3.2-fold during glucose deprivation",
        "β-actin decreases 40% during serum starvation",
        "Ribosomal S6 most stable (CV 9.8%) across metabolic changes",
        "Loading controls respond to metabolic perturbations"
      ],
      studyType: 'experimental',
      sampleSize: 72,
      methodologyNotes: "Multiple metabolic stress conditions tested",
      limitations: ["Single cell type", "Limited metabolic conditions"],
      conflictsOfInterest: false,
      dateAssessed: new Date('2023-06-22')
    },
    {
      article: westernBlotPapers[4],
      strengthScore: 'low',
      qualityScore: 'low',
      relevanceScore: 0.71,
      keyFindings: [
        "67% labs use β-actin, 28% GAPDH, 5% others",
        "43% never validate their chosen control",
        "2.8-fold variation in results based on control choice",
        "Systematic bias in loading control selection"
      ],
      studyType: 'observational',
      sampleSize: 150,
      methodologyNotes: "Multi-laboratory survey with sample comparison",
      limitations: ["Survey-based data", "Self-reported practices", "Limited sample comparison"],
      conflictsOfInterest: false,
      dateAssessed: new Date('2023-05-30')
    }
  ];
}

// Create evidence papers for p53 topic
function createP53EvidencePapers(): EvidencePaper[] {
  return [
    {
      article: p53Papers[0],
      strengthScore: 'very-high',
      qualityScore: 'very-high',
      relevanceScore: 0.96,
      keyFindings: [
        "89% of DNA-damaged cells undergo G1/S arrest with wild-type p53",
        "67% of severely damaged cells undergo apoptosis", 
        "5.2-fold faster tumor development in p53 knockout mice",
        "156 tumor suppressor genes upregulated downstream of p53"
      ],
      studyType: 'experimental',
      sampleSize: 240,
      methodologyNotes: "Mouse models with transcriptomic analysis",
      limitations: ["Mouse model may not reflect human cancer", "Early-stage focus only"],
      conflictsOfInterest: false,
      dateAssessed: new Date('2023-09-10')
    },
    {
      article: p53Papers[1],
      strengthScore: 'high',
      qualityScore: 'high',
      relevanceScore: 0.88,
      keyFindings: [
        "Mutant p53 enhances invasion 4.7-fold vs p53-null",
        "Direct activation of EMT transcription factors TWIST1 and ZEB1",
        "E-cadherin downregulation and increased metastatic potential",
        "Specific mutations correlate with poor prognosis"
      ],
      studyType: 'experimental',
      sampleSize: 180,
      methodologyNotes: "Cell culture and patient sample correlation analysis",
      limitations: ["Limited to pancreatic cancer", "Specific mutations only"],
      conflictsOfInterest: false,
      dateAssessed: new Date('2023-08-25')
    },
    {
      article: p53Papers[2],
      strengthScore: 'high',
      qualityScore: 'high',
      relevanceScore: 0.92,
      keyFindings: [
        "p53 loss accelerates colon cancer growth 3.8-fold",
        "p53 expression correlates with melanoma metastasis (r=0.67)",
        "Different gene sets regulated by p53 in different cancer types",
        "Tissue-specific p53 functions explain paradoxical roles"
      ],
      studyType: 'experimental',
      sampleSize: 320,
      methodologyNotes: "Multi-cancer comparative analysis with RNA-seq",
      limitations: ["Limited cancer types studied", "Correlation vs causation"],
      conflictsOfInterest: false,
      dateAssessed: new Date('2023-07-30')
    },
    {
      article: p53Papers[3],
      strengthScore: 'high',
      qualityScore: 'moderate',
      relevanceScore: 0.81,
      keyFindings: [
        "p53α suppresses tumor growth by 72%",
        "ΔNp53 promotes tumor growth 2.3-fold",
        "Isoform ratios vary between cancer types",
        "High ΔNp53/p53α ratio correlates with poor outcomes in glioblastoma"
      ],
      studyType: 'experimental',
      sampleSize: 156,
      methodologyNotes: "Xenograft models with isoform-specific analysis",
      limitations: ["Limited to specific isoforms", "Xenograft model limitations"],
      conflictsOfInterest: false,
      dateAssessed: new Date('2023-06-18')
    },
    {
      article: p53Papers[4],
      strengthScore: 'moderate',
      qualityScore: 'high',
      relevanceScore: 0.79,
      keyFindings: [
        "MDM2 >3-fold above normal inactivates p53 in 34% of cancers",
        "MDM2 inhibitors restore p53 function in vitro",
        "Limited clinical efficacy due to MDM4 resistance",
        "MDM2 levels determine p53 tumor suppressor function"
      ],
      studyType: 'review',
      sampleSize: 2340,
      methodologyNotes: "Meta-analysis of 47 studies with clinical correlation",
      limitations: ["Review-based analysis", "Heterogeneous study designs"],
      conflictsOfInterest: false,
      dateAssessed: new Date('2023-05-12')
    }
  ];
}

// Create the three sample scientific topics
export const sampleScientificTopics: ScientificTopic[] = [
  {
    id: "crispr-cas9-hek293-efficiency",
    title: "CRISPR-Cas9 cutting efficiency in HEK293 cells",
    description: "Investigation of factors affecting CRISPR-Cas9 genome editing efficiency in human embryonic kidney 293 cells, including guide RNA design, chromatin accessibility, experimental conditions, and protein quality.",
    keywords: ["CRISPR-Cas9", "HEK293", "cutting efficiency", "guide RNA", "genome editing"],
    relatedTerms: ["gRNA design", "PAM sequence", "chromatin accessibility", "off-target effects", "editing success rate"],
    evidencePapers: createCrisprEvidencePapers(),
    evidenceSummary: createEvidenceSummary(createCrisprEvidencePapers()),
    overallAssessment: calculateOverallAssessment(createEvidenceSummary(createCrisprEvidencePapers())),
    confidenceLevel: 0.82,
    researchGaps: [
      "Limited data on efficiency in other cell types",
      "Long-term stability of edits not well characterized", 
      "Standardized protocols needed across laboratories"
    ],
    controversies: [
      "Optimal GC content ranges vary between studies (45-65%)",
      "Temperature effects inconsistent across laboratories",
      "Conflicting results on chromatin modifier effects"
    ],
    futureDirections: [
      "Development of improved Cas9 variants",
      "Machine learning for gRNA optimization",
      "Standardized efficiency measurement protocols"
    ],
    lastReviewed: new Date('2023-09-15'),
    createdBy: "research_team",
    reviewedBy: ["expert_1", "expert_2"],
    version: 1,
    parentTopics: ["genome-editing", "molecular-biology-methods"],
    childTopics: ["cas9-variants", "gRNA-optimization"]
  },
  {
    id: "western-blot-loading-controls",
    title: "Western blot loading control reliability", 
    description: "Comparative analysis of housekeeping proteins used as loading controls in Western blot analysis, examining the reliability of β-actin, GAPDH, α-tubulin, and alternative normalization methods across different experimental conditions.",
    keywords: ["Western blot", "loading control", "β-actin", "GAPDH", "α-tubulin", "normalization"],
    relatedTerms: ["housekeeping genes", "protein normalization", "total protein staining", "coefficient of variation", "experimental validation"],
    evidencePapers: createWesternBlotEvidencePapers(),
    evidenceSummary: createEvidenceSummary(createWesternBlotEvidencePapers()),
    overallAssessment: calculateOverallAssessment(createEvidenceSummary(createWesternBlotEvidencePapers())),
    confidenceLevel: 0.74,
    researchGaps: [
      "Limited validation in primary tissues and clinical samples",
      "Insufficient data on disease-specific loading control stability",
      "Need for automated loading control selection tools"
    ],
    controversies: [
      "β-actin vs GAPDH reliability varies by experimental condition", 
      "Total protein staining acceptance varies between journals",
      "No consensus on validation requirements for loading controls"
    ],
    futureDirections: [
      "Development of condition-specific loading control databases",
      "Automated normalization methods using multiple references",
      "Standardized validation protocols for new experimental conditions"
    ],
    lastReviewed: new Date('2023-09-20'),
    createdBy: "proteomics_lab",
    reviewedBy: ["method_expert", "biostatistician"],
    version: 2,
    parentTopics: ["protein-analysis-methods", "biochemical-techniques"],
    childTopics: ["protein-quantification", "experimental-validation"]
  },
  {
    id: "p53-tumor-suppressor-function",
    title: "p53 tumor suppressor function in cancer progression",
    description: "Analysis of p53's complex role in cancer, examining evidence for both tumor suppressor and metastasis-promoting functions depending on mutation status, cancer type, cellular context, and p53 isoform expression.",
    keywords: ["p53", "tumor suppressor", "cancer progression", "metastasis", "oncogene"],
    relatedTerms: ["TP53 mutations", "gain-of-function", "loss-of-function", "EMT", "cell cycle checkpoint", "apoptosis"],
    evidencePapers: createP53EvidencePapers(),
    evidenceSummary: createEvidenceSummary(createP53EvidencePapers()),
    overallAssessment: calculateOverallAssessment(createEvidenceSummary(createP53EvidencePapers())),
    confidenceLevel: 0.69,
    researchGaps: [
      "Limited understanding of tissue-specific p53 functions",
      "Insufficient data on p53 isoform roles in different cancers", 
      "Need for better predictive models of p53 behavior"
    ],
    controversies: [
      "p53 can both suppress and promote cancer depending on context",
      "Conflicting evidence on mutant p53 gain-of-function mechanisms",
      "Debate over p53's role in metastasis vs primary tumor formation"
    ],
    futureDirections: [
      "Context-specific therapeutic targeting of p53 pathways",
      "Development of isoform-specific p53 modulators", 
      "Integration of p53 status with precision cancer medicine"
    ],
    lastReviewed: new Date('2023-09-25'),
    createdBy: "cancer_biology_team",
    reviewedBy: ["oncologist", "molecular_biologist", "pathologist"],
    version: 3,
    parentTopics: ["cancer-biology", "tumor-suppressor-genes"],
    childTopics: ["p53-mutations", "cancer-therapeutics", "EMT-pathway"]
  }
];