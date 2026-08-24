'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch } from 'react-icons/fi';

const BlogSearch = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/blogs?search=${encodeURIComponent(q)}` : '/blogs');
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search"
        aria-label="Search blogs"
        className="w-full border-b border-[#0000001F] bg-[#FEB90714] py-2 pl-9 pr-3 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </form>
  );
};

export default BlogSearch;
