'use client';
import { footerData, staticMenuItems } from 'data/data';
import Image from 'next/image';
import { FaMapMarkerAlt, FaRegEnvelope, FaWhatsapp } from 'react-icons/fa';
import Container from 'components/common/container/Container';
import Link from 'next/link';
import { IoCall } from 'react-icons/io5';
import { fetchCategories } from 'config/fetch';
import { Category, ISUBCATEGORY } from 'types/cat';
import { useEffect, useState } from 'react';
import { FETCH_HEADER_CATEGORIES } from 'graphql/queries';
import { Category as ICategory } from 'types/cat';
import dynamic from 'next/dynamic';
const Footerlinks = dynamic(() => import('./Footerlinks'));
import SocialIcon from 'components/Reusable/social-icon';
import { getSubcategoryOrder } from 'data/home-category';
import { defaultOrder } from 'data/accessory';
import { showAlert } from 'utils/Alert';

const Footer = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories(FETCH_HEADER_CATEGORIES);
        const publishedCategories = (data || [])
          .filter((cat: ICategory) => cat.status === 'PUBLISHED')
          .map((cat: ICategory) => ({
            ...cat,
            accessories:
              cat.accessories?.filter((acc) => acc.status === 'PUBLISHED') ||
              [],
            subcategories:
              cat.subcategories?.filter((sub) => sub.status === 'PUBLISHED') ||
              [],
            products: cat.products || [], // Products don't have status in query, filter later if needed
            recalledSubCats:
              cat.recalledSubCats?.filter(
                (recall) => recall.status === 'PUBLISHED'
              ) || []
          }));
        const sortedCategories = publishedCategories.sort(
          (a: ICategory, b: ICategory) => {
            const indexA = staticMenuItems.findIndex(
              (item) => item.label.toLowerCase() === a.name.trim().toLowerCase()
            );
            const indexB = staticMenuItems.findIndex(
              (item) => item.label.toLowerCase() === b.name.trim().toLowerCase()
            );
            return (
              (indexA === -1 ? Infinity : indexA) -
              (indexB === -1 ? Infinity : indexB)
            );
          }
        );

        setCategories(sortedCategories);
      } catch {
        showAlert({
          title: 'Error fetching categories:',
          icon: 'error'
        });
      }
    };
    getCategories();
  }, []);

  const customSort = (a: { name: string }, b: { name: string }) => {
    const aIndex = defaultOrder.indexOf(a.name);
    const bIndex = defaultOrder.indexOf(b.name);

    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    return a.name.localeCompare(b.name); // fallback alphabetical
  };

  return (
    <footer className="bg-gray-100 text-gray-700 pt-10 mt-20 px-0 mx-0 relative font-inter">
      <Container className=" mx-auto grid sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-4 2xl:gap-5 font-light">
        <div className="sm:mt-2">
          <Image
            src="/assets/images/logo.webp"
            alt="Easyfloors"
            width={120}
            height={50}
            className="mb-4"
          />
          <p className="mt-2 text-sm w-full sm:max-w-[150px] xl:max-w-[160px] 2xl:max-w-[172px]">
            {footerData.company.description}
          </p>
        </div>
        <Footerlinks categories={categories} />
        {categories.length > 0 ? (
          categories.map((section: Category, index: number) => {
            const reCallFlag =
              section.recalledSubCats && section.recalledSubCats.length > 0;
            let subcategories: ISUBCATEGORY[] =
              ((reCallFlag
                ? section.recalledSubCats
                : section.subcategories) as ISUBCATEGORY[]) || [];
            subcategories = [...subcategories].sort((a, b) => {
              return getSubcategoryOrder(a.name) - getSubcategoryOrder(b.name);
            });
            subcategories = [...subcategories].sort((a, b) => {
              const orderA = getSubcategoryOrder(a.name);
              const orderB = getSubcategoryOrder(b.name);
              if (orderA !== orderB) {
                return orderA - orderB;
              } else {
                return (Number(a.price) || 0) - (Number(b.price) || 0);
              }
            });
            return (
              <div key={index} className="sm:block hidden">
                <Link
                  href={`/${section.custom_url}`}
                  className="lg:text-base md:text-sm font-normal 2xl:tracking-widest 2xl:text-nowrap"
                >
                  {section.name}
                </Link>

                <ul className="mt-4 space-y-2">
                  {section.name === 'ACCESSORIES'
                    ? (section.accessories ?? [])
                      .sort(customSort)
                      .map((item, i) => (
                        <li key={i} className="footer_li">
                          <Link
                            href={`/accessories/${item.custom_url}`}
                            className="filter_Link"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))
                    : (subcategories ?? []).map((item, i) => (
                      <li key={i} className="footer_li">
                        <Link
                          href={`/${item?.category?.RecallUrl || section.RecallUrl}/${item.custom_url}`}
                          className="filter_Link"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            );
          })
        ) : (
          <>
            {[...Array(5)].map((_, index) => (
              <div key={index} className="hidden sm:block w-full animate-pulse">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-6 w-full bg-gray-300 rounded mb-3"
                  >
                  </div>
                ))}
              </div>
            ))}
          </>
        )}

        <div className="sm:block ">
          <p className=" font-normal 2xl:tracking-widest">CONTACT US</p>

          <div className="text-sm mt-4 flex items-center gap-2 group">
            <div className="">
              <IoCall
                size={16}
                className="text-black group-hover:text-primary"
              />
            </div>
            <Link
              href="tel:+971505974385"
              target="_blank"
              className="text-black group-hover:text-primary"
            >
              {footerData.contact.phone}
            </Link>
          </div>
          <div className="text-sm mt-2 flex items-center gap-2 group">
            <div className="">
              <FaRegEnvelope
                size={16}
                className="text-black group-hover:text-primary"
              />
            </div>
            <Link
              href="mailto:cs@easyfloors.ae"
              className="text-black group-hover:text-primary"
            >
              {footerData.contact.email}
            </Link>
          </div>
          <div className="text-sm mt-3 flex items-start gap-2 group">
            <div className="">
              <FaMapMarkerAlt
                size={16}
                className="text-black group-hover:text-primary"
              />
            </div>
            <Link
              href="https://maps.app.goo.gl/t4dm6MhpgeraVkBH8"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black group-hover:text-primary md:full w-60"
            >
              {footerData.contact.address}
            </Link>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-3 w-4/5 gap-3 mt-4 items-center">
            {footerData.paymentMethods.map((method, index) => (
              <div key={index} className="flex justify-start">
                <Image
                  src={`/assets/icons/${method}.png`}
                  alt={method}
                  width={500}
                  height={500}
                  className="h-auto w-full"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col space-y-8 fixed right-4 bottom-8 md:right-16  z-20">
          <Link
            href="tel:+971505974385"
            target="_blank"
            aria-label="Call +971505974385"
            className="bg-[#3DA162] sm:hidden text-white p-2 rounded-full shadow-lg flex_center w-12 h-12"
          >
            <IoCall size={35} />
          </Link>

          <Link
            href={`https://wa.me/${process.env.NEXT_PUBLIC_PHONE_NUMBER?.replace('+', '').replace(/\s+/g, '')}`}
            aria-label="WhatsApp +971505974385"
            target="_blank"
            className="bg-[#25D366] text-white rounded-full shadow-lg flex_center w-12 h-12"
          >
            <FaWhatsapp size={35} />
          </Link>
        </div>
      </Container>
      <div className="xs:border-t xs:border-gray-300 mt-6 py-4 bg-primary">
        <Container className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-sm:justify-items-start max-lg:justify-items-center ">
          <div className="hidden sm:block">
            <div className="flex md:space-x-4 space-x-2">
              <SocialIcon />
            </div>
          </div>
          <div className="text-center hidden sm:block">
            <p className="text-12 sm:text-13 text-white font-medium xs:font-semibold ">
              Easyfloors.ae ©{new Date().getFullYear()}
            </p>
          </div>
          <div className="text-white  flex flex-wrap lg:flex-nowrap  lg:justify-end  w-full">
            <div className="flex_between xs:justify-center text-12 sm:text-13 font-light flex-nowrap xl:whitespace-nowrap gap-2 sm:gap-0 w-full sm:space-x-4">
              {' '}
              <Link
                className="w-full text-start sm:w-fit text-nowrap xs:text-wrap xl:text-nowrap"
                href="/terms-and-conditions"
              >
                Terms & Conditions
              </Link>
              <Link
                className="w-full text-center sm:text-start sm:w-fit"
                href="/shipping-policy"
              >
                Shipping Policy
              </Link>
              <Link
                className="w-full text-start sm:w-fit"
                href="/privacy-policy"
              >
                Privacy Policy
              </Link>
              <Link
                className="w-full text-center sm:text-start sm:w-fit hidden sm:block "
                href="/return-and-refund-policy"
              >
                Return & Refund policy
              </Link>
            </div>
            <Link
              className="w-full text-center sm:text-start sm:w-fit block sm:hidden mt-3 text-12 sm:text-13 font-light ml-16 xs:ml-10"
              href="/return-and-refund-policy"
            >
              Return & Refund policy
            </Link>
          </div>
          <div className="block sm:hidden w-full relative">
            <div className="text-center">
              <div className="flex space-x-2  absolute top-0 left-0">
                <SocialIcon />
              </div>
              <p className="text-12 sm:text-13 text-white font-medium ml-14 xs:ml-8 sm:font-semibold">
                Easyfloors.ae ©{new Date().getFullYear()}
              </p>

            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
