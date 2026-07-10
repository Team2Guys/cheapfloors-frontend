import dynamic from 'next/dynamic';
import Container from 'components/common/container/Container';

const Appointment = dynamic(
  () => import('components/appointment/Appointment')
);

interface ProductQueryProps {
  title?: string;
  description?: string;
  appointsType?: string;
}

const ProductQuery = ({
  title = 'Want to know about our products?',
  description = 'Drop your query and our team will help you find the right flooring for your space, budget, and timeline.',
  appointsType = 'Product Query'
}: ProductQueryProps) => {
  return (
    <Container className="my-10 md:my-16 font-inter">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
        <div className="pt-5 md:pt-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight text-black">
            {title}
          </h2>
          <p className="mt-4 text-base md:text-xl text-black">
            {description}
          </p>
        </div>

        <div>
          <Appointment AppointsType={appointsType} />
        </div>
      </div>
    </Container>
  );
};

export default ProductQuery;
