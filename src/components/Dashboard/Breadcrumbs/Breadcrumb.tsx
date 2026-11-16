'use client';
import Link from 'next/link';
import { ReactNode } from 'react';
interface BreadcrumbProps {
  pageName: string;
  /** A line under the title, e.g. how the list below was put together. */
  description?: ReactNode;
}
const Breadcrumb = ({ pageName, description }: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h2 className="text-2xl font-semibold text-dash-ink">{pageName}</h2>
        {description && (
          <p className="mt-1 max-w-3xl text-sm text-dash-muted">{description}</p>
        )}
      </div>

      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 text-sm text-dash-muted">
          <li>
            <Link className="hover:text-dash-ink" href="/dashboard">
              Dashboard
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-dash-ink">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
