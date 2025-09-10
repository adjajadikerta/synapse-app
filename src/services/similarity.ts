export interface SimilarityScore {
  pmid: string;
  score: number;
  matchingKeywords: string[];
  titleSimilarity: number;
  abstractSimilarity: number;
}

interface PaperForSimilarity {
  pmid: string;
  title?: string;
  abstract?: string;
}

// Common biomedical stop words to filter out
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 
  'from', 'this', 'that', 'these', 'those', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
  'can', 'must', 'shall', 'we', 'our', 'us', 'i', 'me', 'my', 'you', 'your', 'he', 'him', 'his',
  'she', 'her', 'it', 'its', 'they', 'them', 'their', 'study', 'studies', 'research', 'analysis',
  'results', 'conclusion', 'background', 'methods', 'objective', 'purpose', 'introduction',
  'discussion', 'patients', 'patient', 'subjects', 'participants', 'data', 'using', 'used',
  'significantly', 'significantly', 'increase', 'increased', 'decrease', 'decreased', 'effect',
  'effects', 'treatment', 'control', 'group', 'groups', 'compared', 'comparison', 'vs', 'versus'
]);

// Biomedical abbreviations and their expansions
const ABBREVIATION_MAP: { [key: string]: string } = {
  'dna': 'deoxyribonucleic acid',
  'rna': 'ribonucleic acid',
  'pcr': 'polymerase chain reaction',
  'mri': 'magnetic resonance imaging',
  'ct': 'computed tomography',
  'hiv': 'human immunodeficiency virus',
  'aids': 'acquired immunodeficiency syndrome',
  'covid': 'coronavirus disease',
  'sars': 'severe acute respiratory syndrome',
  'who': 'world health organization',
  'fda': 'food and drug administration',
  'nih': 'national institutes of health',
  'cdc': 'centers for disease control',
  'icu': 'intensive care unit',
  'er': 'emergency room',
  'bp': 'blood pressure',
  'bmi': 'body mass index',
  'ecg': 'electrocardiogram',
  'eeg': 'electroencephalogram'
};

// Extract keywords from title and abstract
export function extractKeywords(text: string): string[] {
  if (!text) return [];
  
  // Convert to lowercase and remove punctuation
  const cleaned = text.toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Split into words
  const words = cleaned.split(' ');
  
  // Filter out stop words and short words
  const filtered = words.filter(word => 
    word.length >= 3 && 
    !STOP_WORDS.has(word) &&
    !/^\d+$/.test(word) // Remove pure numbers
  );
  
  // Expand abbreviations
  const expanded = filtered.map(word => 
    ABBREVIATION_MAP[word] || word
  );
  
  // Extract n-grams (bigrams and trigrams for better context)
  const ngrams: string[] = [...expanded];
  
  // Add bigrams
  for (let i = 0; i < expanded.length - 1; i++) {
    const bigram = `${expanded[i]} ${expanded[i + 1]}`;
    ngrams.push(bigram);
  }
  
  // Add important trigrams (only for biomedical terms)
  for (let i = 0; i < expanded.length - 2; i++) {
    const trigram = `${expanded[i]} ${expanded[i + 1]} ${expanded[i + 2]}`;
    // Only add trigrams that look like biomedical terms
    if (isBiomedicalTerm(trigram)) {
      ngrams.push(trigram);
    }
  }
  
  // Remove duplicates and return
  const result = [...new Set(ngrams)];
  console.log(`🔤 Extracted ${result.length} keywords from text:`, result.slice(0, 10)); // Show first 10 keywords
  return result;
}

// Check if a term looks biomedical
function isBiomedicalTerm(term: string): boolean {
  const biomedicalPatterns = [
    /protein/i, /gene/i, /cell/i, /tissue/i, /cancer/i, /tumor/i, /disease/i,
    /therapy/i, /treatment/i, /drug/i, /medicine/i, /clinical/i, /patient/i,
    /syndrome/i, /disorder/i, /infection/i, /virus/i, /bacteria/i, /immune/i,
    /blood/i, /brain/i, /heart/i, /kidney/i, /liver/i, /lung/i, /bone/i,
    /muscle/i, /nerve/i, /hormone/i, /enzyme/i, /antibody/i, /vaccine/i,
    /diagnosis/i, /screening/i, /biomarker/i, /pathway/i, /mechanism/i,
    /receptor/i, /inhibitor/i, /activation/i, /expression/i, /mutation/i
  ];
  
  return biomedicalPatterns.some(pattern => pattern.test(term));
}

// Calculate Jaccard similarity between two sets (unused but kept for potential future use)
// function jaccardSimilarity(set1: Set<string>, set2: Set<string>): number {
//   const intersection = new Set([...set1].filter(x => set2.has(x)));
//   const union = new Set([...set1, ...set2]);
//   
//   return union.size === 0 ? 0 : intersection.size / union.size;
// }

// Calculate cosine similarity using term frequency
function cosineSimilarity(keywords1: string[], keywords2: string[]): number {
  // Create term frequency maps
  const tf1 = new Map<string, number>();
  const tf2 = new Map<string, number>();
  
  keywords1.forEach(keyword => {
    tf1.set(keyword, (tf1.get(keyword) || 0) + 1);
  });
  
  keywords2.forEach(keyword => {
    tf2.set(keyword, (tf2.get(keyword) || 0) + 1);
  });
  
  // Get all unique terms
  const allTerms = new Set([...tf1.keys(), ...tf2.keys()]);
  
  // Calculate dot product and magnitudes
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;
  
  for (const term of allTerms) {
    const freq1 = tf1.get(term) || 0;
    const freq2 = tf2.get(term) || 0;
    
    dotProduct += freq1 * freq2;
    magnitude1 += freq1 * freq1;
    magnitude2 += freq2 * freq2;
  }
  
  const denominator = Math.sqrt(magnitude1) * Math.sqrt(magnitude2);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

// Calculate similarity between two papers
export function calculateSimilarity(paper1: PaperForSimilarity, paper2: PaperForSimilarity): SimilarityScore {
  // Extract keywords from titles and abstracts
  const titleKeywords1 = extractKeywords(paper1.title || '');
  const titleKeywords2 = extractKeywords(paper2.title || '');
  const abstractKeywords1 = extractKeywords(paper1.abstract || '');
  const abstractKeywords2 = extractKeywords(paper2.abstract || '');
  
  console.log(`🔤 Paper 1 keywords - Title: ${titleKeywords1.length}, Abstract: ${abstractKeywords1.length}`);
  console.log(`🔤 Paper 2 keywords - Title: ${titleKeywords2.length}, Abstract: ${abstractKeywords2.length}`);
  
  // Combine all keywords for each paper
  const allKeywords1 = [...titleKeywords1, ...abstractKeywords1];
  const allKeywords2 = [...titleKeywords2, ...abstractKeywords2];
  
  // Calculate different similarity metrics
  const titleSimilarity = cosineSimilarity(titleKeywords1, titleKeywords2);
  const abstractSimilarity = cosineSimilarity(abstractKeywords1, abstractKeywords2);
  
  console.log(`📊 Similarity scores - Title: ${titleSimilarity.toFixed(3)}, Abstract: ${abstractSimilarity.toFixed(3)}`);
  
  // Overall similarity with weighted importance
  const titleWeight = 0.4;
  const abstractWeight = 0.6;
  const overallSimilarity = (titleSimilarity * titleWeight) + (abstractSimilarity * abstractWeight);
  
  // Find matching keywords
  const keywordSet1 = new Set(allKeywords1);
  const keywordSet2 = new Set(allKeywords2);
  const matchingKeywords = [...keywordSet1].filter(keyword => keywordSet2.has(keyword));
  
  console.log(`🎯 Overall similarity: ${overallSimilarity.toFixed(3)}, Matching keywords: ${matchingKeywords.length}`);
  
  return {
    pmid: paper2.pmid,
    score: overallSimilarity,
    matchingKeywords: matchingKeywords.slice(0, 10), // Top 10 matching keywords
    titleSimilarity,
    abstractSimilarity
  };
}

// Find similar papers for a given paper
export function findSimilarPapers(targetPaper: PaperForSimilarity, candidatePapers: PaperForSimilarity[], maxResults: number = 5): SimilarityScore[] {
  console.log('🔬 findSimilarPapers: Starting similarity calculation');
  console.log('🎯 Target paper:', targetPaper.title, 'PMID:', targetPaper.pmid);
  console.log('📊 Target has abstract:', !!targetPaper.abstract);
  console.log('📚 Candidate papers count:', candidatePapers.length);
  
  if (!candidatePapers.length) {
    console.log('❌ No candidate papers to compare against');
    return [];
  }
  
  const filteredCandidates = candidatePapers.filter(paper => paper.pmid !== targetPaper.pmid);
  console.log('🔍 After filtering out target paper:', filteredCandidates.length, 'candidates');
  
  const similarities = filteredCandidates
    .map(paper => {
      const similarity = calculateSimilarity(targetPaper, paper);
      console.log(`📈 Similarity with "${paper.title}": ${similarity.score.toFixed(3)}`);
      return similarity;
    })
    .filter(similarity => {
      const passes = similarity.score > 0.01; // Very low threshold for debugging
      console.log(`🎯 Paper ${similarity.pmid} similarity ${similarity.score.toFixed(3)} ${passes ? 'PASSES' : 'FAILS'} threshold (0.01)`);
      return passes;
    })
    .sort((a, b) => b.score - a.score) // Sort by similarity score (highest first)
    .slice(0, maxResults);
  
  console.log('✅ Final similar papers found:', similarities.length);
  return similarities;
}

// Extract important terms for paper categorization
export function extractImportantTerms(papers: PaperForSimilarity[]): Map<string, number> {
  const termFrequency = new Map<string, number>();
  
  papers.forEach(paper => {
    const keywords = [
      ...extractKeywords(paper.title || ''),
      ...extractKeywords(paper.abstract || '')
    ];
    
    keywords.forEach(keyword => {
      termFrequency.set(keyword, (termFrequency.get(keyword) || 0) + 1);
    });
  });
  
  // Filter to get only terms that appear in multiple papers
  const importantTerms = new Map<string, number>();
  for (const [term, frequency] of termFrequency.entries()) {
    if (frequency >= 2 && isBiomedicalTerm(term)) {
      importantTerms.set(term, frequency);
    }
  }
  
  return importantTerms;
}