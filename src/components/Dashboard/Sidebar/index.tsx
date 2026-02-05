'use client';
import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import SidebarLinkGroup from './SidebarLinkGroup';
import { MdOutlineDashboard, MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { BiCategoryAlt } from 'react-icons/bi';
import { GrCodeSandbox, GrUserAdmin } from 'react-icons/gr';
import { useAppSelector } from 'components/Others/HelperRedux';
import { TfiShoppingCartFull } from 'react-icons/tfi';
import { TbGardenCartOff } from 'react-icons/tb';
import { SiGotomeeting } from 'react-icons/si';

interface SidebarProps {
  sidebarOpen: boolean;
  //eslint-disable-next-line
  setSidebarOpen: any;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { loggedInUser } = useAppSelector((state) => state.usersSlice);
  const superAdmin = loggedInUser && loggedInUser.role !== 'Admin';

  const pathname = usePathname();

  const trigger = useRef<HTMLDivElement>(null);
  const sidebar = useRef<HTMLDivElement>(null);

  const storedSidebarExpanded = 'true';

  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target as Node) ||
        trigger.current.contains(target as Node)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, []);

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!sidebarOpen || key !== 'Escape') return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  const GeneralLinks = [
    { href: '/dashboard/Redirecturls', label: 'View Redirecturls' }
  ];

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-50 flex h-screen w-72 flex-col overflow-y-hidden bg-primary text-white duration-300 ease-linear dark:bg-black lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex_between gap-2 px-6 py-2">
        <Link href="/">
          <Image
            width={176}
            height={32}
            src="/assets/images/logo/logo1.png"
            alt="Logo"
            priority
          />
        </Link>

        <button
          /* eslint-disable */
          //@ts-ignore
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold ">MENU</h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Dashboard --> */}
              <SidebarLinkGroup activeCondition={pathname === '/dashboard'}>
                {(handleClick, open) => {
                  return (
                    <>
                      <Link
                        href="/dashboard"
                        className={`Sidebar-Link group ${
                          pathname === '/dashboard' &&
                          'bg-black dark:bg-primary'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          if (sidebarExpanded) {
                            handleClick();
                          } else {
                            setSidebarExpanded(true);
                          }
                        }}
                      >
                        <MdOutlineDashboard size={20} className="text-white" />
                        Dashboard
                        <MdOutlineKeyboardArrowDown
                          size={30}
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current text-white ${
                            open && 'rotate-180'
                          }`}
                        />
                      </Link>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && 'hidden'
                        }`}
                      >
                        <ul className="mb-3 mt-3 flex flex-col gap-2.5 pl-6">
                          <li>
                            <Link
                              href="/dashboard"
                              className={`Sidebar-Link ${
                                pathname === '/dashboard' && 'active'
                              }`}
                            >
                              eCommerce
                            </Link>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </>
                  );
                }}
              </SidebarLinkGroup>

              <SidebarLinkGroup
                activeCondition={
                  pathname === '/dashboard/category' ||
                  pathname === '/dashboard/subcategory'
                }
              >
                {(handleClick, open) => {
                  return (
                    <>
                      <Link
                        href="#"
                        className={`Sidebar-Link group ${(pathname === '/dashboard/category' || pathname === '/dashboard/subcategory') && 'bg-black dark:bg-primary'}`}
                        onClick={(e) => {
                          e.preventDefault();
                          if (sidebarExpanded) {
                            handleClick();
                          } else {
                            setSidebarExpanded(true);
                          }
                        }}
                      >
                        <BiCategoryAlt size={20} className="text-white" />
                        Category
                        <MdOutlineKeyboardArrowDown
                          size={30}
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current text-white ${
                            open && 'rotate-180'
                          }`}
                        />
                      </Link>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && 'hidden'
                        }`}
                      >
                        <ul className=" flex flex-col pl-6">
                          <li>
                            <Link
                              href="/dashboard/category"
                              className={`Sidebar-Link mt-2.5 ${
                                pathname === '/dashboard/category' && 'active'
                              }`}
                            >
                              View Categories
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/dashboard/subcategory"
                              className={`Sidebar-Link mt-2.5 ${
                                pathname === '/dashboard/subcategory' &&
                                'active'
                              }`}
                            >
                              View Sub Categories
                            </Link>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </>
                  );
                }}
              </SidebarLinkGroup>

              <SidebarLinkGroup
                activeCondition={
                  pathname === '/dashboard/products' ||
                  pathname === '/dashboard/accessories'
                }
              >
                {(handleClick, open) => {
                  return (
                    <>
                      <Link
                        href="#"
                        className={`Sidebar-Link group ${
                          (pathname === '/dashboard/products' ||
                            pathname === '/dashboard/accessories') &&
                          'bg-black dark:bg-primary'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          if (sidebarExpanded) {
                            handleClick();
                          } else {
                            setSidebarExpanded(true);
                          }
                        }}
                      >
                        <GrCodeSandbox size={20} className="text-white" />
                        Products
                        <MdOutlineKeyboardArrowDown
                          size={30}
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current text-white ${
                            open && 'rotate-180'
                          }`}
                        />
                      </Link>
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && 'hidden'
                        }`}
                      >
                        <ul className="gap-2.5 mt-3 flex flex-col pl-6">
                          <li>
                            <Link
                              href="/dashboard/products"
                              className={`Sidebar-Link ${
                                pathname === '/dashboard/products' && 'active'
                              } `}
                            >
                              View Products
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/dashboard/accessories"
                              className={`Sidebar-Link ${
                                pathname === '/dashboard/accessories' &&
                                'active'
                              } `}
                            >
                              View accessories
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </>
                  );
                }}
              </SidebarLinkGroup>

              <SidebarLinkGroup
                activeCondition={
                  pathname === '/dashboard/orders' ||
                  pathname === '/dashboard/free-sample' ||
                  pathname === '/dashboard/abundant'
                }
              >
                {(handleClick, open) => {
                  return (
                    <>
                      <Link
                        href="#"
                        className={`Sidebar-Link group ${
                          (pathname === '/dashboard/orders' ||
                            pathname === '/dashboard/free-sample' ||
                            pathname === '/dashboard/abundant') &&
                          'bg-black dark:bg-primary'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          if (sidebarExpanded) {
                            handleClick();
                          } else {
                            setSidebarExpanded(true);
                          }
                        }}
                      >
                        <TfiShoppingCartFull size={20} className="text-white" />
                        Orders
                        <MdOutlineKeyboardArrowDown
                          size={30}
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current text-white ${
                            open && 'rotate-180'
                          }`}
                        />
                      </Link>
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && 'hidden'
                        }`}
                      >
                        <ul className="mt-3 flex flex-col gap-2.5 pl-6">
                          <li>
                            <Link
                              href="/dashboard/orders"
                              className={`Sidebar-Link ${
                                pathname === '/dashboard/orders' && 'active'
                              } `}
                            >
                              View Orders
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/dashboard/free-sample"
                              className={`Sidebar-Link ${
                                pathname === '/dashboard/free-sample' &&
                                'active'
                              } `}
                            >
                              View Free Sample Orders
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/dashboard/abundant"
                              className={`Sidebar-Link ${
                                pathname === '/dashboard/abundant' && 'active'
                              } `}
                            >
                              View Abandoned Orders
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </>
                  );
                }}
              </SidebarLinkGroup>

              <SidebarLinkGroup
                activeCondition={
                  pathname === '/dashboard/measurement-appointment' ||
                  pathname === '/dashboard/installation-appointments'
                }
              >
                {(handleClick, open) => {
                  return (
                    <>
                      <Link
                        href="#"
                        className={`Sidebar-Link group ${
                          (pathname === '/dashboard/measurement-appointment' ||
                            pathname ===
                              '/dashboard/installation-appointments') &&
                          'bg-black dark:bg-primary'
                        }`}
                        onClick={(e) => {
                          e.preventDefault(); // Prevent default link behavior
                          if (sidebarExpanded) {
                            handleClick();
                          } else {
                            setSidebarExpanded(true);
                          }
                        }}
                      >
                        <SiGotomeeting size={20} className="text-white" />
                        Appointments
                        <MdOutlineKeyboardArrowDown
                          size={30}
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current text-white ${
                            open && 'rotate-180'
                          }`}
                        />
                      </Link>
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && 'hidden'
                        }`}
                      >
                        <ul className="mb-3 mt-3 flex flex-col gap-2.5 pl-6">
                          <li>
                            <Link
                              href="/dashboard/measurement-appointment"
                              className={`Sidebar-Link ${
                                pathname ===
                                  '/dashboard/measurement-appointment' &&
                                'active'
                              } `}
                            >
                              View Measurement Appointment
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/dashboard/installation-appointments"
                              className={`Sidebar-Link ${
                                pathname ===
                                  '/dashboard/installation-appointments' &&
                                'active'
                              } `}
                            >
                              View Installation Appointment
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </>
                  );
                }}
              </SidebarLinkGroup>

              <SidebarLinkGroup
                activeCondition={GeneralLinks.some(
                  (link) => pathname === link.href
                )}
              >
                {(handleClick, open) => {
                  return (
                    <>
                      <Link
                        href="/dashboard"
                        className={`Sidebar-Link group  ${
                          GeneralLinks.some((link) => pathname === link.href)
                            ? 'active'
                            : ''
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          if (sidebarExpanded) {
                            handleClick();
                          } else {
                            setSidebarExpanded(true);
                          }
                        }}
                      >
                        <TbGardenCartOff size={20} className="text-white" />
                        Generals
                        <MdOutlineKeyboardArrowDown
                          size={30}
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current text-white ${
                            open && 'rotate-180'
                          }`}
                        />
                      </Link>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && 'hidden'
                        }`}
                      >
                        <ul className="mb-3 mt-3 flex flex-col gap-2.5 pl-6">
                          {GeneralLinks.map((link) => (
                            <li key={link?.href}>
                              <Link
                                href={link?.href || ''}
                                className={`Sidebar-Link group ${
                                  pathname === link?.href ? 'active' : ''
                                }`}
                              >
                                {link?.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  );
                }}
              </SidebarLinkGroup>

              {superAdmin ? (
                <li>
                  <Link
                    href="/dashboard/super-admin"
                    className={`Sidebar-Link group ${
                      pathname.includes('super-admin') &&
                      'bg-black dark:bg-primary'
                    }`}
                  >
                    <GrUserAdmin size={20} />
                    Admin
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
