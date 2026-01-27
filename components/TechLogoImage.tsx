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

  // Check if this is Microsoft (needs to be bigger) or AWS (needs object-contain to avoid cropping)
  const isMicrosoft = src.includes('/assets/logos/') && src.includes('Microsoft');
  const isAWS = src.includes('/assets/logos/') && src.includes('AWS');
  const objectFit = isAWS ? 'object-contain' : (isMicrosoft ? 'object-cover' : 'object-contain');
  const maxSize = isMicrosoft ? '140px' : '112px'; // Make Microsoft bigger

  return (
    <img
      src={imgSrc}
      alt={alt}
      dir="ltr"
      className={`w-full h-full ${objectFit}`}
      style={{ maxWidth: maxSize, maxHeight: maxSize, filter: 'none', direction: 'ltr' }}
      loading="lazy"
      onError={handleError}
    />
  );
}
