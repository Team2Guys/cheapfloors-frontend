export type BlogStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface RedirectUrls {
  updatedAt?: string;
  createdAt?: string;
  id: number;
  url: string;
  redirectedUrl: string;
  status?: BlogStatus;
}

export interface initialRedirectUrls extends Omit<RedirectUrls, 'id'> {
  redirectedUrl?: string;
  url?: string;
  status?: BlogStatus;
}

export interface MONTHLYGRAPH {
  series: { name: string; data: number[] }[];
  categories: string[];
}
export interface WEEKLYGRAPH {
  series: { name: string; data: number[] }[];
  categories: string[];
}
export interface STATUS {
  date: string;
  day: string;
  Appointments: number;
  orders: number;
}
