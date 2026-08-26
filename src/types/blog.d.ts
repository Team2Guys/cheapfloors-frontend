import { BlogStatus } from './general';
import { ProductImage } from './prod';

// Mirrors the Blogs model exposed by the backend GraphQL API
// (queries: blogs / blog, mutations: createBlog / updateBlog / removeBlog).

export interface Blog {
  id: number;
  title: string;
  content: string;
  category?: string;
  posterImageUrl?: ProductImage;
  Images_Alt_Text?: string;
  Meta_Title?: string;
  Meta_Description?: string;
  Canonical_Tag?: string;
  custom_url: string;
  last_editedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: BlogStatus;
}

export interface EDIT_BLOG {
  title: string;
  content: string;
  category: string;
  Images_Alt_Text: string;
  Meta_Title: string;
  Meta_Description: string;
  Canonical_Tag: string;
  custom_url: string;
  status?: BlogStatus;
}

export interface BlogCategory {
  label: string;
  value: string;
}

export interface BlogsProps {
  title?: string;
  heading?: string;
  description?: string;
  bannerImage?: string;
  categories?: BlogCategory[];
  blogs: Blog[];
  initialCount?: number;
  activeCategory?: string;
  activeSearch?: string;
}
