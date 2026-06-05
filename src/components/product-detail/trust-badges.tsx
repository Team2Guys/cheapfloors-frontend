import Image from 'next/image';
import { GiRoundStar } from 'react-icons/gi';

const TrustBadges = () => {
  return (
    <div className="border border-[#0000003D] rounded-lg px-2 py-2.5 xl:px-4 sm:py-3 flex flex-wrap xsm:flex-nowrap items-center justify-between gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <Image
          src="/assets/images/Home/truck.png"
          alt="Delivery"
          width={24}
          height={24}
          className="size-6 object-contain shrink-0"
        />
        <p className="text-sm xl:text-base font-medium text-black leading-tight">
          Delivered in 1-2 working days
        </p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="flex gap-px">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <GiRoundStar
                key={i}
                className="text-primary w-3.5 h-3.5 sm:w-4 sm:h-4"
              />
            ))}
        </div>

      </div>
    </div>
  );
};

export default TrustBadges;
