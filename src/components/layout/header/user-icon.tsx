'use client';
import { useState, useEffect, useRef, lazy } from 'react';
import CartIcon from 'components/svg/cart-icon';
const FreeSample = lazy(() => import('components/svg/free-sample'));
import ProfileIcon from 'components/svg/user-icon';
import Link from 'next/link';
import { LuHeart } from 'react-icons/lu';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DropdownPanel from './DropdownPanel';
import { ICart } from 'types/prod';
import { getCart, getFreeSamples, getWishlist } from 'utils/indexedDB';

interface UserIconProps {
  className?: string;
}

const UserIcon = ({ className }: UserIconProps) => {
  const { data: session } = useSession();
  //@ts-expect-error("Already added the Image")
  const [imgSrc, setimgSrc] = useState(session?.user?.image?.imageUrl || '/assets/images/dummy-avatar.jpg');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [wishlistTotal, setWishlistTotal] = useState<ICart[]>();
  const [freeSampleTotal, setfreeSampleTotal] = useState<ICart[]>();
  const [mergedCart, setMergedCart] = useState<ICart[]>([]);
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const items = await getCart();
        const wishlist = await getWishlist();
        const freesample = await getFreeSamples();
        setWishlistTotal(wishlist);
        setfreeSampleTotal(freesample);
        setMergedCart(items);
      } catch {
        console.log('Error fetching items.');
      }
    };

    fetchItems();
    const handleCartUpdate = () => fetchItems();
    const handleWishlistUpdate = () => fetchItems();
    const handlefreeSampleUpdate = () => fetchItems();

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    window.addEventListener('freeSampleUpdated', handlefreeSampleUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
      window.removeEventListener('freeSampleUpdated', handlefreeSampleUpdate);
    };
  }, []);
  const handleProfileClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!session) {
      if (e.ctrlKey || e.metaKey) {
        window.open('/login', '_blank');
      } else {
        router.push('/login');
      }
    } else {
      setIsOpen((prev) => !prev);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const logoutHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await signOut();
    setIsOpen(false);
  };

  useEffect(() => {
    //@ts-expect-error("Already added the Image")
    setimgSrc(session?.user?.image?.imageUrl || '/assets/images/dummy-avatar.jpg');
  }, [session]);

  return (
    <div className={`flex items-center 2xl:space-x-1 ${className} relative`}>
      <button
        onClick={handleProfileClick}
        className={`relative flex items-center space-x-2 p-0.5 ${session ? "size-8 xl:size-10" : "hover:bg-primary lg:hover:fill-white"} min-[1150px]:p-1 fill-white focus:bg-white focus:fill-black lg:fill-black`}
        aria-label={session ? 'Open user profile' : 'Login'}
      >
        {session ? (
          <Image
            src={imgSrc}
            alt="User Profile"
            width={50}
            height={50}
            className="rounded-full size-6 xl:size-7 object-cover"
          />
        ) : (
          <ProfileIcon />
        )}
      </button>

      {session && isOpen && (
        <div
          ref={dropdownRef}
          className="absolute  right-12 top-10 md:top-12 z-[999] w-48 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
        >
          {session?.user && (
            <div className="bg-primary text-white p-4 flex justify-content-start items-center gap-2">
              <span className="text-12 font-medium">
                {session.user.name ?? 'Guest User'}
              </span>
            </div>
          )}

          {/* Menu Items */}
          <div className="flex flex-col text-start p-2 space-y-1">
            <Link
              href="/profile"
              className="block px-4 py-2 border text-sm font-medium hover:bg-primary hover:text-white rounded transition"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
            <Link
              href="/order-history"
              className="block px-4 py-2 border text-sm font-medium hover:bg-primary hover:text-white rounded transition"
              onClick={() => setIsOpen(false)}
            >
              Order History
            </Link>

            <div className="my-2 border-t border-gray-200" />
            <button
              onClick={logoutHandler}
              className="w-full text-start px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 hover:text-red-800 rounded transition"
            >
              Log Out
            </button>
          </div>
        </div>
      )}

      <div className="border-l-2 border-white h-4 lg:border-[#464646] md:h-6" />

      {/* Wishlist */}

      <DropdownPanel
        icon={<LuHeart className="size-3.5 min-[1150px]:size-4 xl:size-5" />}
        badgeCount={wishlistTotal?.length ?? 0}
        cartItems={wishlistTotal ?? []}
        type="wishlist"
        viewLink="/wishlist"
        emptyMessage="wishlist is empty"
      />
      <div className="border-l-2 border-white h-4 lg:border-[#464646] md:h-6" />

      {/* Free Sample */}

      <DropdownPanel
        icon={<FreeSample />}
        badgeCount={freeSampleTotal?.length ?? 0}
        cartItems={freeSampleTotal ?? []}
        type="freeSample"
        viewLink="/freesample"
        emptyMessage="free sample is empty"
      />
      <div className="border-l-2 border-white h-4 lg:border-[#464646] md:h-6" />
      {/* Cart */}
      <DropdownPanel
        icon={<CartIcon />}
        type="cart"
        badgeCount={mergedCart?.length ?? 0}
        cartItems={mergedCart ?? []}
      />
    </div>
  );
};

export default UserIcon;
