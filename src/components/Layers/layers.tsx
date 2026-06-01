import { blocksData } from 'data/data';
import Image from 'next/image';
import Container from '../common/container/Container';

const Layers = () => {
  return (
    <Container className="grid grid-cols-1 sm:grid-cols-2 mt-10 md:mt-16 border-b-2 mb-10 font-inter">
      {blocksData.map((block, index) => (
        <div key={index} className={`${index === 0 ? 'sm:border-[#36454F] sm:border-r-2' : ''}`}>
          <h2 className="md:text-5xl text-lg font-bold bg-primary text-black text-center p-4">
            {block.heading}
          </h2>
          <div className="flex flex-col justify-between sm:justify-left bg-[#FBFBFB] pt-4">
            <div className="mx-auto md:py-5 ms-8">
              <ul className="list-disc mb-4 font-medium sm:font-light px-2 space-y-2 max-xl:px-6">
                {block.points.map((point, index) => (
                  <li key={index} className="md:text-xl text-[12px] ">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full h-[200px] sm:h-[300px] px-2 md:px-0 relative">
              <Image
                src={block.imageUrl}
                alt={block.heading}
                loading="lazy"
                fetchPriority="low"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      ))}
    </Container>
  );
};

export default Layers;
