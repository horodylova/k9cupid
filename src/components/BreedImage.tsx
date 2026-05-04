'use client';

import Image from 'next/image';
import { useState } from 'react';

interface BreedImageProps {
  src: string;
  alt: string;
}

export default function BreedImage({ src, alt }: BreedImageProps) {
  const [imgSrc, setImgSrc] = useState(src || '/no-image-available.jpg');

  return (
    <Image
      src={imgSrc}
      className="img-fluid rounded-4"
      alt={alt}
      onError={() => setImgSrc('/no-image-available.jpg')}
      width={500}
      height={300}
      sizes="(max-width: 768px) 100vw, 33vw"
      style={{ width: '100%', height: 'auto', display: 'block' }}
      unoptimized
    />
  );
}
