'use client';
import type { AnchorHTMLAttributes } from 'react';
import { waHref, withWaRef } from 'lib/cf-whatsapp';

type WhatsAppLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
> & {
  /** Text to prefill. Without one, the click uses a short default greeting. */
  message?: string;
};

/**
 * Every WhatsApp button on the site goes through this. On click it adds the
 * visitor's source ref to the prefilled message and logs the click
 * (lib/cf-whatsapp.ts); without JavaScript it is a plain wa.me link.
 */
export default function WhatsAppLink({
  message,
  onClick,
  target = '_blank',
  rel = 'noopener noreferrer',
  children,
  ...rest
}: WhatsAppLinkProps) {
  return (
    <a
      href={waHref(message)}
      target={target}
      rel={rel}
      onClick={(event) => {
        withWaRef(message)(event);
        onClick?.(event);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
