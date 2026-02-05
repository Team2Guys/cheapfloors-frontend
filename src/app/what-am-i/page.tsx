import Breadcrumb from 'components/Reusable/breadcrumb';
import WhatAmICetagory from 'components/WhatAmICetagory/WhatAmICetagory';
import { fetchSubCategories } from 'config/fetch';
import {
  FETCH_ALL_WHAT_AM_I,
  FETCH_ALL_WHAT_AM_I_META_TAGS
} from 'graphql/queries';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import React from 'react';
import { ISUBCATEGORY } from 'types/cat';
import { TrimerHandler } from 'utils/helperFunctions';
interface SlugPageProps {
  searchParams: Promise<{ flooring?: string }>;
}

export async function generateMetadata({
  searchParams
}: SlugPageProps): Promise<Metadata> {
  const { flooring } = await searchParams;
  if (!flooring) return notFound();
  const subCategories = await fetchSubCategories(FETCH_ALL_WHAT_AM_I_META_TAGS);
  const subCategory = subCategories.find(
    (value: ISUBCATEGORY) =>
      TrimerHandler(value?.whatIamEndpoint || value.custom_url) ==
      TrimerHandler(flooring)
  );
  if (!subCategory) return notFound();

  const headersList = await headers();
  const domain =
    headersList.get('x-forwarded-host') || headersList.get('host') || '';
  const protoHeader = headersList.get('x-forwarded-proto');
  const protocol =
    protoHeader && protoHeader.startsWith('https') ? 'https' : 'https';
  const pathname = headersList.get('x-invoke-path') || '/';

  const fullUrl = `${protocol}://${domain}${pathname}`;
  const ImageUrl = subCategory?.posterImageUrl.imageUrl || 'Easy Floor';
  const alt = subCategory?.posterImageUrl.altText || 'Easy Floor';

  const NewImage = [
    {
      url: ImageUrl,
      alt: alt
    }
  ];
  const title = subCategory?.whatAmiMeta_Title || 'Easy Floor';
  const description =
    subCategory?.whatAmiMeta_Description || 'Welcome to Easy Floor';
  const url = `${fullUrl}what-am-i?flooring=${flooring}`;
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: url,
      images: NewImage,
      type: 'website'
    },
    alternates: {
      canonical: url
    }
  };
}

const Whatami = async ({ searchParams }: SlugPageProps) => {
  const { flooring } = await searchParams;
  const subCategories = await fetchSubCategories(FETCH_ALL_WHAT_AM_I);
  if (!flooring) {
    return notFound();
  }
  const subcat = subCategories.find(
    (value: ISUBCATEGORY) =>
      TrimerHandler(value?.whatIamEndpoint || value.custom_url) ==
      TrimerHandler(flooring)
  );
  if (!subcat || subcat.status === 'DRAFT') {
    return notFound();
  }
  return (
    <>
      <Breadcrumb
        title="What Am I?"
        image={
          subcat.whatAmiImageBanner ? subcat.whatAmiImageBanner.imageUrl : ''
        }
        altText={
          subcat.whatAmiImageBanner && subcat.whatAmiImageBanner?.altText
        }
      />
      <WhatAmICetagory subcat={subcat} />
    </>
  );
};

export default Whatami;
