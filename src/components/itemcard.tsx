'use client';
import Image from 'next/image';
import { FiMinus } from 'react-icons/fi';
import { GoPlus } from 'react-icons/go';
import { GrCart } from 'react-icons/gr';
import { ICart } from 'types/prod';

interface ItemCardProps {
  product: ICart;
  isSamplePage?: boolean;
  onRemove: (_product: ICart) => void;
  onQuantityChange?: (_product: ICart, _delta: number) => void;
  onAddToCart: (_product: ICart) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({
  product,
  isSamplePage,
  onRemove,
  onQuantityChange,
  onAddToCart
}) => {
  return (
    <div className="border-b border-gray-300 py-4 flex flex-col gap-4 relative bg-white font-inter">
      <div className="flex justify-between items-start gap-2 w-full">
        <div className="flex flex-row gap-2">
          <Image
            src={
              product.image ||
              product?.matchedProductImages?.imageUrl ||
              '/image.png'
            }
            alt={product.name}
            width={80}
            height={80}
            className="object-cover w-20 h-20"
          />
          <div className="text-sm font-normal flex-grow">
            <p className="font-normal text-sm">{product.name}</p>
            {!isSamplePage &&
              product.category &&
              (product.category?.toLowerCase().trim() === 'accessories' ? (
                <>
                  <p>
                    Price Per Piece:{' '}
                    <span className="font-semibold">
                      {' '}
                      <span className="font-currency text-18 font-normal">
                        
                      </span>{' '}
                      {product.price}
                    </span>
                  </p>
                  <p>
                    No. of Pieces:{' '}
                    <span className="font-semibold">
                      {product.requiredBoxes}
                    </span>
                  </p>
                  <p>
                    color:{' '}
                    <span className="font-semibold">
                      {product.selectedColor?.colorName}
                    </span>
                  </p>
                </>
              ) : (
                <>
                  {product.addInstallation ? (
                    <p>
                      installation Cost:{' '}
                      <span className="font-semibold">
                        {product.installationCost?.toFixed(2)}
                      </span>
                    </p>
                  ) : (
                    <p>
                      installation:{' '}
                      <span className="font-semibold">Not Included</span>
                    </p>
                  )}
                  <p>
                    {product.isClearance ? 'Bundle:' : 'Area:'}{' '}
                    {product.squareMeter.toFixed(2)}{' '}
                    {product.unit === 'sqft' ? 'ft²' : 'SQM'}
                  </p>
                </>
              ))}

            <p className="text-sm font-semibold">
              {isSamplePage ? (
                'Free Sample'
              ) : (
                <span>
                  Price:{' '}
                  <span className="font-currency text-18 font-normal">
                     {product.price}
                  </span>
                </span>
              )}
            </p>
            <p className="text-sm">
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </p>
          </div>
        </div>
        <button
          onClick={() => onRemove(product)}
          className="text-gray-500 hover:text-red-500"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none">
            <rect x="0.5" y="0.5" width="47" height="47" stroke="#424542" />
            <path
              d="M8.95313 9L7.35938 10.5937L14.0625 17.2969L20.7656 24L14.0625 30.7031L7.35938 37.4062L8.98125 39.0187L10.5938 40.6406L17.2969 33.9375L24 27.2344L30.7031 33.9375L37.4063 40.6406L39.0188 39.0187L40.6406 37.4062L33.9375 30.7031L27.2344 24L33.9375 17.2969L40.6406 10.5937L39.0188 8.98125L37.4063 7.35938L30.7031 14.0625L24 20.7656L17.3156 14.0812C13.65 10.4156 10.6219 7.40625 10.5938 7.40625C10.5656 7.40625 9.825 8.12812 8.95313 9Z"
              fill="#424542"
            />
          </svg>
        </button>
      </div>

      <div
        className={`flex gap-2 w-full ${product.isClearance ? 'justify-end' : 'justify-between'} mt-3`}
      >
        {!isSamplePage && onQuantityChange && (
          <div className="flex items-center bg-[#F0F0F0] text-black px-4 py-1">
            <button
              onClick={() => onQuantityChange(product, -1)}
              className="p-2"
            >
              <FiMinus />
            </button>
            <span className="px-2 text-black font-semibold">
              {product.category?.toLowerCase() === 'accessories'
                ? product.requiredBoxes
                : product.squareMeter === 0
                  ? '0.00'
                  : product.squareMeter.toFixed(2)}
            </span>
            <button
              onClick={() => onQuantityChange(product, 1)}
              className="p-2"
            >
              <GoPlus />
            </button>
          </div>
        )}
        {!isSamplePage && (
          <button
            id="AddToCart"
            onClick={() => onAddToCart(product)}
            className={`bg-black text-white text-sm flex items-center gap-2 py-1 ${
              !isSamplePage ? 'px-4 sm:px-7' : 'px-14'
            }`}
          >
            <GrCart /> Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ItemCard;
