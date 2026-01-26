'use client';

import { useState } from 'react';

interface BreedImageProps {
  src: string;
  alt: string;
}

export default function BreedImage({ src, alt }: BreedImageProps) {
  const [imgSrc, setImgSrc] = useState(src || '/no-image-available.jpg');

  return (
    <img
      src={imgSrc}
      className="img-fluid rounded-4"
      alt={alt}
      onError={() => setImgSrc('/no-image-available.jpg')}
      style={{ width: '100%', height: '300px', objectFit: 'cover' }}
    />
  );
}
