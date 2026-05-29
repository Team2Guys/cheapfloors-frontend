'use client';
import { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { SheetProps } from 'types/cat';

export default function Drawer({
  isOpen,
  onClose,
  children,
  size = 'w-80',
  showBackdrop = true
}: SheetProps) {
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    let frame: number;
    if (isOpen) {
      setVisible(true);
      frame = requestAnimationFrame(() => setAnimate(true));
    } else {
      setAnimate(false);
      const timeout = setTimeout(() => setVisible(false), 250);
      return () => clearTimeout(timeout);
    }
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown, { passive: true });
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!visible) return null; // Avoid rendering when not visible

  return (
    <>
      {showBackdrop && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300  ${animate ? 'opacity-100' : 'opacity-0'}`}
          onClick={onClose}
        />
      )}
      {visible && (
        <aside
          className={`fixed right-0 top-0 pt-10 text-start overflow-y-scroll max-h-full ${size} h-full bg-white shadow-xl z-50 p-4 transform transition-transform duration-300 ease-in-out ${animate ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-2"
            aria-label="close drawer"
          >
            <IoClose className="w-6 h-6" />
          </button>
          {children}
        </aside>
      )}
    </>
  );
}
