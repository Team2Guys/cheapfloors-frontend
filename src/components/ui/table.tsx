import React, { useState } from 'react';
import { TableProps } from 'types/types';

const Table = <T,>({
  data,
  columns,
  rowKey,
  emptyMessage = 'No data found'
}: TableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + rowsPerPage);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Generate responsive pagination numbers
  const getPaginationNumbers = () => {
    const windowWidth =
      typeof window !== 'undefined' ? window.innerWidth : 1024;
    const maxButtons = windowWidth < 640 ? 3 : 5; // small screen = 3 numbers, larger = 5
    const pages: (number | string)[] = [];

    if (totalPages <= maxButtons + 2) {
      // Show all pages if small total
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - Math.floor(maxButtons / 2));
      let end = Math.min(totalPages - 1, start + maxButtons - 1);

      if (end >= totalPages - 1) {
        start = totalPages - maxButtons;
        end = totalPages - 1;
      }

      if (start > 2) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push('...');

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div>
      <div className="overflow-auto rounded-xl border border-dash-line bg-dash-surface !max-h-[600px]">
        <table className="min-w-full divide-y divide-dash-line">
          <thead className="sticky top-0 z-10 bg-dash-sunken">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-dash-muted whitespace-nowrap"
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-dash-line">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr
                  key={String(item[rowKey] ?? index)}
                  className="transition-colors hover:bg-dash-sunken"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3 text-sm text-dash-ink whitespace-nowrap"
                    >
                      {col.render
                        ? col.render(item)
                        : String(item[col.key as keyof T])}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center px-4 py-10 text-dash-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4 flex-wrap">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-lg border border-dash-line bg-dash-surface px-3 py-1.5 text-sm text-dash-ink hover:bg-dash-sunken disabled:opacity-50"
          >
            Prev
          </button>

          {getPaginationNumbers().map((page, i) =>
            page === '...' ? (
              <span key={i} className="px-2 py-1 text-dash-muted">
                ...
              </span>
            ) : (
              <button
                key={i}
                onClick={() => goToPage(Number(page))}
                className={`rounded-lg border px-3 py-1.5 text-sm ${
                  currentPage === page
                    ? 'border-dash-accent bg-dash-accent text-dash-accent-ink'
                    : 'border-dash-line bg-dash-surface text-dash-ink hover:bg-dash-sunken'
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-dash-line bg-dash-surface px-3 py-1.5 text-sm text-dash-ink hover:bg-dash-sunken disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;
