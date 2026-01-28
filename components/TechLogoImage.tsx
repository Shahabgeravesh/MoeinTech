'use client';

import { useState } from 'react';

interface TechLogoImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  /** Simple Icons slug (e.g. googlecloud for GCP). Same for EN/FA. */
  simpleIconsSlug?: string;
}

export default function TechLogoImage({ src, alt, fallbackSrc, simpleIconsSlug }: TechLogoImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [errorCount, setErrorCount] = useState(0);

  const handleError = () => {
    if (errorCount === 0 && fallbackSrc) {
      setErrorCount(1);
      setImgSrc(fallbackSrc);
    } else if (errorCount === 1 && simpleIconsSlug) {
      const coloredUrl = `https://cdn.simpleicons.org/${simpleIconsSlug}`;
      setErrorCount(2);
      setImgSrc(coloredUrl);
    } else if (errorCount === 2 && simpleIconsSlug) {
      const unpkgUrl = `https://unpkg.com/simple-icons@v11/icons/${simpleIconsSlug}.svg`;
      setErrorCount(3);
      setImgSrc(unpkgUrl);
    }
  };

  const isMicrosoft = alt.toLowerCase().includes('microsoft') || imgSrc.includes('/assets/logos/Microsoft');

  return (
    <img
      src={imgSrc}
      alt={alt}
      dir="ltr"
      className={`w-full h-full ${isMicrosoft ? 'object-cover' : 'object-contain'}`}
      style={{
        filter: 'none',
        direction: 'ltr',
        transform: isMicrosoft ? 'scale(1.15)' : undefined,
        transformOrigin: 'center',
      }}
      loading="lazy"
      onError={handleError}
    />
  );
}
