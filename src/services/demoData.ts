export interface DemoArticle {
  pmid: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  abstract?: string;
  doi?: string;
}

export interface DemoSearchResult {
  articles: DemoArticle[];
  total: number;
}

// Demo papers with realistic biomedical content and abstracts
const DEMO_PAPERS: DemoArticle[] = [
  {
    pmid: "demo001",
    title: "CRISPR-Cas9 efficiency varies with target sequence and chromatin accessibility",
    authors: ["Smith JA", "Johnson MB", "Lee CK", "Rodriguez P", "Kim SH"],
    journal: "Nature Biotechnology",
    year: 2023,
    abstract: "CRISPR-Cas9 genome editing efficiency is influenced by multiple factors including target sequence composition and local chromatin structure. We performed a comprehensive analysis of 2,847 guide RNAs targeting various genomic loci in human cell lines. Our results demonstrate that guide RNAs with high GC content (60-70%) and targeting open chromatin regions show 3.2-fold higher editing efficiency compared to those in heterochromatin. Additionally, we identified specific sequence motifs that enhance or inhibit Cas9 activity. These findings provide crucial insights for improving CRISPR design algorithms and achieving more predictable genome editing outcomes.",
    doi: "10.1038/nbt.2023.001"
  },
  {
    pmid: "demo002", 
    title: "Machine learning approaches for predicting protein-drug interactions in cancer therapy",
    authors: ["Wang X", "Chen L", "Martinez A"],
    journal: "Nature Machine Intelligence",
    year: 2024,
    abstract: "Predicting protein-drug interactions is crucial for drug discovery and understanding therapeutic mechanisms. We developed a deep learning framework that integrates protein structure data, chemical fingerprints, and gene expression profiles to predict binding affinities. Our model, trained on 145,000 protein-drug pairs, achieved 89% accuracy in binding prediction and identified 23 novel drug-target interactions subsequently validated experimentally. The approach successfully predicted off-target effects for FDA-approved cancer drugs, revealing potential side effects and repurposing opportunities.",
    doi: "10.1038/s42256.2024.001"
  },
  {
    pmid: "demo003",
    title: "Cell culture conditions significantly affect protein expression levels in mammalian systems", 
    authors: ["Johnson R", "Lee SY", "Patel N", "Brown K"],
    journal: "Cell Biology International",
    year: 2024,
    abstract: "Mammalian cell culture conditions including temperature, pH, osmolality, and dissolved oxygen levels critically impact recombinant protein expression. We systematically evaluated HEK293 and CHO cell lines under 48 different culture conditions. Temperature reduction from 37°C to 32°C increased protein yield by 45% while maintaining proper folding. pH optimization (7.0-7.2) and controlled feeding strategies enhanced productivity by 60%. Our standardized protocols provide reproducible high-yield protein production for structural and functional studies.",
    doi: "10.1002/cbi.2024.003"
  },
  {
    pmid: "demo004",
    title: "Antibody storage temperature impacts Western blot detection sensitivity and specificity",
    authors: ["Wilson EM", "Davis JL", "Thompson AG", "Miller RK"],
    journal: "Nature Protocols", 
    year: 2023,
    abstract: "Proper antibody storage is essential for reproducible immunoblotting results. We tested 156 commercial antibodies stored at -80°C, -20°C, 4°C, and room temperature over 12 months. Antibodies stored at 4°C showed 15% signal decrease after 6 months, while -20°C storage maintained 95% activity for 12 months. Freeze-thaw cycles reduced sensitivity by 8% per cycle. Primary antibodies in glycerol-based buffers showed superior stability. We provide evidence-based storage recommendations to ensure consistent Western blot reproducibility across laboratories.",
    doi: "10.1038/nprot.2023.004"
  },
  {
    pmid: "demo005",
    title: "Single-cell RNA sequencing reveals heterogeneity in tumor microenvironment immune cells",
    authors: ["Zhang Y", "Liu H", "Kumar S", "Anderson JM", "Taylor DF"],
    journal: "Cell",
    year: 2024,
    abstract: "The tumor microenvironment contains diverse immune cell populations with distinct functional states. Using single-cell RNA sequencing, we profiled 89,000 immune cells from 45 human tumor samples across 6 cancer types. We identified 12 distinct T-cell states, including exhausted CD8+ populations and regulatory T-cell subsets with tumor-promoting functions. Macrophages showed M1/M2 polarization gradients correlating with patient survival. Our cell atlas reveals immunosuppressive mechanisms and identifies potential therapeutic targets for cancer immunotherapy.",
    doi: "10.1016/j.cell.2024.005"
  },
  {
    pmid: "demo006",
    title: "COVID-19 mRNA vaccines induce robust T-cell responses against SARS-CoV-2 variants",
    authors: ["Roberts K", "Chang WL", "Nakamura T", "Singh P"],
    journal: "Nature Immunology",
    year: 2023,
    abstract: "Understanding T-cell immunity to SARS-CoV-2 variants is crucial for vaccine effectiveness. We analyzed T-cell responses in 234 vaccinated individuals against Alpha, Beta, Gamma, Delta, and Omicron variants. CD8+ T-cells showed 89% cross-reactivity across variants, while CD4+ responses maintained 76% effectiveness. Memory T-cell populations persisted 12 months post-vaccination with minimal decline. Breakthrough infections in vaccinated individuals showed accelerated viral clearance, supporting T-cell mediated protection beyond neutralizing antibodies.",
    doi: "10.1038/ni.2023.006"
  },
  {
    pmid: "demo007", 
    title: "Mitochondrial dysfunction drives neuroinflammation in Alzheimer's disease progression",
    authors: ["Garcia M", "O'Brien S", "Tanaka H", "Williams CT", "Jackson L"],
    journal: "Nature Neuroscience",
    year: 2024,
    abstract: "Mitochondrial dysfunction is an early event in Alzheimer's disease (AD) pathogenesis. We examined mitochondrial respiration, calcium handling, and inflammatory markers in postmortem brain tissue from 67 AD patients and 34 controls. Complex I activity decreased 42% in AD brains, correlating with microglial activation and IL-1β expression. Mitochondrial calcium overload triggered NLRP3 inflammasome activation, initiating neuroinflammatory cascades. Treatment with mitochondria-targeted antioxidants reduced inflammation and improved cognitive function in APP/PS1 mice, suggesting therapeutic potential.",
    doi: "10.1038/nn.2024.007"
  },
  {
    pmid: "demo008",
    title: "Gut microbiome diversity correlates with metabolic health outcomes in obesity",
    authors: ["Peterson D", "Kumar A", "Li J", "Moore BC", "Stewart F"],
    journal: "Nature Medicine",
    year: 2023,
    abstract: "The gut microbiome plays a crucial role in metabolic regulation and obesity. We analyzed fecal samples from 512 individuals across BMI ranges using 16S rRNA sequencing and metabolomics. Obese individuals showed 35% reduced microbial diversity with Firmicutes/Bacteroidetes ratio increases. Akkermansia muciniphila abundance inversely correlated with BMI and insulin resistance. Short-chain fatty acid production was decreased in obese subjects. Microbiome-targeted interventions including prebiotics restored diversity and improved glucose metabolism in clinical trials.",
    doi: "10.1038/nm.2023.008"
  },
  {
    pmid: "demo009",
    title: "Gene therapy approaches for treating inherited retinal dystrophies show clinical promise", 
    authors: ["Thompson R", "Adams ML", "Chen F", "Rodriguez AS"],
    journal: "The Lancet",
    year: 2024,
    abstract: "Inherited retinal dystrophies affect 1 in 3,000 individuals with limited treatment options. We conducted clinical trials of adeno-associated virus (AAV) gene therapy for Leber congenital amaurosis (LCA) and Stargardt disease. Subretinal injection of AAV2-RPE65 in 28 LCA patients improved visual acuity by 2.3 logMAR units at 12 months. ABCA4 gene replacement in 15 Stargardt patients stabilized disease progression. No serious adverse events occurred. Electroretinography showed improved photoreceptor function, supporting gene therapy as a viable treatment approach.",
    doi: "10.1016/S0140-6736(24)009"
  },
  {
    pmid: "demo010",
    title: "Organoid models reveal drug resistance mechanisms in pancreatic cancer",
    authors: ["Liu S", "Kim DJ", "Patel R", "Johnson WA", "Zhang M"], 
    journal: "Cancer Cell",
    year: 2023,
    abstract: "Patient-derived organoids provide physiologically relevant cancer models for drug testing. We established organoids from 89 pancreatic ductal adenocarcinoma (PDAC) patients and tested 127 therapeutic compounds. Organoid drug responses correlated with patient treatment outcomes (R=0.78). We identified novel resistance mechanisms including upregulation of ABC transporters and metabolic rewiring toward glycolysis. Combination therapies targeting both proliferation and metabolism showed synergistic effects. Organoid models successfully predicted patient responses to personalized treatment strategies in 82% of cases.",
    doi: "10.1016/j.ccell.2023.010"
  },
  {
    pmid: "demo011",
    title: "CRISPR base editing enables precise correction of disease-causing mutations",
    authors: ["Taylor JM", "Rodriguez C", "Kim H", "Anderson P"],
    journal: "Nature Biotechnology",
    year: 2024,
    abstract: "Base editing technologies allow precise single-nucleotide changes without double-strand breaks. We developed improved cytosine and adenine base editors with enhanced efficiency and reduced off-target effects. Testing in primary human cells showed 78% editing efficiency for disease-relevant mutations causing sickle cell disease and beta-thalassemia. Chromatin accessibility and guide RNA design significantly influenced editing outcomes. Our optimized base editors provide a safer alternative to traditional CRISPR-Cas9 for therapeutic genome editing applications.",
    doi: "10.1038/nbt.2024.011"
  },
  {
    pmid: "demo012", 
    title: "Proteomic analysis identifies biomarkers for early cancer detection in blood samples",
    authors: ["Chen W", "Davis R", "Kumar V", "Thompson L"],
    journal: "Nature Medicine",
    year: 2024,
    abstract: "Early detection dramatically improves cancer survival rates. We performed quantitative proteomics analysis of plasma samples from 1,247 individuals including healthy controls and early-stage cancer patients across 8 cancer types. Machine learning identified a 23-protein signature distinguishing cancer patients from controls with 91% sensitivity and 87% specificity. Validation in an independent cohort of 456 participants confirmed diagnostic performance. Protein biomarkers showed superior performance to conventional tumor markers and could detect cancer 6-18 months before clinical symptoms.",
    doi: "10.1038/nm.2024.012"
  }
];

// Get demo papers (simulating API call)
export async function getDemoDefaultPapers(): Promise<DemoSearchResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    articles: DEMO_PAPERS.slice(0, 10), // Return 10 papers by default
    total: DEMO_PAPERS.length
  };
}

// Search demo papers by term
export async function searchDemoPapers(query: string, maxResults: number = 20): Promise<DemoSearchResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  if (!query.trim()) {
    return getDemoDefaultPapers();
  }
  
  const lowerQuery = query.toLowerCase();
  const filtered = DEMO_PAPERS.filter(paper => 
    paper.title.toLowerCase().includes(lowerQuery) ||
    paper.authors.some(author => author.toLowerCase().includes(lowerQuery)) ||
    paper.journal.toLowerCase().includes(lowerQuery) ||
    paper.abstract?.toLowerCase().includes(lowerQuery)
  );
  
  return {
    articles: filtered.slice(0, Math.min(maxResults, filtered.length)),
    total: filtered.length
  };
}

// Get papers by category for more targeted demo searches
export async function getDemoPapersByCategory(category: string): Promise<DemoSearchResult> {
  await new Promise(resolve => setTimeout(resolve, 250));
  
  const categoryMap: { [key: string]: string[] } = {
    'crispr': ['CRISPR', 'genome editing', 'gene editing', 'Cas9'],
    'cancer': ['cancer', 'tumor', 'oncology', 'chemotherapy'],
    'covid': ['COVID', 'SARS-CoV-2', 'vaccine', 'pandemic'],
    'protein': ['protein', 'enzyme', 'antibody', 'expression'],
    'neuroscience': ['brain', 'neuron', 'Alzheimer', 'neuroinflammation'],
    'immunology': ['immune', 'T-cell', 'antibody', 'inflammation'],
    'metabolism': ['metabolic', 'obesity', 'glucose', 'microbiome']
  };
  
  const keywords = categoryMap[category.toLowerCase()] || [category];
  const filtered = DEMO_PAPERS.filter(paper =>
    keywords.some(keyword => 
      paper.title.toLowerCase().includes(keyword.toLowerCase()) ||
      paper.abstract?.toLowerCase().includes(keyword.toLowerCase())
    )
  );
  
  return {
    articles: filtered,
    total: filtered.length
  };
}