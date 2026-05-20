"use client";

import { useState, useEffect } from "react";

interface Props {
    ReviewsDescription: string;
}

function ReviewDescription({ ReviewsDescription }: Props) {
    const [isExpanded, setIsExpanded] = useState(false);

    const [charLimit, setCharLimit] = useState(100);

    useEffect(() => {
        const updateLimit = () => {
            if (window.innerWidth < 640) {
                // Mobile view (sm breakpoint)
                setCharLimit(65);
            } else if (window.innerWidth < 1024) {
                // Tablet view (lg breakpoint)
                setCharLimit(85);
            } else {
                // Desktop view
                setCharLimit(110);
            }
        };

        // Set initial limit
        updateLimit();

        // Listen for window resize to update limit
        window.addEventListener("resize", updateLimit);
        return () => window.removeEventListener("resize", updateLimit);
    }, []);

    const isLongText = ReviewsDescription.length > charLimit;

    return (
        <div
            className={`
        relative flex flex-col justify-center shadow-lg bg-white p-2 sm:p-3 transition-all duration-300 mb-2 w-full rounded-sm
        ${isExpanded
                    ? "h-auto min-h-[70px] sm:min-h-[90px] md:min-h-[98px] lg:min-h-[70px] xl:min-h-[128px]"
                    : "h-[70px] sm:h-[90px] md:h-[98px] lg:h-[100px] xl:h-[128px] 2xl:-h-[140px] overflow-hidden"
                }
      `}
        >
            <div className="relative w-full">
                <p
                    className={`
            font-brandon text-start text-[#727272] leading-tight
            xss:text-[11px] xsm:text-[14px] md:text-[16px]
            /* Clamps text only if it's long and not expanded */
            ${!isExpanded && isLongText ? "line-clamp-2 sm:line-clamp-3" : ""}
          `}
                >
                    {/* If not expanded and text is long, show a slice. Otherwise show all */}
                    {!isExpanded && isLongText
                        ? `${ReviewsDescription.substring(0, charLimit)}...`
                        : ReviewsDescription}
                </p>

                {/* Button ONLY shows if text is actually longer than the limit */}
                {isLongText && (
                    <button
                        onClick={() => setIsExpanded((prev) => !prev)}
                        className="text-black text-[10px] xsm:text-[12px] md:text-[14px] cursor-pointer font-bold mt-1 hover:underline block"
                    >
                        {isExpanded ? "View Less" : "View More"}
                    </button>
                )}
            </div>
        </div>
    );
}

export default ReviewDescription;