// Mirrors the blog structure returned by the backend API
// (GET /backend/api/blogs).

export interface BlogImage {
  imageUrl: string;
  public_id: string;
}

export interface BlogReply {
  id: number;
  name: string;
  Email: string;
  description: string;
  createdAt: string;
}

export interface BlogComment {
  id: number;
  name: string;
  Email: string;
  description: string;
  createdAt: string;
  replies: BlogReply[];
  blogId: number;
  status: string;
  last_editedBy: string | null;
}

export interface Blog {
  id: number;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  posterImage: BlogImage;
  last_editedBy: string;
  Images_Alt_Text: string;
  Meta_Title: string;
  Canonical_Tag: string;
  Meta_description: string;
  isPublished: boolean;
  redirectionUrl: string;
  customUrl: string | null;
  comments: BlogComment[];
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
  blogs?: Blog[];
  initialCount?: number;
  activeCategory?: string;
  activeSearch?: string;
}
