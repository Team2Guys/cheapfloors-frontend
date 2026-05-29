'use client';

import Container from 'components/common/container/Container';
import SkirtingProductDetail from 'components/product-detail/productinfo';
import Thumbnail from 'components/product-detail/thumbnail';
import React, { useEffect, useState } from 'react';
import { IProduct, ProductImage } from 'types/prod';

const AccessoriesContainer = ({ productData }: { productData: IProduct }) => {
  const [image, setActiveImage] = useState<ProductImage | undefined>(
    productData?.productImages?.[0]
  );
  const [thumbnailImages, setThumbnailImages] = useState<ProductImage[]>(
    productData?.productImages || []
  );
  const [selectedColor, setSelectedColor] = useState<ProductImage | undefined>(
    productData?.featureImages?.[0]
  );

  useEffect(() => {
    setThumbnailImages(productData?.productImages || []);
    setActiveImage(productData?.productImages?.[0]);
    setSelectedColor(productData?.featureImages?.[0]);
  }, [productData]);
  return (
    <Container className="flex flex-col lg:flex-row gap-10 py-4">

      <div className="w-full lg:w-[55%]">
        {productData?.name && (
          <h1 className="text-xl sm:text-2xl lg:text-[28px] 2xl:text-[32px] font-bold ps-0 lg:ps-[17%] text-primary mb-4">
            {productData.name}
          </h1>
        )}
        <Thumbnail
          ThumnailImage={thumbnailImages}
          hideThumnailBottom
          imageheight
          onImageChange={setActiveImage}
          setSelectedColor={setSelectedColor}
          stickyside
          selectedColor={selectedColor}
        />
      </div>
      <div className="w-full lg:w-[45%]">
        <SkirtingProductDetail
          productData={productData}
          image={image}
          MainCategory="Accessories"
          setSelectedColor={setSelectedColor}
          selectedColor={selectedColor}
        />
      </div>
    </Container>
  );
};

export default AccessoriesContainer;
