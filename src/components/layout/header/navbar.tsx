import { useLayoutEffect, useState } from 'react';
import Container from 'components/common/container/Container';
import Image from 'next/image';
import Link from 'next/link';
import SearchBar from './search-bar';
import UserIcon from './user-icon';
import Megamenu from './Megamenu';
import { FaBars } from 'react-icons/fa';
import Drawer from 'components/ui/drawer';
import { BiChevronDown } from 'react-icons/bi';
import { staticMenuItems } from 'data/data';
import { ISUBCATEGORY } from 'types/cat';
import { HeaderAccessoriesProps, INavbar } from 'types/types';
import { usePathname } from 'next/navigation';
import { IProduct } from 'types/prod';
import { defaultOrder } from 'data/accessory';

const Navbar = ({ categories, products, isLoading, isScrolled }: INavbar) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  //eslint-disable-next-line
  const [menuItems, setMenuItems] = useState<any[]>(staticMenuItems);
  const pathname = usePathname();

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => {
      const isCurrentlyOpen = prev[label];
      const newState: { [key: string]: boolean } = {};
      menuItems.forEach((item) => {
        if (item.label === label) {
          newState[label] = !isCurrentlyOpen;
        } else {
          newState[item.label] = false;
        }
      });
      return newState;
    });
  };

  useLayoutEffect(() => {
    if (!categories || categories.length === 0) return;

    const updatedMenu = staticMenuItems.map((staticItem) => {
      const matchedCategory = categories.find(
        (cat) => cat.custom_url === staticItem.href
      );

      if (!matchedCategory) return staticItem;

      const reCallFlag =
        matchedCategory.recalledSubCats &&
        matchedCategory.recalledSubCats.length > 0;

      const subcategories: ISUBCATEGORY[] =
        (reCallFlag
          ? matchedCategory.recalledSubCats
          : matchedCategory.subcategories) || [];

      return {
        ...staticItem,
        submenu: subcategories.map((sub) => ({
          label: sub.name,
          href: `/${sub?.category?.RecallUrl || matchedCategory.RecallUrl}/${sub.custom_url}`,
          image: sub.posterImageUrl?.imageUrl || '/assets/default-image.png',
          price: sub.price
        }))
      };
    });

    setMenuItems(updatedMenu);
  }, [categories]);

  return (
    <nav
      className={`bg-white w-full z-50 max-sm:py-2 max-lg:py-2 font-inter  ${isScrolled ? 'bg-white text-black' : 'bg-white text-black'}`}
    >
      <Container className="flex_between max-sm:gap-4 py-2">
        <div className="w-2/12 lg:w-[6%] 2xl:w-[10%]">
          <Link href="/">
            <Image
              width={300}
              height={300}
              className="w-[54px] h-[30px] lg:h-[35px] xl:w-[150px] xl:h-[50px] 2xl:h-auto max-h-20 md:pb-2"
              src="/assets/images/logo.webp"
              alt="logo"
              sizes="(max-width: 768px) 70px, 200px"
            />
          </Link>
        </div>
        <div className="w-8/12 lg:w-[62%] 2xl:w-[60%] max-lg:flex max-lg:justify-center">
          <div className="hidden lg:flex items-end gap-0 xl:gap-1 2xl:gap-2 w-fit h-16 justify-between capitalize font-light whitespace-nowrap relative overflow-hidden">
            {menuItems.map((item, index) => (
              <Megamenu
                key={index}
                label={item.label}
                href={item.href}
                submenu={item.submenu}
                products={
                  item.label === 'Accessories'
                    ? (
                        categories?.find(
                          (cat) =>
                            cat.name?.trim().toLowerCase() === 'accessories'
                        )?.accessories || []
                      ).sort((a: IProduct, b: IProduct) => {
                        const indexA = defaultOrder.indexOf(a.name);
                        const indexB = defaultOrder.indexOf(b.name);
                        const safeIndexA =
                          indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA;
                        const safeIndexB =
                          indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB;
                        return safeIndexA - safeIndexB;
                      })
                    : []
                }
              />
            ))}
          </div>
          <SearchBar
            className="block lg:hidden"
            productData={products}
            isLoading={isLoading}
          />
        </div>
        <div className="w-2/12 lg:w-[32%] 2xl:w-[30%] text-end flex justify-end items-center">
          <Link
            href="/measurement-appointment"
            aria-label="Book appointment"
            className="w-fit text-xs sm:text-sm bg-primary hover:bg-secondary text-white px-2 py-1 text-nowrap hidden lg:block "
          >
            Book Your Appointment
          </Link>
          <SearchBar
            className="lg:block hidden"
            productData={products}
            isLoading={isLoading}
          />
          <UserIcon className="hidden lg:flex" />
          <div className="lg:hidden flex justify-end">
            <FaBars onClick={() => setIsOpen(true)} size={25} />
            <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
              {menuItems.map((item) => (
                <div key={item.label} className="border-b py-2 font-inter">
                  <div className="flex_between gap-2 capitalize">
                    {/* Main Category Link */}
                    <Link
                      href={`/${item.href}`}
                      className={`text-sm font-semibold w-fit whitespace-nowrap ${pathname === `/${item.href}` ? 'bg-gray-light' : ''}`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>

                    {/* Toggle for Accordion */}
                    {item.label === 'Accessories' ? (
                      <button
                        onClick={() => toggleMenu('Accessories')}
                        className="w-full flex justify-end"
                      >
                        <BiChevronDown
                          className={`w-5 h-5 transition-transform ${openMenus['Accessories'] ? 'rotate-180' : ''}`}
                        />
                      </button>
                    ) : (
                      item?.submenu &&
                      item?.submenu.length > 0 && (
                        <button
                          onClick={() => toggleMenu(item.label)}
                          className="w-full flex justify-end"
                        >
                          <BiChevronDown
                            className={`w-5 h-5 transition-transform ${openMenus[item.label] ? 'rotate-180' : ''}`}
                          />
                        </button>
                      )
                    )}
                  </div>

                  {item.label === 'Accessories' && openMenus['Accessories'] && (
                    <div className="pt-2 grid grid-cols-2 gap-5">
                      {categories
                        ?.find(
                          (cat) =>
                            cat.name?.trim().toLowerCase() === 'accessories'
                        )
                        ?.accessories?.map(
                          (product: HeaderAccessoriesProps, index: number) => (
                            <Link
                              href={`/accessories/${product.custom_url}`}
                              key={index}
                              className="py-1 text-center"
                              onClick={() => setIsOpen(false)}
                            >
                              <Image
                                width={200}
                                height={200}
                                src={
                                  product.posterImageUrl?.imageUrl ||
                                  '/assets/default-image.png'
                                }
                                alt={
                                  product.posterImageUrl?.altText ?? 'Accessory'
                                }
                                className="w-full rounded-md h-20"
                              />
                              <p className="text-sm text-black hover:underline">
                                {product.name}
                              </p>
                            </Link>
                          )
                        )}
                    </div>
                  )}

                  {item?.submenu &&
                    item?.submenu.length > 0 &&
                    !openMenus['Accessories'] &&
                    openMenus[item.label] && (
                      <div className="grid grid-cols-2 gap-5 pt-2">
                        {[...item.submenu]
                          .sort((a, b) => {
                            const getGroup = (item: {
                              label: string;
                              price?: string;
                            }) => {
                              const label = item.label.toLowerCase();
                              if (label.includes('polar')) return '0';
                              if (label.includes('spc')) return '1';
                              if (label.includes('lvt')) return '2';
                              return '4';
                            };

                            const groupA = getGroup({
                              ...a,
                              price: a.price || '0'
                            });
                            const groupB = getGroup({
                              ...b,
                              price: b.price || '0'
                            });
                            if (groupA !== groupB)
                              return groupA.localeCompare(groupB);
                            return (
                              parseFloat(a.price || '0') -
                              parseFloat(b.price || '0')
                            );
                          })
                          .map((sub, index) => (
                            <Link
                              href={sub.href}
                              key={index}
                              className="py-1 text-center"
                              onClick={() => setIsOpen(false)}
                            >
                              <Image
                                width={200}
                                height={200}
                                src={sub.image}
                                alt={sub.label}
                                className="w-full rounded-md h-20"
                              />
                              <p className="text-sm text-black hover:underline">
                                {sub.label}
                              </p>
                            </Link>
                          ))}
                      </div>
                    )}
                </div>
              ))}
            </Drawer>
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
