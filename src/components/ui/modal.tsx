'use client';
import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  width?: string;
  onOk?: () => void;
  onCancel?: () => void;
  okText?: string;
  cancelText?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  width = 'max-w-md',
  onOk,
  onCancel,
  okText = 'OK',
  cancelText = 'Cancel'
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 flex_center bg-black bg-opacity-50 z-50 ${className || ''}`}
      onClick={onClose}
    >
      <div
        className={`bg-white p-4 shadow-lg max-lg:max-h-[700px] max-lg:overflow-x-scroll ${width} relative`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
        <div className="mt-2">{children}</div>
        {onOk && (
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <div
              onClick={onCancel || onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition cursor-pointer"
            >
              {cancelText}
            </div>
            <div
              onClick={onOk}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition cursor-pointer"
            >
              {okText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
