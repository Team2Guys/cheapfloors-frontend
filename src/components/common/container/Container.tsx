import { FC, ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container: FC<ContainerProps> = ({ children, className }) => {
  return (
    <div
      className={`3xl:max-w-[1800px] 2xl:max-w-[95%] lg:max-w-[92%] mx-auto px-2 xs:px-4 ${className}`}
    >
      {children}
    </div>
  );
};

export default Container;
