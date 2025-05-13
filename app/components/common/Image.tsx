import React, { useState } from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  aspectRatio?: string;
}

export default function Image({
  src,
  alt,
  fallbackSrc = '/images/companies/default.svg',
  aspectRatio,
  className,
  ...props
}: ImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleError = () => {
    if (!error) {
      setImgSrc(fallbackSrc);
      setError(true);
    }
  };

  const handleLoad = () => {
    setLoaded(true);
  };

  return (
    <div
      className={`relative overflow-hidden ${
        aspectRatio ? `aspect-[${aspectRatio}]` : ''
      } ${!loaded ? 'animate-pulse bg-gray-200' : ''}`}
    >
      <img
        src={imgSrc}
        alt={alt}
        className={`h-full w-full object-contain transition-opacity ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    </div>
  );
}