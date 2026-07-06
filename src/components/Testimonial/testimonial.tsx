"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { GiRoundStar } from "react-icons/gi";
import Link from "next/link";
import ReviewDescription from "./review-description";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation, Autoplay } from "swiper/modules";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

import "swiper/css";
import "swiper/css/navigation";
import Container from "../common/container/Container";

type TestimonialProps = {
    backgroundImage: {
        src: string;
        alt: string;
    };
};

type ReviewItem = {
    name: string;
    reviewDate: string;
    starRating: number;
    ReviewsDescription: string;
    posterImageUrl?: { imageUrl: string };
};

const dummyReviewChunks: ReviewItem[][] = [
    [
        {
            name: "Galina Egorova",
            reviewDate: "2026-01-1",
            starRating: 5,
            ReviewsDescription: "I am impressed with the level of service! I had an urgency and urgently needed floors delivery same day. I called, requested expedited delivery, they called me back, confirmed, I paid and had the delivery same day! It was amazing experience. I want to thank Kal for awesome service and for care. She followed up with me till the delivery took place. She is very responsible and kind person. I wish her all the best and much luck!",
            posterImageUrl: { imageUrl: "/assets/images/dummy-avatar.jpg" }
        },
        {
            name: "Aisha Rahman",
            reviewDate: "2026-05-28",
            starRating: 5,
            ReviewsDescription: "Ordered the herringbone SPC for our villa in Arabian Ranches. The free samples arrived in two days and the colour matched exactly what I saw online. The installation team was punctual and tidy and finished the whole living room in a single day.",
            posterImageUrl: { imageUrl: "/assets/images/dummy-avatar.jpg" }
        },
        {
            name: "James Whitfield",
            reviewDate: "2026-05-14",
            starRating: 5,
            ReviewsDescription: "Genuinely the best price I found in Dubai for LVT. The click-lock system is so easy I fitted the bedroom myself over a weekend, no glue or nails needed. Quality feels premium, not budget at all.",
            posterImageUrl: { imageUrl: "/assets/images/dummy-avatar.jpg" }
        }
    ],
    [
        {
            name: "Rozhan",
            reviewDate: "2026-02-10",
            starRating: 5,
            ReviewsDescription: "I had selected samples first from their website, they had sent it within a day, price was really reasonable in comparison to my other quotations. Reliable 👍🏼 …",
            posterImageUrl: { imageUrl: "/assets/images/dummy-avatar.jpg" }
        },
        {
            name: "Fatima Al Mansoori",
            reviewDate: "2026-04-30",
            starRating: 5,
            ReviewsDescription: "Beautiful flooring and great service from start to finish. The team helped me pick the right plank for a high-traffic hallway and let me split the payment with Tabby. Highly recommend Easy Floors.",
            posterImageUrl: { imageUrl: "/assets/images/dummy-avatar.jpg" }
        },
        {
            name: "Daniel Pereira",
            reviewDate: "2026-04-12",
            starRating: 4,
            ReviewsDescription: "Really happy with the SPC flooring, it looks exactly like the photos. Delivery took one extra day but customer service kept me updated the whole time. Would order from them again.",
            posterImageUrl: { imageUrl: "/assets/images/dummy-avatar.jpg" }
        }
    ],
    [
        {
            name: "Rakshith",
            reviewDate: "2026-04-20",
            starRating: 5,
            ReviewsDescription: "i had nice experience with Easy floor. very fast service and good pricing",
            posterImageUrl: { imageUrl: "/assets/images/dummy-avatar.jpg" }
        },
        {
            name: "Sana Khan",
            reviewDate: "2026-03-22",
            starRating: 5,
            ReviewsDescription: "We redid our apartment in JVC with their wood-effect vinyl and it completely transformed the space. Scratch-resistant and waterproof, which is perfect with two kids and a dog. Worth every dirham.",
            posterImageUrl: { imageUrl: "/assets/images/dummy-avatar.jpg" }
        },
        {
            name: "Mohammed Saeed",
            reviewDate: "2026-03-05",
            starRating: 5,
            ReviewsDescription: "Excellent experience. Visited the showroom, got honest advice, and the installers were professional and respectful of our home. The herringbone finish looks absolutely stunning.",
            posterImageUrl: { imageUrl: "/assets/images/dummy-avatar.jpg" }
        }
    ]
];

const Testimonial: React.FC<TestimonialProps> = ({ backgroundImage }) => {
    const [isMounted, setIsMounted] = useState(false);
    const swiperRefs = useRef<(SwiperType | null)[]>([]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const getRandomColor = () => {
        return `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(new Date(dateString));
    };

    if (!isMounted) return null;

    return (
        <>
            <Container className="sm:mt-7 md:my-6 relative !p-0 sm:!px-4">
                {/* Mobile Background: Full width with dark overlay */}
                <div className="md:hidden absolute inset-0 z-0">
                    <Image
                        src={backgroundImage.src}
                        alt={backgroundImage.alt}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                {/* Desktop Background: White left, Image right */}
                <div className="hidden md:grid absolute inset-0 grid-cols-2 z-0">
                    <div className="bg-white"></div>
                    <div className="relative h-full">
                        <Image
                            src={backgroundImage.src}
                            alt={backgroundImage.alt}
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                <div className="relative z-10 py-8 px-2 md:px-0">
                    <div className="flex justify-start items-center mb-6 md:mb-8 px-2 md:px-0">
                        <h2 className="text-[22px] sm:text-3xl md:text-4xl lg:text-[40px] font-bold text-white md:text-[#333] tracking-tight font-inter">
                            What Our Clients Say
                        </h2>
                    </div>

                    <div className="flex flex-col space-y-4 md:space-y-6 w-full lg:w-[70%] xl:w-[60%]">
                        {dummyReviewChunks.map((group, groupIndex) => {
                            const isEvenRow = groupIndex % 2 === 0;
                            return (
                                <div key={groupIndex} className="relative flex items-center">
                                    {/* Left Arrow for Odd Rows (Index 1) */}
                                    {!isEvenRow && (
                                        <button
                                            onClick={() => swiperRefs.current[groupIndex]?.slidePrev()}
                                            className="absolute -left-1 sm:-left-2 z-20 w-6 h-6 md:w-9 md:h-9 bg-[#FEB907] text-black rounded-full flex items-center justify-center shadow-md hover:bg-yellow-400 transition-colors"
                                        >
                                            <FaArrowLeft className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                        </button>
                                    )}

                                    <div className="w-full">
                                        <Swiper
                                            onSwiper={(swiper) => (swiperRefs.current[groupIndex] = swiper)}
                                            modules={[Navigation, Autoplay]}
                                            spaceBetween={10}
                                            slidesPerView={1}
                                            loop
                                            className="w-full px-4 sm:px-2 py-4"
                                        >
                                            {group.map((item, index) => (
                                                <SwiperSlide key={index}>
                                                    <div className={`w-full flex ${!isEvenRow ? "justify-end" : "justify-start"}`}>
                                                        <div className={`flex flex-row gap-0.5 sm:gap-2 w-[98%] sm:w-[95%] ${!isEvenRow ? "flex-row-reverse" : ""}`}>

                                                            {/* Profile Box */}
                                                            <div className="bg-white flex-shrink-0 flex flex-row gap-2 sm:gap-4 p-2 sm:p-5 justify-start items-center w-[140px] xs:w-[155px] sm:w-[240px] md:w-[260px] shadow-lg mb-2 rounded-sm">
                                                                {item?.posterImageUrl?.imageUrl ? (
                                                                    <div className="relative h-[32px] w-[32px] sm:h-[44px] sm:w-[44px] md:h-[56px] md:w-[56px] lg:w-[64px] lg:h-[64px] rounded-full overflow-hidden flex-shrink-0">
                                                                        <Image
                                                                            src={item.posterImageUrl.imageUrl}
                                                                            alt="profile"
                                                                            fill
                                                                            className="object-cover"
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    <div
                                                                        className="h-[32px] w-[32px] sm:h-[44px] sm:w-[44px] md:h-[56px] md:w-[56px] lg:w-[64px] lg:h-[64px] rounded-full flex items-center justify-center text-white text-sm md:text-xl font-semibold flex-shrink-0"
                                                                        style={{ backgroundColor: getRandomColor() }}
                                                                    >
                                                                        {item.name.charAt(0)}
                                                                    </div>
                                                                )}
                                                                <div className="flex flex-col">
                                                                    <h4 className="font-bold text-[#333] text-[11px] xs:text-[12px] sm:text-[14px] md:text-[15px] leading-tight font-inter">
                                                                        {item.name}
                                                                    </h4>
                                                                    <span className="text-[#727272] text-[9px] xs:text-[10px] sm:text-[11px] md:text-[12px] font-brandon mt-0.5 md:mt-1">
                                                                        {formatDate(item.reviewDate)}
                                                                    </span>
                                                                    <div className="flex mt-1 md:mt-1.5 gap-0.5">
                                                                        {Array(item.starRating).fill(0).map((_, i) => (
                                                                            <GiRoundStar key={i} className="text-[#FEB907] w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-[14px] md:h-[14px]" />
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Description Box */}
                                                            <div className="flex-1 min-w-0 flex flex-col justify-stretch">
                                                                <ReviewDescription ReviewsDescription={item.ReviewsDescription} />
                                                            </div>

                                                        </div>
                                                    </div>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>

                                    {/* Right Arrow for Even Rows (Index 0, 2) */}
                                    {isEvenRow && (
                                        <button
                                            onClick={() => swiperRefs.current[groupIndex]?.slideNext()}
                                            className="absolute -right-1 sm:-right-2 z-20 w-6 h-6 md:w-9 md:h-9 bg-[#FEB907] text-black rounded-full flex items-center justify-center shadow-md hover:bg-yellow-400 transition-colors"
                                        >
                                            <FaArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Container>
            <Container className="py-4 md:py-8 flex justify-center md:justify-start">
                <Link
                    href="https://www.google.com/maps/place/EasyFloors+-+Affordable+Flooring/@25.1177844,55.2357386,993m/data=!3m1!1e3!4m8!3m7!1s0x3e5f69fca32528d3:0x63e4dd6474477d84!8m2!3d25.1177844!4d55.2357386!9m1!1b1!16s%2Fg%2F11yfzpsct1?entry=ttu&g_ep=EgoyMDI2MDYwMi4wIKXMDSoASAFQAw%3D%3D" target="_blank"
                    className="inline-block bg-[#FEB907] text-black font-semibold text-sm md:text-base px-8 py-3 rounded-full hover:bg-black hover:text-white transition-colors duration-300 font-inter shadow-md"
                >
                    See All Reviews
                </Link>
            </Container>
        </>
    );
};

export default Testimonial;
