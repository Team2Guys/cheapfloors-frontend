'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

const PHONE = (process.env.NEXT_PUBLIC_PHONE_NUMBER ?? '').replace(/[^\d]/g, '');

// Quick questions shown in the chat popup. Clicking one opens WhatsApp with
// the text already typed in, so the customer only has to press send.
const QUICK_QUESTIONS = [
  'Hi, I need help choosing the right flooring for my space.',
  'Hi, can I get a price quote for my room?',
  'Hi, how can I order free samples?',
  'Hi, do you offer installation and delivery in my area?'
];

const whatsappLink = (text?: string) =>
  `https://wa.me/${PHONE}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

// Floating WhatsApp button with a "Need help?" label. Opens a small
// chat-style popup listing quick questions.
const WhatsAppChat = () => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative font-inter">
      {/* Chat popup */}
      <div
        role="dialog"
        aria-label="Chat with us on WhatsApp"
        aria-hidden={!open}
        className={`absolute bottom-full right-0 mb-4 w-[calc(100vw-2rem)] max-w-[340px] origin-bottom-right rounded-2xl overflow-hidden bg-white shadow-2xl border border-gray-100 transition duration-200 ${
          open
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-2 pointer-events-none invisible'
        }`}
      >
        {/* Header */}
        <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="w-11 h-11 rounded-full bg-white flex_center overflow-hidden p-1.5">
              <Image
                src="/assets/images/logo.png"
                alt="CheapFloors"
                width={44}
                height={44}
                className="w-full h-auto object-contain"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#25D366] border-2 border-[#075E54]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm sm:text-base leading-tight">
              CheapFloors Support
            </p>
            <p className="text-xs text-white/80">Typically replies within minutes</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="p-1 rounded-full hover:bg-white/10 transition"
          >
            <IoClose size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="bg-[#ECE5DD] px-3 py-4 max-h-[60vh] overflow-y-auto">
          <div className="max-w-[85%] bg-white rounded-lg rounded-tl-none px-3 py-2 shadow-sm text-sm text-gray-800">
            <p>Hi there 👋</p>
            <p className="mt-1">How can we help you? Pick a question below.</p>
          </div>

          <div className="mt-4 flex flex-col items-end gap-2">
            {QUICK_QUESTIONS.map((question) => (
              <a
                key={question}
                href={whatsappLink(question)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                className="max-w-[90%] text-left text-sm bg-[#DCF8C6] hover:bg-[#c9f0ad] text-gray-800 rounded-lg rounded-tr-none px-3 py-2 shadow-sm transition"
              >
                {question}
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
          tabIndex={open ? 0 : -1}
          className="flex_center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-white text-sm font-semibold py-3 transition"
        >
          <FaWhatsapp size={18} />
          Start a new chat
        </a>
      </div>

      {/* "Need help?" label: above the button on sm+, to its left on phones
          (where the call button sits above). */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="absolute right-full top-1/2 -translate-y-1/2 mr-2 sm:right-1/2 sm:top-auto sm:bottom-full sm:translate-y-0 sm:translate-x-1/2 sm:mr-0 sm:mb-2 whitespace-nowrap bg-white text-gray-800 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full shadow-lg border border-gray-100 hover:text-[#075E54] transition"
        >
          Need help?
        </button>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close WhatsApp chat' : 'Chat with us on WhatsApp'}
        aria-expanded={open}
        className="bg-[#25D366] text-white rounded-full shadow-lg flex_center w-12 h-12 hover:scale-105 transition"
      >
        {open ? <IoClose size={30} /> : <FaWhatsapp size={35} />}
      </button>
    </div>
  );
};

export default WhatsAppChat;
