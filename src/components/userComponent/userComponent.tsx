'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Loader from 'components/Loader/Loader';
import { USRPROPS } from 'types/type';
import { FaRegUser } from 'react-icons/fa';
import Tabs from 'components/ui/tabs';

export default function UserComponent({
  handleSubmit,
  error,
  loading = false,
  inputFields,
  title,
  InstructionText,
  routingText,
  buttonTitle,
  navigationLink,
  navigationTxt,
  setadminType
}: USRPROPS) {
  const [activeTab, setActiveTab] = useState('Admin');
  const [showPassword, setShowPassword] = useState(false);
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (setadminType) {
      setadminType(value);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Define tabs for your custom Tabs component
  const tabs = [
    {
      label: (
        <>
          <FaRegUser className="inline mr-2" />
          Admin
        </>
      ),
      value: 'Admin',
      content: (
        <div className="inputs_container w-full mt-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {inputFields.map(
              (
                field: {
                  type: string;
                  name: string;
                  id: string;
                  placeholder: string;
                  value: string;
                  onChange: () => void;
                },
                index: number
              ) => (
                <input
                  className="p-3 shadow-none w-full focus:outline-none focus:ring-0 pl-4 border-b"
                  key={index}
                  type={
                    field.type === 'password' && showPassword
                      ? 'text'
                      : field.type
                  }
                  name={field.name}
                  id={field.id}
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={field.onChange}
                  style={{ backgroundColor: '#F6F6F6 !important' }}
                />
              )
            )}

            {error ? (
              <div className="flex justify-center text-red-500">
                {JSON.stringify(error) || error}
              </div>
            ) : null}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={togglePasswordVisibility}
                className="mr-2"
              />
              <label htmlFor="showPassword" className="text-sm text-gray-600">
                Show Password
              </label>
            </div>
            <p className="pt-1 ">
              {!navigationLink ? null : (
                <Link
                  className="underline text-[#9096B2] pt-4 text-sm"
                  href={navigationLink}
                >
                  {navigationTxt}
                </Link>
              )}
            </p>

            <button
              className="w-full h-[76px] flex justify-center items-center bg-primary text-white"
              type="submit"
            >
              {loading ? <Loader color="#fff" /> : buttonTitle}
            </button>
            <div className="flex justify-end space-y-3 w-full">
              <p className="text-[#9096B2] text-sm">
                {InstructionText && InstructionText}{' '}
                {routingText && (
                  <Link
                    className="underline text-sm"
                    href={title && title === 'Sign In' ? '/register' : '/login'}
                  >
                    {routingText}
                  </Link>
                )}
              </p>
            </div>
          </form>
        </div>
      )
    },
    {
      label: (
        <>
          <FaRegUser className="inline mr-2" />
          Super Admin
        </>
      ),
      value: 'Super-Admin',
      content: (
        <div className="inputs_container w-full mt-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {inputFields.map(
              (
                field: {
                  type: string;
                  name: string;
                  id: string;
                  placeholder: string;
                  value: string;
                  onChange: () => void;
                },
                index: number
              ) => (
                <input
                  className="p-3 shadow-none w-full focus:outline-none focus:ring-0 pl-4 border-b"
                  key={index}
                  type={
                    field.type === 'password' && showPassword
                      ? 'text'
                      : field.type
                  }
                  name={field.name}
                  id={field.id}
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={field.onChange}
                />
              )
            )}
            {error ? (
              <div className="flex justify-center text-red-500">{error}</div>
            ) : null}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={togglePasswordVisibility}
                className="mr-2"
              />
              <label htmlFor="showPassword" className="text-sm text-gray-600">
                Show Password
              </label>
            </div>
            <p className="pt-1 ">
              {!navigationLink ? null : (
                <Link
                  className="underline text-[#9096B2] pt-4 text-sm"
                  href={navigationLink}
                >
                  {navigationTxt}
                </Link>
              )}
            </p>

            <button
              className="w-full h-[76px] flex justify-center items-center bg-primary text-white"
              type="submit"
            >
              {loading ? <Loader color="#ffffff" /> : buttonTitle}
            </button>
            <div className="flex justify-end space-y-3 w-full">
              <p className="text-[#9096B2] text-sm">
                {InstructionText && InstructionText}{' '}
                {routingText && (
                  <Link
                    className="underline text-sm"
                    href={title && title === 'Sign In' ? '/register' : '/login'}
                  >
                    {routingText}
                  </Link>
                )}
              </p>
            </div>
          </form>
        </div>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 justify-center px-2 py-5">
      <div className="max-w-screen-sm mx-auto px-2 py-5 xs:p-5 sm:p-10 shadow-[0px_3px_6px_#00000029] rounded-md h-fit">
        {/* Use your custom Tabs component */}
        <Tabs
          tabs={tabs}
          defaultTab={activeTab}
          className="w-full text-center"
          onTabChange={handleTabChange}
          isLogin
        />
      </div>
    </div>
  );
}
