/**
 * AMiner API Client
 */

import fetch from 'node-fetch';
import { 
  AminerConfig, 
  AminerSearchResponse, 
  SearchParams, 
  SearchResult,
  AminerPaper,
  Paper,
  SearchResultFormatted,
  ErrorResult
} from './types.js';

export class AminerClient {
  private config: AminerConfig;

  constructor(config: AminerConfig) {
    this.config = config;
  }

  /**
   * Search papers
   */
  async searchPapers(params: SearchParams): Promise<SearchResult> {
    // Validate required parameters
    if (!params.keyword && !params.venue && !params.author) {
      throw new Error('At least one of keyword, venue, or author must be provided');
    }

    if (params.size > 10) {
      throw new Error('Size parameter cannot exceed 10');
    }

    // Build query parameters
    const searchParams = new URLSearchParams();
    if (params.keyword) searchParams.append('keyword', params.keyword);
    if (params.venue) searchParams.append('venue', params.venue);
    if (params.author) searchParams.append('author', params.author);
    searchParams.append('page', params.page.toString());
    searchParams.append('size', params.size.toString());
    if (params.order) searchParams.append('order', params.order);

    const url = `${this.config.baseUrl}?${searchParams.toString()}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': this.config.apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json() as AminerSearchResponse;

      // Add detailed response data check
      if (!data) {
        throw new Error('API returned empty response');
      }

      if (!data.success) {
        throw new Error(`API Error (${data.code}): ${data.msg}`);
      }

      // Check the completeness of the response data
      if (typeof data.total !== 'number') {
        console.warn('API response missing or invalid total field, defaulting to 0');
      }

      // Ensure data.data is not null, if it is null, use an empty array
      const papers = data.data || [];
      const total = data.total || 0;

      return {
        papers,
        total,
        page: params.page,
        size: params.size,
        hasMore: (params.page + 1) * params.size < total,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to search papers: ${error.message}`);
      }
      throw new Error('Unknown error occurred while searching papers');
    }
  }

  /**
   * Search papers by keyword
   */
  async searchByKeyword(keyword: string, page = 0, size = 10, order?: 'year' | 'n_citation'): Promise<SearchResult> {
    return this.searchPapers({ keyword, page, size, order });
  }

  /**
   * Search papers by venue
   */
  async searchByVenue(venue: string, page = 0, size = 10, order?: 'year' | 'n_citation'): Promise<SearchResult> {
    return this.searchPapers({ venue, page, size, order });
  }

  /**
   * Search papers by author
   */
  async searchByAuthor(author: string, page = 0, size = 10, order?: 'year' | 'n_citation'): Promise<SearchResult> {
    return this.searchPapers({ author, page, size, order });
  }

  /**
   * Format paper information as JSON
   */
  formatPaper(paper: AminerPaper | null | undefined): Paper | ErrorResult {
    // Add empty value check
    if (!paper) {
      return {
        error: "Invalid Paper Data",
        message: "No paper information available."
      };
    }

    const title = paper.title_zh || paper.title || 'N/A';
    const authors = paper.authors && Array.isArray(paper.authors) 
      ? paper.authors.map((author) => ({
          name: author?.name_zh || author?.name || 'Unknown',
          org: author?.org || null
        }))
      : [];
    const venue = paper.venue ? {
      name_zh: paper.venue.name_zh || null,
      name_en: paper.venue.name_en || null,
      alias: paper.venue.alias || null
    } : null;
    const year = paper.year || null;
    const citations = paper.n_citation || 0;
    const abstract = paper.abstract_zh || paper.abstract || null;
    const doi = paper.doi || null;
    const url = paper.url || null;
    const keywords = paper.keywords_zh || paper.keywords || [];

    return {
      title,
      authors,
      venue,
      year,
      citations,
      abstract,
      doi,
      url,
      keywords,
      language: paper.language || null
    };
  }

  /**
   * Format search results as JSON
   */
  formatSearchResults(result: SearchResult): SearchResultFormatted {
    const { papers, total, page, size, hasMore } = result;
    
    // Ensure papers is not null or undefined
    const formattedPapers = papers && Array.isArray(papers) 
      ? papers.map((paper, index) => {
          const formattedPaper = this.formatPaper(paper);
          // Only process successfully formatted papers, skip error results
          if ('error' in formattedPaper) {
            return null;
          }
          return {
            index: page * size + index + 1,
            ...formattedPaper
          };
        }).filter((paper): paper is NonNullable<typeof paper> => paper !== null)
      : [];

    return {
      summary: {
        total,
        page: page + 1,
        size,
        hasMore,
        currentPageResults: formattedPapers.length
      },
      papers: formattedPapers,
      pagination: {
        currentPage: page + 1,
        nextPage: hasMore ? page + 2 : null,
        previousPage: page > 0 ? page : null
      }
    };
  }
}
