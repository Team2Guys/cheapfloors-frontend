'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { RiLogoutBoxLine } from 'react-icons/ri';
import { useAppDispatch, useAppSelector } from 'Others/HelperRedux';
import { loggedInAdminAction } from '../../../redux/slices/Admin/AdminsSlice';

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const loggedInUser = useAppSelector((state) => state.usersSlice.loggedInUser);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const trigger = useRef<HTMLDivElement>(null);
  const dropdown = useRef<HTMLDivElement>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target as Node) ||
        (trigger.current && trigger.current.contains(target as Node))
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  const logoutHandler = async () => {
    try {
      Cookies.remove('admin_access_token');
      Cookies.remove('super_admin_access_token');
      Cookies.remove('admin_data');

      dispatch(loggedInAdminAction(undefined));
      setTimeout(() => {
        router.push('/dashboard/Admin-login');
      }, 100);
    } catch (err) {
      console.error('Logout failed', err);
    }
  };


  return (
    <div className="relative">
      <div
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex cursor-pointer items-center gap-2 py-2 text-dash-ink xs:gap-3"
      >
        <div className="hidden sm:block">
          <span className="text-right lg:block">
            <span className="block text-sm font-medium text-dash-ink">
              {loggedInUser ? loggedInUser?.fullname : null}
            </span>
            <span className="block text-xs text-dash-muted">
              {loggedInUser?.role || ''}
            </span>
          </span>
        </div>
        <div className=" flex items-center gap-1 xs:gap-2">
          <div className="size-8 overflow-hidden rounded-full ring-1 ring-dash-line xs:size-9">
            <Image
              src={
                loggedInUser && loggedInUser.posterImageUrl
                  ? loggedInUser.posterImageUrl
                  : '/assets/images/dummy-avatar.jpg'
              }
              width={55}
              height={55}
              alt={loggedInUser?.name || 'User'}
            />
          </div>
          <MdKeyboardArrowDown className="text-dash-faint" />
        </div>
      </div>
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute right-0 mt-1 w-44 flex flex-col rounded-xl border border-dash-line bg-dash-surface p-1.5 text-dash-ink shadow-lg ${dropdownOpen === true ? 'block' : 'hidden'
          }`}
      >
        <button
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-dash-ink duration-200 ease-in-out hover:bg-dash-sunken"
          onClick={logoutHandler}
        >
          <RiLogoutBoxLine size={20} />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default DropdownUser;
