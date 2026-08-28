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
        className="flex items-center py-3 gap-2 xs:gap-4 text-black cursor-pointer "
      >
        <div>
          <span className="text-right lg:block">
            <span className="block text-11 xs:text-sm font-medium text-white ">
              {loggedInUser ? loggedInUser?.fullname : null}
            </span>
            <span className="block text-11 xs:text-sm text-white ">
              {loggedInUser?.role || ''}
            </span>
          </span>
        </div>
        <div className=" flex items-center gap-1 xs:gap-3">
          <div className="h-6 xs:h-12 w-6 xs:w-12 rounded-full overflow-hidden">
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
          <MdKeyboardArrowDown className="text-white" />
        </div>
      </div>
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute right-0 mt-1 w-40 flex flex-col rounded-sm border bg-white  dark:bg-black dark:text-white  dark:border-blue-50 ${dropdownOpen === true ? 'block' : 'hidden'
          }`}
      >
        <button
          className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base text-black dark:text-white "
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
