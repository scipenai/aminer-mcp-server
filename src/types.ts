/**
 * AMiner API Type Definitions
 */

export interface AminerConfig {
  apiKey: string;
  baseUrl: string;
}

export interface AminerAuthor {
  name: string;
  name_zh: string;
  id: string;
  org: string;
  org_id: string;
  org_alias: string;
  org_detail: string;
  org_short: string;
}

export interface AminerVenue {
  name_zh: string;
  name_en: string;
  alias: string;
}

export interface AminerPaper {
  _id: string;
  abstract: string;
  abstract_zh: string;
  alias: string[];
  authors: AminerAuthor[];
  doi: string;
  id: string;
  introduction: string;
  keywords: string[];
  keywords_zh: string[];
  language: string;
  n_citation: number;
  name: string;
  name_en: string;
  name_zh: string;
  title: string;
  title_zh: string;
  url: string;
  venue: AminerVenue;
  venue_hhb_id: string;
  year: number;
}

export interface AminerSearchResponse {
  code: number;
  success: boolean;
  msg: string;
  data: AminerPaper[] | null; // data 可能为 null
  total: number;
  log_id: string;
}

export interface SearchParams {
  keyword?: string;
  venue?: string;
  author?: string;
  page: number;
  size: number;
  order?: 'year' | 'n_citation';
}

export interface SearchResult {
  papers: AminerPaper[];
  total: number;
  page: number;
  size: number;
  hasMore: boolean;
}

/**
 * Format paper information as JSON
 */
export interface Author {
  name: string;
  org: string | null;
}

export interface Venue {
  name_zh: string | null;
  name_en: string | null;
  alias: string | null;
}

export interface Paper {
  title: string;
  authors: Author[];
  venue: Venue | null;
  year: number | null;
  citations: number;
  abstract: string | null;
  doi: string | null;
  url: string | null;
  keywords: string[];
  language: string | null;
}

export interface PaperWithIndex extends Paper {
  index: number;
}

export interface SearchResultFormatted {
  summary: {
    total: number;
    page: number;
    size: number;
    hasMore: boolean;
    currentPageResults: number;
  };
  papers: PaperWithIndex[];
  pagination: {
    currentPage: number;
    nextPage: number | null;
    previousPage: number | null;
  };
}

export interface ErrorResult {
  error: string;
  message: string;
}
