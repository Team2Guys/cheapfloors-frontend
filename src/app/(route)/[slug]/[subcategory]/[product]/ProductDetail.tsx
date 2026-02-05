'use client';
import Breadcrumb from 'components/Reusable/breadcrumb';
import RelatedSlider from 'components/related-slider/related-slider';
import { detailprops } from 'types/product-detail';
import ProductContainer from 'components/ProdutDetailContainer/ProductContainer';
import AdditionalInfo from 'components/product-detail/additional-information';
import FaqDetail from 'components/product-detail/faq-detail';
import Features from 'components/Reusable/features';
import Container from 'components/common/container/Container';

const ProductDetail = ({
  MainCategory,
  subCategory,
  ProductName,
  productData,
  AccessoriesProducts,
  isClearance
}: detailprops) => {
  return (
    <div className="mb-10">
      <Breadcrumb
        title={ProductName}
        slug={MainCategory}
        subcategory={subCategory}
        isClearance={isClearance}
      />
      <ProductContainer
        MainCategory={MainCategory}
        subCategory={subCategory}
        ProductName={ProductName}
        productData={productData}
        isClearance={isClearance}
      />
      <Container className="mb-10 lg:px-20">
        <AdditionalInfo
          description={productData?.description || ''}
          AdditionalInformation={productData?.AdditionalInformation}
          subcategory={productData?.subcategory?.name || ''}
        />
        <FaqDetail FAQS={productData?.FAQS} />
      </Container>
      <Features />
      <RelatedSlider products={AccessoriesProducts || []} />
    </div>
  );
};

export default ProductDetail;
