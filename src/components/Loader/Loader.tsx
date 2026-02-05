import React from 'react';

interface LoaderProps {
  color?: string;
  size?: number;
}

const Loader = ({ color = '#000', size = 24 }: LoaderProps) => {
  return (
    <div
      className="animate-spin rounded-full border-4 border-t-transparent"
      style={{
        width: size,
        height: size,
        borderColor: `${color} ${color} ${color} transparent`
      }}
    />
  );
};

export default Loader;
