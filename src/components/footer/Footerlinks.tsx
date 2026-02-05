'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Category, ISUBCATEGORY } from 'types/cat';

interface FooterlinksProps {
  categories: Category[];
}

const Footerlinks: React.FC<FooterlinksProps> = ({ categories }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      {/* Add loader of mobile view */}
      {categories.length > 0 ? (
        categories.map((section, index) => {
          const reCallFlag =
            section.recalledSubCats && section.recalledSubCats.length > 0;
          const subcategories: ISUBCATEGORY[] = (
            reCallFlag ? section.recalledSubCats : section.subcategories
          ) as ISUBCATEGORY[];

          return (
            <div key={index} className="sm:hidden w-full">
              <div
                className="flex_between cursor-pointer border-b-2 pb-3"
                onClick={() => toggleSection(index)}
              >
                <Link
                  href={`/${section.custom_url}`}
                  className="font-normal tracking-widest md:text-base text-sm"
                >
                  {section.name}
                </Link>
                <div>
                  {activeIndex === index ? (
                    <FaChevronUp className="text-gray-600" />
                  ) : (
                    <FaChevronDown className="text-gray-600" />
                  )}
                </div>
              </div>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  activeIndex === index
                    ? 'h-auto scale-y-100 opacity-100 mt-2'
                    : 'h-0 scale-y-0 opacity-1'
                }`}
              >
                <ul className="space-y-2">
                  {section.name === 'ACCESSORIES'
                    ? (section.accessories ?? []).map((item, i) => (
                        <li key={i} className="footer_li">
                          <Link
                            href={`/accessories/${item.custom_url}`}
                            className="filter_Link"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))
                    : (subcategories ?? []).map((item, i) => (
                        <li key={i} className="footer_li">
                          <Link
                            href={`/${item?.category?.RecallUrl || section.RecallUrl}/${item.custom_url}`}
                            className="filter_Link"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                </ul>
              </div>
            </div>
          );
        })
      ) : (
        <div className="sm:hidden w-full animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-6 w-full bg-gray-300 rounded mb-3"></div>
          ))}
        </div>
      )}
    </>
  );
};

export default Footerlinks;
