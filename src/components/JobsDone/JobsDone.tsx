"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation, Autoplay } from "swiper/modules";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

import "swiper/css";
import "swiper/css/navigation";
import Container from "../common/container/Container";

const dummyJobsData = [
    {
        id: 1,
        title: "SPC Flooring",
        location: "Location",
        image: "/assets/showroom.webp", // Placeholder, use your actual images
    },
    {
        id: 2,
        title: "LVT Flooring",
        location: "Location",
        image: "https://res.cloudinary.com/dmmeqgdhv/image/upload/v1744179716/after_d38owr.webp",
    },
    {
        id: 3,
        title: "Richmond Flooring",
        location: "Location",
        image: "https://res.cloudinary.com/dmmeqgdhv/image/upload/v1744190575/Before_fnh2q3.webp",
    },
    {
        id: 4,
        title: "Polar Flooring",
        location: "Location",
        image: "https://res.cloudinary.com/dmmeqgdhv/image/upload/v1744179716/after_d38owr.webp",
    },
    {
        id: 5,
        title: "Laminate Flooring",
        location: "Location",
        image: "/assets/showroom.webp",
    },
];

const JobsDone = () => {
    const swiperRef = useRef<SwiperType | null>(null);

    return (
        <section className="py-10 md:py-16 w-full bg-white">
            <Container>
                {/* Header Section */}
                <div className="flex flex-col items-center justify-center mb-6 md:mb-8">
                    <h2 className="text-3xl md:text-[40px] font-bold text-black mb-4 font-inter text-center">
                        jobs done
                    </h2>
                    <p className="text-sm md:text-base text-black text-center font-brandon leading-relaxed px-2">
                        Easy Floors has completed flooring projects across Dubai and the UAE, including Dubai Marina, Downtown, Palm Jumeirah, JVC, Abu Dhabi, and Sharjah. We deliver premium flooring solutions with expert installation for homes, offices, and commercial spaces.
                    </p>
                </div>

                {/* Navigation Arrows */}
                <div className="flex justify-between items-center mb-4 md:mb-6">
                    <button
                        onClick={() => swiperRef.current?.slidePrev()}
                        className="w-8 h-8 md:w-10 md:h-10 bg-[#f5f5f5] text-black rounded-full flex items-center justify-center hover:bg-primary transition-colors z-10"
                    >
                        <FaArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                    <button
                        onClick={() => swiperRef.current?.slideNext()}
                        className="w-8 h-8 md:w-10 md:h-10 bg-[#f5f5f5] text-black rounded-full flex items-center justify-center hover:bg-primary transition-colors z-10"
                    >
                        <FaArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                </div>

                {/* Swiper Slider */}
                <div className="w-full">
                    <Swiper
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                        modules={[Navigation, Autoplay]}
                        spaceBetween={15}
                        slidesPerView={1.2}
                        loop
                        breakpoints={{
                            480: {
                                slidesPerView: 1.5,
                                spaceBetween: 15,
                            },
                            768: {
                                slidesPerView: 2.5,
                                spaceBetween: 20,
                            },
                            1024: {
                                slidesPerView: 3.5,
                                spaceBetween: 20,
                            },
                            1280: {
                                slidesPerView: 4,
                                spaceBetween: 20,
                            },
                        }}
                        className="w-full pb-4"
                    >
                        {dummyJobsData.map((job, index) => (
                            <SwiperSlide key={index}>
                                <div className="relative w-full aspect-square md:aspect-[4/3] overflow-hidden group cursor-pointer">
                                    <Image
                                        src={job.image}
                                        alt={job.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 h-full w-full flex items-end">
                                        <div className="w-full bg-gradient-to-t from-black/40 to-black/20 flex flex-col justify-end items-center py-1 opacity-90 transition-opacity group-hover:opacity-100">
                                            <h3 className="text-white font-semibold text-base">
                                                {job.title}
                                            </h3>
                                            <p className="text-white text-bae">
                                                {job.location}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </Container>
        </section>
    );
};

export default JobsDone;
