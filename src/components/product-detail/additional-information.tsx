'use client';

import { useEffect, useRef, useState } from 'react';
import Tabs from 'components/ui/tabs';
import { Fragment } from 'react/jsx-runtime';
import { AdditionalInfoProps } from 'types/product-detail';

// Descriptions taller than this are clipped behind a "Read more" toggle.
// The full HTML stays in the DOM so it is still crawlable.
const COLLAPSED_HEIGHT = 200;

const CollapsibleDescription = ({ html }: { html: string }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [isLong, setIsLong] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (el) setIsLong(el.scrollHeight > COLLAPSED_HEIGHT + 40);
  }, [html]);

  const collapsed = isLong && !expanded;

  return (
    <div>
      <div className="relative">
        <div
          ref={contentRef}
          className="text-base leading-relaxed prose prose-sm max-w-none [&_p]:mb-3 [&_strong]:font-bold overflow-hidden"
          style={collapsed ? { maxHeight: COLLAPSED_HEIGHT } : undefined}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {collapsed && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
        )}
      </div>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          className="mt-2 font-semibold text-primary hover:underline"
        >
          {expanded ? 'Read less' : 'Read more'}
        </button>
      )}
    </div>
  );
};

const AdditionalInfo = ({
  description,
  // AdditionalInformation,
  subcategory,
  name,
  productData,
}: AdditionalInfoProps) => {
  const tabItems = [
    {
      label: 'Description',
      value: 'description',
      content: (
        <div>
          <h2 className="text-2xl font-bold mb-4">{name}</h2>

          <CollapsibleDescription html={description} />

          <table className="w-full text-left border-collapse rounded-md text-sm mt-6">
            <tbody className="rounded-md">
              <tr className="bg-primary text-white rounded-t-md">
                <th className="py-2 px-4 rounded-tl-md">ITEM</th>
                <th className="py-2 px-4 rounded-tr-md">{subcategory || ''}</th>
              </tr>
              {productData.sizes &&
                productData.sizes.map((spec, index) => (
                  <Fragment key={index}>
                    <tr>
                      <td className="py-2 px-4 border">Height</td>
                      <td className="py-2 px-4 border">{spec.height}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border">Width</td>
                      <td className="py-2 px-4 border">{spec.width}</td>
                    </tr>
                    {spec.thickness && (
                      <tr>
                        <td className="py-2 px-4 border">Thickness</td>
                        <td className="py-2 px-4 border">{spec.thickness}</td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              {productData.colors &&
                productData.colors.map((spec, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border">Color</td>
                    <td className="py-2 px-4 border">{spec.name}</td>
                  </tr>
                ))}
              {productData.ResidentialWarranty && (
                <tr>
                  <td className="py-2 px-4 border">Residential Warranty</td>
                  <td className="py-2 px-4 border">{productData.ResidentialWarranty}</td>
                </tr>
              )}
              {productData.CommmericallWarranty && (
                <tr>
                  <td className="py-2 px-4 border">Commmericall Warranty</td>
                  <td className="py-2 px-4 border">{productData.CommmericallWarranty}</td>
                </tr>
              )}
              {productData.waterproof && (
                <tr>
                  <td className="py-2 px-4 border">Water Resistant</td>
                  <td className="py-2 px-4 border">{productData.waterproof ? 'Yes' : 'No'}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )
    }
  ];
  return <Tabs tabs={tabItems} variant="product-detail" />;
};

export default AdditionalInfo;
