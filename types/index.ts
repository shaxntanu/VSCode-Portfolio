export interface Article {
  id: string;
  title: string;
  description: string;
  cover_image: string;
  url: string;
  page_views_count: number;
  public_reactions_count: number;
  comments_count: number;
}

export type ProjectCategory = 'HARDWARE_MODULES' | 'SOFTWARE_SYSTEMS' | 'MISC_LABS' | 'COMMUNITY_PROJECT';

export interface Project {
  title: string;
  description: string;
  logo: string;
  link: string;
  slug: string;
  category: ProjectCategory;
  dateRange: string;
  background?: string;
}

export interface CategoryConfig {
  title: string;
  titleHighlight: string;
  color: string;
  link?: string;
}

export interface Repo {
  id: number;
  name: string;
  description: string;
  language: string;
  watchers: number;
  forks: number;
  stargazers_count: number;
  html_url: string;
  homepage: string;
}

export interface User {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}
