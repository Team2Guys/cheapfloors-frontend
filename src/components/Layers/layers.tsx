import { blocksData } from 'data/data';
import Image from 'next/image';

const Layers = () => {
  return (
    <div className="grid grid-cols-2 mt-10 md:mt-16 border-b-2 mb-10 font-inter">
      {blocksData.map((block, index) => (
        <div key={index} className={`${index === 0 ? 'border-r-2 pb-4' : ''}`}>
          <h2 className="md:text-5xl text-lg font-bold mb-4 bg-secondary text-white text-center p-4">
            {block.heading}
          </h2>
          <div className="flex flex-col justify-between sm:justify-left">
            <div className="mx-auto md:py-5">
              <ul className="list-disc mb-4 font-medium sm:font-light px-2 space-y-2 max-xl:px-6">
                {block.points.map((point, index) => (
                  <li key={index} className="md:text-xl text-[12px] ">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full h-[100px] md:h-[300px] px-2 md:px-0 relative">
              <Image
                src={block.imageUrl}
                alt={block.heading}
                loading="lazy"
                fetchPriority="low"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100px, 600px"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Layers;
