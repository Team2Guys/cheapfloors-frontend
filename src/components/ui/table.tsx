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
      <div className="overflow-auto border rounded-md !max-h-[550px]">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700 bg-white dark:bg-transparent">
          <thead className="bg-gray-50 dark:bg-black">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="p-2 md:p-4 text-left text-sm font-semibold dark:text-neutral-300 capitalize whitespace-nowrap"
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr
                  key={String(item[rowKey] ?? index)}
                  className="hover:bg-gray-100 dark:hover:bg-black"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3 text-sm dark:text-neutral-200 whitespace-nowrap"
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
                  className="text-center px-4 py-6 dark:text-neutral-300"
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
            className="px-3 py-1 border rounded disabled:opacity-50 dark:text-white"
          >
            Prev
          </button>

          {getPaginationNumbers().map((page, i) =>
            page === '...' ? (
              <span key={i} className="px-3 py-1 dark:text-white">
                ...
              </span>
            ) : (
              <button
                key={i}
                onClick={() => goToPage(Number(page))}
                className={`px-3 py-1 border rounded ${
                  currentPage === page
                    ? 'bg-gray-200 dark:text-black'
                    : 'dark:text-white'
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50 dark:text-white"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;
