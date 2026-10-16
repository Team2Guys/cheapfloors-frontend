'use client';
import { useId, useRef, useState } from 'react';

// The hidden text is always in the HTML so crawlers (which render at phone
// width) still read it and follow its links; it is only hidden visually
// until the visitor opens it.
const ReadMoreContent = ({ html }: { html: string }) => {
  const [expanded, setExpanded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentId = useId();

  const toggle = () => {
    if (expanded) {
      // Collapsing from the bottom of a long section would leave the reader
      // far below the intro, so bring the start of the section back into view.
      const top = sectionRef.current?.getBoundingClientRect().top ?? 0;
      if (top < 0) window.scrollBy({ top: top - 160 });
    }
    setExpanded(!expanded);
  };

  return (
    <div ref={sectionRef}>
      <div
        id={contentId}
        className={`blog-content stack-tables ${expanded ? '' : 'hidden'}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <button
        type="button"
        onClick={toggle}
        aria-expanded={expanded}
        aria-controls={contentId}
        className={`${expanded ? 'mt-2' : ''} rounded-full bg-primary px-8 py-2.5 text-sm font-semibold text-black transition hover:bg-secondary hover:text-white`}
      >
        {expanded ? 'Read Less' : 'Read More'}
      </button>
    </div>
  );
};

export default ReadMoreContent;
