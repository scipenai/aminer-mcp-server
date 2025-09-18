/**
 * AMiner API Client
 */

import fetch from 'node-fetch';
import { AminerConfig, AminerSearchResponse, SearchParams, SearchResult } from './types.js';

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

      if (!data.success) {
        throw new Error(`API Error (${data.code}): ${data.msg}`);
      }

      return {
        papers: data.data,
        total: data.total,
        page: params.page,
        size: params.size,
        hasMore: (params.page + 1) * params.size < data.total,
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
   * Format paper information as text
   */
  formatPaper(paper: any): string {
    const title = paper.title_zh || paper.title || 'N/A';
    const authors = paper.authors?.map((a: any) => a.name_zh || a.name).join(', ') || 'N/A';
    const venue = paper.venue?.name_zh || paper.venue?.name_en || 'N/A';
    const year = paper.year || 'N/A';
    const citations = paper.n_citation || 0;
    const abstract = paper.abstract_zh || paper.abstract || 'N/A';
    const doi = paper.doi || 'N/A';
    const url = paper.url || 'N/A';

    return `**${title}**
Authors: ${authors}
Venue: ${venue}
Year: ${year}
Citations: ${citations}
Abstract: ${abstract}
DOI: ${doi}
URL: ${url}`;
  }

  /**
   * Format search results as text
   */
  formatSearchResults(result: SearchResult): string {
    const { papers, total, page, size, hasMore } = result;
    
    let output = `Found ${total} papers, showing page ${page + 1} (${size} papers per page)\n\n`;
    
    papers.forEach((paper, index) => {
      output += `${page * size + index + 1}. ${this.formatPaper(paper)}\n\n`;
    });

    if (hasMore) {
      output += `More results available, use page=${page + 1} to view next page`;
    }

    return output;
  }
}
