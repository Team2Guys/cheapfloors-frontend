'use client';
import React, { useEffect, useState } from 'react';
import { CardData } from 'types/type';
import { IoMdClose } from 'react-icons/io';
import { categoryData, popupCards } from 'data/data';

function Popup() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCloseModal();
      }
    };

    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      // Optional: Prevent scrolling on the body when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  return (
    <>
      <h2
        className="relative text-center md:text-5xl text-2xl md:max-w-3xl w-full font-bold text-white py-7 mx-auto bg-cover bg-center md:mb-4 lg:mb-6"
        style={{
          backgroundImage: `url(${categoryData.backgroundImage})`,
          backgroundSize: '100%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
      >
        <div className="flex_center gap-3">
          {categoryData.title}{' '}
          <span
            onClick={handleOpenModal}
            className="text-[#1EBFFA] align-top text-base font-normal cursor-pointer"
          >
            {categoryData.subtitle}
          </span>
        </div>
      </h2>

      {isModalOpen && (
      <div 
          className="fixed inset-0 bg-black/50 flex_center z-50 p-4"
          onClick={handleCloseModal}
      >
          <div className="bg-white md:p-8 p-3 shadow-lg w-full max-w-3xl md:max-w-7xl max-h-full overflow-y-auto"  onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end items-center">
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-900"
              >
                <IoMdClose size={25} className="text-black" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 md:gap-6 md:mt-6 mt-2">
              {popupCards.map((card: CardData) => (
                <div
                  key={card.id}
                  className="border border-gray-500 md:p-4 p-2 font-inter"
                >
                  <h3
                    className="text-center md:text-lg text-sm text-primary border-b-2 border-gray-500 md:p-3 p-1 font-normal"
                    dangerouslySetInnerHTML={{
                      __html: card.heading
                    }}
                  />
                  <ul className="list-disc px-5 py-2">
                    {card.content.map((item, index) => (
                      <li
                        key={index}
                        className="md:text-sm text-12 sm:ml-3 py-0.5 font-light"
                        dangerouslySetInnerHTML={{ __html: item }}
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
      </div>
      )}
    </>
  );
}

export default Popup;
