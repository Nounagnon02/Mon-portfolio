import React, { useState } from 'react';

export const OptimizedImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  className = '',
  loading = 'lazy'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`${className} ${isLoaded ? 'loaded' : 'loading'}`}
      loading={loading}
      onLoad={() => setIsLoaded(true)}
      decoding="async"
    />
  );
};
