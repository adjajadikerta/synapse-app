export interface PubMedArticle {
  pmid: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  abstract?: string;
  doi?: string;
}

export interface PubMedSearchResult {
  articles: PubMedArticle[];
  total: number;
}

const PUBMED_BASE_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';

// Search PubMed for articles
export async function searchPubMed(query: string, maxResults: number = 20): Promise<PubMedSearchResult> {
  try {
    // Step 1: Search for PMIDs
    const searchUrl = `${PUBMED_BASE_URL}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=${maxResults}&retmode=json`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchData.esearchresult?.idlist?.length) {
      return { articles: [], total: 0 };
    }

    const pmids = searchData.esearchresult.idlist;
    const total = parseInt(searchData.esearchresult.count);

    // Step 2: Fetch full details for the articles
    const articles = await fetchArticleDetails(pmids);

    return { articles, total };
  } catch (error) {
    console.error('Error searching PubMed:', error);
    return { articles: [], total: 0 };
  }
}

// Fetch detailed information for specific PMIDs
async function fetchArticleDetails(pmids: string[]): Promise<PubMedArticle[]> {
  try {
    const idsString = pmids.join(',');
    const fetchUrl = `${PUBMED_BASE_URL}/efetch.fcgi?db=pubmed&id=${idsString}&retmode=xml`;
    
    const response = await fetch(fetchUrl);
    const xmlText = await response.text();
    
    return parseXMLResponse(xmlText);
  } catch (error) {
    console.error('Error fetching article details:', error);
    return [];
  }
}

// Parse XML response from PubMed
function parseXMLResponse(xmlText: string): PubMedArticle[] {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const articles = xmlDoc.getElementsByTagName('PubmedArticle');
    
    const results: PubMedArticle[] = [];
    
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      
      try {
        const pmid = article.querySelector('PMID')?.textContent || '';
        
        const titleElement = article.querySelector('ArticleTitle');
        const title = titleElement?.textContent || 'No title available';
        
        // Extract authors
        const authorElements = article.querySelectorAll('Author');
        const authors: string[] = [];
        for (let j = 0; j < authorElements.length; j++) {
          const author = authorElements[j];
          const lastName = author.querySelector('LastName')?.textContent || '';
          const foreName = author.querySelector('ForeName')?.textContent || '';
          if (lastName) {
            authors.push(foreName ? `${foreName} ${lastName}` : lastName);
          }
        }
        
        // Extract journal info
        const journalTitle = article.querySelector('Journal Title')?.textContent || 
                           article.querySelector('ISOAbbreviation')?.textContent ||
                           article.querySelector('MedlineJournalInfo MedlineTA')?.textContent ||
                           'Unknown Journal';
        
        // Extract year
        const pubDateYear = article.querySelector('PubDate Year')?.textContent ||
                           article.querySelector('DateCompleted Year')?.textContent ||
                           new Date().getFullYear().toString();
        
        // Extract abstract (try multiple selectors)
        let abstract: string | undefined;
        const abstractElement = article.querySelector('Abstract AbstractText') ||
                               article.querySelector('AbstractText') ||
                               article.querySelector('Abstract');
        
        if (abstractElement) {
          // Handle structured abstracts with multiple sections
          const abstractSections = article.querySelectorAll('Abstract AbstractText');
          if (abstractSections.length > 1) {
            abstract = Array.from(abstractSections)
              .map(section => section.textContent || '')
              .join(' ')
              .trim();
          } else {
            abstract = abstractElement.textContent?.trim() || undefined;
          }
        }
        
        // Extract DOI
        const doiElement = article.querySelector('ArticleId[IdType="doi"]');
        const doi = doiElement?.textContent || undefined;
        
        results.push({
          pmid,
          title,
          authors,
          journal: journalTitle,
          year: parseInt(pubDateYear),
          abstract,
          doi
        });
      } catch (error) {
        console.error('Error parsing individual article:', error);
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error parsing XML response:', error);
    return [];
  }
}

// Get some default biomedical papers for initial load
export async function getDefaultPapers(): Promise<PubMedSearchResult> {
  const queries = [
    'CRISPR gene editing',
    'protein folding',
    'cancer immunotherapy'
  ];
  
  try {
    const allArticles: PubMedArticle[] = [];
    
    for (const query of queries) {
      const result = await searchPubMed(query, 3);
      allArticles.push(...result.articles);
    }
    
    return {
      articles: allArticles.slice(0, 10), // Limit to 10 papers
      total: allArticles.length
    };
  } catch (error) {
    console.error('Error fetching default papers:', error);
    return { articles: [], total: 0 };
  }
}