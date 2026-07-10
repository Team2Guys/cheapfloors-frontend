import { Blog, BlogCategory } from 'types/blog';

export const blogCategories: BlogCategory[] = [
  { label: 'All posts', value: 'all' },
  { label: 'By Brand Type', value: 'By Brand Type' },
  { label: 'SPC Flooring', value: 'SPC Flooring' },
  { label: 'LVT Flooring', value: 'LVT Flooring' }
];

const sampleContent = `
<p>SPC and LVT flooring have transformed how homes and offices in the UAE
approach durable, water-resistant floors. In this guide we break down the
differences, the ideal plank sizes, and how to pick the right finish for your
space.</p>
<h2>Why it matters</h2>
<p>From heavy foot traffic to humidity, the right flooring keeps your interior
looking premium for years. We cover installation tips, maintenance, and
budget-friendly options for every room.</p>
`;

const makeBlog = (
  id: number,
  title: string,
  category: string,
  imageUrl: string,
  redirectionUrl: string,
  createdAt: string
): Blog => ({
  id,
  title,
  content: sampleContent,
  category,
  createdAt,
  updatedAt: createdAt,
  posterImage: { imageUrl, public_id: '' },
  last_editedBy: 'admin@easyfloors.ae',
  Images_Alt_Text: title,
  Meta_Title: `${title} | Easy Floors`,
  Meta_description: `${title} — expert flooring guidance from Easy Floors UAE.`,
  Canonical_Tag: `https://easyfloors.ae/blogs/${redirectionUrl}`,
  isPublished: true,
  redirectionUrl,
  customUrl: null,
  comments: []
});

export const blogsData: Blog[] = [
  makeBlog(1, 'SPC Eco - Desert Oak', 'SPC Flooring', '/assets/images/Home/Eco-new.webp', 'spc-eco-desert-oak', '2026-07-01T09:00:00.000Z'),
  makeBlog(2, 'Polar SPC Eco - Chestnut', 'By Brand Type', '/assets/images/Home/Prime-new.webp', 'polar-spc-eco-chestnut', '2026-07-01T09:00:00.000Z'),
  makeBlog(3, 'Polar SPC Eco - White Wash', 'LVT Flooring', '/assets/images/Home/HerringNew.webp', 'polar-spc-eco-white-wash', '2026-07-01T09:00:00.000Z'),
  makeBlog(4, 'Polar SPC Eco - Chestnut', 'SPC Flooring', '/assets/images/Home/Prime-new.webp', 'polar-spc-eco-chestnut-2', '2026-07-01T09:00:00.000Z'),
  makeBlog(5, 'Polar SPC Eco - White Wash', 'LVT Flooring', '/assets/images/Home/Eco-new.webp', 'polar-spc-eco-white-wash-2', '2026-07-01T09:00:00.000Z'),
  makeBlog(6, 'SPC Eco - Desert Oak', 'By Brand Type', '/assets/images/Home/HerringNew.webp', 'spc-eco-desert-oak-2', '2026-07-01T09:00:00.000Z'),
  makeBlog(7, 'Richmond LVT - Natural Oak', 'LVT Flooring', '/assets/images/Home/Prime-new.webp', 'richmond-lvt-natural-oak', '2026-06-20T09:00:00.000Z'),
  makeBlog(8, 'Herringbone SPC - Smoked Oak', 'SPC Flooring', '/assets/images/Home/HerringNew.webp', 'herringbone-spc-smoked-oak', '2026-06-18T09:00:00.000Z'),
  makeBlog(9, 'Polar Flooring - Silver', 'By Brand Type', '/assets/images/Home/Eco-new.webp', 'polar-flooring-silver', '2026-06-15T09:00:00.000Z')
];
