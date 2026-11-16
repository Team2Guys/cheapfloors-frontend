'use client';
import Link from 'next/link';
import DarkModeSwitcher from './DarkModeSwitcher';
import DropdownUser from './DropdownUser';
import ThemePicker from './ThemePicker';
import Image from 'next/image';
import logoimage from '../../../../public/assets/images/logo/logo1.png';
import { LuMenu } from 'react-icons/lu';

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  //eslint-disable-next-line
  setSidebarOpen: any;
}) => {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full border-b border-dash-line bg-dash-surface text-dash-ink">
      <div className="flex min-w-0 flex-grow items-center justify-between gap-2 px-3 sm:gap-3 sm:px-4 md:px-6 2xl:px-10">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3 lg:hidden">
          <button
            type="button"
            aria-controls="sidebar"
            aria-label="Open menu"
            className="grid size-9 place-items-center rounded-lg border border-dash-line text-dash-ink hover:bg-dash-sunken"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
          >
            <LuMenu className="size-4" />
          </button>

          <Link className="block w-[76px] flex-shrink-0 sm:w-[100px]" href="/">
            <Image
              width={100}
              height={100}
              src={logoimage}
              alt="Logo"
              className="rounded-md dark:bg-white dark:px-1.5 dark:py-0.5"
            />
          </Link>
        </div>

        <p className="hidden text-sm text-dash-muted lg:block">
          Cheapfloors admin
        </p>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <ThemePicker />
          <ul className="flex items-center">
            <DarkModeSwitcher />
          </ul>
          <span className="mx-1 hidden h-6 w-px bg-dash-line sm:block" />
          <DropdownUser />
        </div>
      </div>
    </header>
  );
};

export default Header;
