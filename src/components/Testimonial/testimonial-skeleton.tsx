export default function TestimonialSkeleton({ count = 3 }) {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="flex gap-3 space-y-3 md:space-y-5 items-start w-full h-full mx-1 animate-pulse"
                >
                    {/* Profile Card */}
                    <div className="bg-gray-100 flex gap-1 xs:gap-3 md:gap-5 justify-start items-center xs:h-auto h-[65px] md:h-[92px] pl-1 lg:p-5 w-[140px] sm:w-[180px] md:w-[350px] lg:h-[100px] xl:h-[128px] shadow-lg">
                        <div className="rounded-full bg-gray-300 h-[26px] w-[26px] sm:h-[34px] sm:w-[34px] md:h-14 md:w-16 lg:w-28 lg:h-[84px]" />
                        <div className="flex flex-col gap-1 w-full md:space-y-2">
                            <div className="bg-gray-300 h-3 w-3/4 rounded" />
                            <div className="bg-gray-300 h-2 md:h-3 w-3/4 rounded" />
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, starIndex) => (
                                    <div
                                        key={starIndex}
                                        className="bg-gray-300 h-2 w-2 md:h-3 md:w-7 lg:h-4 lg:w-4 rounded"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Description Skeleton */}
                    <div className="flex-1 flex flex-col gap-2 bg-gray-100 shadow-md py-2 md:py-5 xl:py-6 px-7">
                        <div className="bg-gray-300 h-3 lg:h-5 w-full rounded" />
                        <div className="bg-gray-300 h-3 xl:h-5 w-3/4 rounded" />
                        <div className="bg-gray-300 h-2 xl:h-5 w-1/2 rounded" />
                    </div>
                </div>
            ))}
        </>
    );
}
