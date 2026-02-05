import React from 'react';
import { fetchAccessories, fetchSingeProduct } from 'config/fetch';
import { IProduct } from 'types/prod';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import ProductDetail from 'app/(route)/[slug]/[subcategory]/[product]/ProductDetail';
import { clearanceProducts } from 'data/clearance';

interface IParams {
  slug: string;
  subcategory: string;
  product: string;
}

export async function generateMetadata({
  params
}: {
  params: Promise<IParams>;
}): Promise<Metadata> {
  const { slug, subcategory, product: paramsprod } = await params;
  const productData = await fetchSingeProduct(
    paramsprod.trim(),
    slug.trim(),
    subcategory.trim()
  );
  if (!productData) return notFound();

  const headersList = await headers();
  const domain =
    headersList.get('x-forwarded-host') || headersList.get('host') || '';
  const protoHeader = headersList.get('x-forwarded-proto');
  const protocol =
    protoHeader && protoHeader.startsWith('https') ? 'https' : 'https';
  const pathname = headersList.get('x-invoke-path') || '/';

  const fullUrl = `${protocol}://${domain}${pathname}`;

  const ImageUrl = productData?.posterImageUrl.imageUrl || 'Easy Floor';
  const alt = productData?.posterImageUrl.altText || 'Easy Floor';

  const NewImage = [
    {
      url: ImageUrl,
      alt: alt
    }
  ];
  const title = productData?.Meta_Title || 'Easy Floor';
  const description = productData?.Meta_Description || 'Welcome to Easy Floor';
  const url = `${fullUrl}${slug}/${subcategory}/${paramsprod}`;
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
      canonical: productData?.Canonical_Tag || url
    }
  };
}

const Page = async ({ params }: { params: Promise<IParams> }) => {
  const { slug, subcategory, product: paramsprod } = await params;
  const [ProductInfo, AccessoriesProducts] = await Promise.all([
    fetchSingeProduct(paramsprod.trim(), slug.trim(), subcategory.trim(), true),
    fetchAccessories()
  ]);
  if (
    !ProductInfo ||
    ProductInfo.status !== 'PUBLISHED' ||
    ProductInfo.subcategory?.status !== 'PUBLISHED'
  )
    return notFound();
  const PublishAccessory = AccessoriesProducts.filter(
    (acc: IProduct) => acc.status === 'PUBLISHED'
  );
  const product = clearanceProducts.find(
    (r) => r.name.toLowerCase() === ProductInfo.name.toLowerCase()
  );

  const clearance = product ? { ...product, ...ProductInfo } : null;

  if (!clearance) return notFound();

  return (
    <ProductDetail
      MainCategory={slug}
      subCategory={subcategory}
      ProductName={paramsprod}
      productData={clearance}
      AccessoriesProducts={PublishAccessory}
      isClearance
    />
  );
};

export default Page;
