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

// Display-only: drop the leading "Floor" from "Floor Smart" labels
// (e.g. "Floor Smart" -> "Smart", "Floor Smart SPC Eco" -> "Smart SPC Eco").
// Leaves other labels like "SPC Flooring" / "LVT Flooring" untouched.
const formatMenuLabel = (label: string) =>
  label?.replace(/^floor\s+smart/i, 'Smart') ?? label;

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

    const buildMenu = () => {
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
            label: formatMenuLabel(sub.name),
            href: `/${sub?.category?.RecallUrl || matchedCategory.RecallUrl}/${sub.custom_url}`,
            image: sub.posterImageUrl?.imageUrl || '/assets/default-image.png',
            price: sub.price
          }))
        };
      });

      return updatedMenu;
    };

    const handleResize = () => {
      setMenuItems(buildMenu());
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [categories]);

  return (
    <nav
      className={`bg-white w-full z-50 max-sm:py-2 max-lg:py-2 font-inter  ${isScrolled ? 'bg-white text-black' : 'bg-white text-black'}`}
    >
      <Container className="flex_between max-sm:gap-4 py-2">
        <div className="shrink-0">
          <Link href="/" className="inline-block">
            <svg
              viewBox="0 0 120 53"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Cheap Floors"
              // Scales with the viewport; the viewBox keeps the 120:53 ratio.
              className="block h-auto w-[72px] xs:w-[84px] sm:w-[100px] lg:w-[88px] xl:w-[104px] 2xl:w-[120px]"
            >
<path d="M65.8516 28.525V8.38505H70.467V10.893H70.61C70.8007 10.448 71.0709 10.0189 71.4206 9.60566C71.7766 9.19243 72.2279 8.8555 72.7747 8.59485C73.3277 8.32784 73.9889 8.19434 74.7581 8.19434C75.7753 8.19434 76.7257 8.46134 77.6094 8.99535C78.4994 9.52937 79.2178 10.3526 79.7645 11.4652C80.3112 12.5777 80.5846 13.9954 80.5846 15.7182C80.5846 17.3775 80.3208 18.7665 79.7931 19.8854C79.2718 21.0043 78.5662 21.8435 77.6761 22.4029C76.7925 22.9623 75.8103 23.2421 74.7295 23.2421C73.9921 23.2421 73.3532 23.1213 72.8128 22.8797C72.2724 22.6381 71.8179 22.3203 71.4492 21.9261C71.0868 21.532 70.8071 21.1092 70.61 20.6578H70.5146V28.525H65.8516ZM70.4193 15.7087C70.4193 16.497 70.5242 17.1836 70.734 17.7684C70.9501 18.3533 71.2584 18.8079 71.659 19.1321C72.0658 19.4499 72.5522 19.6089 73.118 19.6089C73.6901 19.6089 74.1764 19.4499 74.577 19.1321C74.9775 18.8079 75.2794 18.3533 75.4829 17.7684C75.6927 17.1836 75.7976 16.497 75.7976 15.7087C75.7976 14.9204 75.6927 14.237 75.4829 13.6584C75.2794 13.0799 74.9775 12.6317 74.577 12.3139C74.1828 11.996 73.6965 11.8371 73.118 11.8371C72.5458 11.8371 72.0595 11.9928 71.659 12.3043C71.2584 12.6158 70.9501 13.0609 70.734 13.6394C70.5242 14.2179 70.4193 14.9076 70.4193 15.7087Z" fill="#381D0C"/>
<path d="M55.0578 23.2802C54.1233 23.2802 53.2937 23.1245 52.569 22.813C51.8506 22.4951 51.2816 22.0183 50.862 21.3826C50.4488 20.7405 50.2422 19.9363 50.2422 18.97C50.2422 18.1562 50.3852 17.4696 50.6713 16.9102C50.9574 16.3508 51.3515 15.8962 51.8538 15.5466C52.356 15.1969 52.9345 14.9331 53.5893 14.7551C54.2441 14.5707 54.9434 14.4467 55.6872 14.3832C56.52 14.3069 57.1907 14.2274 57.6993 14.1448C58.2079 14.0558 58.5766 13.9318 58.8055 13.7729C59.0407 13.6076 59.1583 13.3755 59.1583 13.0767V13.0291C59.1583 12.5396 58.9898 12.1613 58.6529 11.8943C58.316 11.6273 57.8614 11.4938 57.2893 11.4938C56.6726 11.4938 56.1767 11.6273 55.8016 11.8943C55.4266 12.1613 55.1882 12.53 55.0865 13.0005L50.7857 12.8479C50.9129 11.9579 51.2403 11.1632 51.7679 10.4639C52.302 9.75823 53.033 9.20515 53.9612 8.80464C54.8957 8.39777 56.0178 8.19434 57.3274 8.19434C58.2619 8.19434 59.1233 8.30559 59.9116 8.52809C60.7 8.74424 61.3865 9.06211 61.9714 9.48169C62.5563 9.89491 63.0077 10.4035 63.3255 11.0074C63.6497 11.6114 63.8118 12.3012 63.8118 13.0767V23.0323H59.4253V20.9916H59.3109C59.0502 21.4875 58.7165 21.907 58.3096 22.2503C57.9091 22.5936 57.4355 22.8511 56.8887 23.0227C56.3484 23.1944 55.7381 23.2802 55.0578 23.2802ZM56.4978 20.2287C57 20.2287 57.4514 20.127 57.8519 19.9236C58.2587 19.7201 58.583 19.4404 58.8245 19.0844C59.0661 18.722 59.1869 18.3024 59.1869 17.8256V16.4334C59.0534 16.5033 58.8913 16.5669 58.7006 16.6241C58.5162 16.6813 58.3128 16.7354 58.0903 16.7862C57.8678 16.8371 57.6389 16.8816 57.4037 16.9197C57.1685 16.9579 56.9428 16.9928 56.7266 17.0246C56.288 17.0946 55.9129 17.2026 55.6014 17.3489C55.2962 17.4951 55.061 17.6858 54.8957 17.921C54.7368 18.1499 54.6573 18.4232 54.6573 18.7411C54.6573 19.2243 54.829 19.593 55.1723 19.8473C55.5219 20.1016 55.9638 20.2287 56.4978 20.2287Z" fill="#381D0C"/>
<path d="M42.4016 23.3088C40.8695 23.3088 39.5472 23.0068 38.4347 22.4029C37.3285 21.7926 36.4766 20.9248 35.879 19.7996C35.2878 18.668 34.9922 17.3234 34.9922 15.7659C34.9922 14.2528 35.291 12.9305 35.8886 11.7989C36.4862 10.661 37.3285 9.7773 38.4156 9.14793C39.5027 8.5122 40.7837 8.19434 42.2586 8.19434C43.3012 8.19434 44.2548 8.35645 45.1194 8.68067C45.984 9.00489 46.7309 9.48487 47.3603 10.1206C47.9897 10.7563 48.4792 11.5415 48.8289 12.476C49.1785 13.4041 49.3533 14.469 49.3533 15.6705V16.8339H36.6228V14.1257H45.0145C45.0081 13.6298 44.8905 13.188 44.6616 12.8002C44.4328 12.4124 44.1181 12.1104 43.7176 11.8943C43.3234 11.6718 42.8689 11.5605 42.3539 11.5605C41.8326 11.5605 41.3654 11.6781 40.9522 11.9134C40.5389 12.1422 40.2115 12.4569 39.97 12.8574C39.7284 13.2516 39.6012 13.6998 39.5885 14.202V16.9579C39.5885 17.5555 39.7061 18.0799 39.9413 18.5313C40.1766 18.9763 40.5103 19.3228 40.9426 19.5707C41.3749 19.8187 41.8899 19.9426 42.4874 19.9426C42.9007 19.9426 43.2758 19.8854 43.6127 19.771C43.9496 19.6566 44.2389 19.4881 44.4805 19.2656C44.722 19.0431 44.9032 18.7697 45.024 18.4455L49.3057 18.5695C49.1277 19.5294 48.7367 20.3654 48.1327 21.0774C47.5351 21.7831 46.75 22.333 45.7774 22.7271C44.8047 23.1149 43.6794 23.3088 42.4016 23.3088Z" fill="#381D0C"/>
<path d="M23.9443 14.68V23.0335H19.2812V3.50391H23.7918V11.0755H23.9539C24.2844 10.1727 24.8248 9.46706 25.575 8.95847C26.3315 8.44989 27.2565 8.1956 28.3499 8.1956C29.3798 8.1956 30.2762 8.42446 31.0391 8.88219C31.802 9.33355 32.3932 9.97246 32.8128 10.7989C33.2387 11.6254 33.4485 12.5917 33.4421 13.6978V23.0335H28.7791V14.6133C28.7854 13.7996 28.582 13.1638 28.1688 12.7061C27.7555 12.2484 27.1738 12.0195 26.4237 12.0195C25.9342 12.0195 25.5019 12.1276 25.1268 12.3437C24.7581 12.5535 24.4688 12.8555 24.259 13.2497C24.0556 13.6438 23.9507 14.1206 23.9443 14.68Z" fill="#381D0C"/>
<path d="M10.8999 23.3088C9.35507 23.3088 8.02958 22.991 6.92341 22.3552C5.82359 21.7195 4.97807 20.8358 4.38684 19.7042C3.79561 18.5663 3.5 17.2503 3.5 15.7563C3.5 14.256 3.79561 12.9401 4.38684 11.8085C4.98443 10.6705 5.83313 9.78366 6.93294 9.14793C8.03911 8.5122 9.35825 8.19434 10.8904 8.19434C12.2445 8.19434 13.4237 8.43909 14.4282 8.9286C15.439 9.41812 16.2273 10.1111 16.7931 11.0074C17.3653 11.8975 17.6672 12.9432 17.699 14.1448H13.3411C13.2521 13.3946 12.9978 12.8066 12.5782 12.3806C12.165 11.9547 11.6246 11.7417 10.9571 11.7417C10.4167 11.7417 9.94313 11.8943 9.53626 12.1994C9.12939 12.4982 8.81153 12.9432 8.58266 13.5345C8.36016 14.1193 8.2489 14.8441 8.2489 15.7087C8.2489 16.5733 8.36016 17.3043 8.58266 17.9019C8.81153 18.4932 9.12939 18.9414 9.53626 19.2465C9.94313 19.5453 10.4167 19.6947 10.9571 19.6947C11.3894 19.6947 11.7709 19.6025 12.1014 19.4182C12.4384 19.2338 12.7149 18.9636 12.9311 18.6076C13.1472 18.2452 13.2839 17.8066 13.3411 17.2916H17.699C17.6545 18.4995 17.3526 19.5548 16.7931 20.4576C16.24 21.3603 15.4613 22.0628 14.4568 22.565C13.4587 23.0609 12.2731 23.3088 10.8999 23.3088Z" fill="#381D0C"/>
<path d="M115.832 38.8064L111.76 38.9152C111.718 38.6251 111.603 38.3681 111.416 38.1445C111.228 37.9147 110.983 37.7364 110.681 37.6094C110.385 37.4764 110.04 37.4099 109.647 37.4099C109.133 37.4099 108.695 37.5127 108.332 37.7182C107.976 37.9238 107.8 38.2019 107.806 38.5525C107.8 38.8246 107.909 39.0603 108.133 39.2598C108.363 39.4593 108.771 39.6195 109.357 39.7405L112.041 40.2483C113.432 40.5143 114.466 40.9556 115.143 41.5722C115.826 42.1889 116.17 43.005 116.176 44.0207C116.17 44.9758 115.886 45.8071 115.324 46.5144C114.768 47.2217 114.006 47.7719 113.039 48.1648C112.072 48.5517 110.965 48.7452 109.72 48.7452C107.731 48.7452 106.162 48.3371 105.013 47.521C103.871 46.6988 103.218 45.5985 103.055 44.2202L107.435 44.1113C107.531 44.6192 107.782 45.0061 108.187 45.2721C108.592 45.5381 109.109 45.6711 109.738 45.6711C110.306 45.6711 110.769 45.5653 111.125 45.3537C111.482 45.1421 111.663 44.861 111.67 44.5103C111.663 44.196 111.524 43.9451 111.252 43.7577C110.98 43.5642 110.554 43.4131 109.974 43.3043L107.543 42.8418C106.147 42.5879 105.107 42.1194 104.424 41.4362C103.741 40.747 103.402 39.8704 103.408 38.8064C103.402 37.8754 103.65 37.0804 104.152 36.4215C104.654 35.7565 105.367 35.2487 106.292 34.898C107.217 34.5474 108.308 34.3721 109.566 34.3721C111.452 34.3721 112.939 34.768 114.027 35.56C115.115 36.3459 115.717 37.4281 115.832 38.8064Z" fill="#381D0C"/>
<path d="M93.6797 48.4825V34.5537H97.9871V37.0928H98.1322C98.3861 36.1739 98.8002 35.4908 99.3745 35.0434C99.9488 34.59 100.617 34.3633 101.379 34.3633C101.584 34.3633 101.796 34.3784 102.013 34.4086C102.231 34.4328 102.434 34.4721 102.621 34.5265V38.3805C102.409 38.308 102.131 38.2505 101.787 38.2082C101.448 38.1659 101.146 38.1447 100.88 38.1447C100.354 38.1447 99.8793 38.2626 99.4561 38.4984C99.039 38.7281 98.7095 39.0516 98.4677 39.4687C98.2319 39.8798 98.114 40.3634 98.114 40.9196V48.4825H93.6797Z" fill="#381D0C"/>
<path d="M85.1385 48.7452C83.6755 48.7452 82.418 48.446 81.3661 47.8475C80.3203 47.2429 79.5132 46.4026 78.9449 45.3265C78.3827 44.2443 78.1016 42.9899 78.1016 41.5632C78.1016 40.1304 78.3827 38.876 78.9449 37.7999C79.5132 36.7177 80.3203 35.8774 81.3661 35.2789C82.418 34.6743 83.6755 34.3721 85.1385 34.3721C86.6015 34.3721 87.8559 34.6743 88.9018 35.2789C89.9537 35.8774 90.7608 36.7177 91.323 37.7999C91.8913 38.876 92.1754 40.1304 92.1754 41.5632C92.1754 42.9899 91.8913 44.2443 91.323 45.3265C90.7608 46.4026 89.9537 47.2429 88.9018 47.8475C87.8559 48.446 86.6015 48.7452 85.1385 48.7452ZM85.1657 45.399C85.6977 45.399 86.1481 45.2358 86.5169 44.9093C86.8856 44.5829 87.1668 44.1295 87.3602 43.5491C87.5597 42.9687 87.6595 42.2977 87.6595 41.536C87.6595 40.7621 87.5597 40.0851 87.3602 39.5047C87.1668 38.9243 86.8856 38.4709 86.5169 38.1445C86.1481 37.818 85.6977 37.6548 85.1657 37.6548C84.6156 37.6548 84.1501 37.818 83.7692 38.1445C83.3944 38.4709 83.1072 38.9243 82.9077 39.5047C82.7143 40.0851 82.6175 40.7621 82.6175 41.536C82.6175 42.2977 82.7143 42.9687 82.9077 43.5491C83.1072 44.1295 83.3944 44.5829 83.7692 44.9093C84.1501 45.2358 84.6156 45.399 85.1657 45.399Z" fill="#381D0C"/>
<path d="M70.0994 48.7452C68.6364 48.7452 67.379 48.446 66.3271 47.8475C65.2812 47.2429 64.4741 46.4026 63.9058 45.3265C63.3436 44.2443 63.0625 42.9899 63.0625 41.5632C63.0625 40.1304 63.3436 38.876 63.9058 37.7999C64.4741 36.7177 65.2812 35.8774 66.3271 35.2789C67.379 34.6743 68.6364 34.3721 70.0994 34.3721C71.5624 34.3721 72.8169 34.6743 73.8628 35.2789C74.9147 35.8774 75.7217 36.7177 76.284 37.7999C76.8522 38.876 77.1364 40.1304 77.1364 41.5632C77.1364 42.9899 76.8522 44.2443 76.284 45.3265C75.7217 46.4026 74.9147 47.2429 73.8628 47.8475C72.8169 48.446 71.5624 48.7452 70.0994 48.7452ZM70.1266 45.399C70.6587 45.399 71.109 45.2358 71.4778 44.9093C71.8466 44.5829 72.1277 44.1295 72.3212 43.5491C72.5207 42.9687 72.6204 42.2977 72.6204 41.536C72.6204 40.7621 72.5207 40.0851 72.3212 39.5047C72.1277 38.9243 71.8466 38.4709 71.4778 38.1445C71.109 37.818 70.6587 37.6548 70.1266 37.6548C69.5765 37.6548 69.111 37.818 68.7301 38.1445C68.3553 38.4709 68.0682 38.9243 67.8687 39.5047C67.6752 40.0851 67.5785 40.7621 67.5785 41.536C67.5785 42.2977 67.6752 42.9687 67.8687 43.5491C68.0682 44.1295 68.3553 44.5829 68.7301 44.9093C69.111 45.2358 69.5765 45.399 70.1266 45.399Z" fill="#381D0C"/>
<path d="M61.5359 29.9102V48.4819H57.1016V29.9102H61.5359Z" fill="#381D0C"/>
<path d="M55.7328 34.5525V37.8171H46.7734V34.5525H55.7328ZM48.6415 48.4813V33.8452C48.6415 32.7691 48.844 31.8774 49.2491 31.1701C49.6541 30.4567 50.2163 29.9247 50.9358 29.5741C51.6552 29.2174 52.4864 29.0391 53.4295 29.0391C54.0462 29.0391 54.6265 29.0874 55.1706 29.1842C55.7208 29.2748 56.1288 29.3565 56.3948 29.429L55.6875 32.6754C55.5243 32.621 55.3248 32.5757 55.089 32.5394C54.8593 32.5031 54.6416 32.485 54.4361 32.485C53.9162 32.485 53.5595 32.5999 53.366 32.8296C53.1726 33.0593 53.0759 33.3737 53.0759 33.7727V48.4813H48.6415Z" fill="#381D0C"/>
<path fillRule="evenodd" clipRule="evenodd" d="M103.274 12.0042H87.2354V22.3191H103.274V12.0042ZM85.0781 9.88867V24.4346H105.432V9.88867H85.0781Z" fill="#FEB907"/>
<path fillRule="evenodd" clipRule="evenodd" d="M114.325 16.6132H97.7115V26.6769H114.325V16.6132ZM95.5391 14.4717V28.8184H116.497V14.4717H95.5391Z" fill="#FEB907"/>
</svg>

          </Link>
        </div>
        <div className="w-8/12 lg:w-[60%] 2xl:w-[60%] max-lg:flex max-lg:justify-center">
          <div className="hidden lg:flex items-end gap-0 xl:gap-1 min-[1700px]:gap-2 w-fit h-16 justify-between capitalize font-light whitespace-nowrap relative overflow-hidden">
            {menuItems.map((item, index) => (
              <Megamenu
                key={index}
                label={formatMenuLabel(item.label)}
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
            <div className="relative font-inter capitalize font-light pb-5 hidden">
              <Link
                className={`text-12 lg:text-10 xl:text-13 2xl:text-14 min-[1700px]:text-15 3xl:text-base capitalize ${pathname === 'about-us' ? 'bg-gray-light p-[6px] xl:p-2 rounded-xl' : 'hover:bg-gray-light p-[6px]  xl:p-2 rounded-xl '}`}
                href="about-us"
              >
                About Us
              </Link>
            </div>
            <div className="relative font-inter capitalize font-light pb-5 hidden">
              <Link
                className={`text-12 xl:text-13 2xl:text-14 min-[1700px]:text-15 3xl:text-base capitalize ${pathname === 'contact-us' ? 'bg-gray-light p-[6px] xl:p-2 rounded-xl' : 'hover:bg-gray-light p-[6px]  xl:p-2 rounded-xl '}`}
                href="contact-us"
              >
                Contact Us
              </Link>
            </div>
          </div>
          <SearchBar
            className="block lg:hidden"
            productData={products}
            isLoading={isLoading}
          />
        </div>
        <div className="w-2/12 lg:w-[34%] 2xl:w-[30%] text-end flex_between gap-2 max-lg:justify-end">
          {/* Hidden for now; the /measurement-appointment page still exists.
          <Link
            href="/measurement-appointment"
            aria-label="Book appointment"
            className="w-fit mx-auto text-xs sm:text-sm 2xl:text-[16px] bg-primary hover:bg-secondary text-white px-2 py-1 text-nowrap hidden lg:block "
          >
            Book Your Appointment
          </Link> */}
          <SearchBar
            className="hidden lg:flex"
            expandable
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
                      {formatMenuLabel(item.label)}
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
                              if (label.includes('richmond')) return '1';
                              if (label.includes('smart')) return '2';
                              return '3';
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
              <div className="border-b py-2 font-inter block min-[500px]:hidden">
                <div className="flex_between gap-2 capitalize">
                  {/* Main Category Link */}
                  <Link
                    href="/about-us"
                    className={`text-sm font-semibold w-fit whitespace-nowrap ${pathname === '/about-us' ? 'bg-gray-light' : ''}`}
                  >
                    About Us
                  </Link>
                </div>
              </div>
              <div className="border-b py-2 font-inter block min-[500px]:hidden">
                <div className="flex_between gap-2 capitalize">
                  {/* Main Category Link */}
                  <Link
                    href="/contact-us"
                    className={`text-sm font-semibold w-fit whitespace-nowrap ${pathname === '/contact-us' ? 'bg-gray-light' : ''}`}
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </Drawer>
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
