'use client';

import { useState } from 'react';

interface TechLogoImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  iconName?: string;
}

export default function TechLogoImage({ src, alt, fallbackSrc, iconName }: TechLogoImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [errorCount, setErrorCount] = useState(0);

  const handleError = () => {
    if (errorCount === 0 && fallbackSrc) {
      setErrorCount(1);
      setImgSrc(fallbackSrc);
    } else if (errorCount === 1 && iconName) {
      // Try simpleicons.org colored version as second fallback
      const coloredUrl = `https://cdn.simpleicons.org/${iconName}`;
      setErrorCount(2);
      setImgSrc(coloredUrl);
    } else if (errorCount === 2 && iconName) {
      // Try unpkg as third fallback
      const unpkgUrl = `https://unpkg.com/simple-icons@v11/icons/${iconName}.svg`;
      setErrorCount(3);
      setImgSrc(unpkgUrl);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className="w-full h-full object-contain"
      style={{ maxWidth: '96px', maxHeight: '96px', filter: 'none' }}
      loading="lazy"
      onError={handleError}
    />
  );
}
