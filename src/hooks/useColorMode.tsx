'use client';

import { useEffect, useState } from 'react';

const useColorMode = () => {
  const [colorMode, setColorMode] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedColorMode = localStorage.getItem('colorMode') as
        | 'light'
        | 'dark'
        | null;
      return savedColorMode || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(colorMode);
    localStorage.setItem('colorMode', colorMode);
  }, [colorMode]);

  const toggleColorMode = () => {
    setColorMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return [colorMode, toggleColorMode] as const;
};

export default useColorMode;
