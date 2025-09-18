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
  data: AminerPaper[];
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
